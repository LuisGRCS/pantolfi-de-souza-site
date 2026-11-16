import { getCollection, getEntry } from 'astro:content';
import { isPlaceholder, placeholderDisplay, settings } from './site';

/** Áreas publicadas, na ordem definida no conteúdo. */
export async function getAreas() {
  const areas = await getCollection('areas', ({ data }) => !data.rascunho);
  return areas.sort((a, b) => a.data.ordem - b.data.ordem);
}

/** Marcos da trajetória, do mais recente (ordem maior) para o mais antigo. */
export async function getTimeline() {
  const items = await getCollection('trajetoria');
  return items.sort((a, b) => b.data.ordem - a.data.ordem);
}

export async function getHome() {
  const entry = await getEntry('inicio', 'inicio');
  if (!entry) throw new Error('Arquivo src/content/paginas/inicio.json não encontrado.');
  return entry.data;
}

export async function getAbout() {
  const entry = await getEntry('sobre', 'sobre');
  if (!entry) throw new Error('Arquivo src/content/paginas/sobre.json não encontrado.');
  return entry.data;
}

/** Índice editorial de uma área: A.01, A.02… */
export const areaIndex = (position: number): string => `A.${String(position).padStart(2, '0')}`;

/** Anos desde a inscrição na OAB (null enquanto o ano não for preenchido). */
export function yearsOfPractice(today = new Date()): number | null {
  const value = settings.anoInscricaoOab;
  if (isPlaceholder(value) || !/^\d{4}$/.test(value.trim())) return null;
  return today.getFullYear() - Number(value);
}

/** Divide um texto em parágrafos (separados por uma linha em branco). */
export const toParagraphs = (text: string): string[] =>
  text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

/** Nome de exibição de cada área (para etiquetas e filtros), indexado pelo endereço. */
export async function getAreaNames(): Promise<Record<string, string>> {
  const areas = await getAreas();
  return Object.fromEntries(
    areas.map((area) => [area.id, placeholderDisplay(area.data.titulo).text]),
  );
}
