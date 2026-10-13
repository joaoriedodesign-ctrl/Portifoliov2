// Conteúdo dos projetos (PT/EN), na dinâmica desafio → solução → resultado.
// Voz: primeira pessoa do passado. Fatos e números vêm do CV base
// (joao-riedo-cv-base-pt.docx), do sitemap v2 e do case da v1 do portfólio.
// Nada de métricas que não estejam nessas fontes: onde não há resultado de negócio
// medido, o resultado descreve a entrega e os números descrevem o escopo.

// Ordem de exibição (Home, /projetos e "Próximo projeto" em loop).
// Dr. Carlos Mattos e Marina Alves (projetos fictícios) saíram em 13/10/2026; os
// endereços antigos redirecionam para /projetos (src/lib/routes.js).
export const projectOrder = ['instituto-mais', 'multi-tenant-design-system', 'retention-system', 'exclusive-games'];

export const projects = {
  // Case de sistema (sem site navegável): no lugar da demonstração, mostra telas reais.
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
      subtitle: 'Estruturei o Design System da operação white-label internacional da Supernova, aplicado também a Play4tune e Multibet.',
      summary: 'Estruturei um Design System multi-tenant com 87 telas, mais de 200 componentes e 3 tenants, com redução estimada de 80% no tempo de criação de telas.',
      facts: { role: 'Product Designer · arquitetura do Design System', duration: 'fev–set/2026', platform: 'Web (multi-tenant)', team: 'Eu (arquitetura) + liderança (refinamento) + colega (aplicação) + Engenharia' },
      galleryTitle: 'Telas em produção',
      galleryCaption: 'Telas reais em produção, do mobile ao desktop, com os mesmos tokens e componentes do design system.',
      galleryLabels: { home: 'Home', gamepage: 'Gamepage', 'welcome-bonus': 'Welcome Bonus' },
      storybookCaption: 'Biblioteca de componentes documentada no Storybook. Só os nomes catalogados aparecem, sem telas reais, por confidencialidade.',
      challenge: [
        'Quando cheguei, não havia reuso real de componentes entre as marcas. Cada tela nova exigia garimpar o componente no arquivo em que ele tinha sido usado pela última vez, e esses arquivos ficavam defasados quase imediatamente.',
        'Sem uma fonte única e atualizada, cada designer trabalhava com uma versão ligeiramente diferente da interface. O resultado era inconsistência visual entre Supernova, Play4tune e Multibet e retrabalho constante entre design e desenvolvimento.',
      ],
      solution: {
        intro: 'Substituí os arquivos dispersos por uma base compartilhada, construída em parceria com Produto e Engenharia.',
        steps: [
          { title: 'Arquitetura de tokens', text: 'Criei tokens primitivos e semânticos em variáveis do Figma, com aliasing primitivo → semântico. Assim, cada decisão visual passou a ter um nome e um único lugar para mudar.' },
          { title: 'Temas por tenant', text: 'Em vez de trocar cor por cor, tela por tela, montei uma camada de temas sobre a base semântica que gera a identidade de cada marca. Ela passou a atender os 3 tenants.' },
          { title: 'Componentes reutilizáveis', text: 'Migrei componentes antigos para o padrão novo e corrigi os que não tinham cobertura responsiva completa, junto com a evolução da base e não depois dela.' },
          { title: 'Ponte com Engenharia', text: 'Estruturei a implementação com Figma e Storybook e estabeleci com Engenharia um padrão de handoff, com especificações e registros de decisões (DDRs), que reduziu dúvidas recorrentes.' },
        ],
      },
      result: {
        text: ['O Design System entrou em produção nas três operações. Com tokens, componentes reutilizáveis e temas por marca, contribuí para uma redução estimada de 80% no tempo de criação de telas, calculada com base nos tempos de conclusão das tarefas do setor de UX.'],
        numbersNote: null,
        numbers: [
          { value: '87', label: 'telas sustentadas pelo design system' },
          { value: '200+', label: 'componentes reutilizados entre tenants' },
          { value: '3', label: 'tenants em produção' },
          { value: '−80%', label: 'no tempo de criação de telas (estimado)' },
        ],
      },
    },
    en: {
      category: 'Design System',
      subtitle: 'I structured the Design System for Supernova’s international white-label operation, also applied to Play4tune and Multibet.',
      summary: 'I structured a multi-tenant Design System with 87 screens, 200+ components and 3 tenants, cutting screen creation time by an estimated 80%.',
      facts: { role: 'Product Designer · Design System architecture', duration: 'Feb–Sep 2026', platform: 'Web (multi-tenant)', team: 'Me (architecture) + lead (refinement) + teammate (application) + Engineering' },
      galleryTitle: 'Screens in production',
      galleryCaption: 'Real production screens, from mobile to desktop, built with the same design system tokens and components.',
      galleryLabels: { home: 'Home', gamepage: 'Gamepage', 'welcome-bonus': 'Welcome Bonus' },
      storybookCaption: 'Component library documented in Storybook. Only the catalogued names are shown, with no real screens, for confidentiality.',
      challenge: [
        'When I joined, there was no real component reuse across brands. Every new screen meant digging up a component from wherever it had last been used, and those files went out of date almost immediately.',
        'With no single, up-to-date source, each designer worked from a slightly different version of the interface. The result was visual inconsistency across Supernova, Play4tune and Multibet, and constant rework between design and development.',
      ],
      solution: {
        intro: 'I replaced the scattered files with a shared foundation, built together with Product and Engineering.',
        steps: [
          { title: 'Token architecture', text: 'I created primitive and semantic tokens in Figma variables, with primitive → semantic aliasing, so every visual decision got a name and a single place to change it.' },
          { title: 'Per-tenant themes', text: 'Instead of swapping color by color, screen by screen, I built a theme layer on top of the semantic foundation that generates each brand’s identity. It came to serve all 3 tenants.' },
          { title: 'Reusable components', text: 'I migrated legacy components to the new standard and fixed the ones without full responsive coverage, alongside the system’s evolution rather than after it.' },
          { title: 'Bridge to Engineering', text: 'I structured the implementation with Figma and Storybook and set up a handoff standard with Engineering, with specs and design decision records (DDRs), which cut down recurring questions.' },
        ],
      },
      result: {
        text: ['The Design System went into production across all three operations. With tokens, reusable components and per-brand themes, I contributed to an estimated 80% reduction in screen creation time, based on the UX team’s task completion times.'],
        numbersNote: null,
        numbers: [
          { value: '87', label: 'screens powered by the design system' },
          { value: '200+', label: 'components reused across tenants' },
          { value: '3', label: 'tenants in production' },
          { value: '−80%', label: 'screen creation time (estimated)' },
        ],
      },
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
      subtitle: 'Criei e publiquei a presença digital de uma clínica multidisciplinar em Londrina, da identidade visual ao site.',
      summary: 'Criei a identidade visual e o site de uma clínica multidisciplinar em Londrina, com 7 especialidades e um caminho curto até o agendamento.',
      facts: { role: 'Branding, UX/UI e desenvolvimento', duration: '1 a 3 meses', platform: 'Web responsiva', team: 'Eu + a clínica' },
      challenge: [
        'A clínica precisava construir a presença digital do zero, da identidade visual ao site.',
        'Quem procura uma clínica multidisciplinar raramente sabe o nome da especialidade de que precisa. O site tinha de apresentar sete especialidades e nove profissionais sem virar um catálogo, e levar cada pessoa do “para quem é isto?” até o agendamento com o profissional certo.',
      ],
      solution: {
        intro: 'Conduzi o projeto inteiro: identidade visual, logotipo, variáveis, tokens, interfaces, código e publicação.',
        steps: [
          { title: 'Organização por público', text: 'Organizei o conteúdo a partir de quem procura atendimento, e não da lista de serviços. Cada fase da vida abre um caminho próprio até as especialidades relacionadas.' },
          { title: 'Agendamento direto com cada profissional', text: 'Dei a cada profissional o próprio ponto de contato no WhatsApp, com a mensagem já identificando quem a pessoa quer procurar.' },
          { title: 'Identidade em movimento', text: 'Levei a identidade visual da clínica para a interface com movimento contido, respeitando a preferência por movimento reduzido, e criei os temas claro e escuro.' },
          { title: 'Estrutura para descoberta e campanhas', text: 'Estruturei a página para buscadores, com dados estruturados de clínica médica e Open Graph, e preparei as tags de mídia paga para apoiar divulgação e campanhas de aquisição.' },
        ],
      },
      result: {
        text: ['Publiquei o site em institutomaislondrina.com.br, com experiência responsiva para mobile e desktop e caminhos de contato que levam ao agendamento em poucos toques.'],
        numbers: [
          { value: '7', label: 'especialidades' },
          { value: '9', label: 'profissionais' },
          { value: '4', label: 'fases da vida' },
          { value: '2', label: 'temas (claro e escuro)' },
        ],
      },
    },
    en: {
      category: 'Institutional website',
      subtitle: 'I created and launched the digital presence of a multidisciplinary clinic in Londrina, Brazil, from visual identity to website.',
      summary: 'I created the visual identity and website of a multidisciplinary clinic in Londrina, with 7 specialties and a short path to booking.',
      facts: { role: 'Branding, UX/UI and development', duration: '1 to 3 months', platform: 'Responsive web', team: 'Me + the clinic' },
      challenge: [
        'The clinic needed to build its digital presence from scratch, from visual identity to website.',
        'People looking for a multidisciplinary clinic rarely know the name of the specialty they need. The site had to present seven specialties and nine practitioners without becoming a catalogue, taking each visitor from “who is this for?” to booking with the right practitioner.',
      ],
      solution: {
        intro: 'I ran the whole project: visual identity, logo, variables, tokens, interfaces, code and launch.',
        steps: [
          { title: 'Organized by audience', text: 'I organized content around who is seeking care, not around a list of services. Each life stage opens its own path to the related specialties.' },
          { title: 'Direct booking with each practitioner', text: 'I gave every practitioner their own WhatsApp contact point, with the message already naming who the visitor wants to see.' },
          { title: 'Identity in motion', text: 'I brought the clinic’s visual identity into the interface with restrained motion, respecting the reduced-motion preference, and built light and dark themes.' },
          { title: 'Built for discovery and campaigns', text: 'I structured the page for search engines, with medical clinic structured data and Open Graph, and set up paid media tags to support promotion and acquisition campaigns.' },
        ],
      },
      result: {
        text: ['I launched the site at institutomaislondrina.com.br, with a responsive experience for mobile and desktop and contact paths that reach booking in a few taps.'],
        numbers: [
          { value: '7', label: 'specialties' },
          { value: '9', label: 'practitioners' },
          { value: '4', label: 'life stages' },
          { value: '2', label: 'themes (light and dark)' },
        ],
      },
    },
  },

  // Cases de gamificação (Play4tune): sem site navegável, mostram telas mobile reais
  // agrupadas por módulo. Sem métrica de negócio medida: os números descrevem o escopo.
  'retention-system': {
    slug: 'retention-system',
    name: 'Retention System Play4tune',
    year: 2026,
    live: null,
    demo: null,
    extras: [],
    screens: [
      { key: 'hub', items: ['hub'] },
      { key: 'missions', items: ['missions', 'missions-expanded'] },
      { key: 'store', items: ['store', 'store-item', 'store-cart-widget', 'store-cart-widget-expanded', 'store-cart', 'store-purchase-confirmed'] },
      { key: 'tournaments', items: ['tournament', 'tournament-leaderboard', 'tournament-games', 'tournament-rules'] },
      { key: 'profile', items: ['profile', 'profile-avatar'] },
    ],
    pt: {
      category: 'Gamificação',
      subtitle: 'Desenhei de ponta a ponta o sistema de retenção mobile da Play4tune: missões, torneios, loja e perfil conectados por um HUB.',
      summary: 'Desenhei de ponta a ponta um loop de gamificação mobile com 5 módulos e 15 telas, em que missões e torneios geram moedas que viram giros nos slots favoritos do jogador.',
      facts: { role: 'Product Designer · ponta a ponta', duration: 'fev–set/2026', platform: 'Mobile', team: 'Eu (design) + Produto + Engenharia' },
      galleryTitle: 'Telas em produção',
      galleryCaption: 'Telas reais do sistema, organizadas por módulo, construídas com os tokens e componentes do Design System multi-tenant.',
      groups: {
        hub: { title: 'HUB', text: 'O centro do loop: acesso aos quatro módulos e saldo de moedas sempre à vista.' },
        missions: { title: 'Missões', text: 'Missões ativas, com progresso e recompensa em cada card.' },
        store: { title: 'Loja', text: 'Do catálogo à confirmação, com o carrinho também disponível em um widget.' },
        tournaments: { title: 'Torneios', text: 'Lista de torneios e, no detalhe, ranking, jogos elegíveis e regras, com o prêmio fixo no topo.' },
        profile: { title: 'Perfil', text: 'Ranking, nível e histórico de missões, compras e torneios.' },
      },
      screenLabels: {
        hub: 'HUB', missions: 'Missões', 'missions-expanded': 'Missão expandida',
        store: 'Loja', 'store-item': 'Detalhe do item', 'store-cart-widget': 'Widget do carrinho', 'store-cart-widget-expanded': 'Widget expandido', 'store-cart': 'Carrinho', 'store-purchase-confirmed': 'Compra confirmada',
        tournament: 'Torneio', 'tournament-leaderboard': 'Ranking', 'tournament-games': 'Jogos elegíveis', 'tournament-rules': 'Regras',
        profile: 'Perfil', 'profile-avatar': 'Escolha de avatar',
      },
      challenge: [
        'Num cassino online, o jogador costuma entrar, jogar e sair. A Play4tune precisava de um motivo para ele voltar que não dependesse só de bônus de depósito.',
        'O desafio de design era reunir missões, torneios, uma loja de recompensas e o perfil do jogador em um único sistema, sem espalhar cinco mecânicas novas pela interface do cassino e sem exigir que o jogador entendesse regras complicadas para participar.',
      ],
      solution: {
        intro: 'Conduzi o design do sistema inteiro, do fluxo às telas finais, em parceria com Produto e Engenharia e sobre a base do Design System multi-tenant.',
        steps: [
          { title: 'Um HUB como centro do loop', text: 'Concentrei os módulos em um HUB. Dali o jogador chega a missões, torneios, loja e perfil com um toque e vê o saldo de moedas logo no topo, sem precisar procurar cada mecânica pela plataforma.' },
          { title: 'A moeda como fio condutor', text: 'Fiz a moeda ligar os módulos: missões e torneios pagam moedas, a loja converte essas moedas em giros nos slots favoritos e o perfil fecha o ciclo com ranking, nível e histórico.' },
          { title: 'Compra sem sair do contexto', text: 'Na loja, levei o carrinho também para um widget com notificação, para o jogador continuar navegando pelo catálogo antes de finalizar a compra.' },
          { title: 'Torneios fáceis de acompanhar', text: 'Separei a lista de torneios do detalhe de cada um. No detalhe, organizei ranking, jogos elegíveis e regras em três abas e mantive o prêmio total fixo no topo de todas elas.' },
        ],
      },
      result: {
        text: ['O sistema entrou em produção na Play4tune com os cinco módulos conectados pelo HUB. Como usei os mesmos tokens e componentes do Design System multi-tenant, as telas novas seguiram o padrão da plataforma sem criar uma interface paralela.'],
        numbers: [
          { value: '5', label: 'módulos conectados pelo HUB' },
          { value: '15', label: 'telas mobile' },
          { value: '1', label: 'moeda para todo o loop' },
          { value: '3', label: 'abas em cada torneio' },
        ],
      },
    },
    en: {
      category: 'Gamification',
      subtitle: 'I designed Play4tune’s mobile retention system end to end: missions, tournaments, store and profile connected by a HUB.',
      summary: 'I designed a mobile gamification loop end to end, with 5 modules and 15 screens, where missions and tournaments pay out coins that become spins on the player’s favorite slots.',
      facts: { role: 'Product Designer · end to end', duration: 'Feb–Sep 2026', platform: 'Mobile', team: 'Me (design) + Product + Engineering' },
      galleryTitle: 'Screens in production',
      galleryCaption: 'Real screens from the system, grouped by module and built with the multi-tenant Design System’s tokens and components.',
      groups: {
        hub: { title: 'HUB', text: 'The center of the loop: access to all four modules, with the coin balance always in view.' },
        missions: { title: 'Missions', text: 'Active missions, with progress and reward on every card.' },
        store: { title: 'Store', text: 'From catalog to confirmation, with the cart also available as a widget.' },
        tournaments: { title: 'Tournaments', text: 'Tournament list and, in the detail, leaderboard, eligible games and rules, with the prize pinned to the top.' },
        profile: { title: 'Profile', text: 'Ranking, level and a history of missions, purchases and tournaments.' },
      },
      screenLabels: {
        hub: 'HUB', missions: 'Missions', 'missions-expanded': 'Expanded mission',
        store: 'Store', 'store-item': 'Item detail', 'store-cart-widget': 'Cart widget', 'store-cart-widget-expanded': 'Expanded widget', 'store-cart': 'Cart', 'store-purchase-confirmed': 'Purchase confirmed',
        tournament: 'Tournament', 'tournament-leaderboard': 'Leaderboard', 'tournament-games': 'Eligible games', 'tournament-rules': 'Rules',
        profile: 'Profile', 'profile-avatar': 'Avatar selection',
      },
      challenge: [
        'In an online casino, players tend to log in, play and leave. Play4tune needed a reason for them to come back that didn’t rely on deposit bonuses alone.',
        'The design challenge was to bring missions, tournaments, a rewards store and the player profile into a single system, without scattering five new mechanics across the casino interface and without asking players to learn complicated rules to take part.',
      ],
      solution: {
        intro: 'I led the design of the whole system, from flows to final screens, together with Product and Engineering and on top of the multi-tenant Design System.',
        steps: [
          { title: 'A HUB at the center of the loop', text: 'I brought the modules together in a HUB. From there, players reach missions, tournaments, store and profile in one tap and see their coin balance at the top, without hunting for each mechanic across the platform.' },
          { title: 'Coins as the common thread', text: 'I made coins connect the modules: missions and tournaments pay out coins, the store turns them into spins on favorite slots, and the profile closes the cycle with ranking, level and history.' },
          { title: 'Buying without losing context', text: 'In the store, I also put the cart in a widget with a notification, so players can keep browsing the catalog before checking out.' },
          { title: 'Tournaments that are easy to follow', text: 'I separated the tournament list from each tournament’s detail. In the detail, I organized leaderboard, eligible games and rules into three tabs and kept the total prize pinned to the top of all of them.' },
        ],
      },
      result: {
        text: ['The system went into production at Play4tune with all five modules connected by the HUB. Because I used the same tokens and components as the multi-tenant Design System, the new screens followed the platform’s standard instead of creating a parallel interface.'],
        numbers: [
          { value: '5', label: 'modules connected by the HUB' },
          { value: '15', label: 'mobile screens' },
          { value: '1', label: 'currency for the whole loop' },
          { value: '3', label: 'tabs in every tournament' },
        ],
      },
    },
  },

  'exclusive-games': {
    slug: 'exclusive-games',
    name: 'Exclusive Games Play4tune',
    year: 2026,
    live: null,
    demo: null,
    extras: [],
    screens: [
      { key: 'roulette', items: ['roulette-purchase', 'roulette-play', 'roulette-reward'] },
      { key: 'mystery-box', items: ['mystery-box-purchase', 'mystery-box-play', 'mystery-box-reward'] },
      { key: 'scratch-card', items: ['scratch-card-purchase', 'scratch-card-play', 'scratch-card-reward'] },
    ],
    pt: {
      category: 'Minigames',
      subtitle: 'Desenhei três minigames dentro do HUB de gamificação da Play4tune: Roleta, Caixa Misteriosa e Raspadinha.',
      summary: 'Desenhei de ponta a ponta três minigames mobile em que o jogador troca as moedas de missões e torneios por prêmios, sempre no mesmo loop de compra, jogo e recompensa.',
      facts: { role: 'Product Designer · ponta a ponta', duration: 'fev–set/2026', platform: 'Mobile', team: 'Eu (design) + Produto + Engenharia' },
      galleryTitle: 'Telas em produção',
      galleryCaption: 'Cada minigame do começo ao fim: compra, jogo e recompensa.',
      groups: {
        roulette: { title: 'Roleta', text: 'Comprar um giro, ver a roleta girar e receber o prêmio.' },
        'mystery-box': { title: 'Caixa Misteriosa', text: 'Comprar uma caixa, abrir e revelar o que tem dentro.' },
        'scratch-card': { title: 'Raspadinha', text: 'Comprar uma cartela, raspar e descobrir o prêmio.' },
      },
      screenLabels: {
        'roulette-purchase': 'Compra', 'roulette-play': 'Jogo', 'roulette-reward': 'Recompensa',
        'mystery-box-purchase': 'Compra', 'mystery-box-play': 'Jogo', 'mystery-box-reward': 'Recompensa',
        'scratch-card-purchase': 'Compra', 'scratch-card-play': 'Jogo', 'scratch-card-reward': 'Recompensa',
      },
      challenge: [
        'As moedas que o jogador ganhava em missões e torneios precisavam de mais um destino além da loja: algo rápido e divertido de jogar dentro da própria plataforma.',
        'Cada minigame trazia uma mecânica diferente. O risco era criar três jogos que precisassem ser aprendidos do zero, ou que tirassem o jogador do loop de retenção em vez de mantê-lo nele.',
      ],
      solution: {
        intro: 'Desenhei os três minigames de ponta a ponta, adaptando cada mecânica a um mesmo fluxo e à identidade visual do cassino.',
        steps: [
          { title: 'Um loop para três mecânicas', text: 'Fiz todos seguirem a mesma sequência: comprar, jogar, receber. O jogador aprende o fluxo uma vez, e só a interação central muda de um jogo para o outro.' },
          { title: 'Prêmios à vista antes da compra', text: 'Na tela de compra, mostrei o custo em moedas e a lista de recompensas possíveis de cada jogo antes do primeiro toque.' },
          { title: 'A um toque do HUB', text: 'Coloquei os minigames direto no HUB, em vez de escondê-los em submenus, para manter curto o caminho entre missão, torneio e jogo.' },
          { title: 'Interação de verdade', text: 'Desenhei a roleta que gira, a caixa que abre e a cartela que se raspa como interações reais, não como telas estáticas, e terminei os três jogos na mesma tela de recompensa.' },
        ],
      },
      result: {
        text: ['Os três minigames entraram em produção dentro do HUB de gamificação da Play4tune, com o mesmo fluxo, a mesma tela de recompensa e os componentes do Design System multi-tenant.'],
        numbers: [
          { value: '3', label: 'minigames' },
          { value: '9', label: 'telas, da compra à recompensa' },
          { value: '3', label: 'passos em cada jogo' },
          { value: '1', label: 'tela de recompensa para os três' },
        ],
      },
    },
    en: {
      category: 'Minigames',
      subtitle: 'I designed three minigames inside Play4tune’s gamification HUB: Roulette, Mystery Box and Scratch Card.',
      summary: 'I designed three mobile minigames end to end, where players trade the coins they earn in missions and tournaments for prizes, always in the same purchase, play and reward loop.',
      facts: { role: 'Product Designer · end to end', duration: 'Feb–Sep 2026', platform: 'Mobile', team: 'Me (design) + Product + Engineering' },
      galleryTitle: 'Screens in production',
      galleryCaption: 'Each minigame from start to finish: purchase, play and reward.',
      groups: {
        roulette: { title: 'Roulette', text: 'Buy a spin, watch the wheel turn and collect the prize.' },
        'mystery-box': { title: 'Mystery Box', text: 'Buy a box, open it and reveal what’s inside.' },
        'scratch-card': { title: 'Scratch Card', text: 'Buy a card, scratch it and find the prize.' },
      },
      screenLabels: {
        'roulette-purchase': 'Purchase', 'roulette-play': 'Play', 'roulette-reward': 'Reward',
        'mystery-box-purchase': 'Purchase', 'mystery-box-play': 'Play', 'mystery-box-reward': 'Reward',
        'scratch-card-purchase': 'Purchase', 'scratch-card-play': 'Play', 'scratch-card-reward': 'Reward',
      },
      challenge: [
        'The coins players earned in missions and tournaments needed somewhere to go besides the store: something quick and fun to play inside the platform itself.',
        'Each minigame brought a different mechanic. The risk was ending up with three games that had to be learned from scratch, or that pulled players out of the retention loop instead of keeping them in it.',
      ],
      solution: {
        intro: 'I designed all three minigames end to end, fitting each mechanic into a single flow and into the casino’s visual identity.',
        steps: [
          { title: 'One loop for three mechanics', text: 'I made all of them follow the same sequence: buy, play, collect. Players learn the flow once, and only the core interaction changes from one game to the next.' },
          { title: 'Prizes in view before buying', text: 'On the purchase screen, I showed the cost in coins and the list of possible rewards for each game before the first tap.' },
          { title: 'One tap from the HUB', text: 'I placed the minigames right in the HUB instead of burying them in submenus, to keep the path between missions, tournaments and play short.' },
          { title: 'Real interaction', text: 'I designed the spinning wheel, the opening box and the scratch card as real interactions, not static screens, and ended all three games on the same reward screen.' },
        ],
      },
      result: {
        text: ['All three minigames went into production inside Play4tune’s gamification HUB, sharing the same flow, the same reward screen and the multi-tenant Design System’s components.'],
        numbers: [
          { value: '3', label: 'minigames' },
          { value: '9', label: 'screens, from purchase to reward' },
          { value: '3', label: 'steps in every game' },
          { value: '1', label: 'reward screen shared by all three' },
        ],
      },
    },
  },
};
