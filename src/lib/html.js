// Template mínimo: `html` escapa interpolações; `raw()` marca HTML confiável;
// arrays são concatenados; null/undefined/false viram string vazia.
const RAW = Symbol('raw');

export const raw = (s) => ({ [RAW]: String(s) });

export const esc = (v) =>
  String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function render(v) {
  if (v === null || v === undefined || v === false) return '';
  if (Array.isArray(v)) return v.map(render).join('');
  if (typeof v === 'object' && RAW in v) return v[RAW];
  return esc(v);
}

export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((v, i) => { out += render(v) + strings[i + 1]; });
  return raw(out);
}

export const toString = (node) => render(node);

// Atributos opcionais: attrs({ href: x, 'aria-current': cond && 'page' })
export function attrs(obj) {
  return raw(
    Object.entries(obj)
      .filter(([, v]) => v !== null && v !== undefined && v !== false)
      .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
      .join(''),
  );
}
