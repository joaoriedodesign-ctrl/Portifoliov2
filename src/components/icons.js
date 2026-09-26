import { raw } from '../lib/html.js';

// Ícones desenhados para o projeto: traço de 1.75 em grade 24, cor via currentColor.
const svg = (body, cls = '') =>
  raw(`<svg class="icon ${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`);

export const icons = {
  arrowRight: () => svg('<path d="M4 12h15"/><path d="M13 6l6 6-6 6"/>', 'icon--arrow'),
  arrowLeft: () => svg('<path d="M20 12H5"/><path d="M11 6l-6 6 6 6"/>', 'icon--arrow-left'),
  arrowDown: () => svg('<path d="M12 4v15"/><path d="M6 13l6 6 6-6"/>'),
  arrowUpRight: () => svg('<path d="M7 17L17 7"/><path d="M8 7h9v9"/>', 'icon--arrow'),
  menu: () => svg('<path d="M4 8h16"/><path d="M4 16h16"/>'),
  close: () => svg('<path d="M6 6l12 12"/><path d="M18 6L6 18"/>'),
  desktop: () => svg('<rect x="3" y="4.5" width="18" height="12" rx="1.5"/><path d="M9 20h6"/><path d="M12 16.5V20"/>'),
  mobile: () => svg('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>'),
  expand: () => svg('<path d="M4 9V4h5"/><path d="M20 9V4h-5"/><path d="M4 15v5h5"/><path d="M20 15v5h-5"/>'),
  collapse: () => svg('<path d="M9 4v5H4"/><path d="M15 4v5h5"/><path d="M9 20v-5H4"/><path d="M15 20v-5h5"/>'),
  download: () => svg('<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>'),
  lock: () => svg('<rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>'),
  // Silhueta monocromática do WhatsApp (balão + fone), preenchida — não gira no hover.
  whatsapp: () =>
    raw(`<svg class="icon icon--brand" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12.04 2.5a9.4 9.4 0 0 0-8.1 14.17L2.5 21.5l4.95-1.4A9.4 9.4 0 1 0 12.04 2.5Zm0 17.1a7.7 7.7 0 0 1-3.93-1.08l-.28-.17-2.93.83.84-2.86-.18-.29a7.7 7.7 0 1 1 6.48 3.57Z"/><path d="M16.3 13.97c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.52.12-.16.23-.6.76-.74.91-.13.16-.27.18-.5.06a6.3 6.3 0 0 1-3.13-2.73c-.24-.41.24-.38.68-1.27.08-.16.04-.29-.02-.41-.06-.12-.52-1.26-.72-1.72-.19-.45-.38-.39-.52-.4h-.45a.86.86 0 0 0-.62.3 2.6 2.6 0 0 0-.82 1.94 4.52 4.52 0 0 0 .95 2.4 10.36 10.36 0 0 0 3.96 3.5c1.47.63 2.05.69 2.78.58.45-.07 1.38-.57 1.58-1.11.19-.55.19-1.01.13-1.11-.05-.1-.21-.16-.44-.28Z"/></svg>`),
};
