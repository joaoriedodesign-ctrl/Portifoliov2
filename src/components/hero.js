// Hero: área editorial + letras de PORTFÓLIO soltas no fundo, em Primary-default.
// A composição vem do Figma (scripts/hero-layout.mjs → hero-layout.json) e já é
// renderizada na posição final (funciona sem JS e com movimento reduzido); o
// controlador client/hero-fall.js anima a queda e só depois revela os textos.
import { readFileSync } from 'node:fs';
import { html, raw } from '../lib/html.js';
import { path } from '../lib/routes.js';
import { button } from './primitives.js';

const layout = JSON.parse(readFileSync(new URL('./hero-layout.json', import.meta.url)));
const pct = (n) => `${Math.round(n * 10000) / 100}%`;

// Posição do SVG dentro do "palco" de cada layout (em % do palco)
function place([sx0, sy0, sx1, sy1]) {
  const [vx, vy, vw] = layout.viewBox;
  return { l: pct((vx - sx0) / (sx1 - sx0)), t: pct((vy - sy0) / (sy1 - sy0)), w: pct(vw / (sx1 - sx0)) };
}

function letters() {
  const [vx, vy, vw, vh] = layout.viewBox;
  const d = place(layout.stages.desktop), m = place(layout.stages.mobile);
  const g = layout.letters
    .map((l, i) => `<g class="glyph" data-glyph data-order="${l.order}" data-x="${l.x}" data-y="${l.y}" data-mx="${l.mx}" data-my="${l.my}" data-r="${l.r}" data-support="${l.support.join(',')}" style="--dx:${l.x};--dy:${l.y};--mx:${l.mx};--my:${l.my};--r:${l.r}"><path transform="translate(${-l.w / 2} ${-l.h / 2})" d="${layout.paths[l.glyph]}"/></g>`)
    .join('');
  return raw(`<svg class="hero__letters" viewBox="${vx} ${vy} ${vw} ${vh}" aria-hidden="true" focusable="false" style="--dl:${d.l};--dt:${d.t};--dw:${d.w};--ml:${m.l};--mt:${m.t};--mw:${m.w};--vb-ratio:${vw}/${vh}">${g}</svg>`);
}

const stageRatio = (k) => { const [x0, y0, x1, y1] = layout.stages[k]; return `${Math.round(x1 - x0)}/${Math.round(y1 - y0)}`; };

const stageK = (k) => { const [x0, y0, x1, y1] = layout.stages[k]; return +((x1 - x0) / (y1 - y0)).toFixed(4); };

export function hero(ctx) {
  const { t, lang } = ctx;
  return html`<section class="hero" aria-labelledby="hero-title" data-hero>
  <div class="container hero__grid">
    <div class="hero__intro">
      <p class="hero__id"><span class="hero__name">${t.home.name}</span><span class="hero__role">${t.home.role}</span></p>
      <h1 class="hero__title" id="hero-title">${t.home.headline}</h1>
      <p class="hero__bio">${t.home.bio}</p>
      ${button({ href: path('projects', lang), label: t.home.cta, variant: 'primary' })}
    </div>
    <div class="hero__art" data-fall style="--stage-dk:${stageK('desktop')};--stage-d:${stageRatio('desktop')};--stage-m:${stageRatio('mobile')}">${letters()}</div>
  </div>
</section>`;
}
