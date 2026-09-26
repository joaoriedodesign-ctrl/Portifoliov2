// Área de demonstração do projeto. Nesta versão mostra uma prévia local
// (nenhum site de cliente é carregado automaticamente). Quando `demo.embedUrl`
// for definido, o controlador cria o iframe sob demanda, com estado de carregamento
// e fallback (print + link) sempre acessível — sem contornar X-Frame-Options/CSP.
import { html } from '../lib/html.js';
import { assets } from '../config/assets.js';
import { icons } from './icons.js';
import { media } from './primitives.js';

// Mock local do site, desenhado com os tokens (substitui o iframe nesta versão).
function mock(name) {
  return html`<div class="mock" aria-hidden="true">
  <div class="mock__bar"><span class="mock__dot"></span><span class="mock__line mock__line--s"></span><span class="mock__spacer"></span><span class="mock__line mock__line--xs mock__hide-sm"></span><span class="mock__line mock__line--xs mock__hide-sm"></span><span class="mock__pill"></span></div>
  <div class="mock__hero">
    <div class="mock__copy"><p class="mock__title">${name}</p><span class="mock__line"></span><span class="mock__line mock__line--m"></span><span class="mock__btn"></span></div>
    <div class="mock__media"></div>
  </div>
  <div class="mock__row"><span></span><span></span><span></span></div>
</div>`;
}

export function demoViewer(ctx, slug, project) {
  const { t } = ctx;
  const pt = t.project;
  const live = ctx.liveHref;
  return html`<section class="demo" aria-labelledby="demo-title" data-demo data-embed="${project.demo.embedUrl ?? ''}" data-title="${project.name}" data-label-fullscreen="${pt.fullscreen}" data-label-exit="${pt.exitFullscreen}">
  <div class="demo__toolbar">
    <h2 class="demo__heading" id="demo-title">${pt.demoTitle}</h2>
    <div class="segmented" role="group" aria-label="${pt.demoTitle}">
      <button class="segmented__btn" type="button" aria-pressed="true" data-device="desktop">${icons.desktop()}<span>${pt.desktop}</span></button>
      <button class="segmented__btn" type="button" aria-pressed="false" data-device="mobile">${icons.mobile()}<span>${pt.mobile}</span></button>
    </div>
    <button class="icon-btn" type="button" data-fullscreen hidden>${icons.expand()}<span class="icon-btn__label" data-fullscreen-label>${pt.fullscreen}</span></button>
  </div>
  <div class="demo__stage" data-demo-stage>
    <div class="demo__frame" data-demo-frame data-device="desktop" data-state="${project.demo.embedUrl ? 'loading' : 'placeholder'}">
      <div class="demo__chrome" aria-hidden="true"><span></span><span></span><span></span><p class="demo__url">${live && live.startsWith('http') ? live.replace(/^https?:\/\//, '') : `joaoriedo.com${live ?? ''}`}</p></div>
      <div class="demo__viewport" data-demo-viewport>
        <div class="demo__state demo__state--placeholder">
          ${mock(project.name)}
          <p class="demo__caption"><strong>${pt.demoPlaceholder}.</strong> ${pt.demoPlaceholderText}</p>
        </div>
        <div class="demo__state demo__state--loading" role="status">
          <div class="skeleton" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
          <p class="demo__caption">${pt.demoLoading}</p>
        </div>
        <div class="demo__state demo__state--unavailable">
          ${media(assets.demoFallback[slug], `${project.name} — ${t.ui.placeholder}`, { cls: 'demo__fallback-img' })}
          <div class="demo__fallback-copy">
            <p><strong>${pt.demoUnavailable}</strong> ${pt.demoFallback}</p>
            ${live ? html`<a class="text-link" href="${live}" target="_blank" rel="noopener">${pt.live}${icons.arrowUpRight()}</a>` : ''}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}
