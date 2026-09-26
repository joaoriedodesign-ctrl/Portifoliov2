// Verificação automatizada (Playwright): todas as rotas em 360/768/1440,
// erros de console, overflow horizontal, links internos, seletor de idioma,
// redirecionamentos, menu por teclado, sequência 3D nos dois sentidos,
// movimento reduzido e ausência de links "#".
// Uso: npm run build && (npm run serve &) && npm run verify
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { allRoutes, redirects, path as rp } from '../src/lib/routes.js';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import(process.env.PLAYWRIGHT_PATH || 'playwright')); }

const BASE = process.env.BASE || 'http://localhost:4321';
const SHOTS = process.env.SHOTS || '.verify';
mkdirSync(SHOTS, { recursive: true });
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };

const browser = await chromium.launch();
const routes = allRoutes();
const checked = new Set();

for (const width of [360, 768, 1440]) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 700 ? 780 : 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  // Recursos externos dos sites embutidos (Google Fonts, TikTok) podem falhar em ambientes
  // sem rede; só contam falhas de recursos do próprio site e erros de JavaScript.
  page.on('console', (m) => m.type() === 'error' && !m.text().startsWith('Failed to load resource') && errors.push(m.text()));
  page.on('requestfailed', (r) => r.url().startsWith(BASE) && errors.push(`falhou ${r.url()}`));
  for (const r of routes) {
    errors.length = 0;
    const res = await page.goto(BASE + r.path);
    ok(res.status() === 200, `${r.path} status ${res.status()}`);
    await page.waitForTimeout(150);
    // percorre a página para acionar controladores de scroll
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 700) await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.evaluate(() => window.scrollTo(0, 0));
    const ov = await page.evaluate(() => {
      const out = [];
      if (document.documentElement.scrollWidth > window.innerWidth) out.push('document ' + document.documentElement.scrollWidth);
      return out;
    });
    ok(!ov.length, `${r.path} @${width}: overflow horizontal ${ov.join(',')}`);
    ok(!errors.length, `${r.path} @${width}: erros ${errors.join(' | ')}`);
    const hashLinks = await page.$$eval('a[href="#"]', (a) => a.length);
    ok(hashLinks === 0, `${r.path}: ${hashLinks} links "#"`);
    const h1 = await page.$$eval('h1', (a) => a.length);
    ok(h1 === 1, `${r.path}: ${h1} h1`);
    if (width === 1440) {
      // idioma equivalente
      const alt = await page.$eval('a.lang__item', (a) => a.getAttribute('href'));
      const expected = rp(r.key, r.lang === 'pt' ? 'en' : 'pt', r.slug);
      ok(alt === expected, `${r.path}: seletor de idioma → ${alt} (esperado ${expected})`);
      // footer ausente só no contato
      const hasFooter = await page.$('.site-footer');
      ok(r.key === 'contact' ? !hasFooter : !!hasFooter, `${r.path}: footer ${hasFooter ? 'presente' : 'ausente'}`);
      // links internos e assets
      const urls = await page.$$eval('a[href^="/"], img[src^="/"], link[href^="/"], script[src^="/"]', (els) => els.map((e) => e.getAttribute('href') || e.getAttribute('src')));
      for (const u of urls) {
        if (checked.has(u)) continue;
        checked.add(u);
        const rr = await page.request.get(BASE + u, { maxRedirects: 0 });
        ok(rr.status() === 200, `${r.path}: recurso ${u} → ${rr.status()}`);
      }
    }
  }
  await ctx.close();
}

// Redirecionamentos 301 e 404
{
  const ctx = await browser.newContext();
  for (const r of redirects) {
    const res = await ctx.request.get(BASE + r.from, { maxRedirects: 0 });
    ok(res.status() === 301 && res.headers().location === r.to, `redirect ${r.from} → ${res.status()} ${res.headers().location}`);
  }
  const nf = await ctx.request.get(BASE + '/nao-existe');
  ok(nf.status() === 404, `404 status ${nf.status()}`);
  await ctx.close();
}

// Sequência 3D: avança, reverte e libera o fluxo
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/');
  const info = await page.evaluate(() => { const r = document.querySelector('[data-depth]'); return { top: r.getBoundingClientRect().top + scrollY, h: r.offsetHeight, is3d: r.classList.contains('is-3d') }; });
  ok(info.is3d, '3D não ativou');
  const range = info.h - (900 - 64);
  const activeAt = async (f) => { await page.evaluate((y) => window.scrollTo(0, y), info.top - 64 + range * f); await page.waitForTimeout(120); return page.evaluate(() => [...document.querySelectorAll('#selecionados [data-depth-item]')].findIndex((li) => li.classList.contains('is-active'))); };
  const n = await page.$$eval('#selecionados [data-depth-item]', (a) => a.length);
  // pontos de parada de cada projeto (considerando as pausas no início e no fim)
  const stops = await page.evaluate((count) => { const vh = innerHeight; const hold = vh * (innerWidth >= 1024 ? 0.22 : 0.14); const r = document.querySelector('#selecionados'); const range = r.offsetHeight - (vh - 64); return [...Array(count).keys()].map((i) => (hold + (i / (count - 1)) * (range - 2 * hold)) / range); }, n);
  const seq = [];
  for (const f of [...stops, ...stops.slice(0, -1).reverse()]) seq.push(await activeAt(f));
  const expected = [...Array(n).keys(), ...[...Array(n - 1).keys()].reverse()].join();
  ok(seq.join() === expected, `sequência 3D ${seq.join()} (esperado ${expected})`);
  await activeAt(0);
  const hiddenCount = await page.$$eval('#selecionados [data-depth-item][aria-hidden="true"]', (a) => a.length);
  const focusable = await page.$$eval('#selecionados [data-depth-item][aria-hidden="true"] .project-card__link:not([tabindex="-1"])', (a) => a.length);
  ok(hiddenCount === n - 1 && focusable === 0, `itens ocultos ${hiddenCount}, links focáveis ocultos ${focusable}`);
  // Clicar num card do fundo traz esse projeto para a frente
  const box = await page.$eval('#selecionados [data-depth-item]:nth-child(2) .project-card__cover', (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 12 }; });
  await page.mouse.click(box.x, box.y);
  await page.waitForTimeout(1300);
  const afterClick = await page.evaluate(() => [...document.querySelectorAll('#selecionados [data-depth-item]')].findIndex((li) => li.classList.contains('is-active')));
  ok(afterClick === 1 && page.url() === BASE + '/', `clique no card do fundo: ativo ${afterClick}, url ${page.url()}`);
  await page.evaluate((y) => window.scrollTo(0, y), info.top + info.h + 200);
  await page.waitForTimeout(100);
  const released = await page.evaluate(() => document.querySelector('#home-contato').getBoundingClientRect().top < window.innerHeight);
  ok(released, 'fluxo não liberado após o último projeto');
  // Menu mobile por teclado
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto(BASE + '/sobre');
  await page.focus('[data-menu-open]');
  await page.keyboard.press('Enter');
  const opened = await page.evaluate(() => !document.querySelector('[data-menu]').hidden && document.activeElement.classList.contains('mobile-menu__link'));
  ok(opened, 'menu mobile não abriu com foco no primeiro link');
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
  const trapped = await page.evaluate(() => document.querySelector('[data-menu]').contains(document.activeElement));
  ok(trapped, 'foco escapou do menu');
  await page.keyboard.press('Escape');
  const closed = await page.evaluate(() => document.querySelector('[data-menu]').hidden && document.activeElement.matches('[data-menu-open]'));
  ok(closed, 'Esc não fechou o menu / foco não voltou');
  // Toque: foco no container, sem contorno em link
  await page.tap('[data-menu-open]').catch(async () => page.click('[data-menu-open]'));
  const touchFocus = await page.evaluate(() => document.activeElement.matches('[data-menu]'));
  ok(touchFocus, 'abertura por toque/clique deveria focar o container');
  await ctx.close();
}

// Movimento reduzido: hero na composição final, projetos em lista, sem altura extra
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/');
  await page.waitForTimeout(200);
  const r = await page.evaluate(() => ({
    settled: document.querySelector('[data-fall]').classList.contains('is-settled'),
    visible: getComputedStyle(document.querySelector('.glyph')).visibility,
    is3d: document.querySelector('[data-depth]').classList.contains('is-3d'),
    styleH: document.querySelector('[data-depth]').style.height,
    intro: getComputedStyle(document.querySelector('.hero__intro .btn')).opacity,
  }));
  ok(r.settled && r.visible === 'visible' && !r.is3d && !r.styleH && r.intro === '1', `reduced motion: ${JSON.stringify(r)}`);
  await page.screenshot({ path: `${SHOTS}/reduced-home.png`, fullPage: true });
  await ctx.close();
}

// Sem JavaScript: conteúdo visível
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(BASE + '/');
  const vis = await page.evaluate(() => getComputedStyle(document.querySelector('.glyph')).visibility);
  ok(vis === 'visible', `sem JS: letras ${vis}`);
  const cta = await page.evaluate(() => getComputedStyle(document.querySelector('.hero__intro .btn')).opacity);
  ok(cta === '1', `sem JS: textos do hero com opacidade ${cta}`);
  await ctx.close();
}

// Sequência do hero: letras primeiro, textos depois; foco por teclado revela na hora
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/');
  await page.waitForTimeout(300);
  const early = await page.evaluate(() => document.querySelector('[data-hero]').classList.contains('is-revealed'));
  ok(!early, 'hero: textos não deveriam aparecer antes das letras');
  await page.waitForTimeout(2600);
  const late = await page.evaluate(() => ({ rev: document.querySelector('[data-hero]').classList.contains('is-revealed'), op: getComputedStyle(document.querySelector('.hero__intro .btn')).opacity }));
  ok(late.rev && late.op === '1', `hero: textos deveriam estar visíveis após a queda ${JSON.stringify(late)}`);
  await page.goto(BASE + '/');
  await page.waitForTimeout(150);
  for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); if (await page.evaluate(() => !!document.activeElement.closest('.hero'))) break; }
  const kb = await page.evaluate(() => document.querySelector('[data-hero]').classList.contains('is-revealed'));
  ok(kb, 'hero: foco por teclado deveria revelar os textos');
  await ctx.close();
}

// Formulário → WhatsApp (número em src/config/site.js; sem número, modo demonstração)
{
  const { site } = await import('../src/config/site.js');
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const popups = [];
  // Não navega de verdade até o WhatsApp: só registra a URL que seria aberta.
  await ctx.route(/wa\.me|whatsapp\.com/, (r) => r.fulfill({ status: 200, body: 'ok' }));
  ctx.on('page', (p) => popups.push(p));
  await page.goto(BASE + '/contato');
  await page.click('#contato button[type=submit]');
  const errs = await page.$$eval('#contato [data-error-for]:not([hidden])', (a) => a.length);
  ok(errs === 2, `validação: ${errs} erros visíveis`);
  await page.fill('#contato-name', 'Ana & Cia');
  await page.fill('#contato-message', 'Olá? Preciso de um site 100% novo #teste');
  await page.click('#contato button[type=submit]');
  await page.waitForTimeout(600);
  if (site.contact.whatsapp) {
    const url = popups[0] ? popups[0].url() : '';
    const text = url ? new URL(url).searchParams.get('text') : '';
    ok(url.startsWith(`https://wa.me/${site.contact.whatsapp}?text=`) && text.includes('Ana & Cia') && text.includes('100% novo #teste'), `WhatsApp: ${url}`);
  } else {
    const preview = await page.textContent('#contato [data-form-status]');
    ok(preview.includes('Ana & Cia') && !popups.length, 'modo demonstração deveria mostrar prévia sem abrir o WhatsApp');
  }
  await ctx.close();
}

await browser.close();
if (fails.length) { console.error(`✗ ${fails.length} falha(s):\n- ` + fails.join('\n- ')); process.exit(1); }
console.log(`✓ verificação ok — ${routes.length} rotas × 3 larguras, ${checked.size} recursos, ${redirects.length} redirecionamentos`);
