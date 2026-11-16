import { initDialogs, registerSearchShortcut } from '@/lib/dialogs';
import { prefersReducedMotion } from '@/motion/env';
import { initHeader } from '@/motion/header';
import { initSectionIndex } from '@/motion/section-index';

/**
 * Ponto de entrada do JavaScript do site.
 * Roda a cada página (inclusive nas trocas de aba feitas pelas View Transitions).
 */
type Cleanup = () => void;
let cleanups: Cleanup[] = [];

// GSAP e Lenis só são baixados quando há movimento a exibir.
const motion = prefersReducedMotion() ? null : import('@/motion/index');

registerSearchShortcut();

document.addEventListener('astro:page-load', () => {
  initDialogs();
  cleanups.push(initHeader(), initSectionIndex());
  void motion?.then((module) => cleanups.push(module.startPageMotion()));
});

document.addEventListener('astro:before-swap', (event) => {
  cleanups.forEach((cleanup) => cleanup());
  cleanups = [];
  // Mantém as marcações de movimento (e da rolagem suave) na página que vai entrar.
  if (!motion) return;
  const keep = [...document.documentElement.classList].filter(
    (name) => name === 'motion-ok' || name.startsWith('lenis'),
  );
  event.newDocument.documentElement.classList.add(...keep);
});

document.addEventListener('astro:after-swap', () => {
  void motion?.then((module) => module.afterSwap());
});
