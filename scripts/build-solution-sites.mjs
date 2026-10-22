import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('public/sites')
const templatePath = path.join(root, '_template.html')
if (!fs.existsSync(templatePath)) {
  console.error('Missing public/sites/_template.html')
  process.exit(1)
}

let base = fs.readFileSync(templatePath, 'utf8')
base = base
  .replace('href="styles.css"', 'href="../shared/styles.css"')
  .replace('src="script.js"', 'src="../shared/script.js"')
  .replaceAll('href="img/', 'href="../shared/img/')
  .replaceAll('src="img/', 'src="../shared/img/')
  .replaceAll('data-photo="img/', 'data-photo="../shared/img/')
  .replace(
    'href="../shared/styles.css">',
    'href="../shared/styles.css">\n    <link rel="stylesheet" href="theme.css">',
  )

function cardsHtml(cards) {
  return cards
    .map(
      (c, i) => `                    <a href="#contato" class="card reveal reveal-delay-${i + 1}" id="${c.id}">
                        <div class="card-icon" aria-hidden="true"><i class="fas ${c.icon}"></i></div>
                        <h3>${c.title}</h3>
                        <p>${c.text}</p>
                    </a>`,
    )
    .join('\n')
}

function sobreLayout(s) {
  const imgs = s.sobreImgs
  return `            <div class="sobre-content">
                <div class="sobre-layout">
                <div class="sobre-row sobre-row-1 reveal reveal-delay-1">
                    <div class="sobre-text">
                        <p>${s.sobre[0][0]}</p>
                        <p>${s.sobre[0][1]}</p>
                    </div>
                    <div class="sobre-image sobre-image-mapa">
                        <img src="${imgs.mapa.src}" alt="${imgs.mapa.alt}" class="map-outline" loading="lazy" decoding="async">
                    </div>
                </div>
                <div class="sobre-row sobre-row-2 reveal reveal-delay-2">
                    <div class="sobre-image sobre-image-dashboard">
                        <img src="${imgs.painel.src}" alt="${imgs.painel.alt}" class="map-outline" loading="lazy" decoding="async">
                    </div>
                    <div class="sobre-text">
                        <p>${s.sobre[1][0]}</p>
                        <p>${s.sobre[1][1]}</p>
                    </div>
                </div>
                <div class="sobre-row sobre-row-3 reveal reveal-delay-3">
                    <div class="sobre-text">
                        <p>${s.sobre[2][0]}</p>
                        <p>${s.sobre[2][1]}</p>
                    </div>
                    <div class="sobre-image sobre-image-dados">
                        <img src="${imgs.dados.src}" alt="${imgs.dados.alt}" class="map-outline" loading="lazy" decoding="async">
                    </div>
                </div>
            </div>
            </div>`
}

const solutions = [
  {
    id: 'reurb',
    title: 'REURB · Diagnóstico de Maturidade',
    short: 'Regularização Fundiária',
    logo: '../shared/img/logo-reurb.png',
    heroSub: 'Projeto que mapeia e avalia a regularização fundiária no Espírito Santo.',
    sobreTitle: 'Sobre o Diagnóstico',
    teamSub: 'Equipe engajada na regularização fundiária do Espírito Santo.',
    sysSub: 'Acesse as plataformas desenvolvidas para o projeto.',
    btns: ['Dashboard Interativo', 'Mapa de Maturidade - SIG', 'Estudos de Maturidade'],
    sobreImgs: {
      mapa: { src: '../shared/img/pontos.png', alt: 'Silhueta do Espírito Santo' },
      painel: { src: '../shared/img/painel.png', alt: 'Dashboard com indicadores do diagnóstico' },
      dados: { src: '../shared/img/Dados.png', alt: 'Dados e evolução da regularização fundiária' },
    },
    sobre: [
      [
        'O Diagnóstico de Maturidade da Regularização Fundiária mapeia e avalia o estágio dos processos de REURB no território capixaba.',
        'O estudo oferece dados e ferramentas para apoiar a gestão pública e o planejamento de políticas de regularização fundiária municipal.',
      ],
      [
        'Por meio de dashboards e mapas interativos, gestores e população acompanham indicadores e a evolução da regularização fundiária.',
        'As ferramentas mostram a maturidade de cada município, facilitando prioridades e o acompanhamento de avanços.',
      ],
      [
        'O trabalho fortalece a transparência e decisões baseadas em evidências nas políticas de regularização fundiária no Espírito Santo.',
        'O diagnóstico é atualizado periodicamente, permitindo monitoramento contínuo em todo o território estadual.',
      ],
    ],
    teamDesc:
      'O projeto possui uma equipe dedicada, que acredita no poder da inovação no setor público e é apaixonada por soluções transformadoras na regularização fundiária.',
    contatoIntro:
      'Para mais informações sobre o Diagnóstico de Maturidade da REURB ou sugestões, preencha o formulário abaixo. Sua mensagem será enviada para o LabCidades.',
    cards: [
      { id: 'dashboard', icon: 'fa-chart-line', title: 'Dashboard Interativo', text: 'Visualize indicadores e métricas de maturidade em tempo real' },
      { id: 'mapa-sig', icon: 'fa-map-location-dot', title: 'Mapa de Maturidade - SIG', text: 'Explore a distribuição geográfica dos dados' },
      { id: 'estudos-maturidade', icon: 'fa-file-lines', title: 'Estudos de Maturidade', text: 'Acesse os estudos de maturidade por município' },
      { id: 'capacitacoes', icon: 'fa-graduation-cap', title: 'Capacitações', text: 'Materiais e cursos para capacitação em regularização fundiária' },
    ],
    footer: '© 2026 Diagnóstico de Maturidade da Regularização Fundiária - Espírito Santo',
    subject: 'Contato - REURB LabCidades',
  },
  {
    id: 'consulta',
    title: 'Consulta Cidades · Integração de Dados',
    short: 'Consulta Cidades',
    logo: '../shared/img/logo-consulta.png',
    heroSub: 'Um ponto de entrada para encontrar informações da cidade.',
    sobreTitle: 'Sobre a Consulta',
    teamSub: 'Equipe engajada em dados e inteligência territorial.',
    sysSub: 'Ferramentas para consulta e integração de bases municipais.',
    btns: ['Busca Integrada', 'Indicadores', 'Painéis Temáticos'],
    sobreImgs: {
      mapa: { src: '../shared/img/icons/consulta-mapa.svg', alt: 'Busca e integração de dados' },
      painel: { src: '../shared/img/icons/consulta-painel.svg', alt: 'Indicadores e painéis' },
      dados: { src: '../shared/img/icons/consulta-dados.svg', alt: 'Bases de dados municipais' },
    },
    sobre: [
      [
        'A Consulta Cidades reúne bases e indicadores municipais em um único ponto de acesso para a gestão pública.',
        'Em vez de abrir vários sistemas, o gestor busca o município, o tema ou o indicador que precisa — com rapidez e clareza.',
      ],
      [
        'A solução conecta perguntas da gestão às evidências disponíveis no portal LabCidades e em bases integradas.',
        'Dashboards e buscas temáticas ajudam a localizar a informação certa no momento da decisão.',
      ],
      [
        'Com a Consulta, a informação deixa de ficar espalhada e passa a apoiar decisões urbanas com mais agilidade.',
        'O conteúdo pode ser atualizado conforme novas bases e painéis forem integrados ao ecossistema LabCidades.',
      ],
    ],
    teamDesc:
      'Equipe dedicada a integrar dados urbanos e tornar a informação municipal acessível para quem decide e para quem pesquisa.',
    contatoIntro:
      'Para mais informações sobre a Consulta Cidades ou sugestões de integração de dados, preencha o formulário abaixo. Sua mensagem será enviada para o LabCidades.',
    cards: [
      { id: 'dashboard', icon: 'fa-magnifying-glass', title: 'Busca Integrada', text: 'Encontre município, tema ou indicador em um só lugar' },
      { id: 'mapa-sig', icon: 'fa-chart-pie', title: 'Indicadores', text: 'Consulte evidências disponíveis para a gestão' },
      { id: 'estudos-maturidade', icon: 'fa-layer-group', title: 'Painéis Temáticos', text: 'Acesse os recortes do portal LabCidades' },
      { id: 'capacitacoes', icon: 'fa-book-open', title: 'Guias e Capacitações', text: 'Materiais para uso de dados na gestão pública' },
    ],
    footer: '© 2026 Consulta Cidades - LabCidades / UFES',
    subject: 'Contato - Consulta Cidades LabCidades',
  },
  {
    id: 'fiscal',
    title: 'Radar de Inteligência Fiscal',
    short: 'Inteligência Fiscal',
    logo: '../shared/img/logo-fiscal.png',
    heroSub: 'Cadastro, dívida ativa e potencial de arrecadação no mapa.',
    sobreTitle: 'Sobre o Radar Fiscal',
    teamSub: 'Equipe engajada em inteligência fiscal territorial.',
    sysSub: 'Ferramentas para leitura fiscal do território.',
    btns: ['Mapa da Dívida', 'Leitura Cadastral', 'Priorização'],
    sobreImgs: {
      mapa: { src: '../shared/img/icons/fiscal-mapa.svg', alt: 'Localização fiscal no território' },
      painel: { src: '../shared/img/icons/fiscal-painel.svg', alt: 'Arrecadação e cadastro' },
      dados: { src: '../shared/img/icons/fiscal-dados.svg', alt: 'Dívida ativa e priorização' },
    },
    sobre: [
      [
        'O Radar de Inteligência Fiscal cruza IPTU, cadastro imobiliário e dívida ativa para revelar o que o município ainda não vê.',
        'A leitura territorial mostra onde há potencial de arrecadação e onde a cobrança pode ser mais justa e eficiente.',
      ],
      [
        'Mapas e painéis organizam o perfil da dívida, a atualização cadastral e a priorização de quem pode regularizar.',
        'A gestão deixa a cobrança genérica e passa a agir com foco no território e nos contribuintes.',
      ],
      [
        'Com evidência espacial, a prefeitura recupera receita com mais transparência e menos desigualdade na cobrança.',
        'O radar pode ser atualizado conforme novas bases fiscais e cadastros forem incorporados.',
      ],
    ],
    teamDesc:
      'Equipe dedicada a cruzar dados fiscais e territoriais para apoiar arrecadação justa e gestão municipal baseada em evidências.',
    contatoIntro:
      'Para mais informações sobre o Radar de Inteligência Fiscal ou parcerias com municípios, preencha o formulário abaixo. Sua mensagem será enviada para o LabCidades.',
    cards: [
      { id: 'dashboard', icon: 'fa-map', title: 'Mapa da Dívida Ativa', text: 'Visualize a dívida por território' },
      { id: 'mapa-sig', icon: 'fa-building', title: 'Leitura Cadastral', text: 'Atualize a leitura do cadastro imobiliário' },
      { id: 'estudos-maturidade', icon: 'fa-bullseye', title: 'Priorização', text: 'Foque onde recuperar receita com justiça' },
      { id: 'capacitacoes', icon: 'fa-handshake', title: 'Capacitações', text: 'Materiais para equipes de arrecadação' },
    ],
    footer: '© 2026 Radar de Inteligência Fiscal - LabCidades / UFES',
    subject: 'Contato - Inteligência Fiscal LabCidades',
  },
  {
    id: 'licencas',
    title: 'Monitor de Licenças Ambientais',
    short: 'Licenças Ambientais',
    logo: '../shared/img/logo-licencas.png',
    heroSub: 'Validade, prazo e localização das licenças no território.',
    sobreTitle: 'Sobre o Monitor',
    teamSub: 'Equipe engajada em gestão ambiental territorial.',
    sysSub: 'Ferramentas para acompanhar licenças ambientais.',
    btns: ['Mapa de Licenças', 'Vencimentos', 'Alertas'],
    sobreImgs: {
      mapa: { src: '../shared/img/icons/licencas-mapa.svg', alt: 'Território e licenças ambientais' },
      painel: { src: '../shared/img/icons/licencas-painel.svg', alt: 'Prazos e vencimentos' },
      dados: { src: '../shared/img/icons/licencas-dados.svg', alt: 'Monitoramento ambiental' },
    },
    sobre: [
      [
        'O Monitor de Licenças Ambientais mostra no mapa quais licenças estão válidas, quais vão vencer e quais já venceram.',
        'A gestão deixa de depender só de pastas e planilhas e passa a enxergar prazos no território.',
      ],
      [
        'Painéis e alertas ajudam a antecipar vencimentos e organizar a fiscalização com evidência espacial.',
        'É possível priorizar ações antes do risco ambiental se concretizar.',
      ],
      [
        'Com o monitor, a prefeitura ganha antecipação, proteção ambiental e mais capacidade de prestar contas.',
        'Os dados podem ser atualizados conforme novos processos e licenças forem cadastrados.',
      ],
    ],
    teamDesc:
      'Equipe dedicada a conectar licenciamento ambiental e território, para que a fiscalização chegue no tempo certo.',
    contatoIntro:
      'Para mais informações sobre o Monitor de Licenças Ambientais ou implantação em municípios, preencha o formulário abaixo. Sua mensagem será enviada para o LabCidades.',
    cards: [
      { id: 'dashboard', icon: 'fa-earth-americas', title: 'Mapa de Licenças', text: 'Veja no mapa o status das licenças' },
      { id: 'mapa-sig', icon: 'fa-clock', title: 'Vencimentos', text: 'Acompanhe prazos e validade' },
      { id: 'estudos-maturidade', icon: 'fa-bell', title: 'Alertas', text: 'Antecipe ações antes do vencimento' },
      { id: 'capacitacoes', icon: 'fa-seedling', title: 'Capacitações', text: 'Materiais para equipes ambientais' },
    ],
    footer: '© 2026 Monitor de Licenças Ambientais - LabCidades / UFES',
    subject: 'Contato - Licenças Ambientais LabCidades',
  },
]

for (const s of solutions) {
  let html = base

  html = html.replace(
    /<div class="sobre-content">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*\n\s*<section class="team-section/,
    `${sobreLayout(s)}
        </section>

        <section class="team-section`,
  )

  html = html.replace(
    /<div class="cards-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>\s*\n\s*<section class="contato-section/,
    `<div class="cards-grid">
${cardsHtml(s.cards)}
                </div>
            </div>
        </section>

        <section class="contato-section`,
  )

  html = html.replace(
    /<p class="team-description">[\s\S]*?<\/p>/,
    `<p class="team-description">\n                    ${s.teamDesc}\n                </p>`,
  )
  html = html.replace(
    /<p class="contato-intro">[\s\S]*?<\/p>/,
    `<p class="contato-intro">\n                    ${s.contatoIntro}\n                </p>`,
  )

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${s.title}</title>`)
  html = html.replaceAll('../shared/img/logo.png', s.logo)
  html = html.replace('Logo - Maturidade Fundiária ES', s.short)
  html = html.replaceAll(
    'Diagnóstico de Maturidade da Regularização Fundiária - Espírito Santo',
    s.title,
  )
  html = html.replace(
    'Projeto que mapeia e avalia a regularização fundiária no Espírito Santo.',
    s.heroSub,
  )
  html = html.replace('Sobre o Diagnóstico', s.sobreTitle)
  html = html.replace(
    'Equipe engajada na regularização fundiária do Espírito Santo.',
    s.teamSub,
  )
  html = html.replace('Acesse as plataformas desenvolvidas para o projeto.', s.sysSub)
  html = html.replace(
    '© 2026 Diagnóstico de Maturidade da Regularização Fundiária - Espírito Santo',
    s.footer,
  )
  html = html.replace('Contato - Diagnóstico Maturidade Fundiária ES', s.subject)
  html = html.replace('>Dashboard Interativo</a>', `>${s.btns[0]}</a>`)
  html = html.replace('>Mapa de Maturidade - SIG</a>', `>${s.btns[1]}</a>`)
  html = html.replace('>Estudos de Maturidade</a>', `>${s.btns[2]}</a>`)

  fs.mkdirSync(path.join(root, s.id), { recursive: true })
  fs.writeFileSync(path.join(root, s.id, 'index.html'), html)
  console.log('ok', s.id)
}
