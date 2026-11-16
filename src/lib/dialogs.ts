/**
 * Menu em tela cheia e busca: abrem como janelas modais nativas (<dialog>),
 * o que prende o foco dentro delas, fecha com Esc e devolve o foco ao botão de origem.
 * Ao abrir e fechar, avisa o restante do site pelo evento "dialog:toggle"
 * (a rolagem suave é pausada enquanto um deles está aberto).
 */
export interface DialogToggleDetail {
  open: boolean;
}

const announce = (open: boolean) =>
  document.dispatchEvent(
    new CustomEvent<DialogToggleDetail>('dialog:toggle', { detail: { open } }),
  );

function bindDialog(name: 'menu' | 'search'): void {
  const dialog = document.querySelector<HTMLDialogElement>(`[data-${name}]`);
  if (!dialog) return;
  const openers = [...document.querySelectorAll<HTMLElement>(`[data-${name}-open]`)];
  const closers = [...dialog.querySelectorAll<HTMLElement>(`[data-${name}-close]`)];

  const setExpanded = (value: boolean) =>
    openers.forEach((button) => button.setAttribute('aria-expanded', String(value)));

  const open = () => {
    if (dialog.open) return;
    dialog.showModal();
    document.documentElement.setAttribute('data-dialog-open', name);
    setExpanded(true);
    announce(true);
  };

  openers.forEach((button) => button.addEventListener('click', open));
  closers.forEach((button) => button.addEventListener('click', () => dialog.close()));

  dialog.addEventListener('close', () => {
    document.documentElement.removeAttribute('data-dialog-open');
    setExpanded(false);
    announce(false);
  });

  // Fecha ao escolher um link do menu.
  dialog
    .querySelectorAll('a[href]')
    .forEach((link) => link.addEventListener('click', () => dialog.close()));

  // Foco direto no campo de busca ao abrir.
  if (name === 'search') {
    dialog.addEventListener('toggle', () => {
      if (dialog.open) dialog.querySelector<HTMLInputElement>('[data-search-input]')?.focus();
    });
  }
}

/** Liga o menu e a busca da página atual (chamado a cada troca de página). */
export function initDialogs(): void {
  bindDialog('menu');
  bindDialog('search');
}

/** Atalho "/" abre a busca, exceto quando a pessoa está digitando em um campo. */
export function registerSearchShortcut(): void {
  document.addEventListener('keydown', (event) => {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    const typing =
      target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '');
    if (typing || document.querySelector('dialog[open]')) return;
    event.preventDefault();
    document.querySelector<HTMLElement>('[data-search-open]')?.click();
  });
}
