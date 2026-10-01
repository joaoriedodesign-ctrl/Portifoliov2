// Competências do hero: 7 categorias (fonte: CV base, "Competências Técnicas").
// Cada categoria tem uma cor fixa de badge (tokens Color/Badge/<cor>/Background e /Text).

export const skillCategories = [
  {
    id: 'ui', color: 'azul',
    name: { pt: 'UI e Prototipação', en: 'UI & Prototyping' },
    items: [
      { pt: 'Figma', en: 'Figma' },
      { pt: 'Auto Layout', en: 'Auto Layout' },
      { pt: 'Componentes', en: 'Components' },
      { pt: 'Variantes', en: 'Variants' },
      { pt: 'Interfaces responsivas', en: 'Responsive interfaces' },
      { pt: 'Protótipos de alta fidelidade', en: 'High-fidelity prototypes' },
    ],
  },
  {
    id: 'ds', color: 'violeta',
    name: { pt: 'Design Systems', en: 'Design Systems' },
    items: [
      { pt: 'Variáveis', en: 'Variables' },
      { pt: 'Tokens primitivos', en: 'Primitive tokens' },
      { pt: 'Tokens semânticos', en: 'Semantic tokens' },
      { pt: 'Temas multi-tenant', en: 'Multi-tenant themes' },
      { pt: 'Bibliotecas de componentes', en: 'Component libraries' },
      { pt: 'Documentação', en: 'Documentation' },
      { pt: 'Versionamento', en: 'Versioning' },
      { pt: 'Storybook', en: 'Storybook' },
    ],
  },
  {
    id: 'ux', color: 'verde',
    name: { pt: 'UX e Pesquisa', en: 'UX & Research' },
    items: [
      { pt: 'Arquitetura da informação', en: 'Information architecture' },
      { pt: 'Jornadas', en: 'User journeys' },
      { pt: 'Fluxos', en: 'User flows' },
      { pt: 'Testes de usabilidade', en: 'Usability testing' },
      { pt: 'Benchmarking', en: 'Benchmarking' },
      { pt: 'Validação de hipóteses', en: 'Hypothesis validation' },
      { pt: 'Microsoft Clarity', en: 'Microsoft Clarity' },
    ],
  },
  {
    // No Figma esta categoria usa Vermelho; no site usa Céu (proposta, ver DESIGN.md).
    id: 'ia', color: 'ceu',
    name: { pt: 'IA Aplicada', en: 'Applied AI' },
    items: [
      { pt: 'Claude', en: 'Claude' },
      { pt: 'ChatGPT', en: 'ChatGPT' },
      { pt: 'Figma Agent', en: 'Figma Agent' },
      { pt: 'Figma MCP', en: 'Figma MCP' },
      { pt: 'Notion MCP', en: 'Notion MCP' },
      { pt: 'Automação de tarefas', en: 'Task automation' },
    ],
  },
  {
    id: 'web', color: 'amarelo',
    name: { pt: 'Desenvolvimento Web', en: 'Web Development' },
    items: [
      { pt: 'HTML', en: 'HTML' },
      { pt: 'CSS', en: 'CSS' },
      { pt: 'JavaScript', en: 'JavaScript' },
      { pt: 'React', en: 'React' },
    ],
  },
  {
    id: 'process', color: 'verde-agua',
    name: { pt: 'Metodologias e Processos', en: 'Methods & Processes' },
    items: [
      { pt: 'Squads', en: 'Squads' },
      { pt: 'Sprints', en: 'Sprints' },
      { pt: 'Kanban', en: 'Kanban' },
      { pt: 'Retrospectivas', en: 'Retrospectives' },
      { pt: 'Processos de design', en: 'Design processes' },
      { pt: 'Handoff', en: 'Handoff' },
      { pt: 'DDRs', en: 'DDRs' },
    ],
  },
  {
    id: 'soft', color: 'rosa',
    name: { pt: 'Gestão e Soft Skills', en: 'Leadership & Soft Skills' },
    items: [
      { pt: 'Liderança de equipe', en: 'Team leadership' },
      { pt: 'Resolução de problemas complexos', en: 'Complex problem solving' },
      { pt: 'Negociação de escopo', en: 'Scope negotiation' },
      { pt: 'Abertura a feedback', en: 'Open to feedback' },
      { pt: 'Refinamento com Engenharia', en: 'Refinement with Engineering' },
    ],
  },
];

// Ordem de queda: intercala as categorias para as cores se misturarem na pilha.
export function skillsFor(lang) {
  const queues = skillCategories.map((c) => c.items.map((it) => ({ label: it[lang], color: c.color, category: c.name[lang] })));
  const out = [];
  for (let round = 0; queues.some((q) => q.length); round++) {
    // alterna o sentido a cada volta para não repetir sempre a mesma sequência de cores
    const order = round % 2 ? [...queues].reverse() : queues;
    for (const q of order) if (q.length) out.push(q.shift());
  }
  return out;
}
