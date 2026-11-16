import { z } from 'astro/zod';
import type { UiKey } from '@/i18n/pt';

/** Campos do formulário de contato. As mensagens de erro são chaves de tradução. */
export const contactSchema = z.object({
  nome: z.string().trim().min(2, 'field.required').max(120, 'field.required'),
  email: z.email('field.email').max(200, 'field.email'),
  telefone: z.string().trim().max(40).optional().default(''),
  assunto: z.string().trim().min(2, 'field.required').max(160, 'field.required'),
  mensagem: z.string().trim().min(10, 'field.short').max(5000, 'field.required'),
  consentimento: z.literal('sim', { error: 'field.consent' }),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

export type ContactResult =
  | { ok: true }
  | {
      ok: false;
      reason: 'fields' | 'server' | 'limit' | 'captcha';
      errors?: Partial<Record<ContactField, UiKey>>;
    };
