/* Instituto MAIS — carregamento das tags de tráfego.
   Os IDs ficam em window.IM_TRACKING (no <head> do index.html).
   Enquanto um ID tiver "X", aquela tag não é carregada. */
(function () {
  var cfg = window.IM_TRACKING || {};
  var valid = function (id) { return typeof id === 'string' && id && id.indexOf('X') === -1; };
  window.dataLayer = window.dataLayer || [];

  // Google Tag Manager
  if (valid(cfg.gtm)) {
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var g = document.createElement('script');
    g.async = true; g.src = 'https://www.googletagmanager.com/gtm.js?id=' + cfg.gtm;
    document.head.appendChild(g);
  }

  // Google tag (GA4 / Google Ads)
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (valid(cfg.ga4)) {
    var t = document.createElement('script');
    t.async = true; t.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.ga4;
    document.head.appendChild(t);
    window.gtag('js', new Date());
    window.gtag('config', cfg.ga4);
  }

  // Meta Pixel
  if (valid(cfg.metaPixel)) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', cfg.metaPixel);
    window.fbq('track', 'PageView');
  }

  // Evento de conversão: clique em qualquer link de WhatsApp
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (!a) return;
    var origem = a.getAttribute('data-wa') || 'link';
    var profissional = a.getAttribute('data-pro') || '';
    window.dataLayer.push({ event: 'whatsapp_click', wa_origem: origem, wa_profissional: profissional });
    if (valid(cfg.ga4)) window.gtag('event', 'generate_lead', { method: 'whatsapp', origem: origem, profissional: profissional });
    if (window.fbq) window.fbq('track', 'Contact', { content_name: profissional || origem });
  }, true);
})();
