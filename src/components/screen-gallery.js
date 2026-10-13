// Galeria de telas para projetos sem site navegável (ex.: Design System Multi-tenant):
// cada tela aparece em par desktop + mobile, seguida da biblioteca no Storybook.
import { html } from '../lib/html.js';
import { assets } from '../config/assets.js';
import { media } from './primitives.js';

export function screenGallery(ctx, slug, project) {
  const c = project[ctx.lang];
  const screens = assets.dsScreens;
  return html`<section class="gallery" aria-labelledby="gallery-title">
  <div class="gallery__head">
    <h2 class="gallery__title" id="gallery-title">${c.galleryTitle}</h2>
    <p class="gallery__caption">${c.galleryCaption}</p>
  </div>
  ${project.gallery.map((key, i) => html`<figure class="gallery__screen">
    <figcaption class="gallery__label">${c.galleryLabels[key]}</figcaption>
    <div class="gallery__pair">
      <div class="gallery__desktop">${media(screens[key].desktop, `${c.galleryLabels[key]} — desktop`, { priority: i === 0 })}</div>
      <div class="gallery__mobile">${media(screens[key].mobile, `${c.galleryLabels[key]} — mobile`)}</div>
    </div>
  </figure>`)}
  <figure class="gallery__storybook">
    <div class="gallery__storybook-img">${media(screens.storybook, 'Storybook')}</div>
    <figcaption class="gallery__caption">${c.storybookCaption}</figcaption>
  </figure>
</section>`;
}

// Galeria mobile (cases de gamificação): telas agrupadas por módulo. Cada grupo tem
// título, uma frase de contexto e a sequência de telas na ordem do fluxo. No celular,
// a sequência rola na horizontal; a partir do tablet, quebra em grade.
export function mobileGallery(ctx, slug, project) {
  const c = project[ctx.lang];
  const screens = assets.mobileScreens[slug];
  let first = true;
  return html`<section class="gallery gallery--mobile" aria-labelledby="gallery-title">
  <div class="gallery__head">
    <h2 class="gallery__title" id="gallery-title">${c.galleryTitle}</h2>
    <p class="gallery__caption">${c.galleryCaption}</p>
  </div>
  ${project.screens.map((g) => html`<section class="gallery__group" aria-labelledby="gallery-${g.key}">
    <div class="gallery__group-head">
      <h3 class="gallery__label" id="gallery-${g.key}">${c.groups[g.key].title}</h3>
      <p class="gallery__caption">${c.groups[g.key].text}</p>
    </div>
    <ol class="gallery__phones">
      ${g.items.map((k) => {
        const img = media(screens[k], `${c.groups[g.key].title}: ${c.screenLabels[k]}`, { priority: first });
        first = false;
        return html`<li class="gallery__phone"><figure><div class="gallery__phone-img">${img}</div><figcaption class="gallery__phone-label">${c.screenLabels[k]}</figcaption></figure></li>`;
      })}
    </ol>
  </section>`)}
</section>`;
}
