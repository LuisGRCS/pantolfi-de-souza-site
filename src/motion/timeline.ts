import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Trajetória: a linha vertical se desenha acompanhando a rolagem e cada marco
 * se acende quando a linha o alcança. Após filtrar, as posições são recalculadas.
 */
export function initTimeline(): () => void {
  const root = document.querySelector<HTMLElement>('[data-timeline]');
  const line = root?.querySelector<HTMLElement>('[data-timeline-line]');
  if (!root || !line) return () => {};

  const context = gsap.context(() => {
    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: line.parentElement,
          start: 'top 70%',
          end: 'bottom 70%',
          scrub: true,
        },
      },
    );

    root.querySelectorAll<HTMLElement>('[data-timeline-item]').forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 70%',
        once: true,
        onEnter: () => item.setAttribute('data-active', ''),
      });
    });
  });

  const refresh = () => ScrollTrigger.refresh();
  root.addEventListener('timeline:filter', refresh);

  return () => {
    root.removeEventListener('timeline:filter', refresh);
    context.revert();
  };
}
