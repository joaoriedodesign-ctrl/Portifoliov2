// Conteúdo dos projetos (PT/EN). Fatos vêm do sitemap v2 e, no caso do
// Design System Multi-tenant, do case da v1 do portfólio (lib/case-studies.ts).
// Textos marcados "rascunho" são editoriais: descrevem o que as fontes já dizem,
// sem acrescentar resultados, métricas ou credenciais. Revise antes de publicar.

// Ordem de exibição (Home, /projetos e "Próximo projeto" em loop).
export const projectOrder = ['instituto-mais', 'multi-tenant-design-system', 'dr-carlos-mattos', 'marina-alves'];

export const projects = {
  // Case de sistema (sem site navegável): no lugar da demonstração, mostra telas reais.
  // Conteúdo confirmado na v1 do portfólio. Atribuição: construído na Play4tune,
  // hoje também atende Multibet e Supernova. Sem Tokens Studio/Style Dictionary na ponte
  // Figma → Storybook. Governança formal (review/versionamento) ainda não existe.
  'multi-tenant-design-system': {
    slug: 'multi-tenant-design-system',
    name: 'Design System Multi-tenant',
    kind: 'system',
    year: 2026,
    live: null,
    demo: null,
    extras: [],
    gallery: ['home', 'gamepage', 'welcome-bonus'],
    pt: {
      category: 'Design System',
      subtitle: 'De arquivos Figma defasados na Play4tune a uma base de tokens única que hoje também sustenta a Multibet e a Supernova.',
      summary: 'Design system arquitetado do zero na Play4tune, hoje também em uso na Multibet e na Supernova, com automação de tema por tenant.',
      facts: { role: 'Arquitetura de Design System', duration: 'Em andamento desde janeiro', platform: 'Web (multi-tenant)', team: 'Eu (arquitetura) + líder (refinamento) + colega (aplicação)' },
      context: 'Antes do design system existir, não havia reuso real de componentes entre tenants: cada tela nova exigia entrar em arquivos específicos e garimpar o componente de onde ele tivesse sido usado da última vez, e esses arquivos ficavam defasados quase imediatamente. Na prática, nunca existia uma fonte única e atualizada: cada designer trabalhava com uma versão ligeiramente diferente da interface, o que gerava inconsistência visual e retrabalho constante entre design e desenvolvimento.',
      galleryTitle: 'Telas em produção',
      galleryCaption: 'Telas reais em produção, do mobile ao desktop, com os mesmos tokens e componentes do design system.',
      galleryLabels: { home: 'Home', gamepage: 'Gamepage', 'welcome-bonus': 'Welcome Bonus' },
      storybookCaption: 'Biblioteca de componentes documentada no Storybook. Só os nomes catalogados aparecem, sem telas reais, por confidencialidade.',
      decisions: [
        { title: 'Arquitetura de tokens', text: 'Base estruturada em Figma variables com aliasing primitiva → semântica, a mesma disciplina de tokens usada neste portfólio. No código, os tokens chegam ao Storybook por uma sincronização própria (script e processo manual, sem Tokens Studio ou Style Dictionary na ponte).' },
        { title: 'Automação de tema por tenant', text: 'Em vez de customizar cor por cor, tela por tela, criei uma camada de automação sobre a base semântica que gera o tema de cada tenant. Hoje ela atende 3 tenants, elimina a troca manual de cor e acelera a entrada de novos tenants.' },
        { title: 'Dívida técnica em paralelo', text: 'Corrigi componentes cadastrados sem cobertura responsiva completa e migrei componentes antigos para o padrão novo, junto com a evolução da base e não depois dela.' },
        { title: 'Governança compartilhada', text: 'A evolução da base é dividida entre arquitetura (eu), refinamento (liderança) e aplicação no dia a dia (um colega de time), o que ajuda a manter a consistência com mais de uma pessoa mexendo no sistema. Um processo formal de review e versionamento ainda está amadurecendo.' },
      ],
      numbersNote: null,
      numbers: [
        { value: '87', label: 'telas sustentadas pelo design system' },
        { value: '200+', label: 'componentes reutilizados entre tenants' },
        { value: '3', label: 'tenants atendidos pela automação de tema' },
        { value: '1/5', label: 'do tempo para criar uma tela nova' },
      ],
    },
    en: {
      category: 'Design System',
      subtitle: 'From outdated Figma files at Play4tune to a single token foundation that now also powers Multibet and Supernova.',
      summary: 'Design system architected from scratch at Play4tune, now also used by Multibet and Supernova, with per-tenant theme automation.',
      facts: { role: 'Design System Architecture', duration: 'Ongoing since January', platform: 'Web (multi-tenant)', team: 'Me (architecture) + lead (refinement) + teammate (application)' },
      context: 'Before the design system existed, there was no real component reuse across tenants: every new screen meant digging through specific files to find wherever a component had last been used, and those files went out of date almost immediately. In practice there was never a single, up-to-date source of truth: each designer worked from a slightly different version of the interface, which caused visual inconsistency and constant rework between design and development.',
      galleryTitle: 'Screens in production',
      galleryCaption: 'Real production screens, from mobile to desktop, built with the same design system tokens and components.',
      galleryLabels: { home: 'Home', gamepage: 'Gamepage', 'welcome-bonus': 'Welcome Bonus' },
      storybookCaption: 'Component library documented in Storybook. Only the catalogued names are shown, with no real screens, for confidentiality.',
      decisions: [
        { title: 'Token architecture', text: 'Built on Figma variables with primitive → semantic aliasing, the same token discipline used in this portfolio. On the code side, tokens reach Storybook through a dedicated sync (a manual script and process, no Tokens Studio or Style Dictionary in the pipeline).' },
        { title: 'Per-tenant theme automation', text: 'Instead of customizing color by color, screen by screen, I built an automation layer on top of the semantic foundation that generates each tenant’s theme. It now serves 3 tenants, removes manual color swapping and speeds up onboarding new tenants.' },
        { title: 'Technical debt, in parallel', text: 'I fixed components that had shipped without full responsive coverage and migrated legacy components to the new standard, alongside the system’s evolution rather than after it.' },
        { title: 'Shared governance', text: 'Evolving the foundation is split between architecture (me), refinement (leadership) and day-to-day application (a teammate), which helps keep things consistent with more than one person touching the system. A formal review and versioning process is still maturing.' },
      ],
      numbersNote: null,
      numbers: [
        { value: '87', label: 'screens powered by the design system' },
        { value: '200+', label: 'components reused across tenants' },
        { value: '3', label: 'tenants served by the theme automation' },
        { value: '1/5', label: 'of the time to create a new screen' },
      ],
    },
  },

  'instituto-mais': {
    slug: 'instituto-mais',
    name: 'Instituto MAIS',
    year: 2026,
    // "Abrir site ao vivo" leva ao domínio real da clínica. A demonstração usa a
    // cópia local em public/projects/instituto-mais/ (nada é carregado do servidor da clínica).
    live: { href: 'https://institutomaislondrina.com.br', external: true },
    demo: { embedUrl: '/projects/instituto-mais/' },
    extras: [],
    pt: {
      category: 'Site institucional',
      subtitle: 'Clínica multidisciplinar em Londrina.',
      summary: 'Clínica multidisciplinar em Londrina: 7 especialidades, profissionais e um caminho curto até o agendamento.',
      facts: { role: 'UX/UI + front-end', duration: '1 a 3 meses', platform: 'Web responsiva', team: 'Eu + a clínica' },
      // rascunho
      context: 'Quem procura uma clínica multidisciplinar raramente sabe o nome da especialidade de que precisa. O site precisava apresentar sete especialidades e nove profissionais sem virar um catálogo, levando cada pessoa do “para quem é isto?” até o agendamento com o profissional certo.',
      decisions: [
        { title: 'Organização por público', text: 'O conteúdo parte de quem procura atendimento, e não da lista de serviços. Cada fase da vida abre um caminho próprio até as especialidades relacionadas.' },
        { title: 'Agendamento direto com cada profissional', text: 'Cada profissional tem o próprio ponto de contato, com a mensagem já identificando quem a pessoa quer procurar.' },
        { title: 'Identidade em movimento', text: 'A identidade visual da clínica ganha movimento na interface, de forma contida e respeitando a preferência por movimento reduzido.' },
        { title: 'Estrutura para descoberta e medição', text: 'A página foi estruturada para ser encontrada em buscadores e para ter as interações principais mensuráveis.' },
      ],
      numbers: [
        { value: '7', label: 'especialidades' },
        { value: '9', label: 'profissionais' },
        { value: '4', label: 'fases da vida' },
        { value: '2', label: 'temas (claro e escuro)' },
      ],
    },
    en: {
      category: 'Institutional website',
      subtitle: 'Multidisciplinary clinic in Londrina, Brazil.',
      summary: 'Multidisciplinary clinic in Londrina: 7 specialties, practitioners and a short path to booking.',
      facts: { role: 'UX/UI + front-end', duration: '1 to 3 months', platform: 'Responsive web', team: 'Me + the clinic' },
      context: 'People looking for a multidisciplinary clinic rarely know the name of the specialty they need. The site had to present seven specialties and nine practitioners without becoming a catalogue, taking each visitor from “who is this for?” to booking with the right practitioner.',
      decisions: [
        { title: 'Organized by audience', text: 'Content starts from who is seeking care, not from a list of services. Each life stage opens its own path to the related specialties.' },
        { title: 'Direct booking with each practitioner', text: 'Every practitioner has their own contact point, with the message already naming who the visitor wants to see.' },
        { title: 'Identity in motion', text: 'The clinic’s visual identity gains motion in the interface — restrained, and respecting the reduced-motion preference.' },
        { title: 'Built for discovery and measurement', text: 'The page was structured to be found by search engines and to make its key interactions measurable.' },
      ],
      numbers: [
        { value: '7', label: 'specialties' },
        { value: '9', label: 'practitioners' },
        { value: '4', label: 'life stages' },
        { value: '2', label: 'themes (light and dark)' },
      ],
    },
  },

  'dr-carlos-mattos': {
    slug: 'dr-carlos-mattos',
    name: 'Dr. Carlos Mattos',
    year: 2026,
    // Documento independente hospedado no próprio domínio (sem header/footer do portfólio).
    live: { href: '/projects/dr-carlos-mattos/', external: false, hosted: true },
    demo: { embedUrl: '/projects/dr-carlos-mattos/' },
    extras: [],
    pt: {
      category: 'Landing page',
      subtitle: 'Consultório de psiquiatria em Curitiba.',
      summary: 'Consultório de psiquiatria em Curitiba, com toda a jornada levando a um único canal: o WhatsApp.',
      facts: { role: 'UX/UI + front-end', duration: 'Menos de 1 mês', platform: 'Landing page responsiva', team: 'Eu + o cliente' },
      context: 'Procurar um psiquiatra costuma começar com dúvida e hesitação. A landing page precisava ajudar a pessoa a se reconhecer no que lê, construir confiança e oferecer um único próximo passo claro.',
      decisions: [
        { title: 'Identificação inicial', text: 'A página começa pelo que a pessoa está vivendo, para que ela se reconheça antes de qualquer apresentação do consultório.' },
        { title: 'Canal único de conversão', text: 'Toda a jornada leva ao mesmo lugar: o WhatsApp. Sem formulários concorrentes nem caminhos paralelos.' },
        { title: 'Confiança antes do clique', text: 'As informações que sustentam a decisão aparecem antes do pedido de contato.' },
        { title: 'Leveza e acessibilidade', text: 'Código enxuto, sem frameworks, com acessibilidade tratada como requisito desde o início.' },
      ],
      numbers: [
        { value: '6', label: 'seções' },
        { value: '6', label: 'pontos de contato no WhatsApp' },
        { value: '2', label: 'modalidades' },
        { value: '0', label: 'frameworks' },
      ],
    },
    en: {
      category: 'Landing page',
      subtitle: 'Psychiatry practice in Curitiba, Brazil.',
      summary: 'Psychiatry practice in Curitiba, with the whole journey leading to a single channel: WhatsApp.',
      facts: { role: 'UX/UI + front-end', duration: 'Less than 1 month', platform: 'Responsive landing page', team: 'Me + the client' },
      context: 'Looking for a psychiatrist usually starts with doubt and hesitation. The landing page had to help visitors recognize themselves in what they read, build trust and offer one clear next step.',
      decisions: [
        { title: 'Starting with recognition', text: 'The page opens with what the visitor is going through, so they recognize themselves before any introduction of the practice.' },
        { title: 'A single conversion channel', text: 'The whole journey leads to the same place: WhatsApp. No competing forms or parallel paths.' },
        { title: 'Trust before the click', text: 'The information that supports the decision appears before the request to get in touch.' },
        { title: 'Light and accessible', text: 'Lean code with no frameworks, with accessibility treated as a requirement from the start.' },
      ],
      numbers: [
        { value: '6', label: 'sections' },
        { value: '6', label: 'WhatsApp touchpoints' },
        { value: '2', label: 'appointment types' },
        { value: '0', label: 'frameworks' },
      ],
    },
  },

  'marina-alves': {
    slug: 'marina-alves',
    name: 'Marina Alves',
    year: 2026,
    concept: true, // exibe o selo "Projeto conceito — persona fictícia"
    live: { href: '/projects/marina-alves/', external: false, hosted: true },
    demo: { embedUrl: '/projects/marina-alves/' },
    // Botão de mídia kit: fica indisponível enquanto o PDF não existir em public/.
    extras: [{ key: 'mediaKit', href: '/projects/marina-alves/assets/docs/marina-alves-media-kit.pdf', hosted: true }],
    pt: {
      category: 'Mídia kit',
      subtitle: 'Mídia kit online para uma persona de skincare.',
      summary: 'Mídia kit online para uma persona de skincare — métricas, audiência e pacotes com contratação pelo WhatsApp.',
      facts: { role: 'UX/UI + front-end', duration: 'Menos de 1 mês', platform: 'Web responsiva', team: 'Projeto autoral' },
      context: 'Um mídia kit em PDF costuma ser lido às pressas por quem decide uma parceria. A versão online organiza o conteúdo na ordem em que a marca decide, deixa preços e pacotes visíveis e foi pensada para funcionar dentro do navegador do Instagram.',
      decisions: [
        { title: 'Organização pela decisão da marca', text: 'As seções seguem a ordem das perguntas de quem avalia uma parceria.' },
        { title: 'Preços visíveis e contratação', text: 'Pacotes e valores ficam à vista, com a contratação a um toque pelo WhatsApp.' },
        { title: 'Dados em movimento', text: 'Métricas e audiência ganham movimento para serem lidas rapidamente, sem depender dele para aparecer.' },
        { title: 'Experiência no navegador do Instagram', text: 'Layout, carregamento e interações pensados para o navegador interno do Instagram.' },
      ],
      numbers: [
        { value: '8', label: 'seções' },
        { value: '6', label: 'pacotes' },
        { value: '1', label: 'PDF' },
        { value: '0', label: 'conteúdo perdido sem JavaScript' },
      ],
    },
    en: {
      category: 'Media kit',
      subtitle: 'Online media kit for a skincare persona.',
      summary: 'Online media kit for a skincare persona — metrics, audience and packages bookable on WhatsApp.',
      facts: { role: 'UX/UI + front-end', duration: 'Less than 1 month', platform: 'Responsive web', team: 'Self-initiated project' },
      context: 'A PDF media kit is usually skimmed in a hurry by whoever decides on a partnership. The online version orders the content the way a brand decides, keeps prices and packages visible and is designed to work inside Instagram’s in-app browser.',
      decisions: [
        { title: 'Organized around the brand’s decision', text: 'Sections follow the order of questions a brand asks when evaluating a partnership.' },
        { title: 'Visible pricing and booking', text: 'Packages and prices are in plain sight, with booking one tap away on WhatsApp.' },
        { title: 'Data in motion', text: 'Metrics and audience data are animated for quick reading, without depending on motion to appear.' },
        { title: 'Built for Instagram’s browser', text: 'Layout, loading and interactions designed for Instagram’s in-app browser.' },
      ],
      numbers: [
        { value: '8', label: 'sections' },
        { value: '6', label: 'packages' },
        { value: '1', label: 'PDF' },
        { value: '0', label: 'content lost without JavaScript' },
      ],
    },
  },
};
