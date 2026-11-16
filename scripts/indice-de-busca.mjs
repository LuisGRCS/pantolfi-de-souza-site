/**
 * Gera o índice da busca (Pagefind) depois da compilação do site.
 * Indexa apenas o conteúdo marcado (áreas, publicações, trajetória e Sobre)
 * e copia o índice também para a pasta que a Vercel publica.
 */
import { cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import * as pagefind from 'pagefind';

const site = 'dist/client';
const vercelStatic = '.vercel/output/static';

const { index, errors } = await pagefind.createIndex({ forceLanguage: 'pt' });
if (!index) throw new Error(`Falha ao criar o índice de busca: ${errors.join(', ')}`);

const { page_count: pages } = await index.addDirectory({ path: site });
await index.writeFiles({ outputPath: `${site}/pagefind` });
await pagefind.close();

if (existsSync(vercelStatic)) {
  await cp(`${site}/pagefind`, `${vercelStatic}/pagefind`, { recursive: true });
}

process.stdout.write(`Índice de busca: ${pages} páginas.\n`);
