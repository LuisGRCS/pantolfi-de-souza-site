import type { APIRoute } from 'astro';

/** Regras para buscadores (/robots.txt): o painel de edição fica fora da busca. */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('/sitemap.xml', site ?? 'https://pantolfi.com.br');
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /keystatic',
    'Disallow: /admin',
    'Disallow: /api/',
    'Disallow: /contato/enviado',
    'Disallow: /contato/nao-enviado',
    '',
    `Sitemap: ${sitemap}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
