// Configuração central do site. Tudo que ainda não foi confirmado fica null/'' —
// os componentes mostram estados "indisponível" em vez de links falsos.

export const site = {
  domain: 'https://joaoriedo.com',
  name: 'João Riedo',
  role: 'Product Designer',

  // Contatos: preencher somente com dados confirmados.
  contact: {
    // Só dígitos com DDI (confirmado em 25/09/2026, o mesmo do CV).
    whatsapp: '5543984121348',
    email: 'joaoriedodesign@gmail.com',
    phoneDisplay: '+55 43 98412-1348',
  },

  social: {
    linkedin: 'https://www.linkedin.com/in/ri3do/',
    behance: 'https://www.behance.net/ri3do',
    dribbble: 'https://dribbble.com/ri3do',
  },

  // Downloads de CV: indisponíveis até os arquivos existirem em public/assets/docs/.
  cv: {
    pt: '/assets/docs/joao-riedo-cv-pt.pdf',
    en: '/assets/docs/joao-riedo-cv-en.pdf', // gerado por scripts/cv-en.py a partir do CV em português
  },

  // Analytics desativado nesta versão.
  analytics: { enabled: false },
};
