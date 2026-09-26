// Conteúdo do card de projeto (apresentação estática) e a sequência que o
// envolve. O controlador 3D (client/depth-stack.js) é separado: sem JS ou com
// movimento reduzido, a mesma marcação é uma lista vertical comum.
import { html, raw, esc } from '../lib/html.js';
import { path } from '../lib/routes.js';
import { projects, projectOrder } from '../content/projects.js';
import { assets } from '../config/assets.js';
import { icons } from './icons.js';
import { media } from './primitives.js';

const pad = (n) => String(n).padStart(2, '0');

export function projectCard(ctx, slug, i, { level = 3, priority = false } = {}) {
  const { lang, t } = ctx;
  const p = projects[slug];
  const c = p[lang];
  const href = path('project', lang, slug);
  const total = projectOrder.length;
  const H = `h${level}`;
  const id = `pc-${slug}`;
  return html`<article class="project-card" aria-labelledby="${id}">
  <a class="project-card__cover" href="${href}" tabindex="-1" aria-hidden="true">
    ${media(assets.covers[slug], '', { priority, cls: 'project-card__img' })}
  </a>
  <div class="project-card__info">
    <p class="project-card__pos" aria-hidden="true"><span>${pad(i + 1)}</span> / ${pad(total)}</p>
    <p class="project-card__meta">${c.category} · ${p.year}</p>
    ${raw(`<${H} class="project-card__title" id="${id}">`)}${p.name}${raw(`</${H}>`)}
    ${p.concept ? html`<p class="badge">${t.ui.conceptBadge}</p>` : ''}
    <p class="project-card__desc">${c.summary}</p>
    <a class="text-link project-card__link" href="${href}">${t.ui.viewProject}<span class="sr-only">: ${p.name}</span>${icons.arrowRight()}</a>
  </div>
</article>`;
}

// `title`: título da seção renderizado dentro da cena, para continuar visível
// enquanto a sequência está fixa na tela.
export function projectSequence(ctx, { level = 3, id = 'projetos-lista', title = null, titleId, titleTag = 'h2' } = {}) {
  const { t } = ctx;
  return html`<div class="depth" data-depth id="${id}">
  <div class="depth__sticky" data-depth-sticky>
    <div class="depth__head">
      ${title ? raw(`<${titleTag} class="section-title" id="${titleId}">${esc(title)}</${titleTag}>`) : ''}
      <div class="depth__nav" role="group" aria-label="${t.ui.projectNav}">
        <button class="round-btn" type="button" data-depth-prev disabled>${icons.arrowLeft()}<span class="sr-only">${t.ui.prevProject}</span></button>
        <button class="round-btn" type="button" data-depth-next>${icons.arrowRight()}<span class="sr-only">${t.ui.nextProject}</span></button>
      </div>
    </div>
    <ol class="depth__list" data-depth-list>
      ${projectOrder.map((slug, i) => html`<li class="depth__item" data-depth-item>${projectCard(ctx, slug, i, { level, priority: i === 0 && ctx.key === 'projects' })}</li>`)}
    </ol>
    <p class="depth__hint" aria-hidden="true">${icons.arrowDown()}${t.home.scrollHint}</p>
  </div>
</div>`;
}
