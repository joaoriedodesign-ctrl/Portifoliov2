// Hero: as letras de PORTFÓLIO caem até a composição do Figma e, depois do último
// impacto, os textos do hero entram em sequência.
// As posições finais vêm do servidor (data-x/y no desktop, data-mx/my no mobile);
// o HTML já traz a composição final, então sem JS ou com movimento reduzido nada
// fica escondido. Roda uma vez por carregamento.

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const tf = (x, y, r) => `translate(${x}px, ${y}px) rotate(${r}deg)`;

export function initHeroFall() {
  const art = document.querySelector('[data-fall]');
  if (!art) return null;
  const hero = art.closest('[data-hero]') || art.parentElement;
  const svg = art.querySelector('svg');
  const glyphs = [...art.querySelectorAll('[data-glyph]')];
  const byOrder = [...glyphs].sort((a, b) => a.dataset.order - b.dataset.order);
  const anims = [];
  let io = null, failsafe = 0, revealTimer = 0;

  const reveal = () => { clearTimeout(failsafe); clearTimeout(revealTimer); hero.classList.add('is-revealed'); };
  const settle = () => { art.classList.remove('is-live'); art.classList.add('is-settled'); glyphs.forEach((g) => g.classList.remove('is-moving')); };
  if (reduce() || !svg || typeof Element.prototype.animate !== 'function') { settle(); reveal(); return null; }

  // Quem navega por teclado não espera a animação: foco no hero revela tudo.
  hero.addEventListener('focusin', reveal, { once: true });
  failsafe = setTimeout(() => { reveal(); }, 4000);

  function start() {
    const mobile = window.matchMedia('(max-width: 63.99rem)').matches;
    const [vbX, vbY, vbW] = svg.getAttribute('viewBox').split(' ').map(Number);
    const sr = svg.getBoundingClientRect();
    const hr = hero.getBoundingClientRect();
    const k = sr.width / vbW; // px por unidade
    const heroTopUser = vbY + (hr.top - sr.top) / k; // topo do hero em unidades do SVG
    const pos = (g) => mobile
      ? [+g.dataset.mx, +g.dataset.my, +g.dataset.r]
      : [+g.dataset.x, +g.dataset.y, +g.dataset.r];

    art.classList.add('is-live');
    let lastImpact = 0;
    byOrder.forEach((g, i) => {
      const [x, y, r] = pos(g);
      const side = i % 2 ? 1 : -1;
      const y0 = heroTopUser - 220; // começa acima do hero, fora de vista
      const r0 = r + side * (16 + (i % 3) * 7);
      const x0 = x - side * (14 + (i % 4) * 8);
      const dist = y - y0;
      const duration = Math.round(460 + Math.sqrt(dist) * 12); // queda mais longa = mais tempo
      const delay = 80 + i * 95 + (i >= 5 ? 140 : 0); // pausa curta antes da linha de cima
      const b = i >= 5 ? 16 : 22; // rebote amortecido
      g.classList.add('is-moving');
      const a = g.animate(
        [
          { transform: tf(x0, y0, r0), easing: 'cubic-bezier(0.55, 0, 0.95, 0.45)' }, // aceleração (gravidade)
          { transform: tf(x, y, r), offset: 0.66, easing: 'cubic-bezier(0.2, 0.7, 0.4, 1)' },
          { transform: tf(x, y - b, r - side * 2.5), offset: 0.8, easing: 'cubic-bezier(0.5, 0, 0.8, 0.5)' },
          { transform: tf(x, y, r), offset: 0.9, easing: 'ease-out' },
          { transform: tf(x, y - b * 0.2, r), offset: 0.95, easing: 'ease-in' },
          { transform: tf(x, y, r) },
        ],
        { duration, delay, fill: 'backwards' },
      );
      anims.push(a);
      a.finished.then(() => g.classList.remove('is-moving')).catch(() => {});
      // As letras de apoio cedem um pouco no impacto
      const impact = delay + duration * 0.66;
      lastImpact = Math.max(lastImpact, impact);
      (g.dataset.support || '').split(',').filter(Boolean).forEach((idx) => {
        const sup = glyphs[+idx];
        if (!sup) return;
        const [sx, sy, srr] = pos(sup);
        anims.push(sup.animate(
          [{ transform: tf(sx, sy, srr) }, { transform: tf(sx, sy + 4, srr + side * 1.2), offset: 0.3 }, { transform: tf(sx, sy, srr) }],
          { duration: 320, delay: impact, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        ));
      });
    });
    // Textos entram logo depois do último impacto
    revealTimer = setTimeout(reveal, lastImpact + 180);
    Promise.all(anims.map((a) => a.finished)).then(settle).catch(settle);
  }

  // Inicia quando o hero estiver visível; nunca reinicia ao rolar.
  io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); io = null; requestAnimationFrame(start); }
  }, { threshold: 0.1 });
  io.observe(hero);

  return {
    destroy() {
      if (io) io.disconnect();
      anims.forEach((a) => a.cancel());
      settle();
      reveal();
    },
  };
}
