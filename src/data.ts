export type SolutionId = 'consulta' | 'reurb' | 'fiscal' | 'licencas'
export type StageId = 'problema' | 'solucao' | 'impacto'
export type ViewId = 'splash' | 'hub' | 'explore' | 'contact' | 'pos' | 'brinde'

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
  area: string
  tagline: string
  purpose: string
  image: string
  gallery?: string[]
  accent: string
  accentSoft: string
  glow: string
  stages: Record<StageId, StageContent>
}

export const STAGES: { id: StageId; label: string; step: string; icon: 'challenge' | 'solution' | 'impact' }[] = [
  { id: 'problema', label: 'O desafio', step: '01', icon: 'challenge' },
  { id: 'solucao', label: 'A solução', step: '02', icon: 'solution' },
  { id: 'impacto', label: 'O resultado', step: '03', icon: 'impact' },
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
    area: 'Regularização fundiária',
    tagline: 'Diagnóstico da regularização fundiária municipal.',
    purpose:
      'Apoia o município a conhecer o estágio de maturidade da sua REURB, com dashboard, mapa e estudos para planejar e acompanhar a regularização fundiária local.',
    image: './projects/reurb.png',
    gallery: [
      './projects/reurb/01.png',
      './projects/reurb/02.png',
      './projects/reurb/03.png',
      './projects/reurb/04.png',
      './projects/reurb/05.png',
      './projects/reurb/06.png',
      './projects/reurb/07.png',
      './projects/reurb/08.png',
      './projects/reurb/09.png',
    ],
    accent: '#93039f',
    accentSoft: 'rgba(147, 3, 159, 0.16)',
    glow: 'rgba(147, 3, 159, 0.45)',
    stages: {
      problema: {
        title: 'Sem um retrato claro da REURB no município',
        message:
          'A regularização avança em ritmos diferentes em cada bairro e núcleo. Sem diagnóstico municipal, a gestão e a população não enxergam prioridades nem resultados.',
        points: [
          'Falta um panorama completo da REURB no município',
          'Difícil saber onde a prefeitura precisa priorizar ações',
          'Pouca transparência sobre o progresso da regularização local',
        ],
      },
      solucao: {
        title: 'Dashboard, mapa e estudos para a gestão municipal',
        message:
          'O Diagnóstico de Maturidade oferece ferramentas para acompanhar indicadores do município, ver a distribuição no território e consultar estudos que orientam a política local.',
        points: [
          'Dashboard interativo com métricas de maturidade municipal',
          'Mapa SIG dos núcleos e áreas em regularização',
          'Estudos e capacitações para as equipes da prefeitura',
        ],
      },
      impacto: {
        title: 'Regularização com evidência e transparência no município',
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
    name: 'Consulta Cidades',
    short: 'Integração de Dados',
    area: 'Acesso a dados',
    tagline: 'Um ponto de entrada para encontrar informações da cidade.',
    purpose:
      'Reúne dados municipais em um só lugar. Em vez de abrir vários sistemas, o gestor busca o município, o tema ou o indicador que precisa.',
    image: './projects/consulta.jpg',
    accent: '#ff8300',
    accentSoft: 'rgba(255, 131, 0, 0.16)',
    glow: 'rgba(255, 131, 0, 0.45)',
    stages: {
      problema: {
        title: 'A informação existe, mas está espalhada',
        message:
          'Cada secretaria guarda seus dados em um sistema diferente. Quem precisa decidir gasta tempo procurando, e a resposta chega tarde.',
        points: [
          'Bases municipais isoladas umas das outras',
          'Difícil localizar o indicador certo no momento certo',
          'A decisão fica mais lenta do que deveria',
        ],
      },
      solucao: {
        title: 'Uma busca única sobre o território',
        message:
          'A Consulta concentra as camadas do portal LabCidades. Com um toque, a gestão encontra o recorte e segue para o painel correspondente.',
        points: [
          'Busca por município, tema ou indicador',
          'Conecta a pergunta à evidência disponível',
          'Serve de porta de entrada para os demais projetos',
        ],
      },
      impacto: {
        title: 'Consultar a cidade, não caçar arquivos',
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
    name: 'Radar de Inteligência Fiscal',
    short: 'Inteligência Fiscal',
    area: 'Arrecadação',
    tagline: 'Cadastro, dívida ativa e potencial de arrecadação no mapa.',
    purpose:
      'Cruza IPTU, cadastro imobiliário e dívida ativa para revelar o que o município ainda não vê, e onde pode arrecadar com mais justiça.',
    image: './projects/fiscal.png',
    accent: '#5d058c',
    accentSoft: 'rgba(93, 5, 140, 0.18)',
    glow: 'rgba(93, 5, 140, 0.5)',
    stages: {
      problema: {
        title: 'A cidade fiscal é menor que a cidade real',
        message:
          'Imóveis fora do cadastro e dívida sem perfil enfraquecem a arrecadação. A cobrança genérica trata todos os contribuintes da mesma forma.',
        points: [
          'IPTU cobrado sobre uma base incompleta',
          'Dívida ativa sem mapa claro de prioridade',
          'Comunicação igual para perfis muito diferentes',
        ],
      },
      solucao: {
        title: 'Leitura territorial da receita municipal',
        message:
          'A solução organiza o território fiscal: perfil da dívida, leitura do cadastro e priorização de quem pode regularizar.',
        points: [
          'Mapa da dívida ativa por território',
          'Atualização da leitura cadastral',
          'Prioridade para recuperar receita com justiça',
        ],
      },
      impacto: {
        title: 'Arrecadação mais justa e mais eficiente',
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
    area: 'Meio ambiente',
    tagline: 'Validade, prazo e localização das licenças no território.',
    purpose:
      'Em Vargem Alta, o painel mostra no mapa quais licenças estão válidas, quais vão vencer e quais já venceram, para a gestão agir a tempo.',
    image: './projects/licencas.png',
    accent: '#ff8300',
    accentSoft: 'rgba(255, 131, 0, 0.16)',
    glow: 'rgba(255, 131, 0, 0.45)',
    stages: {
      problema: {
        title: 'Prazos se perdem fora do mapa',
        message:
          'Licenças ficam em pastas e planilhas. O município só descobre o problema quando o prazo já passou ou o risco ambiental já aconteceu.',
        points: [
          'Controle fragmentado por processo',
          'Vencimentos invisíveis no território',
          'Fiscalização chega depois do fato',
        ],
      },
      solucao: {
        title: 'Status das licenças no mapa municipal',
        message:
          'O painel reúne validade, prazo e localização. A gestão vê o que está regular, o que está perto de vencer e o que precisa de ação.',
        points: [
          'Acompanhamento contínuo da validade',
          'Leitura espacial das atividades licenciadas',
          'Alerta para licenças a vencer',
        ],
      },
      impacto: {
        title: 'Fiscalização ambiental no tempo certo',
        message:
          'A prefeitura antecipa vencimentos e organiza a fiscalização com evidência, em vez de apagar incêndio.',
        points: [
          'Menos licenças vencidas sem acompanhamento',
          'Prioridade de fiscalização no território',
          'Mais proteção ambiental com antecipação',
        ],
      },
    },
  }

]

export const LAB = {
  name: 'LabCidades',
  full: 'Laboratório das Cidades',
  place: 'UFES · Vitória · Espírito Santo',
  headline: 'Temos soluções inteligentes para desafios urbanos',
  invite: 'Toque na tela para começar',
  cta: 'Conheça os nossos projetos',
  tag: 'projetos inteligentes',
  contactCta: 'Fale conosco',
  posCta: 'Pós-graduação em Cidades Inteligentes',
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

/** Máquina de brindes — 3 iguais = prêmio; “retry” = tente outra vez. */
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

export const POS = {
  title: 'Cidades Inteligentes',
  kicker: 'Pós-graduação · UFES · SEAD',
  headline: 'Pós-graduação em Cidades Inteligentes',
  about:
    'Desenvolver e efetivar análises sobre Cidades Inteligentes por meio de qualificação pós-graduada de profissionais da Gestão Pública. O curso promove reflexão, produção de conhecimento e práticas para melhorar a gestão das cidades.',
  facts: [
    { label: 'Tipo', value: 'Pós-graduação' },
    { label: 'Duração', value: '18 meses' },
    { label: 'Modalidade', value: 'Semipresencial' },
    { label: 'Reconhecimento', value: 'MEC' },
  ],
  coordinator: 'Prof. Dr. Everlam Elias Montibeler',
  hours: '360 horas + TCC',
  modulesCount: '14 disciplinas em 5 módulos',
  profile: [
    'Atuar como agentes multiplicadores nas administrações públicas',
    'Incentivar projetos de melhoria das cidades e dos serviços públicos',
    'Fortalecer a gestão pública municipal',
    'Dominar ferramentas tecnológicas para transformar espaços urbanos em cidades inteligentes',
  ],
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
        'IA, IoT e outras tecnologias (45h)',
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
  offers: [
    {
      year: '2023',
      poles: 'Alegre, Cachoeiro de Itapemirim, Cariacica, Colatina, São Mateus e Vitória',
    },
    {
      year: '2025',
      poles: 'Iúna, Linhares, Serra, Vargem Alta e Vila Velha',
    },
  ],
  qrLabel: 'QR Code do curso',
  qrSrc: './qr-pos.png',
  qrUrl: 'https://sead.ufes.br/cursos/cidades-inteligentes/',
  qrHint: 'Aponte a câmera para acessar a página oficial do curso na SEAD/UFES.',
  ufesLabel: 'Universidade Federal do Espírito Santo',
  ufesSrc: './logo-ufes.png',
  source: 'sead.ufes.br/cursos/cidades-inteligentes',
  tabs: [
    { id: 'sobre', label: 'Sobre' },
    { id: 'perfil', label: 'Perfil' },
    { id: 'grade', label: 'Grade' },
  ] as const,
}

export type PosTabId = (typeof POS.tabs)[number]['id']

