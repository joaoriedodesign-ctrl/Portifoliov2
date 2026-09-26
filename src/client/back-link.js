// Botão "Voltar" da página de contato: volta no histórico quando a página
// anterior é do próprio site; caso contrário, segue o href (Home do idioma).

export function initBackLinks() {
  const links = [...document.querySelectorAll('[data-back]')];
  const handler = (e) => {
    let internal = false;
    try { internal = !!document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1; } catch { internal = false; }
    if (internal) { e.preventDefault(); history.back(); }
  };
  links.forEach((a) => a.addEventListener('click', handler));
  return { destroy: () => links.forEach((a) => a.removeEventListener('click', handler)) };
}
