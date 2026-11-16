import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import type { DialogToggleDetail } from '@/lib/dialogs';
import { motionConfig } from './config';
import { getLenis, resetLenis, startLenis } from './lenis';
import { initPrinciples } from './principles';
import { initReveals } from './reveals';
import { initTimeline } from './timeline';

/**
 * Sistema de movimento. Carregado uma única vez, de forma diferida,
 * e somente quando a pessoa não pediu para reduzir animações.
 */
gsap.registerPlugin(ScrollTrigger, SplitText);

let firstPage = true;

// Filtros e "Carregar mais" mudam a altura da página: recalcula as posições.
document.addEventListener('publications:update', () => ScrollTrigger.refresh());

// Pausa a rolagem suave enquanto o menu ou a busca estão abertos.
document.addEventListener('dialog:toggle', (event) => {
  const { open } = (event as CustomEvent<DialogToggleDetail>).detail;
  const lenis = getLenis();
  if (open) lenis?.stop();
  else lenis?.start();
});

/** Liga o movimento da página atual. Retorna a função que o desliga antes da troca de página. */
export function startPageMotion(): () => void {
  const root = document.documentElement;
  const intro = firstPage && root.classList.contains('intro');

  if (firstPage) startLenis();
  else resetLenis();
  firstPage = false;

  // A seção fixada vem antes dos reveals (ela retira seus itens da animação de entrada).
  const stopPrinciples = initPrinciples();
  const stopReveals = initReveals(document, {
    delay: intro ? motionConfig.intro.contentDelay : 0,
  });
  const stopTimeline = initTimeline();

  // Recalcula as posições quando as fontes terminam de carregar.
  void document.fonts.ready.then(() => ScrollTrigger.refresh());

  // A cortina de abertura é CSS; depois dela, o elemento sai da página.
  if (intro) window.setTimeout(() => root.classList.remove('intro'), 1300);

  return () => {
    stopTimeline();
    stopReveals();
    stopPrinciples();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
}

/** Logo após a troca de página: volta ao topo sem animação. */
export function afterSwap(): void {
  resetLenis();
}
