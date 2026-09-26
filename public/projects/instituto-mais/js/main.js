(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Ano no rodapé */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* Tema: começa no modo do dispositivo; o botão troca só nesta visita (não fica salvo) */
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => root.getAttribute('data-theme') === 'dark' || (!root.hasAttribute('data-theme') && systemDark.matches);
  const themeMetas = [...document.querySelectorAll('meta[name="theme-color"]')];
  const syncThemeUI = () => {
    const dark = isDark();
    if (themeBtn) themeBtn.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
    if (root.hasAttribute('data-theme')) themeMetas.forEach((m) => { m.setAttribute('content', dark ? '#001b1e' : '#fafafa'); m.removeAttribute('media'); });
  };
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      root.setAttribute('data-theme', isDark() ? 'light' : 'dark');
      syncThemeUI();
    });
  }
  if (systemDark.addEventListener) systemDark.addEventListener('change', syncThemeUI);
  syncThemeUI();

  /* Header: sombra ao rolar */
  const header = document.querySelector('.site-header');
  const onScrollHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* Menu mobile — foco só é movido quando a ação vem do teclado */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu-mobile');
  const setMenu = (open, fromKeyboard) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
    if (open) {
      if (fromKeyboard) menu.querySelector('a').focus();
      else menu.focus({ preventScroll: true });
    } else if (fromKeyboard) {
      toggle.focus();
    }
  };
  toggle.addEventListener('click', (e) => setMenu(toggle.getAttribute('aria-expanded') !== 'true', e.detail === 0));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false, false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false, true);
  });
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('is-open') && !e.target.closest('.site-header')) setMenu(false, false);
  });

  /* Navegação: item ativo conforme a seção visível */
  const links = [...document.querySelectorAll('.nav-list a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = '#' + entry.target.id;
        links.forEach((a) => (a.getAttribute('href') === id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* Carrossel de profissionais */
  const teamList = document.querySelector('[data-team-list]');
  if (teamList) {
    const step = () => {
      const card = teamList.querySelector('.pro');
      return card ? (card.getBoundingClientRect().width + 20) * (window.innerWidth > 1024 ? 2 : 1) : 320;
    };
    const prev = document.querySelector('[data-team="prev"]');
    const next = document.querySelector('[data-team="next"]');
    const update = () => {
      const max = teamList.scrollWidth - teamList.clientWidth - 2;
      if (prev) prev.disabled = teamList.scrollLeft <= 2;
      if (next) next.disabled = teamList.scrollLeft >= max;
    };
    prev && prev.addEventListener('click', () => teamList.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next && next.addEventListener('click', () => teamList.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    teamList.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  if (reduceMotion || !('IntersectionObserver' in window)) return;

  /* Reveal ao rolar (progressive enhancement) */
  root.classList.add('js-motion');
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealEls.forEach((el) => {
    // carrosséis horizontais: itens recortados não disparam o observer, então revelamos pelo container
    if (el.closest('.stages__list, .team__list')) {
      el.classList.add('is-in');
    } else {
      io.observe(el);
    }
  });

  /* Assinatura: os olhares se encontram — os blocos convergem no mosaico conforme a seção rola */
  const weave = document.querySelector('[data-weave]');
  if (weave) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = weave.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quando o topo entra pela base da tela, 1 quando o centro do bloco chega a ~55% da tela
      const start = vh;
      const end = vh * 0.55 - r.height / 2;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
      const eased = 1 - Math.pow(1 - p, 3);
      weave.style.setProperty('--p', eased.toFixed(3));
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }
})();
