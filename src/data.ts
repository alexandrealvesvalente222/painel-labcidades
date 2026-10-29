export type SolutionId = 'consulta' | 'reurb' | 'fiscal' | 'licencas'
export type StageId = 'problema' | 'solucao' | 'impacto'
export type ViewId = 'splash' | 'hub' | 'explore' | 'contact' | 'pos' | 'brinde' | 'cert' | 'quiz'

export type BrindePrizeId = 'caneca' | 'chaveiro' | 'adesivo' | 'ecobag' | 'retry'

export interface BrindePrize {
  id: BrindePrizeId
  label: string
  image: string
  /** Peso relativo no sorteio (maior = mais frequente). */
  weight: number
  retry?: boolean
}

export interface StageContent {
  title: string
  message: string
  points: string[]
}

export interface CityNode {
  id: string
  name: string
  x: number
  y: number
  value: number
}

export interface Solution {
  id: SolutionId
  name: string
  short: string
  /** Rótulo curto na barra inferior (Soluções 2.0). */
  railLabel: string
  /** Marca grande no painel de explore. */
  brandTitle: string
  /** Subtítulo sob a marca no painel. */
  brandSubtitle: string
  /** Logo da marca acima do carrossel (quando houver). */
  brandLogo?: string
  area: string
  cardArea: string
  cardTitle?: string
  cardBlurb?: string
  tagline: string
  purpose: string
  image: string
  /** GIF / demo animado da interface da solução (explore). */
  demo?: string
  /** Site ao vivo embutido em janela estilo navegador (explore). */
  liveUrl?: string
  /** Fundo fotográfico do card (layout banner). */
  cardBg?: string
  /** Logo sobreposto no card banner. */
  cardLogo?: string
  /** Ícone vetorial no painel esquerdo do card. */
  cardIcon?: string
  gallery?: string[]
  accent: string
  accentSoft: string
  glow: string
  stages: Record<StageId, StageContent>
}

export const STAGES: { id: StageId; label: string; step: string; icon: 'challenge' | 'solution' | 'impact' }[] = [
  { id: 'problema', label: 'Problema', step: '01', icon: 'challenge' },
  { id: 'solucao', label: 'Solução', step: '02', icon: 'solution' },
  { id: 'impacto', label: 'Resultado', step: '03', icon: 'impact' },
]

export const CITIES: CityNode[] = [
  { id: 'vitoria', name: 'Vitória', x: 0.62, y: 0.46, value: 78 },
  { id: 'vila-velha', name: 'Vila Velha', x: 0.66, y: 0.54, value: 84 },
  { id: 'serra', name: 'Serra', x: 0.64, y: 0.36, value: 71 },
  { id: 'cariacica', name: 'Cariacica', x: 0.54, y: 0.48, value: 66 },
  { id: 'viana', name: 'Viana', x: 0.5, y: 0.56, value: 42 },
  { id: 'guarapari', name: 'Guarapari', x: 0.58, y: 0.68, value: 55 },
  { id: 'linhares', name: 'Linhares', x: 0.7, y: 0.2, value: 38 },
  { id: 'sao-mateus', name: 'São Mateus', x: 0.74, y: 0.1, value: 29 },
  { id: 'colatina', name: 'Colatina', x: 0.48, y: 0.26, value: 33 },
  { id: 'cachoeiro', name: 'Cachoeiro', x: 0.38, y: 0.72, value: 61 },
  { id: 'alegre', name: 'Alegre', x: 0.28, y: 0.78, value: 24 },
  { id: 'vargem', name: 'Vargem Alta', x: 0.42, y: 0.8, value: 27 },
  { id: 'anchieta', name: 'Anchieta', x: 0.5, y: 0.74, value: 31 },
  { id: 'aracruz', name: 'Aracruz', x: 0.68, y: 0.28, value: 44 },
  { id: 'domingos', name: 'Domingos Martins', x: 0.4, y: 0.52, value: 18 },
  { id: 'santa-maria', name: 'Santa Maria', x: 0.34, y: 0.4, value: 22 },
  { id: 'nova-venecia', name: 'Nova Venécia', x: 0.56, y: 0.12, value: 19 },
  { id: 'barra', name: 'Barra de São Francisco', x: 0.42, y: 0.14, value: 16 },
  { id: 'castelo', name: 'Castelo', x: 0.32, y: 0.68, value: 21 },
  { id: 'iconha', name: 'Iconha', x: 0.46, y: 0.66, value: 25 },
]

export const SOLUTIONS: Solution[] = [
{
    id: 'reurb',
    name: 'REURB Diagnóstico de Maturidade',
    short: 'Regularização Fundiária',
    railLabel: 'REURB',
    brandTitle: 'REURB',
    brandSubtitle: 'Diagnóstico de maturidade',
    brandLogo: './projects/reurb-brand.png',
    area: 'Regularização fundiária',
    cardArea: 'Habitação',
    cardTitle: 'Em que estágio está a REURB do seu município?',
    cardBlurb:
      'Diagnosticamos através de dados e mapeamos a REURB para a gestão priorizar onde agir na regularização fundiária.',
    tagline: 'Diagnóstico da regularização fundiária municipal.',
    purpose:
      'Apoia o município a conhecer o estágio de maturidade da sua REURB, com dashboard, mapa e estudos para planejar e acompanhar a regularização fundiária local.',
    image: './projects/reurb.jpg',
    liveUrl: './sites/reurb/index.html',
    cardBg: './projects/reurb-icon.png',
    cardLogo: './projects/reurb-logo.png',
    cardIcon: './projects/icons/reurb.svg',
    gallery: [
      './projects/reurb/sistema-home-full.png',
      './projects/reurb/01-test.jpeg',
      './projects/reurb/02.jpg',
      './projects/reurb/03.jpg',
      './projects/reurb/04.jpg',
      './projects/reurb/05.jpg',
      './projects/reurb/06.jpg',
      './projects/reurb/07.jpg',
      './projects/reurb/08.jpg',
      './projects/reurb/09.jpg',
    ],
    accent: '#93039f',
    accentSoft: 'rgba(147, 3, 159, 0.16)',
    glow: 'rgba(147, 3, 159, 0.45)',
    stages: {
      problema: {
        title: '',
        message:
          'A regularização avança em ritmos diferentes em cada bairro e núcleo. Sem diagnóstico municipal, a gestão e a população não enxergam prioridades nem resultados.',
        points: [
          'Falta um panorama completo da REURB no município',
          'Difícil saber onde a prefeitura precisa priorizar ações',
          'Pouca transparência sobre o progresso da regularização local',
        ],
      },
      solucao: {
        title: '',
        message:
          'O Diagnóstico de Maturidade oferece ferramentas para acompanhar indicadores do município, ver a distribuição no território e consultar estudos que orientam a política local.',
        points: [
          'Dashboard interativo com métricas de maturidade municipal',
          'Mapa SIG dos núcleos e áreas em regularização',
          'Estudos e capacitações para as equipes da prefeitura',
        ],
      },
      impacto: {
        title: '',
        message:
          'As prioridades ficam visíveis no mapa. O diagnóstico é atualizado periodicamente e apoia decisões da gestão municipal com base em dados.',
        points: [
          'Acompanhamento contínuo da regularização no município',
          'Gestores e população veem o mesmo panorama local',
          'Mais capacidade de planejar e prestar contas da REURB',
        ],
      },
    },
  },
{
    id: 'consulta',
    name: 'Integra Fiscal',
    short: 'Inteligência cadastral',
    railLabel: 'Integra Fiscal',
    brandTitle: 'integra FISCAL',
    brandSubtitle: 'Inteligência cadastral para a gestão fiscal',
    brandLogo: './projects/consulta-brand.png',
    area: 'Gestão fiscal',
    cardArea: 'Finanças',
    cardTitle: 'Qual a qualidade das informações nas suas bases de dados?',
    cardBlurb:
      'Reunimos dados e indicadores em uma busca única para a gestão encontrar o que precisa sem caçar em vários sistemas.',
    tagline: 'Inteligência cadastral para a gestão fiscal.',
    purpose:
      'Reúne dados municipais em um só lugar. Em vez de abrir vários sistemas, o gestor busca o município, o tema ou o indicador que precisa.',
    image: './projects/consulta.jpg',
    liveUrl: './sites/consulta/index.html',
    cardBg: './projects/consulta-icon.png',
    cardLogo: './projects/consulta-logo.png',
    cardIcon: './projects/icons/integra-fiscal.svg',
    accent: '#ff8300',
    accentSoft: 'rgba(255, 131, 0, 0.16)',
    glow: 'rgba(255, 131, 0, 0.45)',
    stages: {
      problema: {
        title: '',

        message:
          'Cada secretaria guarda seus dados em um sistema diferente. Quem precisa decidir gasta tempo procurando, e a resposta chega tarde.',
        points: [
          'Bases municipais isoladas umas das outras',
          'Difícil localizar o indicador certo no momento certo',
          'A decisão fica mais lenta do que deveria',
        ],
      },
      solucao: {
        title: '',
        message:
          'O Integra Fiscal concentra as camadas do portal LabCidades. Com um toque, a gestão encontra o recorte e segue para o painel correspondente.',
        points: [
          'Busca por município, tema ou indicador',
          'Conecta a pergunta à evidência disponível',
          'Serve de porta de entrada para os demais projetos',
        ],
      },
      impacto: {
        title: '',
        message:
          'A informação deixa de ser um depósito espalhado e passa a ser um instrumento rápido de decisão.',
        points: [
          'Menos tempo perdido entre sistemas',
          'Mais clareza na hora de agir',
          'Um acesso único aos dados urbanos',
        ],
      },
    },
  },
{
    id: 'fiscal',
    name: 'Conecta Consulta',
    short: 'Consulta integrada',
    railLabel: 'Conecta Consulta',
    brandTitle: 'conecta CONSULTA',
    brandSubtitle: 'Consulta integrada de dados municipais',
    brandLogo: './projects/conecta-consulta-brand.png',
    area: 'Arrecadação',
    cardArea: 'Finanças',
    cardTitle: 'Quanto o município deixa de arrecadar no território?',
    cardBlurb:
      'Cruzamos cadastro, dívida ativa e potencial de arrecadação no mapa para a gestão priorizar onde recuperar receita com justiça.',
    tagline: 'Consulta integrada de dados municipais.',
    purpose:
      'Cruza IPTU, cadastro imobiliário e dívida ativa para revelar o que o município ainda não vê, e onde pode arrecadar com mais justiça.',
    image: './projects/fiscal.jpg',
    liveUrl: './sites/fiscal/index.html',
    cardBg: './projects/fiscal-icon.png',
    cardLogo: './projects/fiscal-logo.png',
    cardIcon: './projects/icons/radar-fiscal.svg',
    accent: '#5d058c',
    accentSoft: 'rgba(93, 5, 140, 0.18)',
    glow: 'rgba(93, 5, 140, 0.5)',
    stages: {
      problema: {
        title: '',
        message:
          'Imóveis fora do cadastro e dívida sem perfil enfraquecem a arrecadação. A cobrança genérica trata todos os contribuintes da mesma forma.',
        points: [
          'IPTU cobrado sobre uma base incompleta',
          'Dívida ativa sem mapa claro de prioridade',
          'Comunicação igual para perfis muito diferentes',
        ],
      },
      solucao: {
        title: '',
        message:
          'A solução organiza o território fiscal: perfil da dívida, leitura do cadastro e priorização de quem pode regularizar.',
        points: [
          'Mapa da dívida ativa por território',
          'Atualização da leitura cadastral',
          'Prioridade para recuperar receita com justiça',
        ],
      },
      impacto: {
        title: '',
        message:
          'A prefeitura enxerga o potencial fiscal e pode investir melhor, com transparência e menos desigualdade na cobrança.',
        points: [
          'Recuperação da dívida com foco',
          'Cadastro mais próximo da realidade urbana',
          'Mais capacidade de financiar serviços públicos',
        ],
      },
    },
  },
{
    id: 'licencas',
    name: 'Monitor de Licenças Ambientais',
    short: 'Meio Ambiente',
    railLabel: 'Radar Ambiental',
    brandTitle: 'radar AMBIENTAL',
    brandSubtitle: 'Monitoramento de licenças ambientais',
    brandLogo: './projects/radar-ambiental-brand.png',
    area: 'Meio ambiente',
    cardArea: 'Meio Ambiente',
    cardTitle: 'Quais licenças ambientais estão válidas no seu território?',
    cardBlurb:
      'Acompanhamos validade, prazo e localização das licenças no mapa para a gestão agir antes do vencimento.',
    tagline: 'Validade, prazo e localização das licenças no território.',
    purpose:
      'Em Vargem Alta, o painel mostra no mapa quais licenças estão válidas, quais vão vencer e quais já venceram, para a gestão agir a tempo.',
    image: './projects/licencas.jpg',
    liveUrl: './sites/licencas/index.html',
    cardBg: './projects/licencas-icon.png',
    cardLogo: './projects/licencas-logo.png',
    cardIcon: './projects/icons/radar-ambiental.svg',
    accent: '#32bcae',
    accentSoft: 'rgba(50, 188, 174, 0.16)',
    glow: 'rgba(50, 188, 174, 0.45)',
    stages: {
      problema: {
        title: '',
        message:
          'Licenças ficam em pastas e planilhas. O município só descobre o problema quando o prazo já passou ou o risco ambiental já aconteceu.',
        points: [
          'Controle fragmentado por processo',
          'Vencimentos invisíveis no território',
          'Fiscalização chega depois do fato',
        ],
      },
      solucao: {
        title: '',
        message:
          'O painel reúne validade, prazo e localização. A gestão vê o que está regular, o que está perto de vencer e o que precisa de ação.',
        points: [
          'Acompanhamento contínuo da validade',
          'Leitura espacial das atividades licenciadas',
          'Alerta para licenças a vencer',
        ],
      },
      impacto: {
        title: '',
        message:
          'A prefeitura antecipa vencimentos e organiza a fiscalização com evidência, em vez de apagar incêndio.',
        points: [
          'Menos licenças vencidas sem acompanhamento',
          'Prioridade de fiscalização no território',
          'Mais proteção ambiental com antecipação',
        ],
      },
    },
  },
]

export const LAB = {
  name: 'LabCidades',
  full: 'Laboratório das Cidades',
  place: 'UFES · Vitória · Espírito Santo',
  headline: 'Temos soluções inteligentes para desafios urbanos',
  invite: 'Toque na tela para começar',
  cta: 'Soluções para as cidades',
  exploreTitle: 'Soluções para as cidades',
  tag: 'Laboratório de projetos',
  contactCta: 'Fale conosco',
  posCta: 'Pós-Graduações',
  certCta: 'Cursos de curta duração',
  homeLead:
    'O LabCidades é um laboratório de projetos que integra ensino, pesquisa e extensão na produção de conhecimento e no desenvolvimento de soluções aplicadas aos desafios\u00A0das\u00A0cidades.',
  solutionsLead:
    'O LabCidades, por meio dos seus projetos, aplica o conhecimento técnico-científico aos desafios das cidades.',
  wordmarkSrc: './csc/marca-vertical.png',
  wordmarkHeaderSrc: './csc/wordmark-header.svg',
  ufesMarkSrc: './csc/ufes.svg',
  cardCoverSrc: './csc/card-cover.png',
  conhecerCta: 'Conhecer',
}

export const CONTACT = {
  kicker: 'Fale conosco',
  headline: 'Escaneie o QR Code',
  line: 'Aponte a câmera do celular para abrir o site do LabCidades e falar com a gente.',
  invite: 'Toque em Início para voltar',
  qrLabel: 'QR Code de contato',
  qrSrc: './qr-contato.png',
  qrUrl: 'https://labcidades.com.br/',
  urlLabel: 'labcidades.com.br',
  ufesLabel: 'Universidade Federal do Espírito Santo',
  ufesSrc: './logo-ufes.png',
  brindeCta: 'Tente ganhar um brinde',
  brindeHint: 'Puxe a alavanca e concorra a um mimo do LabCidades',
}

/** Máquina de brindes - 3 iguais = prêmio; “retry” = tente outra vez. */
export const BRINDE = {
  kicker: 'Brinde LabCidades',
  spinningHint: 'Girando…',
  idlePrize: '« PRÊMIO »',
  winPrefix: 'Você ganhou',
  retryMessage: 'Tente outra vez',
  spinCta: 'Girar',
  homeCta: 'Início',
  socialLine: 'Siga o LabCidades no Instagram',
  socialHandle: '@labcidades',
  socialUrl: 'https://www.instagram.com/labcidades/',
  prizes: [
    { id: 'caneca', label: 'Caneca LabCidades', image: './brindes/caneca.svg', weight: 22 },
    { id: 'chaveiro', label: 'Chaveiro', image: './brindes/chaveiro.svg', weight: 26 },
    { id: 'adesivo', label: 'Adesivo', image: './brindes/adesivo.svg', weight: 28 },
    { id: 'ecobag', label: 'Ecobag', image: './brindes/ecobag.svg', weight: 14 },
    { id: 'retry', label: 'Tente outra vez', image: './brindes/retry.svg', weight: 10, retry: true },
  ] as BrindePrize[],
}

export const CERT = {
  title: 'Cursos de curta duração',
  org: 'LabCidades · UFES',
  typeLabel: 'MODALIDADE',
  typeValue: 'Capacitação para a gestão pública',
  cardTitle: 'Manifeste interesse',
  lead: 'Trilhas curtas para gestores municipais',
  about:
    'Capacitações práticas em cidades inteligentes, dados e melhoria de serviços urbanos — com acompanhamento da equipe LabCidades.',
  tracks: [
    {
      id: 'cidades',
      title: 'Cidades Inteligentes',
      blurb: 'Governança, inovação e transformação digital no município.',
    },
    {
      id: 'dados',
      title: 'Dados e evidência',
      blurb: 'Indicadores, dashboards e decisão baseada em informação.',
    },
    {
      id: 'gestao',
      title: 'Gestão aplicada',
      blurb: 'Ferramentas e práticas para o dia a dia da prefeitura.',
    },
  ],
  highlights: [
    'Certificação de Cidades Inteligentes',
    'Dados, evidência e indicadores para decisão',
    'Práticas aplicáveis à gestão municipal',
  ],
  qrTitle: 'Inscrição de interessados',
  qrHint: 'Escaneie o QR Code para preencher o formulário. Os dados entram no painel de acompanhamento.',
  formPath: '#/interesse-certificacao',
  formTitle: '',
  formLead:
    'Preencha seus dados para receber informações sobre as capacitações do LabCidades.',
  formCta: 'Enviar contato',
  successTitle: 'Interesse registrado',
  successMessage: 'Obrigado! Seus dados foram enviados com sucesso.',
  successContact:
    'A equipe do LabCidades entrará em contato em breve pelo e-mail ou telefone informados.',
  backToPanelCta: 'Voltar ao painel',
  siteCta: 'Site',
  instagramCta: 'Instagram',
  siteUrl: 'https://labcidades.com.br/',
  instagramUrl: 'https://www.instagram.com/labcidades/',
  adminPath: '#/admin',
}

export type PosProgramId = 'cidades' | 'esg'

export type PosModule = {
  id: string
  title: string
  items: string[]
}

export type PosProgram = {
  id: PosProgramId
  tabLabel: string
  highlight: string
  /** Subtítulo sob o nome do curso no card. */
  degree: string
  /** Texto do bloco Objetivo. */
  objective: string
  duration: string
  modality: string
  hours: string
  modulesLead: string
  modules: PosModule[]
}

export const POS = {
  pageTitle: 'Pós-graduações',
  org: 'UFES',
  objectiveLabel: 'Objetivo',
  orgTitle: 'Organização da disciplina',
  programs: [
    {
      id: 'cidades',
      tabLabel: 'Cidades Inteligentes',
      highlight: 'Cidades Inteligentes',
      degree: 'Especialização Lato Sensu',
      objective:
        'Capacitar profissionais que atuam na Gestão Pública e Privada para utilizarem análises de dados para solucionar os desafios das cidades.',
      duration: '18 meses',
      modality: 'Semipresencial',
      hours: '360 horas + TCC',
      modulesLead: '12 disciplinas reunidas em 04 módulos + TCC',
      modules: [
        {
          id: 'm1',
          title: 'Módulo I — Técnicas de Pesquisa',
          items: [
            'Ambiente Virtual de Aprendizagem — AVA (15h)',
            'Métodos de Pesquisa Aplicado (15h)',
            'Cidades Inteligentes, Digitais e Sustentáveis (30h)',
          ],
        },
        {
          id: 'm2',
          title: 'Módulo II — Cidades Inteligentes',
          items: [
            'E-Governo e E-Democracia (30h)',
            'Certificação de Cidades Inteligentes (45h)',
            'Mobilidade e Planejamento Urbano (30h)',
          ],
        },
        {
          id: 'm3',
          title: 'Módulo III — Big Data',
          items: [
            'Banco de Dados (45h)',
            'Análise de Dados (45h)',
            'Mineração de Dados (30h)',
            'Inteligência artificial, IoT e outras tecnologias (45h)',
          ],
        },
        {
          id: 'm4',
          title: 'Módulo IV — Seminários Aplicados',
          items: [
            'Seminários I — Políticas Públicas (15h)',
            'Seminários II — Cidades do Futuro (15h)',
          ],
        },
      ],
    },
    {
      id: 'esg',
      tabLabel: 'ESG, Sustentabilidade e Descarbonização',
      highlight: 'ESG, Sustentabilidade e Descarbonização',
      degree: 'Especialização Lato Sensu',
      objective:
        'Capacitar profissionais que atuam na Gestão Pública e Privada para aplicar ações de ESG (Ambiental, Social e Governança) como princípios estratégicos em sua gestão organizacional.',
      duration: '18 meses',
      modality: 'Semipresencial',
      hours: '360 horas + TCC',
      modulesLead: '18 disciplinas reunidas em 03 módulos + TCC',
      modules: [
        {
          id: 'm1',
          title: 'Módulo I — ESG',
          items: [
            'Ambiente Virtual de Aprendizagem — AVA (15h)',
            'Fundamentos de ESG no Contexto Público e Privado (30h)',
            'Governança, Ética e Responsabilidade Socioambiental (30h)',
            'Finanças Sustentáveis (15h)',
            'Economia Circular e Gestão de Resíduos (30h)',
            'Empreendedorismo Social e Ambiental (15h)',
            'Oficina de Projetos (5h)',
          ],
        },
        {
          id: 'm2',
          title: 'Módulo II — Sustentabilidade',
          items: [
            'Sustentabilidade e Inovação (30h)',
            'Licenciamento e Monitoramento Ambiental (EIA/RIMA/RIU, EVTA) (30h)',
            'Indicadores de Sustentabilidade pelas Normas Brasileiras (30h)',
            'Cadeia de Valor Sustentável (15h)',
            'Políticas Públicas para Sustentabilidade (15h)',
            'Oficina de Projetos (5h)',
          ],
        },
        {
          id: 'm3',
          title: 'Módulo III — Descarbonização',
          items: [
            'Mudanças Climáticas e Mercado de Carbono (30h)',
            'Gestão das Emissões de Produtos e Serviços para a Descarbonização das Cidades e do Transporte (30h)',
            'Energias Renováveis (30h)',
            'Oficina de Projetos (5h)',
          ],
        },
        {
          id: 'm4',
          title: 'Módulo IV — TCC',
          items: ['Trabalho de Conclusão de Curso (30h)'],
        },
      ],
    },
  ] satisfies PosProgram[],
}

export type PosProgramTabId = PosProgramId

export interface QuizOption {
  id: 'A' | 'B' | 'C' | 'D'
  text: string
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: QuizOption[]
  correct: QuizOption['id']
  tip: string
}

export interface QuizResultBand {
  min: number
  max: number
  title: string
  blurb: string
}

/** Quiz “Cidades Inteligentes na prática” (feira / painel). */
export const QUIZ = {
  title: 'Quiz · Cidades Inteligentes',
  subtitle: 'Teste seus conhecimentos e conheça as soluções do LabCidades.',
  startCta: 'Começar',
  nextCta: 'Próxima',
  finishCta: 'Ver resultado',
  againCta: 'Jogar de novo',
  homeCta: 'Voltar ao início',
  tipLabel: 'Você sabia?',
  correctLabel: 'Resposta correta!',
  wrongLabel: 'Quase! A resposta certa era:',
  progressLabel: 'Pergunta',
  scoreLabel: 'Acertos',
  questions: [
    {
      id: 'pos',
      prompt:
        'A Pós-Graduação em Cidades Inteligentes da UFES prepara profissionais para atuar principalmente em quê?',
      options: [
        { id: 'A', text: 'Somente na implantação de tecnologias digitais' },
        { id: 'B', text: 'Apenas na elaboração de projetos urbanos' },
        {
          id: 'C',
          text: 'No planejamento e desenvolvimento de cidades mais inteligentes, sustentáveis e inovadoras, integrando gestão, tecnologia e dados',
        },
        { id: 'D', text: 'Exclusivamente na administração de sistemas de informática' },
      ],
      correct: 'C',
      tip: 'Uma cidade inteligente não é definida apenas pela tecnologia. Pessoas, planejamento, sustentabilidade, inovação, governança e uso estratégico de dados também fazem parte dessa transformação.',
    },
    {
      id: 'reurb',
      prompt:
        'Como a tecnologia e o geoprocessamento podem contribuir para a Regularização Fundiária Urbana (REURB)?',
      options: [
        { id: 'A', text: 'Apenas digitalizando documentos e mapas antigos.' },
        {
          id: 'B',
          text: 'Integrando mapas, imagens, dados cadastrais e informações territoriais para agilizar os processos de regularização fundiária.',
        },
        { id: 'C', text: 'Substituindo completamente as análises técnicas e jurídicas.' },
        { id: 'D', text: 'Realizando somente o levantamento de imóveis por fotografias.' },
      ],
      correct: 'B',
      tip: 'O uso de geotecnologias na REURB permite mapear imóveis, identificar ocupações, organizar informações territoriais e apoiar a gestão dos processos, contribuindo para cidades mais inclusivas, planejadas e inteligentes.',
    },
    {
      id: 'ambiental',
      prompt: 'Na área AMBIENTAL, qual aplicação representa melhor uma solução para cidades inteligentes?',
      options: [
        {
          id: 'A',
          text: 'Monitorar indicadores, áreas e condicionantes ambientais com apoio de geotecnologias e dados',
        },
        { id: 'B', text: 'Utilizar somente documentos impressos para fiscalização' },
        { id: 'C', text: 'Realizar análises ambientais apenas quando ocorrer uma denúncia' },
        { id: 'D', text: 'Evitar integrar informações ambientais a outras bases municipais' },
      ],
      correct: 'A',
      tip: 'Geoprocessamento, imagens, sensores, sistemas de informação e painéis podem apoiar o monitoramento ambiental e a atuação preventiva do poder público.',
    },
    {
      id: 'fiscal',
      prompt: 'Como uma solução de inteligência FISCAL pode contribuir para a gestão municipal?',
      options: [
        { id: 'A', text: 'Apenas emitir boletos de impostos' },
        { id: 'B', text: 'Substituir integralmente a equipe de fiscalização' },
        {
          id: 'C',
          text: 'Cruzar dados para identificar inconsistências, apoiar a fiscalização e melhorar a gestão das receitas municipais',
        },
        { id: 'D', text: 'Aumentar automaticamente os impostos municipais' },
      ],
      correct: 'C',
      tip: 'Inteligência de dados pode ajudar o município a identificar padrões e inconsistências e direcionar melhor suas ações de fiscalização.',
    },
    {
      id: 'comum',
      prompt:
        'O que as soluções de OBRAS, AMBIENTAL e FISCAL têm em comum dentro de uma estratégia de Cidade Inteligente?',
      options: [
        { id: 'A', text: 'Dependem exclusivamente de inteligência artificial' },
        {
          id: 'B',
          text: 'Utilizam dados, tecnologia e inteligência territorial para apoiar decisões e melhorar a gestão pública',
        },
        { id: 'C', text: 'Funcionam sem integração com os órgãos públicos' },
        { id: 'D', text: 'Servem apenas para digitalizar documentos' },
      ],
      correct: 'B',
      tip: 'Cidade inteligente é aquela que transforma dados em decisões e decisões em melhores serviços para a população.',
    },
  ] satisfies QuizQuestion[],
  results: [
    {
      min: 5,
      max: 5,
      title: 'Especialista em Cidades Inteligentes',
      blurb:
        'Você domina a visão integrada: dados, gestão e território a serviço da população.',
    },
    {
      min: 4,
      max: 4,
      title: 'Agente da Transformação Urbana',
      blurb:
        'Você já enxerga como tecnologia e planejamento mudam a cidade — continue transformando.',
    },
    {
      min: 2,
      max: 3,
      title: 'Explorador da Cidade Inteligente',
      blurb:
        'Você está mapeando o caminho. Cada descoberta aproxima gestão e inovação.',
    },
    {
      min: 0,
      max: 1,
      title: 'Sua jornada pela Cidade Inteligente está começando!',
      blurb:
        'O primeiro passo é o mais importante. Explore as soluções do LabCidades e volte a jogar.',
    },
  ] satisfies QuizResultBand[],
}

export function quizResultBand(score: number): QuizResultBand {
  return (
    QUIZ.results.find((r) => score >= r.min && score <= r.max) ??
    QUIZ.results[QUIZ.results.length - 1]
  )
}

export function quizResultTitle(score: number) {
  return quizResultBand(score).title
}

