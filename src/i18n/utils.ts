import { en } from './en';
import { pt, type UiKey } from './pt';

export const languages = { pt: 'pt-BR', en: 'en' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'pt';

const dictionaries: Record<Lang, Record<UiKey, string>> = { pt, en };

/** Idioma da página a partir da URL (/en/... é inglês; o resto é português). */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'en' ? 'en' : defaultLang;
}

/** Retorna a função de tradução dos textos fixos da interface. */
export function useTranslations(lang: Lang) {
  return (key: UiKey): string => dictionaries[lang][key];
}

/** Monta um endereço interno respeitando o idioma (/sobre ou /en/sobre). */
export function localizePath(path: string, lang: Lang): string {
  if (lang === defaultLang) return path;
  return path === '/' ? '/en' : `/en${path}`;
}
