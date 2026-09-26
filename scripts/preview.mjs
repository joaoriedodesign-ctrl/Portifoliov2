// Gera preview/ — uma cópia de dist/ que abre com dois cliques no index.html,
// sem Node nem servidor. Converte caminhos absolutos em relativos e aponta
// cada link de página para o index.html da pasta.
import { readFileSync, writeFileSync, rmSync, cpSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const out = join(root, 'preview');
if (!existsSync(dist)) throw new Error('Rode "npm run build" antes.');
rmSync(out, { recursive: true, force: true });
cpSync(dist, out, { recursive: true });

const isFile = (p) => existsSync(p) && statSync(p).isFile();
function target(abs) {
  const [pathPart, hash = ''] = abs.split('#');
  const clean = pathPart.split('?')[0];
  const disk = join(out, ...clean.split('/'));
  let file = clean;
  if (!isFile(disk)) file = posix.join(clean, 'index.html');
  return { file, hash: hash ? `#${hash}` : '' };
}

function rewrite(fileAbs) {
  const fromDir = dirname(fileAbs);
  let s = readFileSync(fileAbs, 'utf8');
  // preload com crossorigin falha em file:// (as fontes continuam vindo do CSS)
  s = s.replace(/<link rel="preload"[^>]*>\n?/g, '');
  s = s.replace(/(href|src|data-embed)="(\/[^"/][^"]*|\/)"/g, (m, attr, url) => {
    const { file, hash } = target(url);
    let rel = relative(fromDir, join(out, file)).split('\\').join('/');
    return `${attr}="${rel || 'index.html'}${hash}"`;
  });
  writeFileSync(fileAbs, s);
}

(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.html')) rewrite(p);
  }
})(out);

// Fontes no CSS: /fonts/... → ../fonts/...
const cssPath = join(out, 'assets/app.css');
writeFileSync(cssPath, readFileSync(cssPath, 'utf8').replace(/url\('\/fonts\//g, "url('../fonts/"));
console.log('preview ok → abra preview/index.html');
