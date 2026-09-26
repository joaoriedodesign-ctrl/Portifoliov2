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
