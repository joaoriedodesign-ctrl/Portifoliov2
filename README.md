# Portfólio v2 — João Riedo

Site estático bilíngue (PT na raiz, EN em `/en`), gerado por um build Node sem framework. Conteúdo, configuração e tokens ficam separados da apresentação.

## Ver sem instalar nada

Abra `preview/index.html` com dois cliques. É uma cópia do site com links relativos, feita para abrir direto no navegador. Para gerar de novo: `npm run preview`.

## Rodar

```bash
npm install
npm run dev        # build + servidor local em http://localhost:4321
npm run verify     # testes Playwright (com o servidor rodando)
```

Outros scripts: `npm run build` (gera `dist/`), `npm run tokens`, `npm run placeholders`, `npm run hero-layout`, `npm run og`.

Publicação: suba o conteúdo de `dist/`. Ele já traz `vercel.json` (Vercel), `.htaccess` (Apache/Hostinger) e `_redirects` (Netlify/Cloudflare). Nada foi publicado.

## Onde editar

| O quê | Arquivo |
|---|---|
| Textos de interface e das páginas (PT/EN) | `src/content/copy.js` |
| Projetos (fatos, contexto, decisões, números) | `src/content/projects.js` |
| WhatsApp, e-mail, LinkedIn, Behance, Dribbble, CVs, analytics | `src/config/site.js` |
| Imagens (caminho + dimensões reservadas) | `src/config/assets.js` |
| Rotas e redirecionamentos 301 | `src/lib/routes.js` |
| Composição final das letras do hero (vinda do Figma) | `scripts/data/hero-figma.json` → `scripts/hero-layout.mjs` → `src/components/hero-layout.json` |
| Parâmetros da sequência 3D (perspectiva, deslocamento, fade) | `CONFIG` em `src/client/depth-stack.js` |

- **Imagens reais:** coloque o arquivo em `public/assets/…` e troque o caminho em `assets.js`. Se a proporção mudar, atualize `width`/`height`.
- **Sites dos projetos:** ficam em `public/projects/<slug>/` (Instituto MAIS, Dr. Carlos Mattos, Marina Alves) e aparecem embutidos na página de cada projeto. Para atualizar um site, substitua a pasta dele. A cópia do Instituto MAIS vai sem o `.htaccess` da clínica, que redirecionaria tudo para o domínio dela. As pastas em `/projects/` saem com `noindex`.
- **Ordem dos projetos:** `projectOrder` em `src/content/projects.js`.
- **Design System Multi-tenant:** conteúdo trazido da v1 (`lib/case-studies.ts`). No lugar da demonstração, mostra telas reais em pares desktop/mobile (`assets.dsScreens`).
- **Demonstração:** `demo.embedUrl` aponta para a cópia local. O iframe só é criado quando a área se aproxima da tela, renderiza na largura real (1440 px ou 390 px) reduzida para caber e roda com sandbox sem pop-ups: links de WhatsApp e downloads dentro da demo não abrem. Se não carregar, entra o fallback (print + link). Estados para teste: `?demo=loading` e `?demo=unavailable`.

## Tokens (Figma → código)

- `tokens/figma.tokens.json` espelha as coleções **Color / Primitive**, **Color / Semantic** (modos Light e Dark), **Typography / Primitive** e **Typography / Semantic**, com os mesmos nomes, valores e aliases.
- `scripts/build-tokens.mjs` gera `src/styles/tokens.css`: primitivos viram valores (`--color-brand-600: #1236ff`) e semânticos viram referências (`--color-primary-default: var(--color-brand-600)`). A relação Semantic → Primitive continua a mesma.
- Os componentes usam apenas os semânticos (`--color-background`, `--color-text-secondary`, `--heading-h1-font-size`…).
- O modo Dark foi preservado em `:root[data-theme="dark"]`, mas não está ativo, porque a direção visual pedida é clara.
- Fonte única: Outfit. O override dos estilos Display/Heading (Righteous no Figma) fica em `tokens/extensions.tokens.json`.
- `tokens/extensions.tokens.json` reúne o que **não existe no Figma**: espaçamento, raio, borda, sombra, foco, seleção, texto sobre a cor primária e movimento. Veja o `DESIGN.md`.

## SEO e busca por IA

Tudo é gerado por `build.mjs` para o domínio em `src/config/site.js` (`https://joaoriedo.com`):

- `canonical`, `hreflang` (pt-BR/en/x-default), Open Graph e Twitter Card com URLs absolutas; um `h1` por página e `alt` em todas as imagens.
- JSON-LD em `@graph` (`src/lib/schema.js`): `WebSite` + `Person` com `@id` fixo, em todas as páginas; `ProfilePage` em Sobre, `CollectionPage` + `ItemList` em Projetos, `CreativeWork` + `BreadcrumbList` em cada projeto.
- `sitemap.xml` com `lastmod` e alternates; `robots.txt` liberando buscadores e assistentes de IA (GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended…).
- `llms.txt`: resumo em Markdown (PT e EN) de quem é, projetos, trajetória, formação e links, gerado a partir do conteúdo do site.
- Conteúdo 100% no HTML estático (sem depender de JS), o que é o que os rastreadores de IA conseguem ler.
- `.htaccess`: HTTPS e domínio sem www, remove barra final, compressão e cache. Na Vercel, `vercel.json` cobre redirecionamentos e `noindex` das cópias; o redirecionamento de `www` é configurado no painel de domínios.

Depois de publicar: cadastrar o domínio no Google Search Console e no Bing Webmaster Tools (o Bing alimenta o ChatGPT Search e o Copilot) e enviar o `sitemap.xml`.
