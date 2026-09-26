# DESIGN — Portfólio v2

## Fonte da verdade
Arquivo Figma **PORTIFÓLIO** (`piyW12d3fVOGIyEcmxFqd2`). As variáveis locais foram lidas via Plugin API em 25/09/2026. As variáveis usadas no frame do sitemap (`brand/primary #b8492f`, DM Sans, Sora…) pertencem à paleta antiga do sitemap e **não** foram usadas.

## Coleções do Figma implementadas
| Coleção | Modos | Variáveis | CSS |
|---|---|---|---|
| Color / Primitive | Default | brand/50–950, neutral/50–950, base/white, base/black | `--color-brand-600`, `--color-neutral-50`… |
| Color / Semantic | Light, Dark | Background, Background-border, Surface-Primary(+Border), Surface-Secondary(+Border), Text-primary, Text-Secondary, Text-disabled, Text-special, Primary-default/hovered, Secondary-default/hovered | `--color-background: var(--color-neutral-50)`… |
| Typography / Primitive | Default | font-family (Outfit, Righteous), font-weight, font-size/12–56, line-height/16–64 | `--font-size-56: 3.5rem`… |
| Typography / Semantic | Default | Display, Heading H1–H6, Body L/M/S, Label, Caption, Button (18 estilos × 4 propriedades) | `--heading-h1-font-size: var(--font-size-40)`… |

Tipografia: **o site usa somente Outfit** (decisão de 25/09/2026). O Figma define Righteous Regular para Display e Heading; no código, a coleção `Typography / Semantic (override do código)` redireciona `font-family` desses estilos para `font-family/Outfit` e o peso para `font-weight/bold` (Display, H1, H2) ou `font-weight/semibold` (H3–H6). Tamanhos e alturas de linha continuam os do Figma. As letras do hero usam Display Large (Outfit Bold). Para manter o Figma em sincronia, atualize lá os estilos Display/Heading para Outfit com esses pesos.

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
- **Hero:** sem caixa. As letras de PORTFÓLIO são os contornos em Outfit Black exportados do Figma (frames 227:3 desktop e 227:46 mobile), preenchidas com `Color/Primary-default` e sangrando pela direita e pela base. Como são vetores, não dependem do peso 900 da fonte (o sistema tipográfico do site continua sem um token Black). `scripts/hero-layout.mjs` lê `scripts/data/hero-figma.json` e gera `hero-layout.json` com centro, rotação e contorno de cada letra, mais o recorte ("palco") de cada layout. Sequência: as letras caem primeiro (WAAPI, aceleração, rebote amortecido e empurrão nas letras de apoio) e os textos entram em seguida, em cascata. Sem JS ou com movimento reduzido, tudo aparece já na composição final; foco por teclado no hero revela os textos na hora; failsafe de 4 s.
- **Projetos:** perspectiva CSS por card (mesmo ponto de fuga), com fila ao fundo mais alta e menor, card ativo quase frontal e card anterior saindo por baixo. O movimento é guiado pelo scroll nativo.
