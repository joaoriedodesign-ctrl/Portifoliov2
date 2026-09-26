// Formulário reutilizado (Home, páginas de projeto e /contato).
// Com número configurado: abre o WhatsApp com a mensagem codificada (nunca envia sozinho).
// Sem número: estado de demonstração explícito, sem destinatário fictício.
import { html, raw } from '../lib/html.js';
import { site } from '../config/site.js';
import { icons } from './icons.js';

export function contactForm(ctx, { heading = true, level = 2, id = 'contato-form' } = {}) {
  const { t, lang } = ctx;
  const f = t.form;
  const number = (site.contact.whatsapp || '').replace(/\D/g, '');
  const configured = number.length >= 10;
  const H = `h${level}`;
  // Sem JS e com número configurado, o GET para api.whatsapp.com ainda funciona (campo "text").
  const noJsAction = configured ? raw(` action="https://api.whatsapp.com/send" method="get" target="_blank"`) : '';
  return html`<section class="contact-block" aria-labelledby="${id}-title">
  <div class="container contact-block__grid">
    ${heading ? html`<div class="contact-block__intro">
      ${raw(`<${H} class="contact-block__title" id="${id}-title">${f.title}</${H}>`)}
      <p class="contact-block__text">${f.text}</p>
    </div>` : raw(`<span class="sr-only" id="${id}-title">${f.title}</span>`)}
    <form class="form" id="${id}" data-contact-form data-wa="${number}" data-lang="${lang}" data-greeting="${f.greeting('{name}')}" data-error-name="${f.nameError}" data-error-message="${f.messageError}" data-demo-preview="${f.demoPreview}" data-opened="${f.opened}" novalidate${noJsAction}>
      ${configured ? html`<input type="hidden" name="phone" value="${number}">` : ''}
      <div class="field">
        <label class="field__label" for="${id}-name">${f.name}</label>
        <input class="field__input" id="${id}-name" name="name" type="text" autocomplete="name" required aria-describedby="${id}-name-error">
        <p class="field__error" id="${id}-name-error" data-error-for="name" hidden></p>
      </div>
      <div class="field">
        <label class="field__label" for="${id}-message">${f.message}</label>
        <textarea class="field__input field__input--area" id="${id}-message" name="text" rows="5" required aria-describedby="${id}-message-error"></textarea>
        <p class="field__error" id="${id}-message-error" data-error-for="message" hidden></p>
      </div>
      ${configured ? '' : html`<p class="form__notice" role="note">${f.demoNotice}</p>`}
      <div class="form__actions">
        <button class="btn btn--primary" type="submit"><span class="btn__label">${f.submit}</span>${icons.whatsapp()}</button>
      </div>
      <div class="form__status" role="status" aria-live="polite" data-form-status></div>
    </form>
  </div>
</section>`;
}
