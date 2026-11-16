import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getAreas } from '@/lib/content';
import { getPublications, isoDate } from '@/lib/publications';

/**
 * Mapa do site para buscadores (/sitemap.xml). Gerado a cada publicação.
 * Ficam de fora: painel, páginas de resultado do formulário e textos legais em revisão.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://pantolfi.com.br');
  const [areas, publications, legal] = await Promise.all([
    getAreas(),
    getPublications(),
    getCollection('legais', ({ data }) => !data.emRevisao),
  ]);

  const pages: { path: string; lastmod?: string }[] = [
    { path: '/' },
    { path: '/sobre' },
    { path: '/areas' },
    ...areas.map((area) => ({ path: `/areas/${area.id}` })),
    { path: '/trajetoria' },
    {
      path: '/publicacoes',
      ...(publications[0] && { lastmod: isoDate(publications[0].data.data) }),
    },
    ...publications.map((p) => ({ path: `/publicacoes/${p.id}`, lastmod: isoDate(p.data.data) })),
    { path: '/contato' },
    ...legal.map((entry) => ({ path: `/${entry.id}`, lastmod: isoDate(entry.data.atualizadoEm) })),
  ];

  const urls = pages
    .map(({ path, lastmod }) => {
      const loc = new URL(path, base).toString().replace(/(.)\/$/, '$1');
      return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
    })
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
