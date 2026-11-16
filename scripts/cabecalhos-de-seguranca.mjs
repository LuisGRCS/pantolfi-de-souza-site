/**
 * Cabeçalhos de segurança da hospedagem (Vercel), aplicados depois da compilação.
 * A política de conteúdo (CSP) libera apenas os scripts do próprio site: os scripts
 * embutidos nas páginas são identificados pelo seu hash, calculado a cada publicação.
 * O painel de edição (/keystatic) recebe regras próprias, sem CSP, e fica fora dos buscadores.
 */
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const site = 'dist/client';
const configPath = '.vercel/output/config.json';
const plausible = process.env.PUBLIC_PLAUSIBLE_DOMAIN ? ' https://plausible.io' : '';

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return htmlFiles(path);
      return entry.name.endsWith('.html') ? [path] : [];
    }),
  );
  return nested.flat();
}

// Hash de cada <script> embutido executável (ignora os de dados, como o JSON-LD).
const hashes = new Set();
for (const file of await htmlFiles(site)) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    const attrs = match[1] ?? '';
    if (/\ssrc=/.test(attrs) || /type="application\/ld\+json"/.test(attrs)) continue;
    const digest = createHash('sha256').update(match[2]).digest('base64');
    hashes.add(`'sha256-${digest}'`);
  }
}

const csp = [
  "default-src 'self'",
  `script-src 'self' 'wasm-unsafe-eval' ${[...hashes].join(' ')} https://challenges.cloudflare.com${plausible}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' https://challenges.cloudflare.com${plausible}`,
  'frame-src https://challenges.cloudflare.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.google.com https://maps.google.com',
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const common = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'X-Frame-Options': 'DENY',
};

if (!existsSync(configPath)) {
  process.stdout.write(
    'Cabeçalhos: pasta da Vercel não encontrada (compilação local), nada a fazer.\n',
  );
} else {
  const config = JSON.parse(await readFile(configPath, 'utf8'));
  const admin = '^/(?:keystatic|api/keystatic)(?:/.*)?$';
  config.routes = [
    { src: admin, headers: { ...common, 'X-Robots-Tag': 'noindex, nofollow' }, continue: true },
    {
      src: '^/(?!keystatic(?:/|$)|api/keystatic(?:/|$)).*$',
      headers: { ...common, 'Content-Security-Policy': csp },
      continue: true,
    },
    ...config.routes.filter(
      (route) => !route.headers?.['Content-Security-Policy'] && route.src !== admin,
    ),
  ];
  await writeFile(configPath, JSON.stringify(config, null, 2));
  await writeFile('dist/csp.txt', csp);
  process.stdout.write(`Cabeçalhos de segurança: ${hashes.size} scripts embutidos autorizados.\n`);
}
