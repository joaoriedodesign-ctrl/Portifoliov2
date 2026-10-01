// Hero: área editorial + pilha de badges de competência (componente "Badge de
// competência" do Figma). As badges são uma lista real no HTML (lidas por leitores
// de tela e buscadores) e, sem JS ou com movimento reduzido, já aparecem empilhadas
// pelo CSS. Com JS, client/hero-pile.js carrega o motor de física sob demanda e
// faz as badges caírem e se empilharem; com mouse dá para arrastar e arremessar.
import { html, raw, esc } from '../lib/html.js';
import { path } from '../lib/routes.js';
import { button } from './primitives.js';
import { skillsFor } from '../content/skills.js';

// Inclinação estável por badge para a pilha estática (sem JS / movimento reduzido)
const tilt = (i) => [-4, 3, -2, 5, -1, 2, -5, 1, 4, -3][i % 10];

// Tamanho no desktop (grande, médio ou padrão), em ciclo estável; rótulos longos
// nunca ficam grandes para não ocupar a largura do palco inteira.
const SIZES = ['l', 's', 'm', 's', 'l', 'm', 's', 'm', 'l', 's', 'm', 's'];
const size = (label, i) => { const s = SIZES[i % SIZES.length]; return s === 'l' && label.length > 18 ? 'm' : s; };

function pile(ctx) {
  const items = skillsFor(ctx.lang)
    .map((s, i) => `<li class="skill skill--${s.color} skill--${size(s.label, i)}" title="${esc(s.category)}" style="--r:${tilt(i)}deg">${esc(s.label)}</li>`)
    .join('');
  return raw(`<ul class="hero__skills" aria-label="${esc(ctx.t.home.skillsLabel)}" data-pile-list>${items}</ul>`);
}

export function hero(ctx) {
  const { t, lang } = ctx;
  return html`<section class="hero" aria-labelledby="hero-title" data-hero>
  <div class="container hero__grid">
    <div class="hero__intro">
      <h1 class="hero__title" id="hero-title">${t.home.headline}</h1>
      <p class="hero__bio">${t.home.bio}</p>
      ${button({ href: path('projects', lang), label: t.home.cta, variant: 'primary' })}
    </div>
    <div class="hero__art" data-pile data-physics-src="${ctx.build.physics}">${pile(ctx)}</div>
  </div>
</section>`;
}
