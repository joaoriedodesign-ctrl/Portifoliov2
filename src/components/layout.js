// Estrutura global: <head> (SEO/hreflang/OG), header fixo, footer e scripts.
import { html, raw, attrs, toString } from '../lib/html.js';
import { path, other } from '../lib/routes.js';
import { site } from '../config/site.js';
import { assets } from '../config/assets.js';
import { icons } from './icons.js';
import { graphFor } from '../lib/schema.js';
import { button, linkOrPending, wordmark } from './primitives.js';

const abs = (p) => site.domain + (p === '/' ? '/' : p);

function head(ctx, meta) {
  const { lang, t } = ctx;
  const alt = other(lang);
  const altPath = ctx.path404 ? null : path(ctx.key, alt, ctx.slug);
  const ptPath = lang === 'pt' ? ctx.path : altPath;
  const enPath = lang === 'en' ? ctx.path : altPath;
  const og = site.domain + (assets.og[ctx.slug] ?? assets.og.default);
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${meta.title}</title>
<meta name="description" content="${meta.description}">
${ctx.path404 ? '' : html`<link rel="canonical" href="${abs(ctx.path)}">
<link rel="alternate" hreflang="pt-BR" href="${abs(ptPath)}">
<link rel="alternate" hreflang="en" href="${abs(enPath)}">
<link rel="alternate" hreflang="x-default" href="${abs(ptPath)}">`}
<meta property="og:type" content="${ctx.key === 'project' ? 'article' : 'website'}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:url" content="${abs(ctx.path)}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${meta.title}">
<meta property="og:locale" content="${lang === 'pt' ? 'pt_BR' : 'en_US'}">
${ctx.path404 ? '' : html`<meta property="og:locale:alternate" content="${lang === 'pt' ? 'en_US' : 'pt_BR'}">`}
<meta name="author" content="${site.name}">
<meta name="robots" content="${ctx.path404 ? 'noindex' : 'index, follow, max-image-preview:large, max-snippet:-1'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${meta.title}">
<meta name="twitter:description" content="${meta.description}">
<meta name="twitter:image" content="${og}">
<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt">
<meta name="theme-color" content="#f4f4f0">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="icon" href="/favicon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/outfit-latin-wght.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${ctx.build.css}">
<script>document.documentElement.classList.add('js');setTimeout(function(){if(!window.__appReady)document.documentElement.classList.remove('js')},2500)</script>
<script src="${ctx.build.js}" defer></script>
${ctx.path404 ? '' : raw(`<script type="application/ld+json">${JSON.stringify(graphFor(ctx, meta)).replace(/</g, '\\u003c')}</script>`)}
</head>`;
}

function header(ctx) {
  const { lang, t } = ctx;
  const alt = other(lang);
  const nav = ['projects', 'about', 'contact'];
  const current = (k) => ctx.key === k || (k === 'projects' && ctx.key === 'project');
  const altHref = ctx.path404 ? path('home', alt) : path(ctx.key, alt, ctx.slug);
  const langSwitch = html`<div class="lang" role="group" aria-label="${t.ui.langLabel}">
      ${['pt', 'en'].map((l, i) => html`${i ? raw('<span class="lang__sep" aria-hidden="true">|</span>') : ''}${l === lang
        ? html`<span class="lang__item is-current" aria-current="true" lang="${l === 'pt' ? 'pt-BR' : 'en'}">${l.toUpperCase()}</span>`
        : html`<a class="lang__item" href="${altHref}" hreflang="${l === 'pt' ? 'pt-BR' : 'en'}" lang="${l === 'pt' ? 'pt-BR' : 'en'}"><span class="sr-only">${l === 'pt' ? 'Ver em português: ' : 'View in English: '}</span>${l.toUpperCase()}</a>`}`)}
    </div>`;
  const links = (cls) => nav.map((k) => html`<li><a class="${cls}" href="${path(k, lang)}"${attrs({ 'aria-current': current(k) && 'page' })}>${t.ui.nav[k]}</a></li>`);

  return html`<header class="site-header" data-header>
  <div class="site-header__inner">
    <a class="brand" href="${path('home', lang)}"${attrs({ 'aria-current': ctx.key === 'home' && 'page' })}>
      ${wordmark(site.name, site.role)}<span class="sr-only"> — ${t.ui.home}</span>
    </a>
    <nav class="nav" aria-label="${t.ui.navLabel}">
      <ul class="nav__list">${links('nav__link')}</ul>
    </nav>
    <div class="site-header__end">
      ${langSwitch}
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-open>
        ${icons.menu()}<span class="sr-only">${t.ui.menuOpen}</span>
      </button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="${t.ui.navLabel}" tabindex="-1" hidden data-menu>
    <div class="mobile-menu__top">
      <a class="brand" href="${path('home', lang)}">${wordmark(site.name, site.role)}</a>
      <button class="menu-toggle" type="button" data-menu-close>${icons.close()}<span class="sr-only">${t.ui.menuClose}</span></button>
    </div>
    <nav aria-label="${t.ui.navLabel}">
      <ul class="mobile-menu__list">${links('mobile-menu__link')}</ul>
    </nav>
    <div class="mobile-menu__bottom">
      ${button({ href: path('contact', lang), label: t.footer.cta, variant: 'primary' })}
      ${langSwitch}
    </div>
  </div>
</header>`;
}

export function footer(ctx) {
  const { lang, t } = ctx;
  const year = new Date().getFullYear();
  const pending = t.ui.linkPending;
  return html`<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__invite">
      <h2 class="site-footer__title">${t.footer.title}</h2>
      <p class="site-footer__text">${t.footer.text}</p>
      ${button({ href: path('contact', lang), label: t.footer.cta, variant: 'on-primary' })}
    </div>
    <ul class="site-footer__links" aria-label="${t.footer.linksLabel}">
      <li>${linkOrPending({ href: site.social.linkedin, label: 'LinkedIn', pendingLabel: pending })}</li>
      <li>${linkOrPending({ href: site.contact.email && `mailto:${site.contact.email}`, label: 'E-mail', pendingLabel: pending, external: false })}</li>
      <li>${linkOrPending({ href: site.social.behance, label: 'Behance', pendingLabel: pending })}</li>
      <li>${linkOrPending({ href: site.social.dribbble, label: 'Dribbble', pendingLabel: pending })}</li>
    </ul>
  </div>
  <div class="container site-footer__base">
    <p>© <span data-year>${year}</span> ${site.name}. ${t.footer.rights}</p>
  </div>
</footer>`;
}

export function page(ctx, meta, main, { showFooter = true, bodyClass = '' } = {}) {
  const { t } = ctx;
  const body = html`<a class="skip-link" href="#conteudo">${t.ui.skip}</a>
${header(ctx)}
<main id="conteudo" tabindex="-1">
${main}
</main>
${showFooter ? footer(ctx) : ''}`;
  return `<!doctype html>
<html lang="${t.lang}">
${toString(head(ctx, meta))}
<body class="${bodyClass}">
${toString(body)}
</body>
</html>
`;
}
