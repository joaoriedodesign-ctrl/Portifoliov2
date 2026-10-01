# Gera os CVs em PDF (português e inglês) a partir do CV base
# (joao-riedo-cv-base-pt.docx, a fonte da verdade). Mesmo layout nos dois idiomas:
# ReportLab, A4, Liberation Sans. Rode: python3 scripts/cv.py
# Saída: public/assets/docs/joao-riedo-cv-pt.pdf e joao-riedo-cv-en.pdf
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.platypus.flowables import HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

FD = '/usr/share/fonts/truetype/liberation/'
pdfmetrics.registerFont(TTFont('LS', FD + 'LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LS-B', FD + 'LiberationSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LS-I', FD + 'LiberationSans-Italic.ttf'))
registerFontFamily('LS', normal='LS', bold='LS-B', italic='LS-I', boldItalic='LS-B')

DOCS = Path(__file__).resolve().parent.parent / 'public/assets/docs'
LINK = '#1155cc'
GRAY = HexColor('#444444')

name = ParagraphStyle('name', fontName='LS-B', fontSize=22, leading=25)
role = ParagraphStyle('role', fontName='LS', fontSize=11, leading=15, textColor=GRAY)
contact = ParagraphStyle('contact', fontName='LS', fontSize=8.2, leading=11.5)
h = ParagraphStyle('h', fontName='LS-B', fontSize=10, leading=13, spaceBefore=10)
body = ParagraphStyle('body', fontName='LS', fontSize=8.4, leading=11.6)
skill = ParagraphStyle('sk', parent=body, spaceAfter=3)
item_t = ParagraphStyle('it', fontName='LS-B', fontSize=8.8, leading=12)
item_r = ParagraphStyle('ir', parent=item_t, alignment=TA_RIGHT)
sub = ParagraphStyle('sub', fontName='LS-I', fontSize=8.2, leading=11.5, textColor=GRAY)
bullet = ParagraphStyle('b', parent=body, leftIndent=13, bulletIndent=4, spaceBefore=1.5)

W = A4[0] - 2 * 57 - 12  # largura útil do frame


def link(url, text=None):
    return f'<a href="{url}" color="{LINK}"><u>{text or url}</u></a>'


def section(title):
    return [Paragraph(title.upper(), h), Spacer(1, 2), HRFlowable(width='100%', thickness=0.7, color=black, spaceBefore=0, spaceAfter=6)]


def header_row(left, right=''):
    t = Table([[Paragraph(left, item_t), Paragraph(right, item_r)]], colWidths=[W * 0.68, W * 0.32])
    t.setStyle(TableStyle([('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 0), ('VALIGN', (0, 0), (-1, -1), 'TOP')]))
    return t


def entry(title, org='', period='', intro=None, bullets=()):
    flow = [header_row(title, period)]
    if org:
        flow.append(Paragraph(org, sub))
    if intro:
        flow.append(Paragraph(intro, ParagraphStyle('in', parent=body, spaceBefore=2)))
    flow += [Paragraph(b, bullet, bulletText='•') for b in bullets]
    flow.append(Spacer(1, 6))
    return KeepTogether(flow)


CONTACT = f'Londrina, PR · joaoriedodesign@gmail.com · +55 43 98412-1348<br/>{link("https://joaoriedo.com", "joaoriedo.com")} · {link("https://www.linkedin.com/in/ri3do/", "linkedin.com/in/ri3do")}'

# ───────────────────────── Conteúdo (PT = texto do CV base) ─────────────────────────
PT = {
    'file': 'joao-riedo-cv-pt.pdf',
    'meta': ('João Riedo — CV Product Designer', 'Currículo — português'),
    'role': 'Product Designer | UX/UI | Design Systems',
    'contact': CONTACT,
    'summary_t': 'Resumo profissional',
    'summary': 'Construí minha trajetória em design gráfico, liderança de equipe e produtos digitais B2B/B2C. Atuei como Product Designer e UX Designer em Multibet, Cassino.bet e 7K.bet, com foco em UX/UI e Design Systems para plataformas white-label. Combinei análise de comportamento, arquitetura da informação e design de interfaces com documentação e colaboração próxima com Engenharia. Estruturei sistemas compartilhados entre marcas e conduzi redesigns com resultados de negócio.',
    'skills_t': 'Competências técnicas',
    'skills': [
        ('UI e Prototipação', 'Figma (Auto Layout, componentes, variantes, interfaces responsivas) e protótipos de alta fidelidade.'),
        ('Design Systems', 'Variáveis, tokens primitivos e semânticos, temas multi-tenant, bibliotecas de componentes, documentação, versionamento e colaboração com Engenharia via Storybook.'),
        ('UX e Pesquisa', 'Arquitetura da informação, jornadas, fluxos, testes de usabilidade, benchmarking, validação de hipóteses e análise de comportamento com Microsoft Clarity.'),
        ('IA Aplicada', 'Claude, ChatGPT, Figma Agent e workflows com Figma MCP e Notion MCP para ideação, prototipação, documentação e automação de tarefas.'),
        ('Desenvolvimento Web', 'Familiaridade com HTML, CSS, JavaScript e React, com implementação prática de páginas web.'),
        ('Metodologias e Processos', 'Trabalho em squads, sprints, Kanban, planejamento e facilitação de retrospectivas, estruturação de processos de design e gestão de handoff com especificações e registros de decisões (DDRs).'),
        ('Gestão e Soft Skills', 'Liderança de equipe, autonomia para solucionar problemas complexos sob prazos curtos, negociação de escopo com stakeholders, abertura a feedback e refinamento contínuo com Engenharia.'),
    ],
    'exp_t': 'Experiência profissional',
    'exp': [
        ('Product Designer', 'Multibet', 'Fev/2026 – Set/2026',
         'Atuei no design de produto para uma plataforma B2B de apostas e operações white-label. Desenvolvi experiências multi-tenant e Design Systems em parceria com Produto e Engenharia.', [
             'Conduzi design de produto de ponta a ponta em plataforma B2B multi-tenant, do discovery à entrega de interfaces, em parceria com Produto e Engenharia.',
             'Estruturei o Design System da operação white-label internacional da Supernova, aplicado também a Play4tune e Multibet: <b>87 telas, mais de 200 componentes e 3 tenants</b>, em produção com Figma e Storybook.',
             'Contribuí para uma <b>redução estimada de 80% no tempo de criação de telas</b>, com base nos tempos de conclusão das tarefas do setor de UX, por meio de tokens, componentes reutilizáveis e temas por marca.',
             'Estabeleci com Engenharia um padrão de handoff que reduziu dúvidas recorrentes e facilitei retrospectivas do time de Produto.',
         ]),
        ('UX Designer', 'Cassino.bet e 7K.bet (Ana Gaming)', 'Abr/2025 – Dez/2025',
         'Atuei em UX/UI para duas marcas de apostas com públicos e posicionamentos distintos. Evoluí jornadas, estruturei a arquitetura da informação e trabalhei na consistência das interfaces.', [
             'Liderei o redesign do sportsbook da Cassino.bet, revisando fluxos e interfaces com apoio de benchmarking. <b>Um mês após a publicação, a participação das apostas esportivas no volume de apostas passou de 3% para 10% (+7 p.p.)</b>, conforme consulta ao banco de dados.',
             'Estruturei arquitetura da informação e interfaces para Cassino.bet e 7K.bet, considerando os respectivos focos em slots e esportes, e iniciei as bases de um Design System compartilhado.',
         ]),
        ('Work and Travel', 'Alterra Mountain Company', 'Dez/2023 – Mar/2024',
         'Participei do programa Work and Travel durante a temporada de inverno em Snowshoe, EUA. Vivenciei trocas culturais e desenvolvi meu inglês no dia a dia profissional.', [
             'Ampliei meu repertório cultural e aprimorei meu inglês por meio da convivência em um ambiente de trabalho multicultural nos Estados Unidos.',
         ]),
        ('Design Supervisor', 'Instituto ESPE', 'Set/2020 – Jul/2023',
         'Supervisionei a produção de design gráfico e digital e acompanhei a equipe de criação. Organizei demandas e trabalhei na consistência visual da comunicação institucional.', [
             'Liderei uma equipe de <b>4 pessoas</b>, coordenando demandas de criação de peças gráficas e digitais, geração de certificados e edição de vídeos.',
             'Implementei Kanban para organizar demandas e acompanhar o fluxo de trabalho; padronizei as peças de comunicação para manter consistência visual entre as entregas.',
         ]),
    ],
    'proj_t': 'Projetos em destaque',
    'proj': [
        ('Design System Supernova', 'Plataforma white-label', 'Em produção', None, [
            'Criei arquitetura de tokens primitivos e semânticos, componentes reutilizáveis e temas para a operação internacional da Supernova e os tenants Play4tune e Multibet, substituindo arquivos dispersos por uma base compartilhada.',
            'Estruturei a implementação com Figma e Storybook: <b>87 telas, mais de 200 componentes, 3 tenants e redução estimada de 80% no tempo de criação de telas</b>.',
        ]),
        ('Instituto MAIS', 'Branding, UX/UI e desenvolvimento', 'Publicado', link('https://institutomaislondrina.com.br', 'institutomaislondrina.com.br'), [
            'Criei e implementei o projeto completo de presença digital da clínica: identidade visual, logotipo, variáveis, tokens, interfaces e publicação do site.',
            'Organizei conteúdo e caminhos de contato para facilitar o agendamento e apoiar divulgação e campanhas de aquisição, com experiência responsiva para mobile e desktop.',
        ]),
        ('Marina Alves', 'Media kit digital', 'Projeto conceitual', link('https://joaoriedo.com/projects/marina-alves/', 'joaoriedo.com/projects/marina-alves/'), [
            'Concebi um media kit em formato de landing page como proposta de produto para influenciadores, reunindo perfil, audiência, conteúdos e pacotes comerciais em uma experiência responsiva.',
            'Organizei a hierarquia de informações para facilitar a avaliação por marcas, com indicadores em destaque e chamadas para contato via WhatsApp. Publiquei o case no meu portfólio.',
        ]),
        ('Zentupet', 'SaaS para creches e hotéis pet', 'Protótipo', None, [
            'Conduzi pesquisa de mercado e projetei <b>14 telas</b>, componentes e um Design System para dois perfis: equipe do estabelecimento e responsáveis pelos pets.',
            'Desenhei fluxos do check-in ao check-out, contemplando atividades, medicação, banho e tosa em um projeto individual de gestão da rotina dos pets.',
        ]),
    ],
    'edu_t': 'Formação acadêmica',
    'edu': [
        ('Bacharelado em Design Gráfico', 'UniFil — Centro Universitário Filadélfia', '2020 – 2022'),
        ('Técnico Integrado em Informática', 'IFPR, Londrina', '2015 – 2018'),
    ],
    'cert_t': 'Certificações e formação complementar',
    'cert': [
        ('Google UX Design Professional Certificate', 'Google / Coursera', '2026', None),
        ('Claude for Designers', 'Tera', '2026', None),
        ('CCUSA Work Experience', 'CCUSA', 'Temporada de inverno 2023/2024', 'Programa de trabalho e intercâmbio cultural nos Estados Unidos.'),
    ],
    'lang_t': 'Idiomas',
    'lang': 'Português nativo · Inglês avançado',
}

# ───────────────────────── Tradução (EN) do mesmo conteúdo ─────────────────────────
EN = {
    'file': 'joao-riedo-cv-en.pdf',
    'meta': ('João Riedo — Product Designer (CV)', 'Curriculum Vitae — English'),
    'role': 'Product Designer | UX/UI | Design Systems',
    'contact': CONTACT.replace('Londrina, PR', 'Londrina, PR — Brazil'),
    'summary_t': 'Professional summary',
    'summary': 'I built my career across graphic design, team leadership and B2B/B2C digital products. I worked as a Product Designer and UX Designer at Multibet, Cassino.bet and 7K.bet, focusing on UX/UI and Design Systems for white-label platforms. I combined behavior analysis, information architecture and interface design with documentation and close collaboration with Engineering. I structured systems shared across brands and led redesigns with business results.',
    'skills_t': 'Technical skills',
    'skills': [
        ('UI &amp; Prototyping', 'Figma (Auto Layout, components, variants, responsive interfaces) and high-fidelity prototypes.'),
        ('Design Systems', 'Variables, primitive and semantic tokens, multi-tenant themes, component libraries, documentation, versioning and collaboration with Engineering through Storybook.'),
        ('UX &amp; Research', 'Information architecture, journeys, flows, usability testing, benchmarking, hypothesis validation and behavior analysis with Microsoft Clarity.'),
        ('Applied AI', 'Claude, ChatGPT, Figma Agent and Figma MCP and Notion MCP workflows for ideation, prototyping, documentation and task automation.'),
        ('Web Development', 'Familiarity with HTML, CSS, JavaScript and React, with hands-on implementation of web pages.'),
        ('Methods &amp; Processes', 'Squads, sprints, Kanban, planning and facilitating retrospectives, structuring design processes and managing handoff with specs and design decision records (DDRs).'),
        ('Leadership &amp; Soft Skills', 'Team leadership, autonomy to solve complex problems under tight deadlines, scope negotiation with stakeholders, openness to feedback and continuous refinement with Engineering.'),
    ],
    'exp_t': 'Professional experience',
    'exp': [
        ('Product Designer', 'Multibet', 'Feb 2026 – Sep 2026',
         'I worked on product design for a B2B betting platform and white-label operations. I built multi-tenant experiences and Design Systems together with Product and Engineering.', [
             'Led end-to-end product design on a B2B multi-tenant platform, from discovery to interface delivery, together with Product and Engineering.',
             'Structured the Design System for Supernova’s international white-label operation, also applied to Play4tune and Multibet: <b>87 screens, 200+ components and 3 tenants</b>, in production with Figma and Storybook.',
             'Contributed to an <b>estimated 80% reduction in screen creation time</b>, based on the UX team’s task completion times, through tokens, reusable components and per-brand themes.',
             'Set up a handoff standard with Engineering that reduced recurring questions, and facilitated the Product team’s retrospectives.',
         ]),
        ('UX Designer', 'Cassino.bet and 7K.bet (Ana Gaming)', 'Apr 2025 – Dec 2025',
         'I worked on UX/UI for two betting brands with distinct audiences and positioning. I evolved journeys, structured the information architecture and worked on interface consistency.', [
             'Led the Cassino.bet sportsbook redesign, revising flows and interfaces supported by benchmarking. <b>One month after launch, sports bets went from 3% to 10% of total betting volume (+7 p.p.)</b>, according to a database query.',
             'Structured information architecture and interfaces for Cassino.bet and 7K.bet, considering their respective focus on slots and sports, and laid the groundwork for a shared Design System.',
         ]),
        ('Work and Travel', 'Alterra Mountain Company', 'Dec 2023 – Mar 2024',
         'I took part in the Work and Travel program during the winter season in Snowshoe, USA. I experienced cultural exchange and developed my English in a professional, day-to-day setting.', [
             'Broadened my cultural background and improved my English by working in a multicultural environment in the United States.',
         ]),
        ('Design Supervisor', 'Instituto ESPE', 'Sep 2020 – Jul 2023',
         'I supervised graphic and digital design production and supported the creative team. I organized requests and worked on the visual consistency of institutional communication.', [
             'Led a team of <b>4 people</b>, coordinating requests for print and digital pieces, certificate generation and video editing.',
             'Implemented Kanban to organize requests and track workflow; standardized communication pieces to keep visual consistency across deliverables.',
         ]),
    ],
    'proj_t': 'Selected projects',
    'proj': [
        ('Supernova Design System', 'White-label platform', 'In production', None, [
            'Created a primitive and semantic token architecture, reusable components and themes for Supernova’s international operation and the Play4tune and Multibet tenants, replacing scattered files with a shared foundation.',
            'Structured the implementation with Figma and Storybook: <b>87 screens, 200+ components, 3 tenants and an estimated 80% reduction in screen creation time</b>.',
        ]),
        ('Instituto MAIS', 'Branding, UX/UI and development', 'Live', link('https://institutomaislondrina.com.br', 'institutomaislondrina.com.br'), [
            'Created and implemented the clinic’s complete digital presence: visual identity, logo, variables, tokens, interfaces and website launch.',
            'Organized content and contact paths to make booking easier and support promotion and acquisition campaigns, with a responsive experience for mobile and desktop.',
        ]),
        ('Marina Alves', 'Digital media kit', 'Concept project', link('https://joaoriedo.com/projects/marina-alves/', 'joaoriedo.com/projects/marina-alves/'), [
            'Conceived a media kit as a landing page, as a product proposal for influencers, bringing profile, audience, content and commercial packages together in a responsive experience.',
            'Organized the information hierarchy to make evaluation easier for brands, with highlighted indicators and WhatsApp contact calls to action. Published the case in my portfolio.',
        ]),
        ('Zentupet', 'SaaS for pet daycares and hotels', 'Prototype', None, [
            'Ran market research and designed <b>14 screens</b>, components and a Design System for two profiles: facility staff and pet owners.',
            'Designed flows from check-in to check-out, covering activities, medication, bath and grooming, in a solo project for managing pets’ routines.',
        ]),
    ],
    'edu_t': 'Education',
    'edu': [
        ('Bachelor’s Degree in Graphic Design', 'UniFil — Centro Universitário Filadélfia', '2020 – 2022'),
        ('Integrated Technical Degree in Information Technology', 'IFPR, Londrina', '2015 – 2018'),
    ],
    'cert_t': 'Certifications and additional training',
    'cert': [
        ('Google UX Design Professional Certificate', 'Google / Coursera', '2026', None),
        ('Claude for Designers', 'Tera', '2026', None),
        ('CCUSA Work Experience', 'CCUSA', 'Winter season 2023/2024', 'Work and cultural exchange program in the United States.'),
    ],
    'lang_t': 'Languages',
    'lang': 'Portuguese (native) · English (advanced)',
}


def build(c):
    story = [
        Paragraph('JOÃO RIEDO', name),
        Paragraph(c['role'], role),
        Spacer(1, 4),
        Paragraph(c['contact'], contact),
        Spacer(1, 4),
    ]
    story += section(c['summary_t'])
    story.append(Paragraph(c['summary'], body))
    story += section(c['skills_t'])
    story += [Paragraph(f'<b>{k}:</b> {v}', skill) for k, v in c['skills']]
    story += section(c['exp_t'])
    story += [entry(t, org, period, intro, bl) for t, org, period, intro, bl in c['exp']]
    story += section(c['proj_t'])
    story += [entry(f'{t} | {kind}', url or '', status, None, bl) for t, kind, status, url, bl in c['proj']]
    story += section(c['edu_t'])
    story += [entry(t, org, period) for t, org, period in c['edu']]
    story += section(c['cert_t'])
    story += [entry(t, org, period, note) for t, org, period, note in c['cert']]
    story += section(c['lang_t'])
    story.append(Paragraph(c['lang'], body))

    out = DOCS / c['file']
    out.parent.mkdir(parents=True, exist_ok=True)
    title, subject = c['meta']
    doc = SimpleDocTemplate(str(out), pagesize=A4, leftMargin=57, rightMargin=57, topMargin=50, bottomMargin=45,
                            title=title, author='João Riedo', subject=subject)
    doc.build(story)
    print('ok', out)


if __name__ == '__main__':
    build(PT)
    build(EN)
