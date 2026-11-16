import type { UiKey } from '@/i18n/pt';

export interface NavItem {
  key: UiKey;
  href: string;
}

/** Abas do site, na ordem em que aparecem no menu em tela cheia (01–06). */
export const navItems: NavItem[] = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.about', href: '/sobre' },
  { key: 'nav.areas', href: '/areas' },
  { key: 'nav.career', href: '/trajetoria' },
  { key: 'nav.publications', href: '/publicacoes' },
  { key: 'nav.contact', href: '/contato' },
];

/** Abas exibidas no centro do cabeçalho (sem "Início", acessível pelo logotipo). */
export const headerNavItems = navItems.filter((item) => item.href !== '/');

export const legalItems: NavItem[] = [
  { key: 'nav.privacy', href: '/privacidade' },
  { key: 'nav.notice', href: '/aviso-legal' },
];

/** Indica se a aba corresponde à página atual (inclui subpáginas, como /areas/slug). */
export function isActive(href: string, pathname: string): boolean {
  const clean = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  if (href === '/') return clean === '/';
  return clean === href || clean.startsWith(`${href}/`);
}
