/* Marina Alves — Mídia Kit
   Tudo aqui é progressive enhancement: sem JS o site funciona e mostra todo o conteúdo. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var animate = doc.classList.contains('js-anim');
  window.__maReady = true;

  /* ------------------------------------------------------------------
     1. Stagger: define --i para cada item [data-reveal] dentro de um grupo
     ------------------------------------------------------------------ */
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    var items = group.querySelectorAll(':scope > [data-reveal]');
    items.forEach(function (el, i) { el.style.setProperty('--i', i); });
  });
  // Cards da audiência: ordem de cima pra baixo / esquerda pra direita
  document.querySelectorAll('.audience__grid [data-reveal]:not(li)').forEach(function (el, i) {
    el.style.setProperty('--i', i);
  });
  document.querySelectorAll('.bars').forEach(function (list) {
    list.querySelectorAll('.bar__fill').forEach(function (el, i) { el.style.setProperty('--i', i); });
  });

  /* ------------------------------------------------------------------
     2. Contadores (métricas e porcentagens)
     ------------------------------------------------------------------ */
  function formatNumber(value, decimals) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  function prepareCounter(el, target, decimals, suffix) {
    var finalText = el.textContent.trim();
    el.textContent = '';
    var visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    visual.textContent = formatNumber(0, decimals) + suffix;
    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = finalText;
    el.appendChild(visual);
    el.appendChild(sr);
    el._counter = { visual: visual, target: target, decimals: decimals, suffix: suffix, finalText: finalText };
  }

  function runCounter(el, duration, delay) {
    var c = el._counter;
    if (!c || c.done) return;
    c.done = true;
    var start = null;
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var v = c.target * easeOutCubic(p);
      c.visual.textContent = p < 1 ? formatNumber(v, c.decimals) + c.suffix : c.finalText;
      if (p < 1) requestAnimationFrame(frame);
    }
    setTimeout(function () { requestAnimationFrame(frame); }, delay || 0);
  }

  if (animate) {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      prepareCounter(el, parseFloat(el.dataset.count), parseInt(el.dataset.decimals || '0', 10), el.dataset.suffix || '');
    });
    document.querySelectorAll('.bar__pct').forEach(function (el) {
      prepareCounter(el, parseInt(el.textContent, 10), 0, '%');
    });
  }

  /* ------------------------------------------------------------------
     3. Reveal ao rolar
     ------------------------------------------------------------------ */
  if (animate) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-in');
        io.unobserve(el);

        var baseDelay = (parseInt(getComputedStyle(el).getPropertyValue('--i'), 10) || 0) * 110;

        el.querySelectorAll('[data-count]').forEach(function (n) { runCounter(n, 1400, baseDelay + 150); });
        el.querySelectorAll('.bar__pct').forEach(function (n, i) { runCounter(n, 1200, baseDelay + 200 + i * 120); });
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    // Itens dentro de carrosséis horizontais ficam recortados pelo overflow e o observer
    // não os enxergaria. Por isso o carrossel inteiro é observado e revela os filhos em sequência.
    var scrollerIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(':scope > [data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
        scrollerIO.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (el.parentElement && el.parentElement.classList.contains('scroller')) return;
      io.observe(el);
    });
    document.querySelectorAll('.scroller').forEach(function (sc) {
      if (sc.querySelector(':scope > [data-reveal]')) scrollerIO.observe(sc);
    });
  }

  /* ------------------------------------------------------------------
     4. Menu mobile (transição suave de entrada e saída)
     ------------------------------------------------------------------ */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  var closeBtn = menu && menu.querySelector('.mobile-menu__close');
  var lastFocus = null;

  if (toggle && menu) {
    // Itens entram na ordem de cima pra baixo
    var menuItems = menu.querySelectorAll('.mobile-menu__links li, .mobile-menu__actions .btn, .mobile-menu__close');
    menuItems.forEach(function (el, i) { el.setAttribute('data-menu-item', ''); el.style.setProperty('--i', i); });

    var focusables = function () {
      return Array.prototype.slice.call(menu.querySelectorAll('a[href], button:not([disabled])'));
    };

    // Foco só é movido/restaurado quando o menu é usado pelo teclado.
    // No toque (mobile) isso evita o contorno de foco aparecendo no primeiro link.
    var viaKeyboard = false;

    var openMenu = function () {
      lastFocus = document.activeElement;
      menu.hidden = false;
      // força reflow para a transição rodar
      void menu.offsetWidth;
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fechar menu');
      document.body.classList.add('menu-open');
      if (viaKeyboard) {
        var first = focusables()[0];
        if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 50);
      } else {
        menu.setAttribute('tabindex', '-1');
        menu.focus({ preventScroll: true });
      }
    };

    var closeMenu = function (opts) {
      if (menu.hidden) return;
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
      document.body.classList.remove('menu-open');
      var done = function () { if (!menu.classList.contains('is-open')) menu.hidden = true; };
      if (reduceMotion) done(); else setTimeout(done, 420);
      if (viaKeyboard && (!opts || opts.restoreFocus !== false)) {
        if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      } else if (document.activeElement && menu.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    };

    // e.detail === 0 → clique gerado por Enter/Espaço (teclado)
    toggle.addEventListener('click', function (e) {
      viaKeyboard = e.detail === 0;
      if (menu.hidden) openMenu(); else closeMenu();
    });
    closeBtn.addEventListener('click', function (e) { viaKeyboard = e.detail === 0; closeMenu(); });

    menu.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (link) closeMenu({ restoreFocus: false });
    });

    document.addEventListener('keydown', function (e) {
      if (menu.hidden) return;
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key === 'Tab') {
        var f = focusables();
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Se a tela crescer para desktop com o menu aberto, fecha
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (mq) {
      if (mq.matches) closeMenu({ restoreFocus: false });
    });
  }

  /* ------------------------------------------------------------------
     4b. Header mobile: some ao descer, reaparece ao subir
     ------------------------------------------------------------------ */
  var header = document.querySelector('.site-header');
  var mobileMQ = window.matchMedia('(max-width: 899px)');
  if (header) {
    var lastY = window.scrollY;
    var ticking = false;
    var lockUntil = 0;
    var DELTA = 8;

    var showHeader = function () { header.classList.remove('is-hidden'); };

    var onScroll = function () {
      ticking = false;
      var y = Math.max(window.scrollY, 0);
      var diff = y - lastY;
      if (!mobileMQ.matches || document.body.classList.contains('menu-open') ||
          header.contains(document.activeElement) || y <= header.offsetHeight || Date.now() < lockUntil) {
        showHeader();
        lastY = y;
        return;
      }
      if (Math.abs(diff) < DELTA) return;
      header.classList.toggle('is-hidden', diff > 0);
      lastY = y;
    };

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });

    // Ao clicar num link interno, mantém o header visível durante a rolagem até a seção
    document.addEventListener('click', function (e) {
      if (e.target.closest('a[href^="#"]')) { lockUntil = Date.now() + 1200; showHeader(); }
    });
    header.addEventListener('focusin', showHeader);
    mobileMQ.addEventListener('change', showHeader);
  }

  /* ------------------------------------------------------------------
     5. Vídeos do YouTube: carrega o player só no clique (performance)
     ------------------------------------------------------------------ */
  document.querySelectorAll('.video[data-yt]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (link.classList.contains('is-playing')) return;
      e.preventDefault();
      var id = link.dataset.yt;
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&playsinline=1&rel=0&modestbranding=1';
      iframe.title = link.getAttribute('aria-label') || 'Vídeo do YouTube';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      link.appendChild(iframe);
      link.classList.add('is-playing');
      link.removeAttribute('href');
      link.setAttribute('role', 'group');
    });
  });

  /* ------------------------------------------------------------------
     6. Scroll automático e suave dos depoimentos (mobile)
     ------------------------------------------------------------------ */
  document.querySelectorAll('[data-autoscroll]').forEach(function (track) {
    if (reduceMotion) return;
    var INTERVAL = 3500;
    var RESUME_AFTER = 6000;
    var timer = null;
    var paused = false;
    var resumeTimer = null;
    var visible = false;

    function isScrollable() { return track.scrollWidth - track.clientWidth > 4; }

    function step() {
      if (paused || !visible || !isScrollable()) return;
      var cards = track.children;
      var pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      var max = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= max - 4) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }
      for (var i = 0; i < cards.length; i++) {
        var target = cards[i].offsetLeft - pad;
        if (target > track.scrollLeft + 4) {
          track.scrollTo({ left: Math.min(target, max), behavior: 'smooth' });
          return;
        }
      }
    }

    function start() { stop(); timer = setInterval(step, INTERVAL); }
    function stop() { if (timer) clearInterval(timer); timer = null; }

    function pause() {
      paused = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(function () { paused = false; }, RESUME_AFTER);
    }

    ['pointerdown', 'touchstart', 'wheel', 'focusin'].forEach(function (ev) {
      track.addEventListener(ev, pause, { passive: true });
    });
    track.addEventListener('mouseenter', function () { paused = true; clearTimeout(resumeTimer); });
    track.addEventListener('mouseleave', function () { paused = false; });

    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0.4 }).observe(track);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else if (visible) start();
    });
  });
})();
