import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Regras de cada tipo de conteúdo. Se um arquivo de conteúdo estiver
 * incompleto ou com formato errado, o site não é publicado e o erro aponta o campo.
 */

const seo = z
  .object({
    titulo: z.string().optional(),
    descricao: z.string().max(170).optional(),
  })
  .optional();

/** Áreas de atuação: um arquivo por área em src/content/areas. */
const areas = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/areas' }),
  schema: z.object({
    titulo: z.string().min(1),
    ordem: z.number().int(),
    resumo: z.string().min(1).max(220),
    visaoGeral: z.string().min(1),
    comoAtuo: z.array(z.object({ titulo: z.string().min(1), descricao: z.string().min(1) })),
    paraQuem: z.array(z.string().min(1)),
    perguntas: z.array(z.object({ pergunta: z.string().min(1), resposta: z.string().min(1) })),
    rascunho: z.boolean().default(false),
    seo,
  }),
});

export const timelineTypes = ['formacao', 'atuacao', 'academico', 'reconhecimento'] as const;
export type TimelineType = (typeof timelineTypes)[number];

/** Marcos da trajetória: um arquivo por marco em src/content/trajetoria. */
const trajetoria = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/trajetoria' }),
  schema: z.object({
    periodo: z.string().min(1),
    ordem: z.number().int(),
    tipo: z.enum(timelineTypes),
    cargo: z.string().min(1),
    instituicao: z.string().min(1),
    descricao: z.string().optional(),
    destaque: z.boolean().default(false),
  }),
});

/** Toda imagem precisa de descrição para leitores de tela. */
const altWhenImage = (data: { retrato?: unknown; retratoAlt?: string | undefined }) =>
  !data.retrato || Boolean(data.retratoAlt?.trim());
const altMessage = {
  message: 'Descreva o retrato no campo "retratoAlt" (texto alternativo).',
  path: ['retratoAlt'],
};

const principle = z.object({
  titulo: z.string().min(1),
  resumo: z.string().min(1),
  texto: z.string().min(1),
});

/** Página inicial (arquivo único). */
const inicio = defineCollection({
  loader: glob({ pattern: 'inicio.json', base: './src/content/paginas' }),
  schema: ({ image }) =>
    z
      .object({
        tagline: z.string().min(1),
        imagemHero: image().optional(),
        bioCurta: z.string().min(1),
        retrato: image().optional(),
        retratoAlt: z.string().optional(),
        principios: z.array(principle).min(3).max(4),
        contatoTitulo: z.string().min(1),
        seo,
      })
      .refine(altWhenImage, altMessage),
});

/** Página Sobre (arquivo único). */
const sobre = defineCollection({
  loader: glob({ pattern: 'sobre.json', base: './src/content/paginas' }),
  schema: ({ image }) =>
    z
      .object({
        titulo: z.string().min(1),
        abertura: z.string().min(1),
        retrato: image().optional(),
        retratoAlt: z.string().optional(),
        biografia: z.array(z.string().min(1)).min(1),
        formacao: z.array(
          z.object({
            curso: z.string().min(1),
            instituicao: z.string().min(1),
            ano: z.string().min(1),
          }),
        ),
        idiomas: z.array(z.string().min(1)),
        associacoes: z.array(z.string().min(1)),
        seo,
      })
      .refine(altWhenImage, altMessage),
});

export const publicationTypes = [
  'artigo',
  'nota-tecnica',
  'palestra',
  'entrevista',
  'evento',
  'curso-aula',
  'livro-capitulo',
] as const;
export type PublicationType = (typeof publicationTypes)[number];

/**
 * Publicações (artigos, notas técnicas, palestras, entrevistas…): um arquivo .md por
 * publicação em src/content/publicacoes. O nome do arquivo vira o endereço da página.
 * Nunca citar clientes, valores ou resultados de casos (Provimento 205/2021).
 */
const publicacoes = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/publicacoes' }),
  schema: ({ image }) =>
    z
      .object({
        titulo: z.string().min(1),
        tipo: z.enum(publicationTypes),
        data: z.coerce.date(),
        resumo: z.string().min(1).max(220),
        capa: image().optional(),
        capaAlt: z.string().optional(),
        areas: z.array(reference('areas')).default([]),
        veiculo: z.string().optional(),
        linkExterno: z.url().optional(),
        video: z.url().optional(),
        pdf: z.string().optional(),
        destaque: z.boolean().default(false),
        rascunho: z.boolean().default(false),
        seo,
      })
      .refine((data) => !data.capa || Boolean(data.capaAlt?.trim()), {
        message: 'Descreva a imagem de capa no campo "capaAlt" (texto alternativo).',
        path: ['capaAlt'],
      }),
});

export const collections = { areas, trajetoria, inicio, sobre, publicacoes };
