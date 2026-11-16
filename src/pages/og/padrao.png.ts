import type { APIRoute } from 'astro';
import { renderOgImage } from '@/lib/og';
import { settings } from '@/lib/site';

/** Imagem de compartilhamento padrão das páginas do site. */
export const GET: APIRoute = async () => {
  const png = await renderOgImage({ title: settings.nome, label: settings.posicionamento });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
