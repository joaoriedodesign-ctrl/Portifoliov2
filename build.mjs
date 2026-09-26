// Build estático: tokens → CSS, bundle JS, páginas PT/EN, SEO e redirecionamentos.
// Saída em dist/ (pronta para Vercel ou hospedagem Apache/Hostinger).
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, relative, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

import { allRoutes, outFile, redirects, path as routePath } from './src/lib/routes.js';
import { copy } from './src/content/copy.js';
import { projects, projectOrder } from './src/content/projects.js';
import { site } from './src/config/site.js';
import { setLang } from './src/components/primitives.js';
import { home, projectsPage, projectPage, aboutPage, contactPage, notFoundPage } from './src/pages/pages.js';

const root = fileURLToPath(new URL('.', import.meta.url));
const dist = join(root, 'dist');
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);

execFileSync('node', [join(root, 'scripts/build-tokens.mjs')], { stdio: 'inherit' });
if (!existsSync(join(root, 'public/assets/placeholders/cover-instituto-mais.svg'))) execFileSync('node', [join(root, 'scripts/placeholders.mjs')], { stdio: 'inherit' });

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(root, 'public'), dist, { recursive: true });

// Arquivos hospedados (sites independentes em /projects/..., PDFs) presentes neste build
const hosted = new Set();
(function walk(dir) {
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir)) {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) walk(full);
    else {
      const rel = '/' + relative(join(root, 'public'), full).split(sep).join('/');
      hosted.add(rel);
      if (f === 'index.html') hosted.add(rel.replace(/index\.html$/, ''));
    }
  }
})(join(root, 'public/projects'));

// CSS (ordem importa: tokens → base → componentes)
const cssOrder = ['tokens', 'base', 'layout', 'components', 'hero', 'depth', 'project', 'pages'];
const css = cssOrder.map((n) => readFileSync(join(root, `src/styles/${n}.css`), 'utf8')).join('\n');
mkdirSync(join(dist, 'assets'), { recursive: true });
writeFileSync(join(dist, 'assets/app.css'), css);

const js = await esbuild.build({ entryPoints: [join(root, 'src/client/main.js')], bundle: true, minify: true, format: 'iife', target: ['es2020'], write: false });
const jsText = js.outputFiles[0].text;
writeFileSync(join(dist, 'assets/app.js'), jsText);

const build = { css: `/assets/app.css?v=${hash(css)}`, js: `/assets/app.js?v=${hash(jsText)}`, hosted };

const render = { home, projects: projectsPage, project: projectPage, about: aboutPage, contact: contactPage };
const routes = allRoutes();
for (const r of routes) {
  setLang(r.lang);
  const ctx = { ...r, t: copy[r.lang], build, copyAll: copy };
  const htmlOut = render[r.key](ctx);
  const file = join(dist, outFile(r.path));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, htmlOut);
}
setLang('pt');
writeFileSync(join(dist, '404.html'), notFoundPage({ key: 'home', lang: 'pt', path: '/404', path404: true, t: copy.pt, build, copyAll: copy }));

// sitemap.xml com alternates hreflang
const buildDate = new Date().toISOString().slice(0, 10);
const abs = (p) => site.domain + p;
const alt = (r) => routePath(r.key, r.lang === 'pt' ? 'en' : 'pt', r.slug);
const urls = routes.map((r) => {
  const pt = r.lang === 'pt' ? r.path : alt(r);
  const en = r.lang === 'en' ? r.path : alt(r);
  return `  <url><loc>${abs(r.path)}</loc><lastmod>${buildDate}</lastmod>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${abs(pt)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${abs(en)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(pt)}"/>
  </url>`;
});
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`);
// robots.txt: tudo liberado, inclusive buscadores e assistentes de IA (liberação explícita
// para deixar a intenção clara). As cópias em /projects/ saem do índice via X-Robots-Tag.
const aiBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot'];
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\n# Assistentes e buscadores de IA\n${aiBots.map((b) => `User-agent: ${b}`).join('\n')}\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml\n`);

// llms.txt: resumo em Markdown para assistentes de IA (convenção llmstxt.org),
// gerado só a partir do conteúdo publicado no site.
function llmsSection(lang) {
  const t = copy[lang], a = t.about, L = lang === 'pt';
  const u = (key, slug) => abs(routePath(key, lang, slug));
  return [
    `## ${L ? 'Páginas' : 'Pages'} (${L ? 'português' : 'English'})`,
    `- [${t.meta.home.title}](${u('home')}): ${t.meta.home.description}`,
    `- [${t.meta.projects.title}](${u('projects')}): ${t.meta.projects.description}`,
    `- [${t.meta.about.title}](${u('about')}): ${t.meta.about.description}`,
    `- [${t.meta.contact.title}](${u('contact')}): ${t.meta.contact.description}`,
    '',
    `## ${L ? 'Projetos' : 'Projects'}`,
    ...projectOrder.map((s) => { const p = projects[s], c = p[lang]; return `- [${p.name}](${u('project', s)}) — ${c.category}, ${p.year}: ${c.summary}`; }),
    '',
    `## ${a.timelineTitle}`,
    ...a.timeline.map((x) => `- ${x.org} — ${x.role} (${x.period})`),
    '',
    `## ${L ? 'Formação' : 'Education'}`,
    ...a.education.map((x) => `- ${x.course} — ${x.org} (${x.period})`),
    ...(a.certifications || []).map((c) => `- ${c.name} — ${c.issuer}${c.url ? ` ([${a.verify}](${c.url}))` : ''}`),
    '',
    `## ${a.skillsTitle}`,
    a.skills.join(', '),
  ].join('\n');
}
const pt = copy.pt.home;
writeFileSync(join(dist, 'llms.txt'), [
  `# ${site.name} — ${site.role}`,
  '',
  `> ${pt.headline} ${pt.bio} Londrina, PR, Brasil.`,
  '',
  `- E-mail: ${site.contact.email}`,
  ...Object.entries(site.social).filter(([, v]) => v).map(([k, v]) => `- ${k[0].toUpperCase() + k.slice(1)}: ${v}`),
  `- Idiomas / Languages: português, English`,
  '',
  llmsSection('pt'),
  '',
  llmsSection('en'),
  '',
].join('\n'));
writeFileSync(join(dist, 'site.webmanifest'), JSON.stringify({ name: site.name, short_name: 'João Riedo', start_url: '/', display: 'browser', background_color: '#f4f4f0', theme_color: '#1236ff', icons: [{ src: '/favicon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }] }, null, 2));

// Redirecionamentos: Vercel + Apache (.htaccess) + _redirects (Netlify/Cloudflare)
// Cópias dos sites em /projects/ não devem ser indexadas (o original tem o próprio canonical).
writeFileSync(join(dist, 'vercel.json'), JSON.stringify({ cleanUrls: true, trailingSlash: false, redirects: redirects.map((r) => ({ source: r.from, destination: r.to, permanent: true })), headers: [{ source: '/projects/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] }] }, null, 2));
writeFileSync(join(dist, '_redirects'), redirects.map((r) => `${r.from} ${r.to} 301`).join('\n') + '\n');
writeFileSync(join(dist, '.htaccess'), `# Gerado por build.mjs
Options -MultiViews
ErrorDocument 404 /404.html
AddDefaultCharset UTF-8
AddCharset UTF-8 .txt .xml .webmanifest
RewriteEngine On

# Um único endereço: HTTPS e sem www
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^www\\. [NC]
RewriteRule ^ ${site.domain}%{REQUEST_URI} [R=301,L]

# Redirecionamentos permanentes (migração)
${redirects.map((r) => `RewriteRule ^${r.from.slice(1).replace(/[.-]/g, '\\$&')}/?$ ${r.to} [R=301,L]`).join('\n')}

# URLs sem barra final servem pasta/index.html — exceto os sites independentes em /projects/
DirectorySlash Off
# /sobre/ → /sobre (evita URL duplicada; o canonical já é sem barra)
RewriteCond %{REQUEST_URI} !^/projects/
RewriteRule ^(.+)/$ /$1 [R=301,L]
RewriteCond %{REQUEST_URI} !^/projects/
RewriteCond %{REQUEST_FILENAME} -d
RewriteCond %{REQUEST_FILENAME}/index.html -f
RewriteRule ^(.+?)/?$ /$1/index.html [L]
RewriteCond %{REQUEST_URI} ^/projects/[^/]+$
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^(.*)$ /$1/ [R=301,L]

<IfModule mod_headers.c>
  <If "%{REQUEST_URI} =~ m#^/projects/#">
    Header set X-Robots-Tag "noindex"
  </If>
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 week"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json application/xml application/manifest+json image/svg+xml
</IfModule>
`);

console.log(`build ok: ${routes.length} páginas + 404 · sites hospedados: ${[...hosted].filter((h) => /^\/projects\/[^/]+\/$/.test(h)).join(', ') || 'nenhum'}`);
