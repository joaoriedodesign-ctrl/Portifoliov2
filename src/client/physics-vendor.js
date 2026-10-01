// Motor de física (matter-js) em um bundle separado: só é baixado na home, quando o
// movimento é permitido, para não pesar nas outras páginas. hero-pile.js o carrega.
import Matter from 'matter-js';

window.__Matter = Matter;
window.dispatchEvent(new Event('physics:ready'));
