import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { motionConfig } from './config';
import { isDesktop } from './env';

/**
 * Convenções de marcação (usadas pelos componentes):
 *   - todo h1/h2 dentro de <main> revela linha a linha (data-reveal-skip desliga)
 *   - [data-reveal]        bloco que surge e sobe ao entrar na tela
 *                          (os já visíveis ao abrir a página ganham data-reveal-now e
 *                          surgem só com CSS; ver BaseLayout.astro e motion.css)
 *   - [data-reveal-group]  revela os filhos [data-reveal] em sequência
 *   - [data-hero-media]    fundo do hero: zoom de entrada e parallax
 *   - [data-parallax]      imagem editorial com parallax (só desktop)
 *   - [data-draw-line]     divisor (.rule-top) que se desenha da esquerda
 *   - [data-count-to]      número que conta de 0 até o valor (só números permitidos)
 * Cada elemento revela uma única vez.
 */

const { headings, blocks, hero, parallax, ease } = motionConfig;

/**
 * O que já está visível ao abrir a página anima logo (com o atraso da abertura);
 * o resto espera entrar na tela.
 */
function playWhenVisible(trigger: Element, start: string, delay: number) {
  return ScrollTrigger.isInViewport(trigger, 0.01)
    ? { delay }
    : { delay: 0, scrollTrigger: { trigger, start, once: true } };
}

interface RevealOptions {
  /** atraso inicial (s) para o que já está visível, ex.: durante a abertura */
  delay?: number;
}

function revealHeadings(scope: ParentNode, delay: number): SplitText[] {
  const targets = gsap.utils.toArray<HTMLElement>(
    scope.querySelectorAll('main :is(h1, h2):not([data-reveal-skip]):not(:has(a, button))'),
  );
  return targets.map((heading) => {
    const split = SplitText.create(heading, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'reveal-line',
      aria: 'auto',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 100,
          duration: headings.duration,
          ease,
          stagger: headings.stagger,
          ...playWhenVisible(heading, headings.start, delay),
        }),
    });
    heading.setAttribute('data-revealed', '');
    return split;
  });
}

function revealBlocks(scope: ParentNode, delay: number): void {
  const grouped = new Set<HTMLElement>();

  scope.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = gsap.utils.toArray<HTMLElement>(
      group.querySelectorAll('[data-reveal]:not([data-reveal-now])'),
    );
    group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((item) => grouped.add(item));
    if (items.length === 0) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: blocks.distance },
      {
        opacity: 1,
        y: 0,
        duration: blocks.duration,
        ease,
        stagger: blocks.stagger,
        ...playWhenVisible(group, blocks.start, delay),
      },
    );
  });

  scope.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-now])').forEach((item) => {
    if (grouped.has(item)) return;
    gsap.fromTo(
      item,
      { opacity: 0, y: blocks.distance },
      {
        opacity: 1,
        y: 0,
        duration: blocks.duration,
        ease,
        ...playWhenVisible(item, blocks.start, delay),
      },
    );
  });
}

function animateHero(scope: ParentNode, delay: number): void {
  const media = scope.querySelector<HTMLElement>('[data-hero-media]');
  if (!media) return;
  gsap.fromTo(
    media,
    { scale: hero.zoomFrom },
    { scale: 1, duration: hero.zoomDuration * 2, ease: motionConfig.easeSoft, delay },
  );
  if (!isDesktop()) return;
  gsap.to(media, {
    yPercent: hero.parallax,
    ease: 'none',
    scrollTrigger: {
      trigger: media.parentElement,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}

function parallaxImages(scope: ParentNode): void {
  if (!isDesktop()) return;
  scope.querySelectorAll<HTMLElement>('[data-parallax]').forEach((image) => {
    gsap.fromTo(
      image,
      { yPercent: -parallax.amount },
      {
        yPercent: parallax.amount,
        ease: 'none',
        scrollTrigger: {
          trigger: image.parentElement ?? image,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}

function drawLines(scope: ParentNode): void {
  scope.querySelectorAll<HTMLElement>('[data-draw-line]').forEach((element) => {
    ScrollTrigger.create({
      trigger: element,
      start: blocks.start,
      once: true,
      onEnter: () => element.setAttribute('data-drawn', ''),
    });
  });
}

function countUp(scope: ParentNode): void {
  scope.querySelectorAll<HTMLElement>('[data-count-to]').forEach((element) => {
    const target = Number(element.dataset['countTo']);
    if (!Number.isFinite(target)) return;
    const counter = { value: 0 };
    element.textContent = '0';
    gsap.to(counter, {
      value: target,
      duration: motionConfig.counters.duration,
      ease: motionConfig.easeSoft,
      onUpdate: () => {
        element.textContent = String(Math.round(counter.value));
      },
      scrollTrigger: { trigger: element, start: blocks.start, once: true },
    });
  });
}

/** Liga todos os reveals da página. Retorna uma função que desfaz tudo (troca de página). */
export function initReveals(scope: ParentNode = document, options: RevealOptions = {}): () => void {
  const delay = options.delay ?? 0;
  const context = gsap.context(() => {
    animateHero(scope, delay);
    revealBlocks(scope, delay);
    parallaxImages(scope);
    drawLines(scope);
    countUp(scope);
  });
  const splits = revealHeadings(scope, delay);
  document.documentElement.setAttribute('data-motion-ready', '');

  return () => {
    splits.forEach((split) => split.revert());
    context.revert();
  };
}
