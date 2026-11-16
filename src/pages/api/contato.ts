import type { APIRoute } from 'astro';
import { CONTACT_FROM, CONTACT_TO, RESEND_API_KEY, TURNSTILE_SECRET_KEY } from 'astro:env/server';
import type { UiKey } from '@/i18n/pt';
import { contactSchema, type ContactField, type ContactResult } from '@/lib/contact';
import { settings } from '@/lib/site';

/**
 * Envio do formulário de contato (roda no servidor, nunca no navegador).
 * Etapas: anti-spam (campo oculto + Turnstile), limite de envios, validação e envio pelo Resend.
 * Sem JavaScript no navegador, o formulário também funciona: a resposta volta para /contato.
 */
export const prerender = false;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

/** Limite simples por endereço de rede (vale por instância do servidor). */
function tooMany(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

async function captchaOk(token: string | null, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) return import.meta.env.DEV; // sem chave: só no computador
  if (!token) return false;
  const body = new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token, remoteip: ip });
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

async function sendEmail(data: Record<string, string>): Promise<boolean> {
  if (!RESEND_API_KEY || !CONTACT_FROM) return false;
  const lines = [
    ['Nome', data['nome']],
    ['E-mail', data['email']],
    ['Telefone', data['telefone'] || '—'],
    ['Assunto', data['assunto']],
  ] as const;
  const text = `${lines.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${data['mensagem']}`;
  const html = `${lines
    .map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value ?? '')}</p>`)
    .join('')}<p style="white-space:pre-wrap">${escapeHtml(data['mensagem'] ?? '')}</p>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO || settings.email],
      reply_to: data['email'],
      subject: `Contato pelo site: ${data['assunto']}`,
      text,
      html,
    }),
  });
  return response.ok;
}

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const wantsJson = request.headers.get('accept')?.includes('application/json') ?? false;
  const reply = (result: ContactResult, status = 200) => {
    if (wantsJson) return Response.json(result, { status });
    return redirect(result.ok ? '/contato/enviado' : '/contato/nao-enviado', 303);
  };

  const form = await request.formData();
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress || 'local';

  // Campo invisível: pessoas não o preenchem; robôs sim. Finge sucesso para o robô.
  if (String(form.get('empresa_site') ?? '') !== '') return reply({ ok: true });

  if (tooMany(ip)) return reply({ ok: false, reason: 'limit' }, 429);

  const fields = Object.fromEntries(
    ['nome', 'email', 'telefone', 'assunto', 'mensagem', 'consentimento'].map((key) => [
      key,
      String(form.get(key) ?? ''),
    ]),
  );
  const parsed = contactSchema.safeParse(fields);
  if (!parsed.success) {
    const errors: Partial<Record<ContactField, UiKey>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      errors[field] ??= issue.message as UiKey;
    }
    return reply({ ok: false, reason: 'fields', errors }, 422);
  }

  const token = form.get('cf-turnstile-response');
  if (!(await captchaOk(typeof token === 'string' ? token : null, ip))) {
    return reply({ ok: false, reason: 'captcha' }, 400);
  }

  try {
    const sent = await sendEmail(fields);
    return sent ? reply({ ok: true }) : reply({ ok: false, reason: 'server' }, 502);
  } catch {
    return reply({ ok: false, reason: 'server' }, 502);
  }
};
