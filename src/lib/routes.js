// Mapa de rotas PT/EN. Cada página tem uma chave; o seletor de idioma usa
// a mesma chave para levar à página equivalente.
import { projectOrder } from '../content/projects.js';

const base = {
  home: { pt: '/', en: '/en' },
  projects: { pt: '/projetos', en: '/en/projects' },
  about: { pt: '/sobre', en: '/en/about' },
  contact: { pt: '/contato', en: '/en/contact' },
};

export const langs = ['pt', 'en'];

export function path(key, lang, slug) {
  if (key === 'project') return `${base.projects[lang]}/${slug}`;
  return base[key][lang];
}

// Todas as páginas geradas: { key, lang, slug?, path }
export function allRoutes() {
  const list = [];
  for (const lang of langs) {
    for (const key of ['home', 'projects', 'about', 'contact']) list.push({ key, lang, path: path(key, lang) });
    for (const slug of projectOrder) list.push({ key: 'project', lang, slug, path: path('project', lang, slug) });
  }
  return list;
}

export const other = (lang) => (lang === 'pt' ? 'en' : 'pt');

// Arquivo de saída para uma rota ("/" → index.html, "/sobre" → sobre/index.html)
export const outFile = (p) => (p === '/' ? 'index.html' : `${p.replace(/^\//, '')}/index.html`);

// Redirecionamentos permanentes (migração do site anterior)
export const redirects = [
  { from: '/case-studies', to: '/projetos' },
  ...projectOrder.map((slug) => ({ from: `/case-studies/${slug}`, to: `/projetos/${slug}` })),
  { from: '/case-studies/zentupet', to: '/projetos' },
  // Rotas em inglês da v1 (Next.js): /en/case-studies, /en/sobre, /en/contato
  { from: '/en/case-studies', to: '/en/projects' },
  ...projectOrder.map((slug) => ({ from: `/en/case-studies/${slug}`, to: `/en/projects/${slug}` })),
  { from: '/en/case-studies/zentupet', to: '/en/projects' },
  { from: '/en/sobre', to: '/en/about' },
  { from: '/en/contato', to: '/en/contact' },
];
