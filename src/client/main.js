// Ponto de entrada do front-end. Cada módulo é opcional: só inicia se a
// marcação correspondente existir, e expõe destroy() para limpeza.
import { initHeader, initMenu } from './nav.js';
import { initHeroFall } from './hero-fall.js';
import { initDepthStacks } from './depth-stack.js';
import { initDemos } from './demo-viewer.js';
import { initContactForms } from './contact-form.js';
import { initBackLinks } from './back-link.js';

window.__appReady = true;

const controllers = [];
function boot() {
  const run = (fn) => { try { const c = fn(); if (c) controllers.push(...[].concat(c)); } catch (e) { console.error(e); } };
  run(initHeader);
  run(initMenu);
  run(initHeroFall);
  run(initDepthStacks);
  run(initDemos);
  run(initContactForms);
  run(initBackLinks);
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
}

// Limpa controladores ao sair da página (inclusive bfcache)
window.addEventListener('pagehide', (e) => {
  if (e.persisted) return;
  controllers.forEach((c) => c && c.destroy && c.destroy());
});

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
