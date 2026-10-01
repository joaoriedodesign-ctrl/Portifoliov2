// Carrossel com scroll nativo (scroll-snap): os botões andam um item por vez e
// ficam desabilitados nas pontas. Sem JS, a trilha continua rolável e os botões
// ficam ocultos.

export function initCarousels() {
  const roots = [...document.querySelectorAll('[data-carousel]')];
  return roots.map((root) => {
    const track = root.querySelector('[data-carousel-track]');
    const nav = root.querySelector('[data-carousel-nav]');
    const prev = root.querySelector('[data-carousel-prev]');
    const next = root.querySelector('[data-carousel-next]');
    if (!track || !prev || !next) return null;
    const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
      // tudo cabe na tela: navegação não faz sentido
      if (nav) nav.hidden = max <= 2;
    };
    const step = (dir) => {
      const item = track.firstElementChild;
      if (!item) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.scrollBy({ left: dir * (item.getBoundingClientRect().width + gap), behavior: reduce() ? 'auto' : 'smooth' });
    };
    const onPrev = () => step(-1);
    const onNext = () => step(1);
    prev.addEventListener('click', onPrev);
    next.addEventListener('click', onNext);
    track.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(track);
    update();
    return {
      destroy() {
        prev.removeEventListener('click', onPrev);
        next.removeEventListener('click', onNext);
        track.removeEventListener('scroll', update);
        ro.disconnect();
      },
    };
  }).filter(Boolean);
}
