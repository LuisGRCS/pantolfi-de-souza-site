import { getCollection, type CollectionEntry } from 'astro:content';
import type { PublicationType } from '@/content.config';
import type { UiKey } from '@/i18n/pt';

export type Publication = CollectionEntry<'publicacoes'>;

/** Publicações visíveis (sem rascunhos), da mais recente para a mais antiga. */
export async function getPublications(): Promise<Publication[]> {
  const items = await getCollection('publicacoes', ({ data }) => !data.rascunho);
  return items.sort((a, b) => b.data.data.getTime() - a.data.data.getTime());
}

/** Nome do tipo de publicação nos textos da interface. */
export const typeKey = (type: PublicationType): UiKey => `pub.type.${type}`;

/** Tipos com página de evento (data, local, veículo, vídeo). */
export const isEventType = (type: PublicationType): boolean =>
  ['palestra', 'entrevista', 'evento', 'curso-aula'].includes(type);

const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (date: Date): string => dateFormat.format(date);
export const isoDate = (date: Date): string => date.toISOString().slice(0, 10);

/** Tempo de leitura estimado (200 palavras por minuto), mínimo de 1 minuto. */
export function readingMinutes(body: string | undefined): number {
  const words = (body ?? '')
    .replace(/\[\^[^\]]+\]/g, '')
    .replace(/[#>*_`[\]()-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Três publicações relacionadas: primeiro as da mesma área, depois as do mesmo tipo. */
export function relatedTo(current: Publication, all: Publication[], limit = 3): Publication[] {
  const areaIds = new Set(current.data.areas.map((area) => area.id));
  const score = (item: Publication) =>
    item.data.areas.filter((area) => areaIds.has(area.id)).length * 2 +
    (item.data.tipo === current.data.tipo ? 1 : 0);
  return all
    .filter((item) => item.id !== current.id)
    .map((item) => ({ item, points: score(item) }))
    .filter(({ points }) => points > 0)
    .sort((a, b) => b.points - a.points || b.item.data.data.getTime() - a.item.data.data.getTime())
    .slice(0, limit)
    .map(({ item }) => item);
}

/** Publicações ligadas a uma área de atuação. */
export const byArea = (all: Publication[], areaId: string): Publication[] =>
  all.filter((item) => item.data.areas.some((area) => area.id === areaId));

/** Endereço do vídeo incorporado (YouTube sem cookies ou Vimeo); null se não reconhecido. */
export function embedUrl(url: string): string | null {
  const youtube = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(
    url,
  );
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}?autoplay=1&rel=0`;
  const vimeo = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&dnt=1`;
  return null;
}
