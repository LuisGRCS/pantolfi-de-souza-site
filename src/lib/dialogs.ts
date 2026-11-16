/**
 * Menu em tela cheia e busca: abrem como janelas modais nativas (<dialog>),
 * o que prende o foco dentro delas, fecha com Esc e devolve o foco ao botão de origem.
 */
interface DialogBinding {
  dialog: HTMLDialogElement;
  openers: HTMLElement[];
}

function bindDialog(name: 'menu' | 'search'): DialogBinding | null {
  const dialog = document.querySelector<HTMLDialogElement>(`[data-${name}]`);
  if (!dialog) return null;
  const openers = [...document.querySelectorAll<HTMLElement>(`[data-${name}-open]`)];
  const closers = [...dialog.querySelectorAll<HTMLElement>(`[data-${name}-close]`)];

  const setExpanded = (value: boolean) =>
    openers.forEach((button) => button.setAttribute('aria-expanded', String(value)));

  const open = () => {
    if (dialog.open) return;
    dialog.showModal();
    document.documentElement.setAttribute('data-dialog-open', name);
    setExpanded(true);
  };

  openers.forEach((button) => button.addEventListener('click', open));
  closers.forEach((button) => button.addEventListener('click', () => dialog.close()));

  dialog.addEventListener('close', () => {
    document.documentElement.removeAttribute('data-dialog-open');
    setExpanded(false);
  });

  // Fecha ao escolher um link do menu.
  dialog
    .querySelectorAll('a[href]')
    .forEach((link) => link.addEventListener('click', () => dialog.close()));

  return { dialog, openers };
}

export function initDialogs(): void {
  bindDialog('menu');
  const search = bindDialog('search');
  if (!search) return;

  // Atalho "/" abre a busca, exceto quando a pessoa está digitando em um campo.
  document.addEventListener('keydown', (event) => {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    const typing =
      target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '');
    if (typing || document.querySelector('dialog[open]')) return;
    event.preventDefault();
    search.openers[0]?.click();
  });

  // Foco direto no campo de busca ao abrir.
  search.dialog.addEventListener('toggle', () => {
    if (search.dialog.open) {
      search.dialog.querySelector<HTMLInputElement>('[data-search-input]')?.focus();
    }
  });
}
