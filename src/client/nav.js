// Header (borda ao rolar) e menu mobile em tela cheia com foco gerenciado.

export function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return null;
  let ticking = false;
  const update = () => { header.classList.toggle('is-scrolled', window.scrollY > 8); ticking = false; };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  return { destroy: () => window.removeEventListener('scroll', onScroll) };
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])';

export function initMenu() {
  const menu = document.querySelector('[data-menu]');
  const openBtn = document.querySelector('[data-menu-open]');
  const closeBtn = document.querySelector('[data-menu-close]');
  if (!menu || !openBtn || !closeBtn) return null;
  let lastTrigger = null;
  let viaKeyboard = false;

  const focusables = () => [...menu.querySelectorAll(FOCUSABLE)].filter((el) => !el.hasAttribute('hidden') && el.offsetParent !== null);

  function open(e) {
    viaKeyboard = e && e.detail === 0; // Enter/Espaço disparam click com detail 0
    lastTrigger = openBtn;
    menu.hidden = false;
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    // Teclado: foco no primeiro link. Toque: foco no container (sem contorno visível).
    if (viaKeyboard) (menu.querySelector('.mobile-menu__link') || closeBtn).focus();
    else menu.focus({ preventScroll: true });
    document.addEventListener('keydown', onKey);
  }
  function close({ restore = true } = {}) {
    if (menu.hidden) return;
    menu.hidden = true;
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    document.removeEventListener('keydown', onKey);
    if (restore && lastTrigger) lastTrigger.focus({ preventScroll: true });
  }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === menu)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  const onOpen = (e) => open(e);
  const onClose = (e) => close({ restore: e.detail === 0 });
  const onLink = (e) => { if (e.target.closest('a')) close({ restore: false }); };
  const mq = window.matchMedia('(min-width: 48rem)');
  const onMq = () => { if (mq.matches) close({ restore: false }); };

  openBtn.addEventListener('click', onOpen);
  closeBtn.addEventListener('click', onClose);
  menu.addEventListener('click', onLink);
  mq.addEventListener('change', onMq);
  return {
    destroy() {
      openBtn.removeEventListener('click', onOpen);
      closeBtn.removeEventListener('click', onClose);
      menu.removeEventListener('click', onLink);
      mq.removeEventListener('change', onMq);
      document.removeEventListener('keydown', onKey);
    },
  };
}
