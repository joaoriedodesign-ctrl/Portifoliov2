// Composição final das letras do hero, extraída do Figma (frames 227:3 desktop e
// 227:46 mobile, letras em Outfit Black convertidas em vetor). Os dados brutos ficam
// em scripts/data/hero-figma.json; este script gera src/components/hero-layout.json
// com centro, rotação e contorno de cada letra, no sistema de coordenadas do frame
// desktop (1440 × 900). O mobile usa as mesmas unidades, com as posições que o
// Figma define para o frame de 390 px convertidas de volta para essa escala.
import { readFileSync, writeFileSync } from 'node:fs';

const src = JSON.parse(readFileSync(new URL('./data/hero-figma.json', import.meta.url)));
const r1 = (n) => Math.round(n * 10) / 10;
const shortPath = (d) => d.replace(/-?\d+\.?\d*(e-?\d+)?/g, (n) => String(r1(+n))).replace(/\s+/g, ' ');

// Caixas (x, y, w, h) das letras no frame mobile, na mesma ordem de `letters`.
const mobileBoxes = [
  [2.4, 717.5, 86.5, 111.3], [89.5, 687.1, 118.8, 151], [188.5, 622.3, 119.9, 127.9],
  [224.2, 728.6, 67.7, 108.2], [277.2, 720.4, 127.8, 123.8], [-7, 593.1, 105.1, 120.6],
  [89.5, 548.3, 129.4, 125.5], [207.8, 504, 100.5, 113.8], [282.9, 563.1, 115, 124.2],
];

// Ordem de queda: base primeiro (F, Ó, I, O), o L apoiado no I, depois a linha de cima.
const order = [0, 1, 3, 4, 2, 5, 6, 7, 8];
// Em quem cada letra se apoia (índices em `letters`), para o pequeno empurrão no impacto.
const support = { 2: [3], 5: [0, 1], 6: [1, 2], 7: [2], 8: [4] };

const letters = src.letters.map((l, i) => {
  const g = src.glyphs[l.ch];
  const [a, c, e, b, d, f] = l.t; // absoluteTransform do Figma: [[a c e] [b d f]]
  const cx = a * g.w / 2 + c * g.h / 2 + e;
  const cy = b * g.w / 2 + d * g.h / 2 + f;
  const r = Math.atan2(b, a) * 180 / Math.PI;
  const corners = [[0, 0], [g.w, 0], [g.w, g.h], [0, g.h]].map(([x, y]) => [a * x + c * y + e, b * x + d * y + f]);
  return { ch: l.ch, glyph: l.ch, cx, cy, r, w: g.w, h: g.h, corners, support: support[i] || [] };
});

// Escala e deslocamento do mobile por mínimos quadrados (centros das caixas),
// ignorando o P, que foi reposicionado à mão no frame mobile.
const mc = mobileBoxes.map(([x, y, w, h]) => [x + w / 2, y + h / 2]);
const fitIdx = letters.map((_, i) => i).filter((i) => letters[i].ch !== 'P');
const mean = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;
const dx = fitIdx.map((i) => letters[i].cx), dy = fitIdx.map((i) => letters[i].cy);
const mx = fitIdx.map((i) => mc[i][0]), my = fitIdx.map((i) => mc[i][1]);
const mdx = mean(dx), mdy = mean(dy), mmx = mean(mx), mmy = mean(my);
const num = fitIdx.reduce((s, _, k) => s + (dx[k] - mdx) * (mx[k] - mmx) + (dy[k] - mdy) * (my[k] - mmy), 0);
const den = fitIdx.reduce((s, _, k) => s + (dx[k] - mdx) ** 2 + (dy[k] - mdy) ** 2, 0);
const s = num / den, ox = mmx - s * mdx, oy = mmy - s * mdy;
letters.forEach((l, i) => { l.mcx = (mc[i][0] - ox) / s; l.mcy = (mc[i][1] - oy) / s; });

// Limites de todas as letras (desktop e mobile) → viewBox do SVG
const pts = letters.flatMap((l) => [
  ...l.corners,
  ...l.corners.map(([x, y]) => [x - l.cx + l.mcx, y - l.cy + l.mcy]),
]);
const pad = 4;
const vb = [
  Math.floor(Math.min(...pts.map((p) => p[0])) - pad),
  Math.floor(Math.min(...pts.map((p) => p[1])) - pad),
];
vb.push(Math.ceil(Math.max(...pts.map((p) => p[0])) + pad) - vb[0], Math.ceil(Math.max(...pts.map((p) => p[1])) + pad) - vb[1]);

// "Palco": o recorte visível do frame em cada layout, em unidades do desktop.
// Desktop: da primeira letra até a borda direita/inferior do frame (1440 × 900).
// Mobile: a largura inteira do frame de 390 px até a base da tela.
const [FW, FH] = src.frame;
const top = Math.min(...letters.map((l) => Math.min(...l.corners.map((p) => p[1])))) - 8;
const stages = {
  desktop: [Math.floor(Math.min(...letters.map((l) => Math.min(...l.corners.map((p) => p[0]))))), Math.floor(top), FW, FH],
  mobile: [r1((0 - ox) / s), Math.floor(Math.min(...mc.map((c, i) => (mobileBoxes[i][1] - oy) / s)) - 8), r1((src.mobile.frame[0] - ox) / s), r1((src.mobile.frame[1] - oy) / s)],
};

const paths = Object.fromEntries(Object.entries(src.glyphs).map(([k, g]) => [k, shortPath(g.d)]));
const out = {
  source: src.source,
  viewBox: vb,
  stages,
  mobileFit: { scale: +s.toFixed(5), offset: [r1(ox), r1(oy)] },
  paths,
  letters: letters.map((l, i) => ({
    ch: l.ch, glyph: l.glyph, order: order.indexOf(i),
    x: r1(l.cx), y: r1(l.cy), mx: r1(l.mcx), my: r1(l.mcy), r: r1(l.r),
    w: r1(l.w), h: r1(l.h), support: l.support,
  })),
};
writeFileSync(new URL('../src/components/hero-layout.json', import.meta.url), JSON.stringify(out, null, 1) + '\n');
console.log('viewBox', vb, 'stages', stages, 'mobile fit', out.mobileFit);
console.table(out.letters.map(({ ch, order, x, y, mx, my, r }) => ({ ch, order, x, y, mx, my, r })));
