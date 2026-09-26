// Páginas: compõem componentes a partir do conteúdo. Nenhum texto fixo aqui.
import { html, raw } from '../lib/html.js';
import { path } from '../lib/routes.js';
import { projects, projectOrder } from '../content/projects.js';
import { site } from '../config/site.js';
import { assets } from '../config/assets.js';
import { page } from '../components/layout.js';
import { hero } from '../components/hero.js';
import { projectSequence } from '../components/projects.js';
import { contactForm } from '../components/contact-form.js';
import { demoViewer } from '../components/demo-viewer.js';
import { screenGallery } from '../components/screen-gallery.js';
import { button, linkOrPending, media } from '../components/primitives.js';
import { icons } from '../components/icons.js';

export function home(ctx) {
  const { t, lang } = ctx;
  const main = html`${hero(ctx)}
<section class="selected" aria-labelledby="selected-title">
  ${projectSequence(ctx, { level: 3, id: 'selecionados', title: t.home.selectedTitle, titleId: 'selected-title' })}
  <div class="container selected__foot">
    <a class="text-link" href="${path('projects', lang)}">${t.home.allProjects}${icons.arrowRight()}</a>
  </div>
</section>
${contactForm(ctx, { id: 'home-contato' })}`;
  return page(ctx, t.meta.home, main, { bodyClass: 'page-home' });
}

export function projectsPage(ctx) {
  const { t } = ctx;
  const main = html`${projectSequence(ctx, { level: 2, id: 'todos-projetos', title: t.projects.title, titleId: 'projects-title', titleTag: 'h1' })}`;
  return page(ctx, t.meta.projects, main, { bodyClass: 'page-projects' });
}

export function projectPage(ctx) {
  const { t, lang, slug } = ctx;
  const p = projects[slug];
  const c = p[lang];
  const pt = t.project;
  const hosted = ctx.build.hosted; // arquivos presentes em public/ neste build
  const liveAvailable = !!p.live && (p.live.external || hosted.has(p.live.href));
  ctx.liveHref = liveAvailable ? p.live.href : null;
  const idx = projectOrder.indexOf(slug);
  const nextSlug = projectOrder[(idx + 1) % projectOrder.length];
  const next = projects[nextSlug];
  const factKeys = ['role', 'duration', 'platform', 'team'];

  const extras = p.extras.map((x) => {
    const available = !x.hosted || hosted.has(x.href);
    return button({ href: available ? x.href : null, label: available ? pt.mediaKit : pt.mediaKitUnavailable, variant: 'secondary', icon: 'download', disabled: !available, attrs: available ? { download: '' } : {} });
  });

  const main = html`<article class="project" aria-labelledby="project-title">
  <header class="project__head container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol><li><a href="${path('projects', lang)}">${pt.breadcrumb}</a></li><li><span aria-current="page">${p.name}</span></li></ol>
    </nav>
    <p class="project__meta">${c.category} · ${p.year}</p>
    <h1 class="project__title" id="project-title">${p.name}</h1>
    ${p.concept ? html`<p class="badge badge--strong">${t.ui.conceptBadge}</p>` : ''}
    <p class="project__subtitle">${c.subtitle}</p>
    <dl class="facts">
      ${factKeys.map((k) => html`<div class="facts__item"><dt>${pt.facts[k]}</dt><dd>${c.facts[k] ?? html`<span class="pending">${t.ui.pending}</span>`}</dd></div>`)}
    </dl>
    <div class="project__actions">
      ${!p.live ? '' : liveAvailable
        ? button({ href: p.live.href, label: pt.live, variant: 'primary', icon: 'arrowUpRight', external: true })
        : button({ label: pt.live, disabled: true, disabledNote: pt.liveUnavailable })}
      ${extras}
    </div>
  </header>

  <div class="container">${p.demo ? demoViewer(ctx, slug, p) : screenGallery(ctx, slug, p)}</div>

  <section class="project__section container" aria-labelledby="ctx-title">
    <h2 class="section-title" id="ctx-title">${pt.contextTitle}</h2>
    <p class="prose">${c.context}</p>
  </section>

  <section class="project__section container" aria-labelledby="dec-title">
    <h2 class="section-title" id="dec-title">${pt.decisionsTitle}</h2>
    <ol class="decisions">
      ${c.decisions.map((d, i) => html`<li class="decisions__item"><span class="decisions__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3 class="decisions__title">${d.title}</h3><p class="decisions__text">${d.text}</p></li>`)}
    </ol>
  </section>

  <section class="project__section container" aria-labelledby="num-title">
    <h2 class="section-title" id="num-title">${pt.numbersTitle}</h2>
    ${c.numbersNote === null ? '' : html`<p class="section-note">${c.numbersNote ?? pt.numbersNote}</p>`}
    <dl class="numbers">
      ${c.numbers.map((n) => html`<div class="numbers__item"><dt>${n.label}</dt><dd>${n.value}</dd></div>`)}
    </dl>
  </section>

  <nav class="next container" aria-label="${pt.next}">
    <a class="next__link" href="${path('project', lang, nextSlug)}">
      <span class="next__label">${pt.next}</span>
      <span class="next__name">${next.name}</span>
      <span class="next__meta">${next[lang].category} · ${next.year}</span>
      ${media(assets.covers[nextSlug], '', { cls: 'next__img' })}
      ${icons.arrowRight()}
    </a>
  </nav>
</article>
${contactForm(ctx, { id: 'projeto-contato' })}`;
  return page(ctx, { title: `${p.name} — ${c.category} · João Riedo`, description: c.summary }, main, { bodyClass: 'page-project' });
}

export function aboutPage(ctx) {
  const { t, lang } = ctx;
  const a = t.about;
  const cv = (k, label) => button({ href: site.cv[k], label, variant: 'secondary', icon: 'download', disabled: !site.cv[k], disabledNote: !site.cv[k] && a.cvUnavailable, attrs: site.cv[k] ? { download: '' } : {} });
  const main = html`<header class="about-hero container">
  <div class="about-hero__copy">
    <h1 class="page-title">${a.title}</h1>
    <p class="lead">${a.intro}</p>
  </div>
  <figure class="about-hero__photo">${media(assets.portrait, a.photoAlt, { priority: true })}</figure>
</header>

<section class="about-section container about-focus" aria-labelledby="focus-title">
  <h2 class="about-focus__title" id="focus-title">${a.focusTitle}</h2>
  <p class="prose">${a.focusText}</p>
</section>

<section class="about-section container" aria-labelledby="phil-title">
  <h2 class="section-title" id="phil-title">${a.philosophyTitle}</h2>
  <div class="philosophy">${a.philosophy.map((p) => html`<p>${p}</p>`)}</div>
</section>

<section class="about-section container" aria-labelledby="diff-title">
  <h2 class="section-title" id="diff-title">${a.differentialsTitle}</h2>
  <ul class="diffs">${a.differentials.map((d) => html`<li class="diffs__item"><h3 class="diffs__title">${d.title}</h3><p>${d.text}</p></li>`)}</ul>
</section>

<section class="about-section container" aria-labelledby="time-title">
  <h2 class="section-title" id="time-title">${a.timelineTitle}</h2>
  <ol class="timeline">${a.timeline.map((r) => html`<li class="timeline__row"><span class="timeline__org">${r.org}</span><span class="timeline__role">${r.role}</span><span class="timeline__period">${r.period}</span></li>`)}</ol>
</section>

<section class="about-section container about-split" aria-labelledby="edu-title">
  <div>
    <h2 class="section-title" id="edu-title">${a.educationTitle}</h2>
    <ul class="timeline timeline--compact">${a.education.map((e) => html`<li class="timeline__row"><span class="timeline__org">${e.org}</span><span class="timeline__role">${e.course}</span><span class="timeline__period">${e.period}</span></li>`)}</ul>
    <h3 class="label-title skills-title">${a.skillsTitle}</h3>
    <ul class="tags">${a.skills.map((sk) => html`<li class="tag">${sk}</li>`)}</ul>
  </div>
  <div>
    <h2 class="section-title" id="cert-title">${a.certificationsTitle}</h2>
    <ul class="timeline timeline--compact">${a.certifications.map((c) => html`<li class="timeline__row"><span class="timeline__org">${c.name}</span><span class="timeline__role">${c.issuer}</span><span class="timeline__period">${linkOrPending({ href: c.url, label: a.verify, pendingLabel: t.ui.linkPending })}</span></li>`)}</ul>
  </div>
</section>

<section class="about-section container about-contact" aria-labelledby="direct-title">
  <div>
    <h2 class="section-title" id="direct-title">${a.contactTitle}</h2>
    <p class="prose">${a.contactText}</p>
    <ul class="channel-list">
      <li>${linkOrPending({ href: site.contact.email && `mailto:${site.contact.email}`, label: 'E-mail', pendingLabel: t.ui.linkPending, external: false })}</li>
      <li>${linkOrPending({ href: site.social.linkedin, label: 'LinkedIn', pendingLabel: t.ui.linkPending })}</li>
      <li>${linkOrPending({ href: site.contact.whatsapp && `tel:+${site.contact.whatsapp}`, label: site.contact.phoneDisplay || (lang === 'en' ? 'Phone' : 'Telefone'), pendingLabel: t.ui.linkPending, external: false })}</li>
    </ul>
    ${button({ href: path('contact', lang), label: a.contactCta, variant: 'primary' })}
  </div>
  <div>
    <h2 class="section-title" id="cv-title">${a.cvTitle}</h2>
    <div class="cv-actions">${cv('pt', a.cvPt)}${cv('en', a.cvEn)}</div>
  </div>
</section>`;
  return page(ctx, t.meta.about, main, { bodyClass: 'page-about' });
}

export function contactPage(ctx) {
  const { t, lang } = ctx;
  const main = html`<div class="contact-page container">
  <a class="back-link" href="${path('home', lang)}" data-back>${icons.arrowLeft()}${t.ui.back}</a>
  <h1 class="page-title">${t.contact.title}</h1>
  <p class="lead">${t.contact.text}</p>
</div>
${contactForm(ctx, { heading: false, id: 'contato' })}
<div class="container contact-page__channels">
  <h2 class="label-title">${t.contact.otherChannels}</h2>
  <ul class="channel-list">
    <li>${linkOrPending({ href: site.contact.email && `mailto:${site.contact.email}`, label: 'E-mail', pendingLabel: t.ui.linkPending, external: false })}</li>
    <li>${linkOrPending({ href: site.social.linkedin, label: 'LinkedIn', pendingLabel: t.ui.linkPending })}</li>
  </ul>
</div>`;
  return page(ctx, t.meta.contact, main, { showFooter: false, bodyClass: 'page-contact' });
}

export function notFoundPage(ctx) {
  const pt = ctx.copyAll.pt.notFound;
  const en = ctx.copyAll.en.notFound;
  const main = html`<div class="not-found container">
  <p class="not-found__code" aria-hidden="true">404</p>
  <h1 class="page-title">${pt.title}</h1>
  <p class="lead">${pt.text}</p>
  ${button({ href: '/projetos', label: pt.cta })}
  <div class="not-found__en" lang="en">
    <h2 class="section-title">${en.title}</h2>
    <p>${en.text} <a class="text-link" href="/en/projects">${en.cta}</a></p>
  </div>
</div>`;
  return page(ctx, ctx.t.meta.notFound, main, { bodyClass: 'page-404' });
}
