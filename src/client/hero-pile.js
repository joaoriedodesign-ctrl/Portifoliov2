// Hero: as badges de competência caem do topo do hero e se empilham no palco
// (matter-js, carregado sob demanda). Depois das primeiras quedas, os textos do
// hero entram em sequência. Com mouse, as badges podem ser arrastadas e arremessadas.
//
// Sem JS, com movimento reduzido ou se o motor não carregar, a pilha estática do CSS
// fica visível (classe is-static). A simulação para sozinha quando tudo assenta e
// pausa quando o hero sai da tela.

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = '(hover: hover) and (pointer: fine)';
const STEP = 1000 / 60;

// Aleatório estável (mesma pilha a cada carregamento na mesma largura)
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function loadPhysics(src) {
  if (window.__Matter) return Promise.resolve(window.__Matter);
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = () => (window.__Matter ? resolve(window.__Matter) : reject(new Error('physics')));
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export function initHeroPile() {
  const art = document.querySelector('[data-pile]');
  if (!art) return null;
  const hero = art.closest('[data-hero]') || art.parentElement;
  const list = art.querySelector('[data-pile-list]');
  let failsafe = 0, revealTimer = 0, sim = null, io = null, destroyed = false;

  const reveal = () => { clearTimeout(failsafe); clearTimeout(revealTimer); hero.classList.add('is-revealed'); };
  const fallback = () => { if (!sim) art.classList.add('is-static'); reveal(); };

  if (reduce() || !list || !('IntersectionObserver' in window)) { fallback(); return null; }

  // Quem navega por teclado não espera a animação: foco no hero revela tudo.
  hero.addEventListener('focusin', reveal, { once: true });
  failsafe = setTimeout(fallback, 4000);

  const physics = loadPhysics(art.dataset.physicsSrc);
  physics.catch(fallback);

  io = new IntersectionObserver((entries) => {
    const visible = entries.some((e) => e.isIntersecting);
    if (sim) { sim.setVisible(visible); return; }
    if (!visible) return;
    physics.then((M) => {
      if (sim || destroyed) return;
      clearTimeout(failsafe);
      sim = createPile(M, { art, hero, list });
      revealTimer = setTimeout(reveal, 1100);
    }).catch(() => {});
  }, { threshold: 0.05 });
  io.observe(hero);

  return {
    destroy() {
      destroyed = true;
      if (io) io.disconnect();
      if (sim) sim.destroy();
      clearTimeout(failsafe);
      reveal();
    },
  };
}

function createPile(M, { art, hero, list }) {
  const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Events, Sleeping } = M;
  const ENGINE = { enableSleeping: true, positionIterations: 10, velocityIterations: 8 };
  const newEngine = () => { const e = Engine.create(ENGINE); e.gravity.y = 1.1; return e; };
  const engine = newEngine();

  // Coordenadas da física: o chão fica sempre em y = 0 (a prévia e a animação fazem
  // exatamente as mesmas contas); na tela, soma-se H para descer até o chão do palco.
  let W = 0, H = 0, inset = 0, drop = 0, walls = [], items = [];
  let raf = 0, last = 0, acc = 0, visible = true, dragging = false, activeAt = 0, stepN = 0, nextSpawn = 0;
  const touch = () => { activeAt = performance.now(); };
  let mouseConstraint = null, mouse = null;
  const cleanups = [];

  art.classList.add('is-live');
  art.classList.remove('is-static');

  // Desktop: o palco tem altura fixa (CSS). Mobile/tablet: o palco fica logo abaixo
  // do CTA e a altura dele é a da pilha, calculada antes da animação.
  const autoHeight = () => getComputedStyle(art).position !== 'absolute';

  // Paredes relativas ao chão (y = floor): o resultado da simulação não depende de
  // onde o chão está, então dá para simular antes e repetir igual na tela.
  function addWalls(eng, floor) {
    const t = 200, tall = drop + 4000, opts = { isStatic: true, friction: 0.8, restitution: 0.1, collisionFilter: { category: 0x0002 } };
    const ws = [
      Bodies.rectangle(W / 2, floor + t / 2, W + t * 4, t, opts), // chão
      Bodies.rectangle(-t / 2, floor - tall / 2, t, tall, opts), // parede esquerda
      Bodies.rectangle(W - inset + t / 2, floor - tall / 2, t, tall, opts), // parede direita (recuada da borda da tela)
    ];
    Composite.add(eng.world, ws);
    return ws;
  }

  // Plano de queda: tudo o que é aleatório é sorteado uma vez, para a simulação
  // prévia e a animação serem idênticas.
  function makePlan() {
    const els = [...list.children].filter((el) => getComputedStyle(el).display !== 'none');
    const rand = rng(Math.round(W) * 31 + els.length);
    const every = Math.max(2, Math.round(Math.min(70, 2000 / Math.max(els.length, 1)) / STEP));
    return els.map((el, i) => ({
      el, w: el.offsetWidth, h: el.offsetHeight, body: null,
      // distribuição quase uniforme (razão áurea + ruído): a pilha cresce por igual
      u: (i * 0.618034 + rand() * 0.18) % 1,
      jitter: rand() * 120, angle: (rand() - 0.5) * 0.5,
      vx: (rand() - 0.5) * 3, vy: 3 + rand() * 3, av: (rand() - 0.5) * 0.03,
      at: Math.round(120 / STEP) + i * every, // passo da simulação em que a badge nasce
    }));
  }

  function spawn(eng, it, floor) {
    const x = inset + it.w / 2 + it.u * Math.max(1, W - 2 * inset - it.w);
    const b = Bodies.rectangle(x, floor - drop - it.h - it.jitter, it.w, it.h, {
      chamfer: { radius: it.h / 2 - 0.5 }, angle: it.angle,
      friction: 0.3, frictionStatic: 0.6, frictionAir: 0.015,
      restitution: 0.15, density: 0.0016, slop: 0.02,
    });
    Body.setVelocity(b, { x: it.vx, y: it.vy });
    Body.setAngularVelocity(b, it.av);
    // inércia maior: giram menos e tendem a assentar deitadas (mais legíveis)
    Body.setInertia(b, b.inertia * 4);
    Composite.add(eng.world, b);
    return b;
  }

  // Um passo de simulação (o mesmo na prévia e na tela)
  function tick(eng, list_, floor, onSpawn) {
    for (const it of list_) if (it.at === stepN) { it.body = spawn(eng, it, floor); onSpawn && onSpawn(it); }
    Engine.update(eng, STEP);
    stepN++;
    for (const it of list_) {
      const b = it.body;
      if (b && (b.position.y > floor + 400 || b.position.x < -400 || b.position.x > W + 400)) {
        Body.setPosition(b, { x: W / 2, y: floor - drop - it.h });
        Body.setVelocity(b, { x: 0, y: 0 });
      }
    }
  }

  // Simula a queda inteira fora da tela e devolve a altura final da pilha
  function preview(plan, floor) {
    const eng = newEngine();
    addWalls(eng, floor);
    const copy = plan.map((it) => ({ ...it, body: null }));
    const lastAt = copy.length ? copy[copy.length - 1].at : 0;
    stepN = 0;
    while (stepN < lastAt + 1800) {
      tick(eng, copy, floor);
      if (stepN > lastAt && copy.every((it) => it.body.isSleeping)) break;
    }
    const top = Math.min(...copy.map((it) => it.body.bounds.min.y));
    Engine.clear(eng);
    Composite.clear(eng.world, false);
    return floor - top;
  }

  function measure() {
    const r = list.getBoundingClientRect();
    W = r.width; H = r.height;
    inset = Math.min(24, W * 0.04);
  }

  // Monta a pilha: plano de queda, altura do palco (mobile) e início da animação
  function build() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    // mesmo motor (o arraste do mouse está ligado a ele), mundo e contatos zerados
    Composite.clear(engine.world, false);
    Engine.clear(engine);
    if (mouseConstraint) { mouseConstraint.body = null; mouseConstraint.constraint.bodyB = null; dragging = false; Composite.add(engine.world, mouseConstraint); }
    art.style.height = '';
    measure();
    const offset = list.getBoundingClientRect().top - hero.getBoundingClientRect().top; // palco abaixo do topo do hero
    items = makePlan();
    const maxH = Math.max(0, ...items.map((it) => it.h));
    if (autoHeight() && items.length) {
      // 1ª prévia estima a pilha; 2ª fixa a altura de queda (logo acima do hero) e
      // dá a altura exata, que a animação vai repetir passo a passo.
      drop = offset + 2000;
      const rough = preview(items, 0);
      drop = offset + Math.ceil(rough) + maxH + 160;
      H = Math.ceil(preview(items, 0));
      art.style.height = `${H}px`;
    } else {
      drop = H + offset;
    }
    walls = addWalls(engine, 0);
    if (mouse) Mouse.setOffset(mouse, { x: 0, y: -H });
    items.forEach((it) => it.el.classList.add('is-waiting'));
    stepN = 0;
    acc = 0; last = 0;
    wake();
  }

  function draw(it) {
    const { x } = it.body.position, y = it.body.position.y + H;
    it.el.style.transform = `translate(${(x - it.w / 2).toFixed(2)}px, ${(y - it.h / 2).toFixed(2)}px) rotate(${it.body.angle.toFixed(4)}rad)`;
  }

  const spawning = () => items.some((it) => !it.body);
  const onSpawn = (it) => { it.el.classList.remove('is-waiting'); touch(); };

  function frame(now) {
    raf = 0;
    if (!visible) return;
    const dt = last ? Math.min(now - last, 64) : STEP;
    last = now; acc += dt;
    while (acc >= STEP) { tick(engine, items, 0, onSpawn); acc -= STEP; }
    let awake = false;
    for (const it of items) {
      if (!it.body) continue;
      if (!it.body.isSleeping) awake = true;
      draw(it);
    }
    const busy = spawning();
    // Pilha praticamente parada há alguns segundos: adormece tudo e para o loop
    if (awake && !busy && !dragging && now - activeAt > 4500) {
      items.forEach((it) => it.body && Sleeping.set(it.body, true));
      awake = false;
    }
    if (awake || busy || dragging) { art.classList.remove('is-settled'); raf = requestAnimationFrame(frame); }
    else { art.classList.add('is-settled'); last = 0; acc = 0; }
  }

  function wake() {
    touch();
    if (!raf && visible) { last = 0; raf = requestAnimationFrame(frame); }
  }

  // Arrastar e arremessar: só com mouse (no toque, o gesto é da rolagem da página)
  if (window.matchMedia(FINE).matches) {
    mouse = Mouse.create(list);
    // devolve a roda do mouse e o toque para a página
    ['mousewheel', 'DOMMouseScroll', 'wheel'].forEach((ev) => list.removeEventListener(ev, mouse.mousewheel));
    list.removeEventListener('touchstart', mouse.mousedown);
    list.removeEventListener('touchmove', mouse.mousemove);
    list.removeEventListener('touchend', mouse.mouseup);
    mouseConstraint = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.18, damping: 0.08, render: { visible: false } } });
    mouseConstraint.collisionFilter.mask = 0x0001; // só as badges, nunca as paredes
    Events.on(mouseConstraint, 'startdrag', () => { dragging = true; art.classList.add('is-dragging'); wake(); });
    Events.on(mouseConstraint, 'enddrag', () => { dragging = false; art.classList.remove('is-dragging'); wake(); });
    // continua o arraste mesmo fora do palco
    const move = (e) => { if (dragging) mouse.mousemove(e); };
    const up = (e) => { if (dragging) mouse.mouseup(e); };
    const down = () => { items.forEach((it) => it.body && Sleeping.set(it.body, false)); wake(); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    list.addEventListener('mousedown', down);
    cleanups.push(() => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); list.removeEventListener('mousedown', down); ['mousemove', 'mousedown', 'mouseup'].forEach((ev) => list.removeEventListener(ev, mouse[ev])); });
    art.classList.add('is-interactive');
  }

  // Redimensionamento: mudou a largura → remonta a pilha (nova queda). No desktop,
  // se só a altura mudou, basta mover o chão.
  let resizeTimer = 0, lastW = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = list.getBoundingClientRect().width;
      if (Math.abs(w - lastW) >= 1) { lastW = w; build(); return; }
      if (autoHeight()) return; // a altura do palco no mobile é a própria pilha
      // só a altura mudou: o chão continua em 0, basta redesenhar mais acima/abaixo
      const prevH = H;
      measure();
      if (Math.abs(H - prevH) < 1) return;
      if (mouse) Mouse.setOffset(mouse, { x: 0, y: -H });
      items.forEach((it) => it.body && draw(it));
    }, 150);
  });

  build();
  lastW = W;
  ro.observe(list);

  return {
    setVisible(v) { visible = v; if (v) wake(); else if (raf) { cancelAnimationFrame(raf); raf = 0; } },
    destroy() {
      ro.disconnect();
      clearTimeout(resizeTimer);
      if (raf) cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
      Engine.clear(engine);
    },
  };
}
