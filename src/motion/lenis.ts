import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionConfig } from './config';

let lenis: Lenis | null = null;

/**
 * Rolagem suave do site inteiro, sincronizada com o GSAP e o ScrollTrigger.
 * No toque (celular) a rolagem nativa é mantida. Áreas com o atributo
 * data-lenis-prevent, o menu, a busca e os campos de texto rolam normalmente.
 */
export function startLenis(): Lenis {
  if (lenis) return lenis;

  lenis = new Lenis({
    lerp: motionConfig.lenis.lerp,
    wheelMultiplier: motionConfig.lenis.wheelMultiplier,
    syncTouch: false,
    autoRaf: false,
    anchors: { offset: 0 },
    prevent: (node) => node.closest('dialog, textarea, select, [data-lenis-prevent]') !== null,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export const getLenis = (): Lenis | null => lenis;

/** Após trocar de página: volta ao topo e recalcula o tamanho da página. */
export function resetLenis(): void {
  if (!lenis) return;
  lenis.scrollTo(0, { immediate: true, force: true });
  lenis.resize();
  lenis.start();
}
