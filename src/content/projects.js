// Conteúdo dos projetos (PT/EN), na dinâmica desafio → solução → resultado.
// Voz: primeira pessoa do passado. Fatos e números vêm do CV base
// (joao-riedo-cv-base-pt.docx), do sitemap v2 e do case da v1 do portfólio.
// Nada de métricas que não estejam nessas fontes: onde não há resultado de negócio
// medido, o resultado descreve a entrega e os números descrevem o escopo.

// Ordem de exibição (Home, /projetos e "Próximo projeto" em loop).
export const projectOrder = ['instituto-mais', 'multi-tenant-design-system', 'dr-carlos-mattos', 'marina-alves'];

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
      subtitle: 'Desenhei e desenvolvi a landing page de um consultório de psiquiatria em Curitiba.',
      summary: 'Desenhei e desenvolvi a landing page de um consultório de psiquiatria em Curitiba, com toda a jornada levando a um único canal: o WhatsApp.',
      facts: { role: 'UX/UI + front-end', duration: 'Menos de 1 mês', platform: 'Landing page responsiva', team: 'Eu + o cliente' },
      challenge: ['Procurar um psiquiatra costuma começar com dúvida e hesitação. A landing page precisava ajudar a pessoa a se reconhecer no que lê, construir confiança e oferecer um único próximo passo claro.'],
      solution: {
        intro: 'Desenhei a página em torno de uma decisão difícil e desenvolvi o front-end sem frameworks.',
        steps: [
          { title: 'Identificação inicial', text: 'Abri a página pelo que a pessoa está vivendo, para que ela se reconhecesse antes de qualquer apresentação do consultório.' },
          { title: 'Canal único de conversão', text: 'Fiz toda a jornada levar ao mesmo lugar, o WhatsApp, sem formulários concorrentes nem caminhos paralelos.' },
          { title: 'Confiança antes do clique', text: 'Posicionei as informações que sustentam a decisão antes do pedido de contato.' },
          { title: 'Leveza e acessibilidade', text: 'Escrevi um código enxuto, sem frameworks, e tratei acessibilidade como requisito desde o início.' },
        ],
      },
      result: {
        text: ['Entreguei em menos de um mês uma landing page leve e responsiva, com seis pontos de contato que levam ao WhatsApp e atendimento presencial e online apresentados lado a lado.'],
        numbers: [
          { value: '6', label: 'seções' },
          { value: '6', label: 'pontos de contato no WhatsApp' },
          { value: '2', label: 'modalidades' },
          { value: '0', label: 'frameworks' },
        ],
      },
    },
    en: {
      category: 'Landing page',
      subtitle: 'I designed and built the landing page for a psychiatry practice in Curitiba, Brazil.',
      summary: 'I designed and built the landing page for a psychiatry practice in Curitiba, with the whole journey leading to a single channel: WhatsApp.',
      facts: { role: 'UX/UI + front-end', duration: 'Less than 1 month', platform: 'Responsive landing page', team: 'Me + the client' },
      challenge: ['Looking for a psychiatrist usually starts with doubt and hesitation. The landing page had to help visitors recognize themselves in what they read, build trust and offer one clear next step.'],
      solution: {
        intro: 'I designed the page around a difficult decision and built the front-end with no frameworks.',
        steps: [
          { title: 'Starting with recognition', text: 'I opened the page with what the visitor is going through, so they would recognize themselves before any introduction of the practice.' },
          { title: 'A single conversion channel', text: 'I made the whole journey lead to the same place, WhatsApp, with no competing forms or parallel paths.' },
          { title: 'Trust before the click', text: 'I placed the information that supports the decision before the request to get in touch.' },
          { title: 'Light and accessible', text: 'I wrote lean code with no frameworks and treated accessibility as a requirement from the start.' },
        ],
      },
      result: {
        text: ['In less than a month, I delivered a light, responsive landing page with six touchpoints leading to WhatsApp and in-person and online care presented side by side.'],
        numbers: [
          { value: '6', label: 'sections' },
          { value: '6', label: 'WhatsApp touchpoints' },
          { value: '2', label: 'appointment types' },
          { value: '0', label: 'frameworks' },
        ],
      },
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
      subtitle: 'Concebi um media kit em formato de landing page como proposta de produto para influenciadores.',
      summary: 'Concebi um media kit online para uma persona de skincare, com métricas, audiência e pacotes contratáveis pelo WhatsApp.',
      facts: { role: 'UX/UI + front-end', duration: 'Menos de 1 mês', platform: 'Web responsiva', team: 'Projeto autoral' },
      challenge: ['Um media kit em PDF costuma ser lido às pressas por quem decide uma parceria. Quis testar um formato que facilitasse a avaliação por marcas e funcionasse bem dentro do navegador do Instagram.'],
      solution: {
        intro: 'Reuni perfil, audiência, conteúdos e pacotes comerciais em uma experiência responsiva.',
        steps: [
          { title: 'Organização pela decisão da marca', text: 'Organizei a hierarquia das informações na ordem das perguntas de quem avalia uma parceria, com os indicadores em destaque.' },
          { title: 'Preços visíveis e contratação', text: 'Deixei pacotes e valores à vista, com a contratação a um toque pelo WhatsApp.' },
          { title: 'Dados em movimento', text: 'Animei métricas e audiência para serem lidas rapidamente, sem depender do movimento para aparecer.' },
          { title: 'Experiência no navegador do Instagram', text: 'Pensei layout, carregamento e interações para o navegador interno do Instagram e gerei também a versão em PDF.' },
        ],
      },
      result: {
        text: ['Publiquei o case no portfólio como projeto conceitual, com a página navegável e o PDF do media kit, pronto para ser adaptado a influenciadores reais.'],
        numbers: [
          { value: '8', label: 'seções' },
          { value: '6', label: 'pacotes' },
          { value: '1', label: 'PDF' },
          { value: '0', label: 'conteúdo perdido sem JavaScript' },
        ],
      },
    },
    en: {
      category: 'Media kit',
      subtitle: 'I conceived a media kit as a landing page, as a product proposal for influencers.',
      summary: 'I conceived an online media kit for a skincare persona, with metrics, audience and packages bookable on WhatsApp.',
      facts: { role: 'UX/UI + front-end', duration: 'Less than 1 month', platform: 'Responsive web', team: 'Self-initiated project' },
      challenge: ['A PDF media kit is usually skimmed in a hurry by whoever decides on a partnership. I wanted to test a format that made it easier for brands to evaluate and that worked well inside Instagram’s in-app browser.'],
      solution: {
        intro: 'I brought profile, audience, content and commercial packages together in a responsive experience.',
        steps: [
          { title: 'Organized around the brand’s decision', text: 'I ordered the information by the questions a brand asks when evaluating a partnership, with key indicators highlighted.' },
          { title: 'Visible pricing and booking', text: 'I kept packages and prices in plain sight, with booking one tap away on WhatsApp.' },
          { title: 'Data in motion', text: 'I animated metrics and audience data for quick reading, without depending on motion for them to appear.' },
          { title: 'Built for Instagram’s browser', text: 'I designed layout, loading and interactions for Instagram’s in-app browser and also produced a PDF version.' },
        ],
      },
      result: {
        text: ['I published the case in my portfolio as a concept project, with the navigable page and the media kit PDF, ready to be adapted for real influencers.'],
        numbers: [
          { value: '8', label: 'sections' },
          { value: '6', label: 'packages' },
          { value: '1', label: 'PDF' },
          { value: '0', label: 'content lost without JavaScript' },
        ],
      },
    },
  },
};
