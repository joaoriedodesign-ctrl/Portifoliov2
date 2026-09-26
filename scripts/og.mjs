// Gera as imagens de compartilhamento (1200×630, JPG) e os ícones (favicon, Android, iOS).
// Requer Playwright (npx playwright ou instalação global). Rode: npm run og
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { projects, projectOrder } from '../src/content/projects.js';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import(process.env.PLAYWRIGHT_PATH || 'playwright')); }

const tokens = JSON.parse(readFileSync(new URL('../tokens/figma.tokens.json', import.meta.url)));
const P = Object.fromEntries(Object.entries(tokens.collections['Color / Primitive'].variables).map(([k, v]) => [k, v.Default]));
const f64 = (f) => readFileSync(new URL(`../public/fonts/${f}`, import.meta.url)).toString('base64');
const fonts = `@font-face{font-family:O;src:url(data:font/woff2;base64,${f64('outfit-latin-wght.woff2')});font-weight:100 900}`;
const hero = JSON.parse(readFileSync(new URL('../src/components/hero-layout.json', import.meta.url)));
const out = new URL('../public/og/', import.meta.url);
mkdirSync(out, { recursive: true });

const card = (title, meta) => `<!doctype html><html><head><style>${fonts}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:${P['neutral/50']};font-family:O;color:${P['neutral/950']};display:grid;grid-template-columns:420px 1fr;gap:32px;padding:48px}
.l{display:flex;flex-direction:column;justify-content:space-between}.brand{display:flex}.wm{display:flex;flex-direction:column;font-size:34px;line-height:1}.wm b{font-weight:700;letter-spacing:-0.02em}.wm i{font-style:normal;color:${P['brand/600']}}.wm small{margin-top:.3em;font-size:.38em;font-weight:500;letter-spacing:.3em;text-transform:uppercase;color:${P['neutral/500']}}
.t{font-weight:700;font-size:54px;line-height:60px}.m{margin-top:16px;font-size:24px;color:${P['neutral/600']}}.tag{display:inline-block;margin-top:24px;padding:6px 14px;border:1px dashed ${P['neutral/400']};border-radius:99px;font-size:16px;font-weight:600;color:${P['neutral/600']}}
.box{position:relative;margin:-48px -48px -48px 0;overflow:hidden}
.box svg{position:absolute;right:-60px;bottom:-50px;height:96%;width:auto}</style></head><body>
<div class="l"><div class="brand"><span class="wm"><b>João <i>Riedo</i></b><small>Product Designer</small></span></div>
<div><p class="t">${title}</p><p class="m">${meta}</p></div></div>
<div class="box"><svg viewBox="${hero.viewBox.join(' ')}" fill="${P['brand/600']}">${hero.letters.map((l) => `<g transform="translate(${l.x} ${l.y}) rotate(${l.r})"><path transform="translate(${-l.w / 2} ${-l.h / 2})" d="${hero.paths[l.glyph]}"/></g>`).join('')}</svg></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const shots = [['default', card('Product Designer', 'Portfólio · Projetos, trajetória e contato')], ...projectOrder.map((s) => [s, card(projects[s].name, `${projects[s].pt.category} · ${projects[s].year}`)])];
for (const [name, htmlStr] of shots) {
  await page.setContent(htmlStr);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: fileURLToPath(new URL(`${name}.jpg`, out)), type: 'jpeg', quality: 86 });
}
// Ícones com o símbolo JR (favicon, Android, iOS)
const jr = (size, bg = 'transparent') => `<!doctype html><html><head><style>${fonts}html,body{margin:0;background:${bg}}</style></head><body><svg width="${size}" height="${size}" viewBox="0 0 80 80" style="display:block"><circle cx="40" cy="40" r="40" fill="${P['brand/600']}"/><text x="40" y="54.5" text-anchor="middle" font-family="O" font-weight="700" font-size="41" letter-spacing="-2.5" fill="${P['neutral/50']}">JR</text></svg></body></html>`;
for (const [file, size, bg] of [['favicon-32.png', 32], ['favicon-192.png', 192], ['apple-touch-icon.png', 180, P['brand/600']]]) {
  await page.setViewportSize({ width: size, height: size });
  // iOS recorta o ícone em cantos arredondados: fundo azul cheio evita bordas brancas
  await page.setContent(bg ? `<!doctype html><html><head><style>${fonts}html,body{margin:0;background:${bg}}</style></head><body><svg width="${size}" height="${size}" viewBox="0 0 80 80" style="display:block"><rect width="80" height="80" fill="${bg}"/><text x="40" y="54.5" text-anchor="middle" font-family="O" font-weight="700" font-size="41" letter-spacing="-2.5" fill="${P['neutral/50']}">JR</text></svg></body></html>` : jr(size));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: fileURLToPath(new URL(`../public/${file}`, import.meta.url)), omitBackground: !bg });
}
await browser.close();
console.log('og ok');
