// Formulário → WhatsApp. Valida, monta a mensagem e abre wa.me com o texto
// codificado. Nada é enviado automaticamente: a pessoa revisa e envia no app.
// Sem número configurado: mostra a prévia da mensagem (modo demonstração).

function createForm(form) {
  const number = form.dataset.wa;
  const status = form.querySelector('[data-form-status]');
  const fields = { name: form.elements.name, message: form.elements.text };
  const errors = { name: form.dataset.errorName, message: form.dataset.errorMessage };

  function setError(key, msg) {
    const input = fields[key];
    const el = form.querySelector(`[data-error-for="${key}"]`);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    el.textContent = msg || '';
    el.hidden = !msg;
  }
  const clear = (key) => () => { if (fields[key].value.trim()) setError(key, ''); };
  const onName = clear('name'), onMsg = clear('message');
  fields.name.addEventListener('input', onName);
  fields.message.addEventListener('input', onMsg);

  function onSubmit(e) {
    e.preventDefault();
    const name = fields.name.value.trim();
    const message = fields.message.value.trim();
    setError('name', name ? '' : errors.name);
    setError('message', message ? '' : errors.message);
    if (!name) return fields.name.focus();
    if (!message) return fields.message.focus();

    const text = `${form.dataset.greeting.replace('{name}', name)}\n\n${message}`;
    status.replaceChildren();
    if (number) {
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      const p = document.createElement('p');
      p.textContent = form.dataset.opened;
      status.append(p);
    } else {
      const p = document.createElement('p');
      p.textContent = form.dataset.demoPreview;
      const q = document.createElement('blockquote');
      q.textContent = text;
      status.append(p, q);
    }
  }
  form.addEventListener('submit', onSubmit);
  return {
    destroy() {
      form.removeEventListener('submit', onSubmit);
      fields.name.removeEventListener('input', onName);
      fields.message.removeEventListener('input', onMsg);
    },
  };
}

export function initContactForms() {
  return [...document.querySelectorAll('[data-contact-form]')].map(createForm);
}
