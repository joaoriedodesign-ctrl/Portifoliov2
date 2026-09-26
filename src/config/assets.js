// Registro único de imagens. Para trocar uma imagem (ou um placeholder),
// substitua o caminho (e, se mudar, a proporção) aqui — o layout reserva o espaço
// pelas dimensões declaradas, então nada se desloca.

export const assets = {
  avatar: { src: '/assets/placeholders/avatar.svg', width: 96, height: 96, placeholder: true },
  portrait: { src: '/assets/joao-riedo.webp', width: 960, height: 1200 },

  covers: {
    'multi-tenant-design-system': { src: '/assets/projects/multi-tenant-design-system/cover.webp', width: 1600, height: 1000 },
    'instituto-mais': { src: '/assets/projects/instituto-mais/cover.webp', width: 1600, height: 1000 },
    'dr-carlos-mattos': { src: '/assets/projects/dr-carlos-mattos/cover.webp', width: 1600, height: 1000 },
    'marina-alves': { src: '/assets/projects/marina-alves/cover.webp', width: 1600, height: 1000 },
  },

  // Fallback da área de demonstração (print do site) — usado se o site não carregar.
  demoFallback: {
    'instituto-mais': { src: '/assets/projects/instituto-mais/fallback.webp', width: 1400, height: 875 },
    'dr-carlos-mattos': { src: '/assets/projects/dr-carlos-mattos/fallback.webp', width: 1400, height: 875 },
    'marina-alves': { src: '/assets/projects/marina-alves/fallback.webp', width: 1400, height: 875 },
  },

  // Telas do Design System Multi-tenant (Play4tune), em pares mobile/desktop.
  dsScreens: {
    home: {
      mobile: { src: '/assets/projects/multi-tenant-design-system/screen-home-mobile.webp', width: 600, height: 1193 },
      desktop: { src: '/assets/projects/multi-tenant-design-system/screen-home-desktop.webp', width: 1400, height: 1021 },
    },
    gamepage: {
      mobile: { src: '/assets/projects/multi-tenant-design-system/screen-gamepage-mobile.webp', width: 600, height: 1190 },
      desktop: { src: '/assets/projects/multi-tenant-design-system/screen-gamepage-desktop.webp', width: 1400, height: 1019 },
    },
    'welcome-bonus': {
      mobile: { src: '/assets/projects/multi-tenant-design-system/screen-welcome-bonus-mobile.webp', width: 600, height: 1190 },
      desktop: { src: '/assets/projects/multi-tenant-design-system/screen-welcome-bonus-desktop.webp', width: 1400, height: 1019 },
    },
    storybook: { src: '/assets/projects/multi-tenant-design-system/storybook-components.webp', width: 884, height: 1182 },
  },

  // Imagens de compartilhamento 1200×630 (JPG), geradas por scripts/og.mjs.
  og: {
    default: '/og/default.jpg',
    'multi-tenant-design-system': '/og/multi-tenant-design-system.jpg',
    'instituto-mais': '/og/instituto-mais.jpg',
    'dr-carlos-mattos': '/og/dr-carlos-mattos.jpg',
    'marina-alves': '/og/marina-alves.jpg',
  },
};
