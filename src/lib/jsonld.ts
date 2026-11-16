/**
 * Dados estruturados (JSON-LD) para buscadores: quem é o advogado, o escritório,
 * as publicações, a trilha de navegação e as perguntas frequentes.
 * Campos ainda não preenchidos ([PREENCHER]) ficam de fora.
 */
import { activeSocials, isPlaceholder, settings } from './site';

type Json = Record<string, unknown>;

const filled = (value: string | undefined): string | undefined =>
  value && !isPlaceholder(value) ? value : undefined;

const clean = (data: Json): Json =>
  Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));

export function siteGraph(site: URL): Json {
  const personId = new URL('/#advogado', site).toString();
  const serviceId = new URL('/#escritorio', site).toString();
  const oab = filled(settings.oab);
  const street = filled(settings.endereco);
  const address = clean({
    '@type': 'PostalAddress',
    streetAddress: street,
    addressLocality: 'São Paulo',
    addressRegion: 'SP',
    addressCountry: 'BR',
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      clean({
        '@type': 'Person',
        '@id': personId,
        name: settings.nome,
        jobTitle: 'Advogado',
        url: new URL('/sobre', site).toString(),
        email: `mailto:${settings.email}`,
        telephone: `+${settings.whatsapp}`,
        sameAs: activeSocials.length ? activeSocials.map((rede) => rede.url) : undefined,
        hasCredential: oab
          ? {
              '@type': 'EducationalOccupationalCredential',
              credentialCategory: 'Inscrição na Ordem dos Advogados do Brasil',
              name: `OAB/SP nº ${oab}`,
            }
          : undefined,
        worksFor: { '@id': serviceId },
      }),
      clean({
        '@type': 'LegalService',
        '@id': serviceId,
        name: `${settings.nome} · ${settings.posicionamento}`,
        url: site.toString(),
        logo: new URL('/icon-512.png', site).toString(),
        image: new URL('/og/padrao.png', site).toString(),
        email: settings.email,
        telephone: `+${settings.whatsapp}`,
        address,
        areaServed: 'BR',
        founder: { '@id': personId },
      }),
    ],
  };
}

export const breadcrumbs = (site: URL, items: { name: string; path: string }[]): Json => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: new URL(item.path, site).toString(),
  })),
});

export function article(
  site: URL,
  data: { title: string; description: string; path: string; date: Date; image: string },
): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    datePublished: data.date.toISOString(),
    url: new URL(data.path, site).toString(),
    mainEntityOfPage: new URL(data.path, site).toString(),
    image: new URL(data.image, site).toString(),
    inLanguage: 'pt-BR',
    author: { '@id': new URL('/#advogado', site).toString() },
    publisher: { '@id': new URL('/#escritorio', site).toString() },
  };
}

/** Perguntas frequentes; só entram as já preenchidas. */
export function faq(items: { pergunta: string; resposta: string }[]): Json | null {
  const ready = items.filter((item) => filled(item.pergunta) && filled(item.resposta));
  if (ready.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ready.map((item) => ({
      '@type': 'Question',
      name: item.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: item.resposta },
    })),
  };
}
