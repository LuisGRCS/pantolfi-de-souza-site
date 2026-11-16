/**
 * Índice de seção ("02 / 06") no canto da tela, com barra fina de progresso.
 * Conta as seções marcadas com data-section dentro de <main>.
 * Não é animação: funciona também com movimento reduzido.
 */
const pad = (n: number) => String(n).padStart(2, '0');

export function initSectionIndex(): () => void {
  const index = document.querySelector<HTMLElement>('[data-section-index]');
  const sections = [...document.querySelectorAll<HTMLElement>('main [data-section]')];
  if (!index || sections.length < 2) return () => {};

  const current = index.querySelector<HTMLElement>('[data-current]');
  const total = index.querySelector<HTMLElement>('[data-total]');
  const progress = index.querySelector<HTMLElement>('[data-progress]');
  if (total) total.textContent = pad(sections.length);
  index.hidden = false;

  let ticking = false;
  const update = () => {
    const middle = window.innerHeight * 0.5;
    let active = 0;
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= middle) active = i;
    });
    if (current) current.textContent = pad(active + 1);

    // A cor acompanha o fundo que está logo atrás do índice (claro ou escuro).
    const indexY = index.getBoundingClientRect().top;
    const behind = sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= indexY && rect.bottom >= indexY;
    });
    index.dataset['surface'] = behind?.dataset['surface'] ?? 'dark';

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progress?.style.setProperty('--progress', String(ratio));
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
}
