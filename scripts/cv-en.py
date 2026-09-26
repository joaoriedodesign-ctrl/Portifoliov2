# Gera o CV em inglês (public/assets/docs/joao-riedo-cv-en.pdf) no mesmo layout
# do CV em português (ReportLab, A4, Liberation Sans). Rode: python3 scripts/cv-en.py
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.platypus.flowables import HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FD = '/usr/share/fonts/truetype/liberation/'
pdfmetrics.registerFont(TTFont('LS', FD + 'LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LS-B', FD + 'LiberationSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LS-I', FD + 'LiberationSans-Italic.ttf'))
from reportlab.pdfbase.pdfmetrics import registerFontFamily
registerFontFamily('LS', normal='LS', bold='LS-B', italic='LS-I', boldItalic='LS-B')

OUT = Path(__file__).resolve().parent.parent / 'public/assets/docs/joao-riedo-cv-en.pdf'
LINK = '#1155cc'
GRAY = HexColor('#444444')

name = ParagraphStyle('name', fontName='LS-B', fontSize=22, leading=25)
role = ParagraphStyle('role', fontName='LS', fontSize=11, leading=15, textColor=GRAY)
contact = ParagraphStyle('contact', fontName='LS', fontSize=8.2, leading=11.5)
h = ParagraphStyle('h', fontName='LS-B', fontSize=10, leading=13, spaceBefore=10)
body = ParagraphStyle('body', fontName='LS', fontSize=8.4, leading=11.6)
item_t = ParagraphStyle('it', fontName='LS-B', fontSize=8.8, leading=12)
item_r = ParagraphStyle('ir', parent=item_t, alignment=TA_RIGHT)
sub = ParagraphStyle('sub', fontName='LS-I', fontSize=8.2, leading=11.5, textColor=GRAY)
bullet = ParagraphStyle('b', parent=body, leftIndent=13, bulletIndent=4, spaceBefore=1.5)

W = A4[0] - 2 * 57 - 12  # largura útil do frame (padding padrão de 6 pt de cada lado)

def link(url, text=None):
    return f'<a href="{url}" color="{LINK}"><u>{text or url}</u></a>'

def section(title):
    return [Paragraph(title.upper(), h), Spacer(1, 2), HRFlowable(width='100%', thickness=0.7, color=black, spaceBefore=0, spaceAfter=6)]

def header_row(left, right=''):
    t = Table([[Paragraph(left, item_t), Paragraph(right, item_r)]], colWidths=[W * 0.68, W * 0.32])
    t.setStyle(TableStyle([('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 0), ('VALIGN', (0, 0), (-1, -1), 'TOP')]))
    return t

def entry(title, org, period='', bullets=()):
    flow = [header_row(title, period), Paragraph(org, sub)]
    flow += [Paragraph(b, bullet, bulletText='•') for b in bullets]
    flow.append(Spacer(1, 6))
    return KeepTogether(flow)

story = [
    Paragraph('JOÃO RIEDO', name),
    Paragraph('Product Designer | Design Systems &amp; Applied AI', role),
    Spacer(1, 4),
    Paragraph(f'Londrina, PR — Brazil | joaoriedodesign@gmail.com | +5543984121348 | {link("https://www.linkedin.com/in/ri3do/", "linkedin.com/in/ri3do")}', contact),
    Paragraph(f'Portfolio: {link("https://joaoriedo.com", "joaoriedo.com")}', contact),
    Spacer(1, 4),
]

story += section('Summary')
story.append(Paragraph(
    'Product Designer with 5+ years of experience, specialized in Design Systems and end-to-end product design for complex B2B/B2C multi-tenant platforms. '
    'Architects scalable design systems — primitive-to-semantic tokens, component libraries, per-tenant theme automation — and works closely with Engineering through clear handoff and design-to-code practices. '
    'Uses AI natively in the workflow, with Claude and MCP workflows (Figma MCP, Notion MCP) daily for research, documentation and iteration. '
    'Comfortable driving ambiguous problems end to end, from discovery and hypothesis validation to high-fidelity execution.', body))

story += section('Skills')
for k, v in [
    ('Design &amp; Systems', 'Design Systems, Design Tokens (Primitive to Semantic), Multi-tenant Theming, Component Libraries, High-Fidelity Prototyping, Interaction Design, Dev Handoff'),
    ('Applied AI &amp; MCP Workflows', 'Claude (daily use — research, documentation, rapid iteration), Figma MCP &amp; Notion MCP, Claude for Designers Certification'),
    ('Discovery &amp; Research', 'Hypothesis-Driven Discovery, Competitive Benchmarking, UX Research, Journey Mapping'),
    ('Tools', 'Figma (Auto Layout, Components, Variants, Design Tokens), Storybook, Notion'),
    ('Domain', 'B2B/B2C Multi-tenant Platforms, Payment UX, Operational Tools and Documentation'),
    ('Languages', 'Portuguese (native), English (advanced)'),
]:
    story.append(Paragraph(f'<b>{k}:</b> {v}', ParagraphStyle('sk', parent=body, spaceAfter=3)))

story += section('Professional Experience')
story += [
    entry('Product Designer', 'Multibet', 'Feb 2026 – Present', [
        'Owns end-to-end product design on a complex B2B multi-tenant platform — from discovery to production-ready UI — using Figma MCP and Notion MCP as part of a daily AI-native workflow with Claude.',
        'Leads the Design Tokens audit and the structured migration of component libraries to the Supernova Design System, working directly with Engineering (Figma to Storybook) to ensure clear handoff and design-to-code consistency; architected a multi-tenant token system (primitive to semantic, per-tenant theme automation) that now powers 87 screens and 200+ components across 3 tenants — cutting the time to create new screens by about 80%.',
        'Ran discovery and built a hypothesis matrix for an expiration problem in a payment method, validated with competitive benchmarking across two markets, to reduce friction in the payment journey.',
    ]),
    entry('UX Designer', 'Ana Gaming (Cassino.bet / 7K.bet)', 'Apr 2025 – Dec 2025', [
        'Led the full redesign of the Cassino.bet sportsbook experience, from the betting flow to the final interface, aligning decisions with business and engineering stakeholders.',
        'Laid the initial foundations of a unified, multi-tenant Design System, later evolved at Multibet.',
    ]),
    entry('Work and Travel', 'Alterra Mountain Company — United States', 'Dec 2023 – Mar 2024', [
        'International exchange program focused on improving English.',
    ]),
    entry('Design Supervisor', 'Instituto ESPE', 'Sep 2020 – Jul 2023', [
        'Led and managed the graphic and digital design team, establishing processes and visual consistency standards.',
    ]),
]

story += section('Selected Projects')
story += [
    entry('Multi-tenant Design System', 'Design System — Multibet', '', [
        'Structured the token architecture (primitive to semantic) and a per-tenant theme automation layer, replacing scattered, outdated Figma files with a single source of truth.',
        'Result: 87 screens and 200+ components consumed directly from Storybook across 3 tenants; time to create new screens reduced by about 80%.',
    ]),
    entry(f'Instituto MAIS — {link("https://institutomaislondrina.com.br", "institutomaislondrina.com.br")}', 'Institutional Website — Multidisciplinary Clinic', '', [
        'Designed and built the website for a clinic in Londrina with seven specialties (psychology, educational psychology, neuropsychology, pilates, among others), organizing content by specialty, life stage and team.',
        'Structured the page for WhatsApp conversion, with direct booking per practitioner, and handled local SEO (medical clinic structured data, Open Graph), paid media tags, light/dark theme and accessibility.',
    ]),
    entry('Zentupet', 'Management SaaS — Solo Project', '', [
        'Designed from scratch a management SaaS for pet daycares and hotels, covering the pet’s entire journey on site — check-in, activities, medication, bath and grooming, through check-out.',
        'Single-handedly ran the market research and designed the 14 product screens, the components and a design system built from scratch for two user profiles: facility staff and pet owners.',
    ]),
]

story += section('Education')
story += [
    entry('Bachelor’s Degree in Graphic Design', 'UniFil — Centro Universitário Filadélfia', '2020 – 2022'),
    entry('Integrated Technical Degree in Information Technology', 'IFPR Londrina (Federal Institute of Paraná)', '2015 – 2018'),
]

story += section('Certifications')
story += [
    entry('Google UX Design Professional Certificate', 'Google (Coursera)', '', [
        'Foundations of User Experience (UX) Design',
        'Start the UX Design Process: Empathize, Define, and Ideate',
        'Build Wireframes and Low-Fidelity Prototypes',
        'Conduct UX Research and Test Early Concepts',
        'Create High-Fidelity Designs and Prototypes in Figma',
        'Build Dynamic User Interfaces (UI) for Websites',
        'Design a User Experience for Social Good &amp; Prepare for Jobs',
    ]),
    entry('Claude for Designers', 'Tera'),
]

OUT.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(OUT), pagesize=A4, leftMargin=57, rightMargin=57, topMargin=50, bottomMargin=45,
                        title='João Riedo — Product Designer (CV)', author='João Riedo', subject='Curriculum Vitae — English')
doc.build(story)
print('ok', OUT)
