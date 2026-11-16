import type { APIRoute, GetStaticPaths } from 'astro';
import { renderOgImage } from '@/lib/og';
import { getPublications } from '@/lib/publications';
import { placeholderDisplay } from '@/lib/site';
import { pt } from '@/i18n/pt';

/** Imagem de compartilhamento de cada publicação: /og/<endereço-da-publicação>.png */
export const getStaticPaths = (async () => {
  const publications = await getPublications();
  return publications.map((publication) => ({
    params: { slug: publication.id },
    props: {
      title: placeholderDisplay(publication.data.titulo).text,
      label: pt[`pub.type.${publication.data.tipo}`],
    },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage({ title: props['title'], label: props['label'] });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
