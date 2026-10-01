// Seção "Quem já trabalhou comigo" (Figma 289:1164, componente Depoimento 289:1154).
// Carrossel horizontal com scroll nativo (arrastar/rolar funciona sem JS); os botões
// anterior/próximo são ligados por client/carousel.js.
import { html } from '../lib/html.js';
import { icons } from './icons.js';
import { testimonials } from '../content/testimonials.js';

export function testimonialsSection(ctx) {
  const { t, lang } = ctx;
  const h = t.home;
  return html`<section class="testimonials" aria-labelledby="testimonials-title" data-carousel>
  <div class="container">
    <div class="testimonials__head">
      <h2 class="section-title" id="testimonials-title">${h.testimonialsTitle}</h2>
      <div class="testimonials__nav" role="group" aria-label="${h.testimonialsNav}" data-carousel-nav hidden>
        <button class="round-btn" type="button" data-carousel-prev disabled>${icons.arrowLeft()}<span class="sr-only">${h.prevTestimonial}</span></button>
        <button class="round-btn" type="button" data-carousel-next>${icons.arrowRight()}<span class="sr-only">${h.nextTestimonial}</span></button>
      </div>
    </div>
    <ul class="testimonials__track" data-carousel-track>
      ${testimonials.map((x) => html`<li class="testimonial">
        <figure>
          <figcaption class="testimonial__author">
            <span class="avatar" aria-hidden="true">${x.initials}</span>
            <span class="testimonial__id"><span class="testimonial__name">${x.name}</span><span class="testimonial__role">${x.role[lang]}</span></span>
          </figcaption>
          <blockquote class="testimonial__quote">
            <span class="testimonial__mark" aria-hidden="true">“</span>
            ${x.text[lang].map((p) => html`<p>${p}</p>`)}
          </blockquote>
        </figure>
      </li>`)}
    </ul>
  </div>
</section>`;
}
