(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     MENU MOBILE
     Anotações do Figma: transição suave ao abrir + itens em fade-in
     em cascata (a cascata é feita via CSS puro, nth-child + delay).
  ------------------------------------------------------------------ */
  var menuToggle = document.getElementById('menuToggle');
  var menuClose = document.getElementById('menuClose');
  var mobileMenu = document.getElementById('mobileMenu');

  function openMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    var firstLink = mobileMenu.querySelector('a');
    if (firstLink) firstLink.focus({ preventScroll: true });
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    menuToggle.focus({ preventScroll: true });
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('is-open');
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });
  }
  if (menuClose) menuClose.addEventListener('click', closeMenu);

  // Fecha o menu ao clicar em um link ou apertar Esc
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* ------------------------------------------------------------------
     FAQ ACCORDION
     Anotação do Figma: "Animação suave ao abrir esses chevrons"
     Sem JS: todas as respostas ficam visíveis (ver CSS). Com JS,
     fechamos tudo e deixamos só a primeira pergunta aberta,
     alternando ao clicar.
  ------------------------------------------------------------------ */
  var faqItems = document.querySelectorAll('.faq-item');

  document.documentElement.classList.add('js-ready');

  faqItems.forEach(function (item) {
    var trigger = item.querySelector('.faq-item__trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function () {
      var willOpen = !item.classList.contains('is-open');
      item.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
    });
  });

  /* ------------------------------------------------------------------
     SCROLL REVEAL
     Anotação do Figma: "Cada opção tem de aparecer na ordem de cima
     pra baixo e da esquerda para a direita com uma animação de fade
     in suave" — a ordem já é a ordem do DOM (grid preenche em ordem
     de leitura), então só escalonamos o delay por índice.
     Progressive enhancement: só ativa com JS e sem prefers-reduced-motion.
  ------------------------------------------------------------------ */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('reveal-ready');

    var groups = document.querySelectorAll('.reveal-group');
    groups.forEach(function (group) {
      var items = group.querySelectorAll('.reveal-item');
      items.forEach(function (el, index) {
        el.style.transitionDelay = (index * 90) + 'ms';
      });

      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      items.forEach(function (el) { observer.observe(el); });
    });
  }
})();
