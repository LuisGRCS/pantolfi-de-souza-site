import { z } from 'astro/zod';
import raw from '@/content/configuracoes.json';

/** Dados gerais do site (nome, OAB, contatos). Editados em src/content/configuracoes.json. */
const settingsSchema = z.object({
  nome: z.string().min(1),
  posicionamento: z.string().min(1),
  oab: z.string().min(1),
  anoInscricaoOab: z.string().min(1),
  telefone: z.string().min(1),
  whatsapp: z.string().regex(/^\d{12,13}$/, 'Use apenas números, com 55 e DDD'),
  email: z.email(),
  cidade: z.string().min(1),
  endereco: z.string().min(1),
  horario: z.string().min(1),
  redes: z.array(z.object({ nome: z.string().min(1), url: z.union([z.url(), z.literal('')]) })),
  inglesAtivo: z.boolean(),
});

export type Settings = z.infer<typeof settingsSchema>;

export const settings: Settings = settingsSchema.parse(raw);

/** Redes com endereço preenchido (redes vazias não aparecem no site). */
export const activeSocials = settings.redes.filter((rede) => rede.url !== '');

export const phoneHref = `tel:+${settings.whatsapp}`;
export const whatsappHref = `https://wa.me/${settings.whatsapp}`;
export const emailHref = `mailto:${settings.email}`;

const placeholderPattern = /^\[PREENCHER:.*\]$/;

/** Indica se um texto ainda é um marcador [PREENCHER: …]. */
export const isPlaceholder = (value: string): boolean => placeholderPattern.test(value.trim());

/**
 * Texto a exibir para um valor que pode ser marcador.
 * Em "[PREENCHER: descrição — ex.: texto sugerido]", exibe o texto sugerido.
 */
export function placeholderDisplay(value: string): { pending: boolean; text: string } {
  if (!isPlaceholder(value)) return { pending: false, text: value };
  const example = /—\s*ex\.:\s*(.+)\]$/.exec(value)?.[1]?.trim();
  return { pending: true, text: example ?? value };
}
