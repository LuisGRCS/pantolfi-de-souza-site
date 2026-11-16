// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import { placeholderPlugin } from './src/lib/markdown-placeholder.ts';

export default defineConfig({
  site: 'https://pantolfi.com.br',
  adapter: vercel(),
  // Painel de edição: /keystatic (o endereço /admin leva até ele)
  integrations: [react(), keystatic()],
  redirects: { '/admin': '/keystatic' },
  trailingSlash: 'never',
  build: { assets: 'assets' },
  devToolbar: { enabled: false },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  markdown: {
    processor: satteri({
      mdastPlugins: [placeholderPlugin],
      features: {
        smartPunctuation: true,
        gfm: {
          footnotes: { label: 'Notas', backLabel: 'Voltar ao texto (nota {reference})' },
        },
      },
    }),
  },
  i18n: {
    // Português é o idioma padrão (sem prefixo na URL).
    // As páginas em inglês ficam em /en/ e só serão criadas quando houver tradução.
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
    // Arquivos finais com nomes neutros (apenas o código de conteúdo).
    environments: {
      client: {
        build: {
          rolldownOptions: {
            output: {
              entryFileNames: 'assets/[hash].js',
              chunkFileNames: 'assets/[hash].js',
              assetFileNames: 'assets/[hash][extname]',
            },
          },
        },
      },
    },
  },
});
