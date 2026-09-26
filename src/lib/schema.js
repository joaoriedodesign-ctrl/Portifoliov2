// Dados estruturados (schema.org, JSON-LD) em um @graph por página.
// Pessoa e site têm @id fixos, para buscadores e IAs ligarem todas as páginas à
// mesma entidade. Só usa dados já confirmados em config/site.js e content/.
import { site } from '../config/site.js';
import { assets } from '../config/assets.js';
import { copy } from '../content/copy.js';
import { projects, projectOrder } from '../content/projects.js';
import { path } from './routes.js';

const D = site.domain;
const abs = (p) => D + (p === '/' ? '/' : p);
export const ids = { person: `${D}/#person`, website: `${D}/#website` };
const inLang = (lang) => (lang === 'en' ? 'en' : 'pt-BR');

export function person(lang) {
  const a = copy[lang].about;
  return {
    '@type': 'Person',
    '@id': ids.person,
    name: site.name,
    jobTitle: site.role,
    url: abs(path('about', lang)),
    image: { '@type': 'ImageObject', url: D + assets.portrait.src, width: assets.portrait.width, height: assets.portrait.height },
    worksFor: { '@type': 'Organization', name: 'Multibet' },
    address: { '@type': 'PostalAddress', addressLocality: 'Londrina', addressRegion: 'PR', addressCountry: 'BR' },
    alumniOf: a.education.map((e) => ({ '@type': 'EducationalOrganization', name: e.org })),
    knowsAbout: ['Product Design', 'Design Systems', 'UX Design', 'UI Design', ...a.skills],
    knowsLanguage: ['pt-BR', 'en'],
    hasCredential: (a.certifications || []).filter((c) => c.url).map((c) => ({ '@type': 'EducationalOccupationalCredential', name: c.name, url: c.url, recognizedBy: { '@type': 'Organization', name: c.issuer } })),
    email: site.contact.email ? `mailto:${site.contact.email}` : undefined,
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

function website(lang) {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: abs('/'),
    name: `${site.name} — ${site.role}`,
    inLanguage: ['pt-BR', 'en'],
    publisher: { '@id': ids.person },
    about: { '@id': ids.person },
  };
}

function webPage(ctx, meta, type = 'WebPage', extra = {}) {
  return {
    '@type': type,
    '@id': `${abs(ctx.path)}#webpage`,
    url: abs(ctx.path),
    name: meta.title,
    description: meta.description,
    inLanguage: inLang(ctx.lang),
    isPartOf: { '@id': ids.website },
    about: { '@id': ids.person },
    ...extra,
  };
}

function crumbs(ctx, items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(p) })),
  };
}

export function graphFor(ctx, meta) {
  const { key, lang, t } = ctx;
  const g = [website(lang), person(lang)];
  const home = [site.name, path('home', lang)];
  if (key === 'home') g.push(webPage(ctx, meta, 'WebPage', { mainEntity: { '@id': ids.person } }));
  else if (key === 'about') g.push(webPage(ctx, meta, 'ProfilePage', { mainEntity: { '@id': ids.person } }), crumbs(ctx, [home, [t.ui.nav.about, ctx.path]]));
  else if (key === 'contact') g.push(webPage(ctx, meta, 'ContactPage'), crumbs(ctx, [home, [t.ui.nav.contact, ctx.path]]));
  else if (key === 'projects') {
    g.push(webPage(ctx, meta, 'CollectionPage', {
      mainEntity: { '@type': 'ItemList', itemListElement: projectOrder.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(path('project', lang, s)), name: projects[s].name })) },
    }), crumbs(ctx, [home, [t.ui.nav.projects, ctx.path]]));
  } else if (key === 'project') {
    const p = projects[ctx.slug], c = p[lang], cover = assets.covers[ctx.slug];
    const work = {
      '@type': 'CreativeWork',
      '@id': `${abs(ctx.path)}#work`,
      name: p.name,
      genre: c.category,
      dateCreated: String(p.year),
      description: c.summary,
      inLanguage: inLang(lang),
      url: abs(ctx.path),
      image: cover ? { '@type': 'ImageObject', url: D + cover.src, width: cover.width, height: cover.height } : undefined,
      creator: { '@id': ids.person },
      author: { '@id': ids.person },
      ...(p.live && p.live.external ? { sameAs: p.live.href } : {}),
    };
    g.push(webPage(ctx, meta, 'WebPage', { mainEntity: { '@id': work['@id'] } }), work, crumbs(ctx, [home, [t.ui.nav.projects, path('projects', lang)], [p.name, ctx.path]]));
  }
  return { '@context': 'https://schema.org', '@graph': g };
}
