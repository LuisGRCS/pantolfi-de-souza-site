import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPublications } from '@/lib/publications';
import { placeholderDisplay, settings } from '@/lib/site';

/** Feed RSS das publicações: /rss.xml */
export const GET: APIRoute = async ({ site }) => {
  const publications = await getPublications();
  return rss({
    title: `${settings.nome} — Publicações`,
    description: `Artigos, notas técnicas, palestras e entrevistas de ${settings.nome}.`,
    site: site ?? 'https://pantolfi.com.br',
    customData: '<language>pt-BR</language>',
    trailingSlash: false,
    items: publications.map((publication) => ({
      title: placeholderDisplay(publication.data.titulo).text,
      pubDate: publication.data.data,
      description: placeholderDisplay(publication.data.resumo).text,
      link: `/publicacoes/${publication.id}`,
    })),
  });
};
