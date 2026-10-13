// Registro único de imagens. Para trocar uma imagem (ou um placeholder),
// substitua o caminho (e, se mudar, a proporção) aqui — o layout reserva o espaço
// pelas dimensões declaradas, então nada se desloca.

export const assets = {
  avatar: { src: '/assets/placeholders/avatar.svg', width: 96, height: 96, placeholder: true },
  portrait: { src: '/assets/joao-riedo.webp', width: 960, height: 1200 },

  covers: {
    'multi-tenant-design-system': { src: '/assets/projects/multi-tenant-design-system/cover.webp', width: 1600, height: 1000 },
    'instituto-mais': { src: '/assets/projects/instituto-mais/cover.webp', width: 1600, height: 1000 },
    'retention-system': { src: '/assets/projects/retention-system/cover.webp', width: 1600, height: 1000 },
    'exclusive-games': { src: '/assets/projects/exclusive-games/cover.webp', width: 1600, height: 1000 },
  },

  // Fallback da área de demonstração (print do site) — usado se o site não carregar.
  demoFallback: {
    'instituto-mais': { src: '/assets/projects/instituto-mais/fallback.webp', width: 1400, height: 875 },
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

  // Telas mobile dos cases de gamificação (Play4tune), exportadas do Figma em 2x (582 px de
  // largura). As chaves batem com `screens` em src/content/projects.js.
  mobileScreens: {
    'retention-system': {
      'hub': { src: '/assets/projects/retention-system/screen-hub.webp', width: 582, height: 2824 },
      'missions': { src: '/assets/projects/retention-system/screen-missions.webp', width: 582, height: 2314 },
      'missions-expanded': { src: '/assets/projects/retention-system/screen-missions-expanded.webp', width: 582, height: 1628 },
      'store': { src: '/assets/projects/retention-system/screen-store.webp', width: 582, height: 1260 },
      'store-item': { src: '/assets/projects/retention-system/screen-store-item.webp', width: 582, height: 1260 },
      'store-cart-widget': { src: '/assets/projects/retention-system/screen-store-cart-widget.webp', width: 582, height: 1260 },
      'store-cart-widget-expanded': { src: '/assets/projects/retention-system/screen-store-cart-widget-expanded.webp', width: 582, height: 1260 },
      'store-cart': { src: '/assets/projects/retention-system/screen-store-cart.webp', width: 582, height: 1260 },
      'store-purchase-confirmed': { src: '/assets/projects/retention-system/screen-store-purchase-confirmed.webp', width: 582, height: 1260 },
      'tournament': { src: '/assets/projects/retention-system/screen-tournament.webp', width: 582, height: 1260 },
      'tournament-leaderboard': { src: '/assets/projects/retention-system/screen-tournament-leaderboard.webp', width: 582, height: 2042 },
      'tournament-games': { src: '/assets/projects/retention-system/screen-tournament-games.webp', width: 582, height: 1260 },
      'tournament-rules': { src: '/assets/projects/retention-system/screen-tournament-rules.webp', width: 582, height: 1260 },
      'profile': { src: '/assets/projects/retention-system/screen-profile.webp', width: 582, height: 1260 },
      'profile-avatar': { src: '/assets/projects/retention-system/screen-profile-avatar.webp', width: 582, height: 1260 },
    },
    'exclusive-games': {
      'roulette-purchase': { src: '/assets/projects/exclusive-games/screen-roulette-purchase.webp', width: 582, height: 1260 },
      'roulette-play': { src: '/assets/projects/exclusive-games/screen-roulette-play.webp', width: 582, height: 1260 },
      'roulette-reward': { src: '/assets/projects/exclusive-games/screen-roulette-reward.webp', width: 582, height: 1260 },
      'mystery-box-purchase': { src: '/assets/projects/exclusive-games/screen-mystery-box-purchase.webp', width: 582, height: 1260 },
      'mystery-box-play': { src: '/assets/projects/exclusive-games/screen-mystery-box-play.webp', width: 582, height: 1260 },
      'mystery-box-reward': { src: '/assets/projects/exclusive-games/screen-mystery-box-reward.webp', width: 582, height: 1260 },
      'scratch-card-purchase': { src: '/assets/projects/exclusive-games/screen-scratch-card-purchase.webp', width: 582, height: 1260 },
      'scratch-card-play': { src: '/assets/projects/exclusive-games/screen-scratch-card-play.webp', width: 582, height: 1260 },
      'scratch-card-reward': { src: '/assets/projects/exclusive-games/screen-scratch-card-reward.webp', width: 582, height: 1260 },
    },
  },

  // Imagens de compartilhamento 1200×630 (JPG), geradas por scripts/og.mjs.
  og: {
    default: '/og/default.jpg',
    'multi-tenant-design-system': '/og/multi-tenant-design-system.jpg',
    'instituto-mais': '/og/instituto-mais.jpg',
    'retention-system': '/og/retention-system.jpg',
    'exclusive-games': '/og/exclusive-games.jpg',
  },
};
