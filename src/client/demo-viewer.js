// Área de demonstração: alternância Desktop/Mobile, tela cheia e estados.
// Estados: placeholder (sem site configurado) · loading · embed · unavailable.
//
// O site é a cópia local em /projects/<slug>/ (mesmo domínio). O iframe:
// - só é criado quando a área se aproxima da tela;
// - renderiza na largura real do dispositivo (1440 px desktop, 390 px mobile)
//   e é reduzido com transform para caber, então o layout é o mesmo do site;
// - usa sandbox SEM allow-popups/allow-top-navigation: links de WhatsApp e
//   downloads dentro da demo não abrem, para uma visita ao portfólio não virar
//   mensagem para o cliente. O site completo continua em "Abrir site ao vivo".
// Se não carregar em 10 s, mostra o fallback (print + link).
// Para inspecionar estados: ?demo=loading | ?demo=unavailable

const TIMEOUT = 10000;
const DEVICES = { desktop: { w: 1440, h: 900 }, mobile: { w: 390, h: 844 } };

function createDemo(root) {
  const frame = root.querySelector('[data-demo-frame]');
  const viewport = root.querySelector('[data-demo-viewport]');
  const buttons = [...root.querySelectorAll('button[data-device]')];
  const fsBtn = root.querySelector('[data-fullscreen]');
  const fsLabel = root.querySelector('[data-fullscreen-label]');
  const embed = root.dataset.embed;
  const cleanups = [];
  const on = (el, ev, fn, opt) => { el.addEventListener(ev, fn, opt); cleanups.push(() => el.removeEventListener(ev, fn, opt)); };
  const setState = (s) => { frame.dataset.state = s; };
  let iframe = null;

  function fit() {
    if (!iframe) return;
    const d = DEVICES[frame.dataset.device] || DEVICES.desktop;
    const scale = Math.min(1, viewport.clientWidth / d.w);
    iframe.style.width = `${d.w}px`;
    iframe.style.height = `${Math.round(viewport.clientHeight / scale)}px`;
    iframe.style.transform = `scale(${scale})`;
  }

  buttons.forEach((b) => on(b, 'click', () => {
    frame.dataset.device = b.dataset.device;
    buttons.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    requestAnimationFrame(fit);
  }));

  if (fsBtn && root.requestFullscreen && document.fullscreenEnabled) {
    fsBtn.hidden = false;
    on(fsBtn, 'click', () => (document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen()).catch(() => {}));
    on(document, 'fullscreenchange', () => {
      fsLabel.textContent = document.fullscreenElement === root ? root.dataset.labelExit : root.dataset.labelFullscreen;
      requestAnimationFrame(fit);
    });
  }

  // Em telas estreitas, começa no modo Mobile.
  if (window.matchMedia('(max-width: 37.5rem)').matches) buttons.find((b) => b.dataset.device === 'mobile')?.click();

  const ro = new ResizeObserver(fit);
  ro.observe(viewport);
  cleanups.push(() => ro.disconnect());

  const forced = new URLSearchParams(location.search).get('demo');
  if (forced === 'loading' || forced === 'unavailable') { setState(forced); return { destroy: () => cleanups.forEach((f) => f()) }; }

  let io = null, timer = 0;
  if (embed) {
    io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect(); io = null;
      setState('loading');
      iframe = document.createElement('iframe');
      iframe.className = 'demo__iframe';
      iframe.src = embed;
      iframe.title = root.dataset.title || 'Demo';
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
      iframe.referrerPolicy = 'same-origin';
      timer = setTimeout(() => { iframe.remove(); iframe = null; setState('unavailable'); }, TIMEOUT);
      iframe.addEventListener('load', () => {
        clearTimeout(timer);
        // Mesmo domínio: confere se a página tem conteúdo. Se o acesso for bloqueado
        // (ex.: preview aberto via file://), confia no evento de load.
        let ok = true;
        try { const doc = iframe.contentDocument; if (doc) ok = !!doc.body?.childElementCount; } catch { ok = true; }
        if (ok) { setState('embed'); } else { iframe.remove(); iframe = null; setState('unavailable'); }
      }, { once: true });
      viewport.appendChild(iframe);
      fit();
    }, { rootMargin: '300px' });
    io.observe(root);
  }

  return {
    destroy() { cleanups.forEach((f) => f()); if (io) io.disconnect(); clearTimeout(timer); },
  };
}

export function initDemos() {
  return [...document.querySelectorAll('[data-demo]')].map(createDemo);
}
