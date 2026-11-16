import { motionConfig } from './config';

/** A pessoa pediu ao sistema para reduzir animações? */
export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Tela larga o bastante para parallax e seções fixadas. */
export const isDesktop = (): boolean => window.matchMedia(motionConfig.desktopQuery).matches;
