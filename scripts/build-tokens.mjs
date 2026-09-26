// Gera src/styles/tokens.css a partir de tokens/figma.tokens.json (+ extensões).
// Primitivos viram valores; semânticos viram var() apontando para o primitivo,
// preservando a relação Semantic → Primitive do Figma.
import { readFileSync, writeFileSync } from 'node:fs';

const figma = JSON.parse(readFileSync(new URL('../tokens/figma.tokens.json', import.meta.url)));
const ext = JSON.parse(readFileSync(new URL('../tokens/extensions.tokens.json', import.meta.url)));

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const WEIGHTS = { regular: 400, medium: 500, semibold: 600, bold: 700 };
const FALLBACK = { outfit: "'Outfit', ui-sans-serif, system-ui, sans-serif", righteous: "'Righteous', 'Outfit', ui-sans-serif, sans-serif" };
const rem = (px) => `${+(px / 16).toFixed(4)}rem`;

// Nome CSS de cada variável, por coleção
function cssName(collection, name) {
  if (collection.startsWith('Color / Primitive')) return `--color-${slug(name)}`;
  return `--${slug(name)}`;
}
// Índice nome-curto → nome CSS (para resolver aliases "→ x")
const index = new Map();
function register(collections) {
  for (const [cName, c] of Object.entries(collections)) {
    for (const vName of Object.keys(c.variables)) index.set(vName, cssName(cName, vName));
  }
}
register(figma.collections);
register(ext.collections);

function primitiveValue(name, raw) {
  if (typeof raw === 'number') {
    if (/^(font-size|line-height|space|radius)\//.test(name)) return name === 'radius/full' ? '999px' : rem(raw);
    if (name.startsWith('border-width/')) return `${raw}px`;
    if (name.startsWith('duration/')) return `${raw}ms`;
    return String(raw);
  }
  if (name.startsWith('font-family/')) return FALLBACK[slug(raw)] ?? `'${raw}'`;
  if (name.startsWith('font-weight/')) return String(WEIGHTS[slug(raw)] ?? 400);
  return raw;
}
const resolve = (v) => {
  const m = typeof v === 'string' && v.match(/^→\s*(.+)$/);
  if (!m) return null;
  const target = index.get(m[1].trim());
  if (!target) throw new Error(`Alias sem destino: ${v}`);
  return `var(${target})`;
};

const overridden = new Set(Object.values(ext.collections).filter((c) => c.override).flatMap((c) => Object.keys(c.variables)));
const blocks = { root: [], dark: [] };
function emit(collections, origin) {
  for (const [cName, c] of Object.entries(collections)) {
    blocks.root.push(`\n  /* ${origin} · ${cName} */`);
    const modes = c.modes;
    for (const [vName, def] of Object.entries(c.variables)) {
      if (origin === 'Figma' && overridden.has(vName)) { blocks.root.push(`  /* ${vName}: substituído pela extensão (override) */`); continue; }
      const name = cssName(cName, vName);
      const val = typeof def === 'object' && def !== null ? def : { Default: def };
      const first = val[modes[0]];
      const light = resolve(first) ?? primitiveValue(vName, first);
      blocks.root.push(`  ${name}: ${light};`);
      if (modes.includes('Dark')) {
        const d = resolve(val.Dark) ?? primitiveValue(vName, val.Dark);
        blocks.dark.push(`  ${name}: ${d};`);
      }
    }
  }
}
emit(figma.collections, 'Figma');
emit(ext.collections, 'Extensão do código (não existe no Figma)');

const css = `/* ARQUIVO GERADO por scripts/build-tokens.mjs — não edite à mão.
   Fonte: tokens/figma.tokens.json (espelho do Figma) + tokens/extensions.tokens.json.
   Modo padrão: Light (direção visual clara). O modo Dark do Figma fica disponível em [data-theme="dark"]. */
:root {${blocks.root.join('\n')}
}

/* Figma · Color / Semantic — modo Dark (preservado, não ativado por padrão) */
:root[data-theme="dark"] {
${blocks.dark.join('\n')}
}
`;
writeFileSync(new URL('../src/styles/tokens.css', import.meta.url), css);
console.log(`tokens.css: ${blocks.root.length} linhas, ${blocks.dark.length} overrides Dark`);
