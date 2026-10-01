# DESIGN — Portfólio v2

## Fonte da verdade
Arquivo Figma **PORTIFÓLIO** (`piyW12d3fVOGIyEcmxFqd2`). As variáveis locais foram lidas via Plugin API em 25/09/2026. As variáveis usadas no frame do sitemap (`brand/primary #b8492f`, DM Sans, Sora…) pertencem à paleta antiga do sitemap e **não** foram usadas.

## Coleções do Figma implementadas
| Coleção | Modos | Variáveis | CSS |
|---|---|---|---|
| Color / Primitive | Default | brand/50–950, neutral/50–950, base/white, base/black | `--color-brand-600`, `--color-neutral-50`… |
| Color / Primitive (badges) | Default | violet, green, red, yellow, teal, pink (100/200/800/900) | `--color-violet-100`… |
| Color / Semantic | Light, Dark | Badge/<Azul, Violeta, Verde, Vermelho, Amarelo, Verde-água, Rosa>/Background e /Text, Background, Background-border, Surface-Primary(+Border), Surface-Secondary(+Border), Text-primary, Text-Secondary, Text-disabled, Text-special, Primary-default/hovered, Secondary-default/hovered | `--color-background: var(--color-neutral-50)`… |
| Typography / Primitive | Default | font-family (Outfit, Righteous), font-weight, font-size/12–56, line-height/16–64 | `--font-size-56: 3.5rem`… |
| Typography / Semantic | Default | Display, Heading H1–H6, Body L/M/S, Label, Caption, Button (18 estilos × 4 propriedades) | `--heading-h1-font-size: var(--font-size-40)`… |

Tipografia: **o site usa somente Outfit** (decisão de 25/09/2026). O Figma define Righteous Regular para Display e Heading; no código, a coleção `Typography / Semantic (override do código)` redireciona `font-family` desses estilos para `font-family/Outfit` e o peso para `font-weight/bold` (Display, H1, H2) ou `font-weight/semibold` (H3–H6). Tamanhos e alturas de linha continuam os do Figma. Para manter o Figma em sincronia, atualize lá os estilos Display/Heading para Outfit com esses pesos.

Uso das cores: o fundo usa `Color/Background` (neutral/50, #F4F4F0), a assinatura usa `Color/Primary-default` (brand/600, #1236FF), o texto usa `Color/Text-primary` (neutral/950) e as divisórias usam `Color/Background-border` (neutral/300).

## Extensões criadas no código (não existem no Figma)
- **Space / Primitive** `space/0…160` e **Space / Semantic** (`Gutter-*`, `Stack-*`, `Section-*`)
- **Shape / Primitive** `radius/0…full`, `border-width/1–2` e **Shape / Semantic** (`Radius/Control`, `Field`, `Media`, `Block`, `Border/Hairline`, `Border/Focus`)
- **Color / Semantic (extensão)**: `On-primary` → base/white, `On-primary-secondary` → brand/100, `Focus-ring` → brand/600, `Selection` → brand/100, `Shadow` → neutral/950 (todas apontam para primitivos já existentes)
- **Motion** `duration/150/350/600` e `easing/out-expo`, `easing/in-out`, fora do DS por serem valores de animação

Se forem aprovadas, recrie essas variáveis no Figma com os mesmos nomes.

## Contraste verificado
| Par | Contraste |
|---|---|
| Texto branco sobre brand/600 | 7,0:1 |
| brand/100 sobre brand/600 | 5,7:1 |
| Text-Secondary sobre Background | 5,2:1 |
| Text-special sobre Background | 8,2:1 |
| Text-primary sobre Background | 14,8:1 |

## Assinaturas
- **Hero (desde 01/10/2026):** a palavra PORTFÓLIO saiu e no lugar entrou uma pilha de badges de competência. Cada badge usa o componente **Badge de competência** do Figma (291:1320): Label/Medium e padding 6/14/6/12, com raio total e as cores `Color/Badge/<cor>/Background` e `/Text`. São 7 categorias e 43 palavras-chave, tiradas das Competências Técnicas do CV (`src/content/skills.js`). As badges são uma lista `<ul>` no HTML, então leitores de tela e buscadores leem as competências. Com JS e movimento permitido, `client/hero-pile.js` carrega o matter-js sob demanda (`assets/physics.js`, só na home). As badges caem do topo do hero intercalando as categorias, empilham no palco e os textos entram depois. Com mouse, dá para arrastar e arremessar. No toque, o gesto continua sendo a rolagem da página. A simulação adormece quando a pilha assenta e pausa fora da tela. Sem JS, com movimento reduzido ou se o motor não carregar, o CSS monta uma pilha estática levemente inclinada. No mobile e no tablet o palco começa 48 px abaixo do CTA e mostra todas as badges. A altura dele é a da pilha: o `hero-pile.js` simula a queda antes de animar (as contas são idênticas), fixa essa altura e depois repete a mesma queda na tela.
  - **Propostas novas (não existem no Figma):** (1) **IA Aplicada usa `Color/Badge/Céu`** (sky/100 · sky/800; Dark sky/900 · sky/200) em vez de Vermelho, porque vermelho lê como erro. Os tokens estão em `extensions.tokens.json`, e o Figma deveria ganhar a cor e a variante. (2) **Tamanho Hero da badge** = badge × 1,4 no desktop e × 1,15 no tablet (`--skill-scale`), para a badge ter peso ao lado do H1.
  - **Contraste:** a descrição do componente no Figma diz ≥ 7:1, mas só Azul (8,9:1) e Violeta (7,6:1) chegam lá. Verde, Amarelo, Verde-água, Rosa e Céu ficam entre 6,4 e 6,7:1: passam no AA e não chegam ao AAA. Vale corrigir a descrição no Figma ou escurecer o texto para o tom 900.
  - Os arquivos das letras (`client/hero-fall.js`, `components/hero-layout.json`, `scripts/hero-layout.mjs`, `scripts/data/hero-figma.json`) não são mais usados e podem ser apagados.
- **Revisão de 01/10/2026 (Figma, seção 283:739):** a Home perdeu a linha "João Riedo / Product Designer" do hero, ganhou a bio nova e a seção **Quem já trabalhou comigo** (componente Depoimento 289:1154: Avatar com iniciais, nome, cargo, aspas em Primary-default e texto em Body/Large). Os depoimentos ficam num carrossel com scroll nativo e scroll-snap, com 2 por vez no desktop e 1 no mobile, e os botões vêm de `client/carousel.js`. A seção "Vamos conversar sobre o seu projeto?" e o link "Ver todos os projetos" saíram da Home. A página **Projetos** virou uma grade de capas 2 × 2 (1 coluna no mobile), sem texto visível; o nome do projeto fica no alt e no link. O **Contato** perdeu o link "Voltar", e no celular o botão fica centralizado. O rodapé usa o texto novo do Figma. A página **Sobre** segue o CV base (`joao-riedo-cv-base-pt.docx`): trajetória com uma linha de destaque por empresa, Multibet de fev a set/2026, competências do CV, idiomas e a certificação CCUSA.
- **Tom de voz (01/10/2026):** os textos narrativos do site ficam na primeira pessoa do passado ("Estruturei…", "Liderei…"). As exceções são os convites ao contato, como "Me conte sua ideia", os rótulos de interface e os depoimentos de terceiros. As páginas de projeto seguem **Desafio → Solução → Resultado** (`challenge`, `solution.steps` e `result` em `src/content/projects.js`) e não têm mais o formulário de contato no fim.
- **Projetos:** perspectiva CSS por card (mesmo ponto de fuga), com fila ao fundo mais alta e menor, card ativo quase frontal e card anterior saindo por baixo. O movimento é guiado pelo scroll nativo.
