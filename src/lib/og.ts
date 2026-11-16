import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { settings } from './site';

/**
 * Imagem de compartilhamento (Open Graph, 1200×630) com a identidade da marca.
 * Usada quando a publicação não tem capa, e como imagem padrão das demais páginas.
 */
// Gerada durante a publicação do site, a partir da pasta do projeto.
const root = process.cwd();
const fontPath = (weight: 300 | 400) =>
  join(root, 'node_modules/@fontsource/lato/files', `lato-latin-${weight}-normal.woff`);
const logoPath = join(root, 'public/marca/horizontal_dourado-fundo-escuro.svg');

let assets: Promise<{ light: Buffer; regular: Buffer; logo: string }> | undefined;
const loadAssets = () =>
  (assets ??= Promise.all([
    readFile(fontPath(300)),
    readFile(fontPath(400)),
    readFile(logoPath),
  ]).then(([light, regular, logo]) => ({
    light,
    regular,
    logo: `data:image/svg+xml;base64,${logo.toString('base64')}`,
  })));

interface OgOptions {
  title: string;
  label?: string;
}

type Node = { type: string; props: Record<string, unknown> };
const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
  extra = {},
): Node => ({
  type,
  props: { style, children, ...extra },
});

export async function renderOgImage({ title, label }: OgOptions): Promise<Buffer> {
  const { light, regular, logo } = await loadAssets();
  const titleSize = title.length > 90 ? 52 : title.length > 55 ? 60 : 70;

  const tree = el(
    'div',
    {
      width: 1200,
      height: 630,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 72px',
      backgroundColor: '#031822',
      color: '#ffffff',
      fontFamily: 'Lato',
    },
    [
      el('img', { height: 72, width: 226 }, undefined, { src: logo, width: 226, height: 72 }),
      el(
        'div',
        { display: 'flex', flexDirection: 'column', gap: 24 },
        [
          label
            ? el(
                'div',
                { fontSize: 22, color: '#BA8D68', letterSpacing: 4, textTransform: 'uppercase' },
                label,
              )
            : null,
          el(
            'div',
            { fontSize: titleSize, fontWeight: 300, lineHeight: 1.12, maxWidth: 1000 },
            title,
          ),
        ].filter(Boolean),
      ),
      el('div', { display: 'flex', flexDirection: 'column', gap: 18 }, [
        el('div', {
          width: 120,
          height: 2,
          backgroundImage: 'linear-gradient(90deg, #BA8D68 0%, #F6ECB4 55%, #BA8D68 100%)',
        }),
        el(
          'div',
          { fontSize: 24, color: '#D1D3D4', fontWeight: 400 },
          `${settings.nome} · ${settings.posicionamento}`,
        ),
      ]),
    ],
  );

  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Lato', data: light, weight: 300, style: 'normal' },
      { name: 'Lato', data: regular, weight: 400, style: 'normal' },
    ],
  });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
