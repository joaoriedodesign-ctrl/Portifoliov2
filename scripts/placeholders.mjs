// Gera os placeholders locais (SVG) a partir dos primitivos do Figma.
// São substituíveis: troque os caminhos em src/config/assets.js pelas imagens reais.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const tokens = JSON.parse(readFileSync(new URL('../tokens/figma.tokens.json', import.meta.url)));
const P = Object.fromEntries(Object.entries(tokens.collections['Color / Primitive'].variables).map(([k, v]) => [k, v.Default]));
const outfit = readFileSync(new URL('../public/fonts/outfit-latin-wght.woff2', import.meta.url)).toString('base64');
const out = new URL('../public/assets/placeholders/', import.meta.url);
mkdirSync(out, { recursive: true });

// Somente Outfit: .r = títulos (Bold), .o = texto
const style = () => `<style>@font-face{font-family:O;src:url(data:font/woff2;base64,${outfit}) format('woff2');font-weight:100 900}.r{font-family:O,sans-serif;font-weight:700}.o{font-family:O,sans-serif}</style>`;

const tag = (x, y, text, fg, bg) => `<g transform="translate(${x} ${y})"><rect x="0" y="0" width="${text.length * 13 + 48}" height="48" rx="24" fill="${bg}"/><text class="o" x="24" y="31" font-size="20" font-weight="600" letter-spacing="1.5" fill="${fg}">${text}</text></g>`;

function cover({ slug, bg, ink, sub, shapes, name, meta }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">${style()}
<rect width="1600" height="1000" fill="${bg}"/>
${shapes}
<text class="r" x="96" y="820" font-size="148" fill="${ink}">${name}</text>
<text class="o" x="100" y="890" font-size="30" font-weight="500" fill="${sub}">${meta}</text>
${tag(96, 88, 'CAPA PROVISÓRIA', bg, ink)}
</svg>`;
  writeFileSync(new URL(`cover-${slug}.svg`, out), svg);
}

cover({
  slug: 'instituto-mais', bg: P['brand/600'], ink: P['base/white'], sub: P['brand/100'],
  name: 'Instituto MAIS', meta: 'Site institucional · 2026',
  shapes: `<g transform="translate(1000 120)">
    <path d="M0 240A240 240 0 0 1 240 0V240Z" fill="${P['brand/100']}"/>
    <path d="M260 0A240 240 0 0 1 500 240H260Z" fill="${P['base/white']}"/>
    <path d="M0 260H240V500A240 240 0 0 1 0 260Z" fill="${P['neutral/950']}"/>
    <path d="M260 260H500A240 240 0 0 1 260 500Z" fill="${P['brand/300']}"/>
  </g>`,
});

cover({
  slug: 'dr-carlos-mattos', bg: P['neutral/950'], ink: P['neutral/50'], sub: P['neutral/300'],
  name: 'Dr. Carlos Mattos', meta: 'Landing page · 2026',
  shapes: `<path d="M1080 640V340a200 200 0 0 1 400 0v300Z" fill="${P['brand/600']}"/>
    <circle cx="1280" cy="330" r="46" fill="${P['neutral/50']}"/>
    <path d="M880 640h160" stroke="${P['neutral/700']}" stroke-width="4"/><path d="M880 590h120" stroke="${P['neutral/700']}" stroke-width="4"/>`,
});

cover({
  slug: 'marina-alves', bg: P['brand/100'], ink: P['brand/950'], sub: P['brand/800'],
  name: 'Marina Alves', meta: 'Mídia kit · 2026',
  shapes: `<g transform="translate(940 120)" fill="${P['brand/600']}">
    <rect x="0" y="300" width="96" height="220" rx="48"/>
    <rect x="120" y="160" width="96" height="360" rx="48" fill="${P['brand/800']}"/>
    <rect x="240" y="60" width="96" height="460" rx="48"/>
    <rect x="360" y="220" width="96" height="300" rx="48" fill="${P['brand/400']}"/>
    <rect x="480" y="120" width="96" height="400" rx="48" fill="${P['brand/950']}"/>
  </g>`,
});

// Fallback da demonstração (print provisório) — 1440×900
function demo(slug, name, accent) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900">${style()}
<rect width="1440" height="900" fill="${P['neutral/100']}"/>
<rect x="0" y="0" width="1440" height="88" fill="${P['base/white']}"/>
<circle cx="96" cy="44" r="18" fill="${accent}"/><rect x="130" y="34" width="180" height="20" rx="10" fill="${P['neutral/300']}"/>
<rect x="900" y="34" width="96" height="20" rx="10" fill="${P['neutral/300']}"/><rect x="1024" y="34" width="96" height="20" rx="10" fill="${P['neutral/300']}"/>
<rect x="1160" y="24" width="184" height="40" rx="20" fill="${accent}"/>
<text class="r" x="96" y="300" font-size="84" fill="${P['neutral/950']}">${name}</text>
<rect x="96" y="350" width="560" height="22" rx="11" fill="${P['neutral/300']}"/><rect x="96" y="388" width="440" height="22" rx="11" fill="${P['neutral/300']}"/>
<rect x="96" y="452" width="220" height="56" rx="28" fill="${accent}"/>
<rect x="800" y="168" width="544" height="400" rx="24" fill="${accent}" opacity=".9"/>
<g fill="${P['base/white']}"><rect x="96" y="640" width="384" height="180" rx="20"/><rect x="528" y="640" width="384" height="180" rx="20"/><rect x="960" y="640" width="384" height="180" rx="20"/></g>
${tag(96, 120, 'PRÉVIA PROVISÓRIA', P['base/white'], P['neutral/950'])}
</svg>`;
  writeFileSync(new URL(`demo-${slug}.svg`, out), svg);
}
demo('instituto-mais', 'Instituto MAIS', P['brand/600']);
demo('dr-carlos-mattos', 'Dr. Carlos Mattos', P['neutral/950']);
demo('marina-alves', 'Marina Alves', P['brand/800']);

// Retrato provisório 960×1200 — composição geométrica, sem pessoa real
writeFileSync(new URL('portrait.svg', out), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 1200" width="960" height="1200">${style()}
<rect width="960" height="1200" fill="${P['neutral/200']}"/>
<rect x="0" y="760" width="960" height="440" fill="${P['neutral/300']}"/>
<circle cx="480" cy="470" r="170" fill="${P['neutral/400']}"/>
<path d="M170 1200a310 310 0 0 1 620 0Z" fill="${P['neutral/500']}"/>
<rect x="640" y="120" width="200" height="200" rx="32" fill="${P['brand/600']}"/>
<path d="M690 290V150a140 140 0 0 1 140 140Z" fill="${P['base/white']}"/>
${tag(64, 64, 'FOTO PROVISÓRIA', P['neutral/50'], P['neutral/950'])}
</svg>`);

// Avatar provisório 96×96
writeFileSync(new URL('avatar.svg', out), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">${style()}
<rect width="96" height="96" rx="48" fill="${P['brand/600']}"/><text class="r" x="48" y="61" font-size="36" text-anchor="middle" fill="${P['base/white']}">JR</text></svg>`);

console.log('placeholders ok');
