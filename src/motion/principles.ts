import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionConfig } from './config';

/**
 * "Forma de trabalhar" (scroll narrativo): no computador, a seção fica fixada e
 * cada princípio substitui o anterior conforme a rolagem; o número grande muda junto.
 * No celular a seção continua como lista simples.
 * Precisa rodar antes dos reveals, pois retira os itens da animação de entrada.
 */
export function initPrinciples(): () => void {
  const section = document.querySelector<HTMLElement>('[data-principles]');
  if (!section) return () => {};

  const media = gsap.matchMedia();
  media.add(motionConfig.desktopQuery, () => {
    const items = [...section.querySelectorAll<HTMLElement>('[data-principle]')];
    const numbers = [...section.querySelectorAll<HTMLElement>('[data-principle-number]')];
    const group = section.querySelector<HTMLElement>('[data-reveal-group]');
    const count = items.length;

    // No modo fixado, a troca de textos é feita aqui (não pelo reveal de blocos).
    items.forEach((item) => item.removeAttribute('data-reveal'));
    group?.removeAttribute('data-reveal-group');
    section.classList.add('is-pinned');

    let current = -1;
    const setActive = (index: number) => {
      if (index === current) return;
      current = index;
      [items, numbers].forEach((list) =>
        list.forEach((element, i) => {
          element.toggleAttribute('data-active', i === index);
          element.toggleAttribute('data-past', i < index);
        }),
      );
    };
    setActive(0);

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * (count - 0.4)}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => setActive(Math.min(count - 1, Math.floor(self.progress * count))),
    });

    return () => {
      section.classList.remove('is-pinned');
      items.forEach((item) => item.removeAttribute('data-active'));
      numbers.forEach((number) => number.removeAttribute('data-active'));
    };
  });

  return () => media.revert();
}
