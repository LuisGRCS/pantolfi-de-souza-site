import { motionConfig } from './config';

/**
 * Cabeçalho: translúcido sobre o hero até 80px de rolagem, depois sólido.
 * Esconde ao rolar para baixo e reaparece ao rolar para cima.
 */
export function initHeader(): () => void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return () => {};

  const { solidAfter, hideAfter, tolerance } = motionConfig.header;
  const overlay = header.dataset['overlay'] === 'true';
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    if (overlay) header.dataset['solid'] = String(y > solidAfter);

    const delta = y - lastY;
    const menuOpen = document.documentElement.hasAttribute('data-dialog-open');
    const focusInside = header.contains(document.activeElement);
    if (!menuOpen && !focusInside && Math.abs(delta) > tolerance) {
      header.dataset['hidden'] = String(delta > 0 && y > hideAfter);
    }
    if (y <= hideAfter) header.dataset['hidden'] = 'false';

    lastY = y;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  // Ao navegar pelo teclado, o cabeçalho reaparece.
  const onFocusIn = () => {
    header.dataset['hidden'] = 'false';
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  header.addEventListener('focusin', onFocusIn);
  return () => {
    window.removeEventListener('scroll', onScroll);
    header.removeEventListener('focusin', onFocusIn);
  };
}
