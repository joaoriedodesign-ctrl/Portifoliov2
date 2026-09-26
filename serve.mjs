// Servidor local de visualização do dist/ (sem dependências).
// Imita a hospedagem: URLs limpas, redirecionamentos 301 e 404.html.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { redirects } from './src/lib/routes.js';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'dist');
const port = Number(process.env.PORT || 4321);
const types = { '.webp': 'image/webp', '.woff': 'font/woff', '.ico': 'image/x-icon', '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.pdf': 'application/pdf', '.webmanifest': 'application/manifest+json' };

async function file(p) { try { const s = await stat(p); return s.isFile() ? p : null; } catch { return null; } }

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  let p = decodeURIComponent(url.pathname);
  const r = redirects.find((x) => x.from === p.replace(/\/$/, ''));
  if (r) { res.writeHead(301, { Location: r.to }); return res.end(); }
  if (p.length > 1 && p.endsWith('/') && !p.startsWith('/projects/')) { res.writeHead(301, { Location: p.slice(0, -1) + url.search }); return res.end(); }
  const safe = normalize(p).replace(/^(\.\.[/\\])+/, '');
  const found = (await file(join(root, safe))) || (await file(join(root, safe, 'index.html')));
  if (!found) {
    res.writeHead(404, { 'Content-Type': types['.html'] });
    return res.end(await readFile(join(root, '404.html')));
  }
  res.writeHead(200, { 'Content-Type': types[extname(found)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  res.end(await readFile(found));
}).listen(port, () => console.log(`http://localhost:${port}`));
