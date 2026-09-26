// Controlador da sequência 3D de projetos, guiada pelo scroll nativo.
// - A cena fica sticky; o progresso é derivado da posição de scroll (sem bloquear
//   wheel/touch/teclado, sem saltos forçados, sem autoplay).
// - Rolar para cima reverte; após o último projeto a página segue o fluxo normal.
// - Ancoragem: quando a rolagem para no meio de uma transição, a página desliza
//   até o próximo projeto no sentido em que a pessoa estava rolando (ou volta ao
//   anterior, se estava subindo). Nada acontece enquanto o dedo está na tela.
// - Cards fora de foco: texto oculto (sem paradas de foco invisíveis); a capa
//   continua clicável e leva a sequência até aquele projeto.
// - Com movimento reduzido (ou se algo falhar) a marcação continua uma lista estática.

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);

// Parâmetros de animação (fora do design system, configuráveis aqui)
const CONFIG = {
  desktop: { step: 0.9, hold: 0.22, rise: 0.13, depth: 380, tiltActive: 6, tiltQueue: 16, dropY: 0.95, dropZ: 320, tiltOut: -14, fadeFrom: 0.55, fadeLen: 0.45, infoFade: 2.4, queueFade: 2.4 },
  mobile: { step: 0.62, hold: 0.14, rise: 0.075, depth: 260, tiltActive: 3, tiltQueue: 10, dropY: 0.55, dropZ: 180, tiltOut: -8, fadeFrom: 0.05, fadeLen: 0.4, infoFade: 3.5, queueFade: 1.4 },
};

function createStack(root) {
  const items = [...root.querySelectorAll('[data-depth-item]')];
  const sticky = root.querySelector('[data-depth-sticky]');
  const n = items.length;
  if (n < 2 || !sticky) return null;
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mqDesk = window.matchMedia('(min-width: 64rem)');
  let enabled = false, visible = false, raf = 0, cfg = CONFIG.desktop;
  let vh = 0, sceneH = 0, range = 0, holdPx = 0, active = -1, io = null;
  const covers = items.map((li) => li.querySelector('.project-card__cover'));

  function measure() {
    cfg = mqDesk.matches ? CONFIG.desktop : CONFIG.mobile;
    vh = window.innerHeight;
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) * 16 || 64;
    sceneH = vh - headerH;
    holdPx = vh * cfg.hold;
    range = (n - 1) * vh * cfg.step + holdPx * 2;
    root.style.height = `${Math.round(sceneH + range)}px`;
  }

  const prevBtn = root.querySelector('[data-depth-prev]');
  const nextBtn = root.querySelector('[data-depth-next]');
  function setActive(i) {
    if (i === active) return;
    active = i;
    if (prevBtn) prevBtn.disabled = i <= 0;
    if (nextBtn) nextBtn.disabled = i >= n - 1;
    items.forEach((li, k) => {
      const on = k === i;
      li.classList.toggle('is-active', on);
      // Inativos: fora da árvore de acessibilidade e sem paradas de foco (o texto
      // fica com visibility:hidden no CSS); a capa continua clicável para selecionar.
      if (on) li.removeAttribute('aria-hidden'); else li.setAttribute('aria-hidden', 'true');
      li.querySelectorAll('.project-card__link').forEach((a) => (on ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1')));
    });
  }

  function frame() {
    raf = 0;
    const top = root.getBoundingClientRect().top;
    const headerH = vh - sceneH;
    const scrolled = clamp(headerH - top, 0, range);
    const t = clamp((scrolled - holdPx) / (range - holdPx * 2), 0, 1) * (n - 1);
    root.classList.toggle('is-moved', scrolled > holdPx * 0.5);

    items.forEach((li, i) => {
      const d = i - t; // >0: na fila (fundo), 0: ativo, <0: já passou (primeiro plano)
      let y, z, rx, op;
      if (d >= 0) {
        const q = Math.min(d, 3.2);
        y = -q * cfg.rise * sceneH;
        z = -q * cfg.depth;
        rx = cfg.tiltActive + Math.min(q, 1) * cfg.tiltQueue + Math.max(0, q - 1) * cfg.tiltQueue * 0.5;
        op = q > cfg.queueFade ? clamp(1 - (q - cfg.queueFade) / 0.6, 0, 1) : 1;
      } else {
        const a = smooth(Math.min(-d, 1));
        y = a * cfg.dropY * sceneH;
        z = a * cfg.dropZ;
        rx = cfg.tiltActive + a * (cfg.tiltOut - cfg.tiltActive);
        op = 1 - clamp((-d - cfg.fadeFrom) / cfg.fadeLen, 0, 1);
      }
      const c = covers[i];
      c.style.transform = `translate3d(0, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg)`;
      c.style.opacity = op.toFixed(3);
      c.style.pointerEvents = op > 0.35 ? 'auto' : 'none';
      li.style.zIndex = String(100 - Math.round(d * 10));
      li.style.setProperty('--info', clamp(1 - Math.abs(d) * cfg.infoFade, 0, 1).toFixed(3));
    });
    setActive(clamp(Math.round(t), 0, n - 1));
  }

  const request = () => { if (!raf && enabled) raf = requestAnimationFrame(frame); };

  // ── Ancoragem em cada projeto ──
  // Rolagem animada própria (em vez do scroll "smooth" nativo, que varia muito
  // entre navegadores): desacelera até o projeto e é cancelada por qualquer
  // gesto novo (roda, toque, tecla).
  let lastY = window.scrollY, dir = 0, settleTimer = 0, touching = false;
  let anim = 0, animating = false;
  const easeOut = (x) => 1 - Math.pow(1 - x, 3);
  const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  function cancelAnim() { if (anim) cancelAnimationFrame(anim); anim = 0; animating = false; }
  function animateTo(targetY, ease = easeOut) {
    cancelAnim();
    const startY = window.scrollY, dist = targetY - startY;
    if (Math.abs(dist) < 2) return;
    const duration = clamp(380 + Math.abs(dist) * 0.45, 480, 950);
    const t0 = performance.now();
    animating = true;
    const step = (now) => {
      const k = clamp((now - t0) / duration, 0, 1);
      window.scrollTo(0, Math.round(startY + dist * ease(k)));
      if (k < 1) anim = requestAnimationFrame(step);
      else { anim = 0; animating = false; }
    };
    anim = requestAnimationFrame(step);
  }
  const stopY = (i) => {
    const top = root.getBoundingClientRect().top + window.scrollY - (vh - sceneH);
    return Math.round(top + holdPx + (i / (n - 1)) * (range - holdPx * 2));
  };
  let anchor = -1; // último projeto em que a página parou (-1 = acima da sequência, n = abaixo)
  function settle() {
    if (!enabled || touching || animating) return;
    const y = window.scrollY;
    const first = stopY(0), last = stopY(n - 1);
    if (y <= first + 2) { anchor = y < first - 2 ? -1 : 0; return; } // antes da sequência: fluxo livre
    if (y >= last - 2) { anchor = y > last + 2 ? n : n - 1; return; } // depois: fluxo livre
    const pos = ((y - first) / (last - first)) * (n - 1);
    const near = Math.round(pos);
    if (Math.abs(pos - near) < 0.02) { anchor = near; return; } // já ancorado
    const lo = Math.floor(pos), hi = Math.ceil(pos);
    let target;
    // Descendo: vai para o próximo — a não ser que tenha acabado de entrar na
    // sequência por cima, aí para no projeto que está chegando. Subindo: espelho.
    if (dir > 0) target = anchor < lo ? lo : hi;
    else if (dir < 0) target = anchor > hi ? hi : lo;
    else target = near;
    anchor = target;
    animateTo(stopY(target));
  }
  const scheduleSettle = () => { clearTimeout(settleTimer); settleTimer = setTimeout(settle, 110); };
  const onScroll = () => {
    const y = window.scrollY;
    if (!animating && y !== lastY) dir = Math.sign(y - lastY);
    lastY = y;
    if (visible) { request(); if (!animating) scheduleSettle(); }
  };
  const onTouchStart = () => { touching = true; cancelAnim(); clearTimeout(settleTimer); };
  const onTouchEnd = () => { touching = false; scheduleSettle(); };
  const onUserIntent = (e) => { if (e.type === 'keydown' && !/Arrow|Page|Home|End| /.test(e.key)) return; cancelAnim(); };

  // Botões anterior/próximo
  const go = (delta) => {
    const i = clamp((anchor >= 0 && anchor < n ? anchor : active) + delta, 0, n - 1);
    anchor = i;
    animateTo(stopY(i), easeInOut);
  };
  const onPrev = () => go(-1);
  const onNext = () => go(1);

  // Clicar num card do fundo (ou no que está saindo) traz esse projeto para a frente.
  const onCoverClick = (e) => {
    const cover = e.target.closest('.project-card__cover');
    if (!cover) return;
    const i = covers.indexOf(cover);
    if (i < 0 || i === active) return; // o ativo segue o link normalmente
    e.preventDefault();
    anchor = i;
    animateTo(stopY(i), easeInOut);
  };
  // Ignora a variação de altura da barra de endereço no mobile (evita saltos);
  // recalcula em mudanças reais de largura, orientação ou altura.
  let lastW = 0, lastH = 0;
  const onResize = () => {
    if (!enabled) return;
    const w = window.innerWidth, h = window.innerHeight;
    if (w === lastW && Math.abs(h - lastH) < 120) return request();
    lastW = w; lastH = h;
    measure(); request();
  };

  function enable() {
    if (enabled) return;
    enabled = true;
    root.classList.add('is-3d');
    measure();
    lastW = window.innerWidth; lastH = window.innerHeight;
    io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) request(); }, { rootMargin: '50% 0px' });
    io.observe(root);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('wheel', onUserIntent, { passive: true });
    window.addEventListener('keydown', onUserIntent);
    sticky.addEventListener('click', onCoverClick);
    prevBtn?.addEventListener('click', onPrev);
    nextBtn?.addEventListener('click', onNext);
    window.addEventListener('resize', onResize);
    frame();
  }
  function disable() {
    if (!enabled) return;
    enabled = false;
    if (raf) cancelAnimationFrame(raf), (raf = 0);
    if (io) io.disconnect(), (io = null);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchcancel', onTouchEnd);
    window.removeEventListener('wheel', onUserIntent);
    window.removeEventListener('keydown', onUserIntent);
    sticky.removeEventListener('click', onCoverClick);
    prevBtn?.removeEventListener('click', onPrev);
    nextBtn?.removeEventListener('click', onNext);
    clearTimeout(settleTimer);
    cancelAnim();
    window.removeEventListener('resize', onResize);
    root.classList.remove('is-3d', 'is-moved');
    root.style.height = '';
    active = -1;
    items.forEach((li, i) => {
      li.classList.remove('is-active');
      li.removeAttribute('aria-hidden');
      li.querySelectorAll('.project-card__link').forEach((a) => a.removeAttribute('tabindex'));
      li.style.zIndex = ''; li.style.removeProperty('--info');
      covers[i].style.transform = ''; covers[i].style.opacity = ''; covers[i].style.pointerEvents = '';
    });
  }
  const sync = () => (mqReduce.matches ? disable() : enable());
  mqReduce.addEventListener('change', sync);
  mqDesk.addEventListener('change', onResize);
  sync();

  return {
    destroy() {
      disable();
      mqReduce.removeEventListener('change', sync);
      mqDesk.removeEventListener('change', onResize);
    },
  };
}

export function initDepthStacks() {
  return [...document.querySelectorAll('[data-depth]')].map(createStack).filter(Boolean);
}
