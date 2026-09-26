// Componentes base: botão, link-ou-indisponível, mídia com proporção reservada, marca.
import { html, attrs, raw } from '../lib/html.js';
import { icons } from './icons.js';

// Idioma da página em renderização (o build renderiza uma página por vez).
let lang = 'pt';
export const setLang = (l) => { lang = l; };
const newTab = () => (lang === 'en' ? ' (opens in a new tab)' : ' (abre em nova aba)');

// variant: 'primary' | 'secondary' | 'ghost' | 'on-primary'
export function button({ href, label, variant = 'primary', icon = 'arrowRight', external = false, disabled = false, disabledNote, attrs: extra = {}, type }) {
  const ic = icon ? icons[icon]() : '';
  const cls = `btn btn--${variant}`;
  if (disabled || (!href && !type)) {
    return html`<span class="${cls} is-disabled" aria-disabled="true"${attrs(extra)}><span class="btn__label">${label}${disabledNote ? html`<span class="btn__note">${disabledNote}</span>` : ''}</span>${icons.lock()}</span>`;
  }
  if (type) return html`<button class="${cls}" type="${type}"${attrs(extra)}><span class="btn__label">${label}</span>${ic}</button>`;
  return html`<a class="${cls}" href="${href}"${attrs({ target: external && '_blank', rel: external && 'noopener', ...extra })}><span class="btn__label">${label}</span>${ic}${external ? html`<span class="sr-only">${newTab()}</span>` : ''}</a>`;
}

// Link que só existe quando há endereço confirmado; senão, texto indisponível.
export function linkOrPending({ href, label, pendingLabel, external = true }) {
  if (href) return html`<a class="text-link" href="${href}"${attrs({ target: external && '_blank', rel: external && 'noopener' })}>${label}${external ? html`${icons.arrowUpRight()}<span class="sr-only">${newTab()}</span>` : ''}</a>`;
  return html`<span class="text-link is-pending" aria-disabled="true">${label}<span class="pending-note">${pendingLabel}</span></span>`;
}

export function media(asset, alt, { cls = '', loading = 'lazy', priority = false, sizes } = {}) {
  return html`<img class="media ${cls}" src="${asset.src}" alt="${alt}" width="${asset.width}" height="${asset.height}"${attrs({ loading: priority ? 'eager' : loading, fetchpriority: priority && 'high', decoding: 'async', sizes })}>`;
}

// Marca: símbolo "JR" (círculo azul) e wordmark "João Riedo / Product Designer".
// Desenhados em código com Outfit e os tokens de cor, para ficarem nítidos em qualquer tamanho.
export const brandSymbol = (size = 32) =>
  raw(`<svg class="brand-symbol" viewBox="0 0 80 80" width="${size}" height="${size}" aria-hidden="true" focusable="false"><circle cx="40" cy="40" r="40" fill="var(--color-primary-default)"/><text x="40" y="54.5" text-anchor="middle" font-family="Outfit, sans-serif" font-weight="700" font-size="41" letter-spacing="-2.5" fill="var(--color-background)">JR</text></svg>`);

// variant: '' (fundo claro) | 'inverse' (fundo escuro)
export const wordmark = (name, tagline, variant = '') =>
  html`<span class="wordmark${variant ? ` wordmark--${variant}` : ''}"><span class="wordmark__name">${name.split(' ')[0]} <span class="wordmark__accent">${name.split(' ').slice(1).join(' ')}</span></span><span class="wordmark__tag">${tagline}</span></span>`;
