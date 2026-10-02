"use strict";

const APP_EDITION = window.FINUP_EDITION === "community" ? "community" : "full";
const EDUCATION_VIEWS = new Set(["trilhas", "atividades", "conquistas"]);
const EDUCATION_GROUPS = new Set(["JORNADA FINUP", "APRENDIZAGEM", "INDICADORES EDUCACIONAIS"]);
document.documentElement.dataset.edition = APP_EDITION;

const icons = {
  home: '<path d="M3 10.7 12 3l9 7.7"/><path d="M5 9.8V21h14V9.8"/><path d="M9 21v-7h6v7"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="1"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/>',
  file: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/>',
  wallet: '<path d="M3 6h16v14H3z"/><path d="M3 8V5h13M15 12h6v5h-6a2 2 0 0 1 0-5z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  chart: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowUp: '<path d="m18 15-6-6-6 6"/>',
  arrowDown: '<path d="m6 9 6 6 6-6"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-1 .8-1.7 1.2-1.7 2.7M12 17h.01"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  logout: '<path d="M10 17l5-5-5-5M15 12H3M14 3h6v18h-6"/>',
  cube: '<path d="m12 2 9 5-9 5-9-5zM3 7v10l9 5 9-5V7M12 12v10"/>',
  palette: '<path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a1.5 1.5 0 0 1 0-3h2a7 7 0 0 0-2-11z"/><circle cx="7.5" cy="10" r=".7" fill="currentColor"/><circle cx="9" cy="6.5" r=".7" fill="currentColor"/><circle cx="14" cy="6.5" r=".7" fill="currentColor"/>',
  code: '<path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/>',
  video: '<rect x="3" y="5" width="14" height="14" rx="1"/><path d="m17 10 4-3v10l-4-3z"/>',
  tool: '<path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 8.5 7.1 6.2 4.8a4 4 0 0 0 5 5L4 17l3 3 7.7-7.7a4 4 0 0 0 5-5L17.4 9.6 14 6.2z"/>',
  cpu: '<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  alert: '<path d="M12 3 2 21h20z"/><path d="M12 9v5M12 18h.01"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  upload: '<path d="M12 17V5M7 10l5-5 5 5M4 21h16"/>',
  award: '<circle cx="12" cy="8" r="5"/><path d="M8.5 12 7 22l5-3 5 3-1.5-10"/>',
  school: '<path d="m3 10 9-7 9 7v10H3zM8 20v-6h8v6M2 10h20"/>',
  accessibility: '<circle cx="12" cy="4" r="2"/><path d="M5 8h14M12 6v15M8 21l4-8 4 8"/>',
  type: '<path d="M4 6V4h16v2M9 20h6M12 4v16"/>',
  contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
  motion: '<path d="M4 8h10M2 12h12M5 16h9"/><path d="m15 7 5 5-5 5"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  sync: '<path d="M20 7h-5V2M4 17h5v5"/><path d="M5.8 8A7 7 0 0 1 18 6l2 1M18.2 16A7 7 0 0 1 6 18l-2-1"/>',
  idcard: '<rect x="3" y="5" width="18" height="14" rx="1"/><circle cx="8" cy="11" r="2"/><path d="M5.5 16c.6-1.7 4.4-1.7 5 0M13 10h5M13 14h5"/>',
  graduation: '<path d="m2 10 10-5 10 5-10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5M22 10v6"/>',
  building: '<path d="M4 21V7l8-4 8 4v14M2 21h20M8 10h2M14 10h2M8 14h2M14 14h2M10 21v-4h4v4"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 5a9 9 0 0 1 0 14"/>',
  speed: '<path d="M4 14a8 8 0 1 1 16 0"/><path d="m12 14 4-4M5 18h14"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/>',
  message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3v-7a4 4 0 0 1-1-2.6V7a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4z"/>',
  bot: '<rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M8 12h.01M16 12h.01M8 16h8"/>',
  printer: '<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/>',
  book: '<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22z"/><path d="M4 5.5v13A3.5 3.5 0 0 1 7.5 15H20M9 6h7M9 10h7"/>',
  play: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  star: '<path d="m12 2.5 3 6.1 6.7 1-4.9 4.7 1.2 6.7-6-3.1-6 3.1 1.2-6.7-4.9-4.7 6.7-1z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 22a8 8 0 0 1 16 0"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z"/>',
};

function icon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.help}</svg>`;
}

const STORAGE_KEY = "caixa-senai-v6";
const profileData = {
  aluno: { name: "Kaique Silva", initials: "KS", label: "Aluno • DS2" },
  professor: { name: "Marcos Lima", initials: "ML", label: "Docente • DS2 / MEC2" },
  adm: { name: "Ana Paula Rocha", initials: "AP", label: "ADM • SENAI-SP" },
  desenvolvedor: { name: "Equipe FinUp", initials: "EF", label: "Desenvolvedor • Ambiente de teste" },
};

function makeDefaultState() {
  return {
    loggedIn: false,
    theme: "light",
    role: "aluno",
    activeView: "inicio",
    assistantMode: "kaique",
    assistantId: "kaique",
    notificationRead: false,
    learning: { completed: ["fundamentos"], xp: 320, quizScore: null },
    textSize: "normal",
    highContrast: false,
    reducedMotion: false,
    readingSpeed: 1,
    highlightLinks: false,
    readableFont: false,
    wideSpacing: false,
    monochrome: false,
    readingGuide: false,
    negotiationBalance: 10,
    noteBalance: 0,
    filters: { service: "", category: "Todos", contract: "Todos", registry: "" },
    platformStatus: { status: "checking", message: "Verificando os serviços seguros do Caixa SENAI…" },
    integration: { status: "checking", message: "Verificando configuração segura…", checkedAt: null },
    ngrokIntegration: { status: "idle", message: "Ponte ngrok ainda não verificada.", endpoint: null, checkedAt: null },
    aiConversation: [
      { from: "ai", text: "Olá! Sou o Caixa IA. Posso explicar negociações de serviços, contratos, créditos, acessibilidade, chat e suporte pedagógico." },
    ],
    contracts: [
      { id: "CTR-031", title: "Identidade visual da interface", from: "Equipe Vértice", to: "Comunicação Visual 02", value: 3, deadline: "29 AGO", status: "Em negociação", description: "Sistema visual e componentes principais para o protótipo da plataforma.", criteria: "Paleta compatível com a marca SENAI, contraste acessível e arquivo editável.", offerHistory: [{ author: "Equipe Vértice", value: 3, note: "Proposta inicial com dois ciclos de revisão.", time: "Hoje, 09:15" }] },
      { id: "CTR-030", title: "Modelagem 3D do gabinete", from: "Equipe Vértice", to: "Mecatrônica 03", value: 4, deadline: "02 SET", status: "Em negociação", description: "Modelagem completa do gabinete, com arquivos STEP e STL prontos para prototipagem.", criteria: "Arquivos editáveis, espessura mínima de 2 mm e encaixes validados.", offerHistory: [{ author: "Mecatrônica 03", value: 4, note: "Contraproposta considerando a validação dos encaixes.", time: "Ontem, 16:40" }] },
      { id: "CTR-029", title: "Revisão de acessibilidade do código", from: "Desenvolvimento 05", to: "Equipe Vértice", value: 2, deadline: "27 AGO", status: "Aguardando validação", description: "Auditoria de navegação por teclado, semântica e contraste.", criteria: "Checklist WCAG, correções documentadas e teste com leitor de tela.", offerHistory: [] },
    ],
    transactions: [
      { id: "TRX-1101", title: "Saldo inicial da conta de serviços", group: "Regra do projeto", value: 10, type: "entrada", date: "21 ago, 08:00" },
    ],
    audit: [
      { title: "Saldo inicial concedido", detail: "A Equipe Vértice recebeu 10 créditos exclusivos para negociação de serviços.", time: "Hoje, 08:00" },
      { title: "Contraproposta registrada", detail: "O valor do CTR-030 foi ajustado para 4 créditos.", time: "Ontem, 16:40" },
      { title: "Entrega registrada", detail: "CTR-029 recebeu evidências e aguarda validação.", time: "Ontem, 14:10" },
    ],
    registry: [
      { id: "2026001842", name: "Kaique dos Santos Silva", type: "Aluno", unit: "SENAI-SP", className: "DS2", status: "Ativo" },
      { id: "DOC-1048", name: "Marcos Lima", type: "Docente", unit: "SENAI-SP", className: "DS2 / MEC2", status: "Ativo" },
      { id: "ADM-021", name: "Ana Paula Rocha", type: "ADM", unit: "SENAI-SP", className: "Gestão", status: "Ativo" },
      { id: "2026001997", name: "Arthur Garcia", type: "Aluno", unit: "SENAI-SP", className: "DS2", status: "Ativo" },
    ],
  };
}

function loadState() {
  const defaults = makeDefaultState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return defaults;
    if (saved.role === "admin" || saved.role === "diretor") saved.role = "adm";
    return { ...defaults, ...saved, loggedIn: false, role: "aluno", learning: { ...defaults.learning, ...(saved.learning || {}) }, filters: { ...defaults.filters, ...(saved.filters || {}) }, platformStatus: { ...defaults.platformStatus, ...(saved.platformStatus || {}) }, integration: { ...defaults.integration, ...(saved.integration || {}) }, ngrokIntegration: { ...defaults.ngrokIntegration, ...(saved.ngrokIntegration || {}) } };
  } catch {
    return defaults;
  }
}

let state = loadState();
let lastFocusedElement = null;
let speechQueue = [];
let speechActive = false;
let chatMessages = [];
let chatStatus = "loading";
let chatPollTimer = null;
let authRequestVersion = 0;

const assistants = {
  kaique: { name: "Kaique", role: "Desenvolvimento", folder: "kaique" },
  arthur: { name: "Arthur", role: "Banco de dados", folder: "arthur" },
  gabriel: { name: "Gabriel Ricardo", role: "Experiência do usuário", folder: "gabriel" },
  diosman: { name: "Diosman", role: "Testes e documentação", folder: "diosman" },
  gustavo: { name: "Gustavo", role: "Liderança do projeto", folder: "gustavo" },
};

const assistantIds = Object.keys(assistants);

function getActiveAssistant() {
  const id = assistantIds.includes(state.assistantId) ? state.assistantId : "kaique";
  return { id, ...assistants[id] };
}

function assistantAsset(file, extension = "gif") {
  const assistant = getActiveAssistant();
  return `./assets/images/tutorial-caixa/assistants/${assistant.folder}/${file}.${extension}`;
}

function assistantChoiceLabel() {
  const assistant = getActiveAssistant();
  return state.assistantMode === "random" ? `Aleatório: ${assistant.name}` : assistant.name;
}

function syncAssistantUi() {
  const assistant = getActiveAssistant();
  const poster = assistantAsset("01-o-que-e-o-caixa", "png");
  const animation = assistantAsset("01-o-que-e-o-caixa", "gif");
  const loginAvatar = document.getElementById("loginAssistantAvatar");
  const topbarAvatar = document.getElementById("assistantTopbarAvatar");
  if (loginAvatar) loginAvatar.src = animation;
  if (topbarAvatar) topbarAvatar.src = poster;
  ["loginAssistantName", "assistantTopbarName", "sidebarAssistantName"].forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.textContent = assistant.name;
  });
}

const services = [
  { id: 1, title: "Modelagem 3D e render técnico", category: "Design de Produto", group: "Mecatrônica 03", initials: "M3", price: 4, icon: "cube", description: "Modelos editáveis, renderização e arquivos preparados para prototipagem." },
  { id: 2, title: "Identidade visual para projetos", category: "Comunicação Visual", group: "Comunicação Visual 02", initials: "CV", price: 3, icon: "palette", description: "Logotipo de projeto, paleta, tipografia e kit básico de comunicação." },
  { id: 3, title: "Landing page responsiva", category: "Desenvolvimento", group: "Desenvolvimento 05", initials: "D5", price: 5, icon: "code", description: "Página institucional responsiva em HTML, CSS e JavaScript." },
  { id: 4, title: "Vídeo pitch e apresentação", category: "Audiovisual", group: "Multimídia 01", initials: "MM", price: 3, icon: "video", description: "Roteiro, edição, legendas e finalização de vídeo de até três minutos." },
  { id: 5, title: "Prototipagem eletrônica", category: "Eletrônica", group: "Eletrônica 04", initials: "E4", price: 6, icon: "cpu", description: "Circuitos, firmware e validação funcional para protótipos de TCC." },
  { id: 6, title: "Usinagem CNC de componentes", category: "Manufatura", group: "Manufatura 02", initials: "M2", price: 5, icon: "tool", description: "Preparação, usinagem e conferência dimensional de componentes." },
];

const members = [
  { initials: "KS", name: "Kaique dos Santos Silva", role: "Desenvolvimento" },
  { initials: "AG", name: "Arthur Garcia", role: "Banco de dados" },
  { initials: "GR", name: "Gabriel Ricardo", role: "Experiência do usuário" },
  { initials: "GD", name: "Gabriel Diosman", role: "Testes e documentação" },
  { initials: "GG", name: "Gustavo Gabriel", role: "Líder do grupo" },
];

const learningModules = [
  { id: "fundamentos", title: "Fundamentos do Caixa", icon: "book", duration: "8 min", xp: 80, level: "Essencial", summary: "Entenda créditos pedagógicos, perfis e regras de segurança.", topics: ["Créditos sem valor monetário", "Perfis e permissões", "Ambiente demonstrativo"] },
  { id: "negociacao", title: "Negociação de serviços", icon: "briefcase", duration: "12 min", xp: 120, level: "Prática", summary: "Monte uma proposta com valor, prazo, entregáveis e critérios claros.", topics: ["Catálogo de competências", "Oferta e contraproposta", "Critérios de aceite"] },
  { id: "contratos", title: "Contratos e entregas", icon: "file", duration: "10 min", xp: 100, level: "Prática", summary: "Acompanhe o acordo até a entrega e a validação pedagógica.", topics: ["Reserva de créditos", "Registro de evidências", "Validação do professor"] },
  { id: "planejamento", title: "Planejamento financeiro", icon: "target", duration: "14 min", xp: 140, level: "Avançada", summary: "Organize os créditos do grupo e tome decisões responsáveis.", topics: ["Definição de prioridades", "Controle de saldo", "Análise de resultados"] },
];

const quizQuestions = [
  { id: "q1", prompt: "Quando os créditos são reservados para um serviço?", options: [["a", "Ao abrir o catálogo"], ["b", "Depois que a proposta é aceita"], ["c", "Somente no fim do semestre"]], correct: "b" },
  { id: "q2", prompt: "O que deve aparecer em uma proposta bem definida?", options: [["a", "Apenas o nome do serviço"], ["b", "Somente o valor"], ["c", "Valor, prazo, entregáveis e critérios"]], correct: "c" },
  { id: "q3", prompt: "Os créditos do Caixa representam dinheiro real?", options: [["a", "Não, são recursos pedagógicos"], ["b", "Sim, podem ser sacados"], ["c", "Somente para professores"]], correct: "a" },
];

const leaderboard = [
  { name: "Comunicação Visual 02", className: "CV1", xp: 1180 },
  { name: "Equipe Vértice", className: "DS2", xp: 1040 },
  { name: "Mecatrônica 03", className: "MEC2", xp: 930 },
  { name: "Eletrônica 04", className: "EL2", xp: 810 },
  { name: "Multimídia 01", className: "MM1", xp: 745 },
];

const viewMeta = {
  inicio: ["CONTA DE SERVIÇOS", "Início"], tutorial: ["PRIMEIROS PASSOS", "Tutorial do Caixa"], trilhas: ["JORNADA FINUP", "Trilhas"], atividades: ["APRENDIZAGEM", "Atividades"], conquistas: ["EVOLUÇÃO", "Conquistas"], servicos: ["COLABORAÇÃO", "Serviços"], contratos: ["NEGOCIAÇÕES", "Contratos"], carteira: ["CRÉDITOS", "Carteira"], grupo: ["PROJETO", "Meu grupo"], gestao: ["ACOMPANHAMENTO", "Gestão"], auditoria: ["SEGURANÇA", "Auditoria"], registro: ["CADASTRO INSTITUCIONAL", "Registro geral"], integracao: ["CONEXÃO INSTITUCIONAL", "Integrações"], chat: ["COMUNIDADE", "Chat entre turmas"], suporte: ["ASSISTÊNCIA", "Caixa IA"], acessibilidade: ["INCLUSÃO DIGITAL", "Acessibilidade"], perfil: ["CONTA", "Meu perfil"],
};

const allowedViews = {
  aluno: ["inicio", "tutorial", "trilhas", "atividades", "conquistas", "servicos", "contratos", "carteira", "grupo", "chat", "suporte", "acessibilidade", "perfil"],
  professor: ["inicio", "tutorial", "trilhas", "atividades", "conquistas", "servicos", "contratos", "carteira", "gestao", "auditoria", "chat", "suporte", "acessibilidade", "perfil"],
  adm: ["inicio", "tutorial", "servicos", "registro", "gestao", "contratos", "auditoria", "integracao", "chat", "suporte", "acessibilidade", "perfil"],
  desenvolvedor: ["inicio", "integracao", "auditoria", "chat", "suporte", "acessibilidade", "perfil"],
};

function availableViewsForRole(role) {
  const views = allowedViews[role] || allowedViews.aluno;
  return APP_EDITION === "community" ? views.filter((view) => !EDUCATION_VIEWS.has(view)) : views;
}

function escapeHtml(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function announce(message) {
  const live = document.getElementById("srStatus");
  if (!live) return;
  live.textContent = "";
  requestAnimationFrame(() => { live.textContent = message; });
}

function statusClass(status) {
  const map = { "Em andamento": "andamento", "Em análise": "analise", "Aguardando validação": "validacao", "Em negociação": "negociacao", Concluído: "concluido", Ativo: "concluido", Ocorrência: "ocorrencia", Recusado: "recusado" };
  return map[status] || "analise";
}

function statusBadge(status) { return `<span class="status ${statusClass(status)}">${escapeHtml(status)}</span>`; }
function formatCredits(value) { return new Intl.NumberFormat("pt-BR").format(value); }

function pageHead(eyebrow, title, description, actions = "") {
  return `<header class="page-head"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${description}</p></div>${actions ? `<div class="page-actions">${actions}</div>` : ""}</header>`;
}

function roleBanner(role, title, copy) {
  const iconName = role === "aluno" ? "graduation" : role === "professor" ? "school" : role === "desenvolvedor" ? "code" : "building";
  return `<div class="role-banner ${role}"><span>${icon(iconName)}</span><div><strong>${title}</strong><small>${copy}</small></div></div>`;
}

function renderNav() {
  const menus = {
    aluno: [["CONTA DE SERVIÇOS"], ["inicio", "home", "Início"], ["tutorial", "help", "Como funciona o Caixa"], ["servicos", "briefcase", "Negociar serviços"], ["contratos", "file", "Propostas e contratos"], ["carteira", "wallet", "Créditos"], ["grupo", "users", "Meu grupo"], ["JORNADA FINUP"], ["trilhas", "book", "Trilhas de aprendizagem"], ["atividades", "target", "Atividades e quiz"], ["conquistas", "award", "XP e conquistas"], ["COMUNIDADE E AJUDA"], ["chat", "message", "Chat entre turmas"], ["suporte", "bot", "Caixa IA"], ["acessibilidade", "accessibility", "Acessibilidade"], ["perfil", "user", "Meu perfil"]],
    professor: [["DOCÊNCIA"], ["inicio", "home", "Painel docente"], ["tutorial", "help", "Como funciona o Caixa"], ["servicos", "briefcase", "Negociar serviços"], ["gestao", "users", "Turmas e grupos"], ["contratos", "file", "Validações"], ["carteira", "wallet", "Créditos"], ["auditoria", "shield", "Ocorrências"], ["APRENDIZAGEM"], ["trilhas", "book", "Conteúdos e trilhas"], ["atividades", "target", "Avaliações"], ["conquistas", "chart", "Desempenho"], ["COMUNIDADE E AJUDA"], ["chat", "message", "Chat entre turmas"], ["suporte", "bot", "Caixa IA"], ["acessibilidade", "accessibility", "Acessibilidade"], ["perfil", "user", "Meu perfil"]],
    adm: [["ADMINISTRAÇÃO"], ["inicio", "home", "Painel ADM"], ["tutorial", "help", "Como funciona o Caixa"], ["servicos", "briefcase", "Catálogo de serviços"], ["registro", "idcard", "Registro geral"], ["gestao", "chart", "Unidade e grupos"], ["contratos", "file", "Contratos"], ["auditoria", "shield", "Auditoria"], ["integracao", "sync", "Integrações"], ["COMUNIDADE E AJUDA"], ["chat", "message", "Chat entre turmas"], ["suporte", "bot", "Caixa IA"], ["acessibilidade", "accessibility", "Acessibilidade"], ["perfil", "user", "Meu perfil"]],
    desenvolvedor: [["FERRAMENTAS TÉCNICAS"], ["inicio", "home", "Painel técnico"], ["integracao", "code", "Serviços e integrações"], ["auditoria", "shield", "Eventos demonstrativos"], ["COMUNIDADE E AJUDA"], ["chat", "message", "Chat entre turmas"], ["suporte", "bot", "Caixa IA"], ["acessibilidade", "accessibility", "Acessibilidade"], ["perfil", "user", "Meu perfil"]],
  };
  const menu = APP_EDITION === "community"
    ? menus[state.role].filter((item) => item.length === 1 ? !EDUCATION_GROUPS.has(item[0]) : !EDUCATION_VIEWS.has(item[0]))
    : menus[state.role];
  document.getElementById("navList").innerHTML = menu.map((item) => item.length === 1
    ? `<div class="nav-group-label">${item[0]}</div>`
    : `<button class="nav-button ${state.activeView === item[0] ? "active" : ""}" type="button" data-view="${item[0]}" ${state.activeView === item[0] ? 'aria-current="page"' : ""}>${icon(item[1])}<span>${item[2]}</span></button>`).join("");
  document.querySelectorAll("#mobileBottomNav [data-view]").forEach((button) => {
    const isActive = button.dataset.view === state.activeView;
    button.classList.toggle("active", isActive);
    if (isActive) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  document.querySelector("#primaryNav [aria-current='page']")?.scrollIntoView({ block: "nearest" });
}

function renderQuickAndDeadlines(actions, contracts) {
  return `<section class="home-shortcuts"><h2>Acessos rápidos</h2><div class="quick-actions">${actions.map(([action, ico, title]) => `<button class="quick-action" type="button" data-action="${action}"><span>${icon(ico)}</span><strong>${title}</strong></button>`).join("")}</div></section>`;
}

function renderHomeHero({ label, value, unit, description, actions = [] }) {
  return `<section class="overview-grid role-home-overview" aria-label="${escapeHtml(label)}">
    <article class="balance-panel service-account-hero student-balance-card"><div class="balance-copy"><div class="student-balance-heading"><small>${escapeHtml(label)}</small><span class="student-demo-tag">AMBIENTE DEMONSTRATIVO</span></div><div class="balance-value"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(unit)}</span></div><p>${escapeHtml(description)}</p>${actions.length ? `<div class="account-actions">${actions.map(({ action, ico, title }) => `<button type="button" data-action="${action}">${icon(ico)} ${escapeHtml(title)}</button>`).join("")}</div>` : ""}</div></article>
  </section>`;
}

function renderHomeSummary(title, eyebrow, items, headingAction = null) {
  return `<section class="home-lite-summary home-overview-summary" aria-labelledby="homeSummaryTitle">
    <div class="home-lite-summary-head"><div><span class="eyebrow">${escapeHtml(eyebrow)}</span><h2 id="homeSummaryTitle">${escapeHtml(title)}</h2></div>${headingAction ? `<button type="button" data-action="${headingAction.action}">${escapeHtml(headingAction.title)} ${icon("arrowRight")}</button>` : ""}</div>
    <div class="home-lite-summary-grid">${items.map(({ action, ico, label, value, description }) => `<button class="home-lite-stat" type="button" data-action="${action}" aria-label="${escapeHtml(`${label}: ${value}. ${description}`)}"><span class="home-lite-stat-icon">${icon(ico)}</span><span><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong><em>${escapeHtml(description)}</em></span>${icon("arrowRight")}</button>`).join("")}</div>
  </section>`;
}

function renderStudentHome() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const nextContract = state.contracts.find((contract) => contract.status === "Aguardando validação") || state.contracts[0];
  return `${pageHead("SEU ESPAÇO", `${greeting}, ${escapeHtml(profileData.aluno.name.split(" ")[0])}.`, "Seu projeto em um só lugar: acompanhe os créditos, avance nas negociações e continue aprendendo.", "")}
  ${renderHomeHero({ label: "CRÉDITOS DO GRUPO", value: formatCredits(state.negotiationBalance), unit: "créditos disponíveis", description: "Créditos pedagógicos para negociar com outros grupos. Não representam dinheiro real.", actions: [{ action: "open-services", ico: "briefcase", title: "Explorar serviços" }, { action: "open-contracts", ico: "file", title: "Ver propostas" }] })}
  ${renderHomeSummary("Seu projeto está avançando", "PARA CONTINUAR", [
    { action: "open-contracts", ico: "file", label: "NEGOCIAÇÕES", value: `${state.contracts.length} em andamento`, description: "Confira suas propostas" },
    { action: "open-services", ico: "briefcase", label: "OPORTUNIDADES", value: `${services.length} serviços`, description: "Competências de outros grupos" },
    { action: "open-contracts", ico: "calendar", label: "PRÓXIMA ENTREGA", value: nextContract.deadline, description: nextContract.title },
  ], { action: "open-contracts", title: "Ver propostas" })}`;
}

function renderProfessorHome() {
  const pending = state.contracts.filter((contract) => contract.status === "Aguardando validação");
  const awaiting = state.contracts.filter((contract) => contract.status === "Em análise").length;
  return `${pageHead("ESPAÇO DOCENTE", "Acompanhamento pedagógico", "Uma visão organizada das turmas, das avaliações e das entregas que precisam da sua atenção.", `<button class="primary-button" type="button" data-action="grant-credits">${icon("plus")} Conceder créditos</button>`)}
  ${renderHomeHero({ label: "ACOMPANHAMENTO PEDAGÓGICO", value: "4", unit: "turmas acompanhadas", description: "Olá, Marcos. Acompanhe suas turmas e apoie cada grupo no próximo passo do projeto.", actions: [{ action: "open-management", ico: "users", title: "Turmas e grupos" }] })}
  ${renderHomeSummary("Acompanhamento das turmas", "VISÃO PEDAGÓGICA", [
    { action: "open-management", ico: "users", label: "TURMAS", value: "4 acompanhadas", description: "Veja o andamento dos projetos" },
    { action: "open-contracts", ico: "clock", label: "ENTREGAS", value: `${pending.length} para validar`, description: "Aguardando sua análise" },
    { action: "open-activities", ico: "target", label: "ATIVIDADES", value: `${awaiting + pending.length} em revisão`, description: "Resultados e devolutivas" },
    { action: "open-wallet", ico: "wallet", label: "CRÉDITOS", value: "40 pedagógicos", description: "Saldo demonstrativo da docência" },
  ])}`;
}

function testModeStatusCard() {
  const description = isStandaloneDemo()
    ? "Modo local ativo, dados fictícios e permissões separadas por perfil. Nenhuma API é necessária para navegar."
    : "Sessão demonstrativa ativa, dados fictícios e permissões separadas por perfil.";
  return `<div class="api-status-card configured" role="status"><span>${icon("check")}</span><div><strong>Ambiente de teste ativo</strong><small>${description}</small></div><span class="status concluido">DEMO</span></div>`;
}

function renderAdmHome() {
  const pending = state.contracts.filter((contract) => contract.status === "Aguardando validação").length;
  return `${pageHead("ADMINISTRAÇÃO", "Painel ADM", "Visão geral da unidade, com acesso rápido ao registro e às informações de governança.", `<button class="primary-button" type="button" data-action="open-registry">${icon("idcard")} Consultar registros</button>`)}
  ${renderHomeHero({ label: "GESTÃO DA UNIDADE", value: "ADM", unit: "visão institucional", description: "Dados demonstrativos para apoiar a organização institucional. Consulte registros fictícios, indicadores e eventos de governança.", actions: [{ action: "open-registry", ico: "idcard", title: "Consultar registros" }] })}
  ${renderHomeSummary("Administração da unidade", "GOVERNANÇA", [
    { action: "open-registry", ico: "idcard", label: "REGISTRO GERAL", value: "Perfis fictícios", description: "Consultar registros demonstrativos" },
    { action: "open-management", ico: "chart", label: "VISÃO DA UNIDADE", value: "4 grupos", description: `${state.contracts.length} contratos e indicadores de exemplo` },
    { action: "open-audit", ico: "shield", label: "AUDITORIA", value: "Ativa", description: `${pending} entregas pendentes; eventos demonstrativos` },
    { action: "open-integration", ico: "sync", label: "INTEGRAÇÕES", value: "Configuração", description: "Consultar estado das integrações" },
  ])}`;
}

function renderDeveloperHome() {
  const demoDescription = isStandaloneDemo()
    ? "Modo local ativo, dados fictícios e permissões separadas por perfil. Nenhuma API é necessária para navegar."
    : "Sessão demonstrativa ativa, dados fictícios e permissões separadas por perfil.";
  return `${pageHead("FERRAMENTAS TÉCNICAS", "Painel do desenvolvedor", "Acompanhe os serviços da demonstração e consulte os limites das integrações configuradas.", `<button class="secondary-button" type="button" data-action="refresh-platform">${icon("refresh")} Verificar backend</button>`)}
  ${renderHomeHero({ label: "AMBIENTE DE DEMONSTRAÇÃO", value: "DEMO", unit: "verificações locais", description: `As verificações são apenas de configuração da plataforma. Nenhuma API bancária live está conectada. ${demoDescription}`, actions: [{ action: "refresh-platform", ico: "refresh", title: "Verificar backend" }, { action: "open-integration", ico: "code", title: "Ver integrações" }] })}
  ${renderHomeSummary("Ferramentas do ambiente", "STATUS TÉCNICO", [
    { action: "open-integration", ico: "code", label: "SERVIÇOS", value: "Integrações", description: "Configuração e limites conhecidos" },
    { action: "refresh-platform", ico: "refresh", label: "BACKEND", value: "Verificação", description: "Atualizar estado da hospedagem" },
    { action: "open-audit", ico: "shield", label: "EVENTOS", value: "Demonstração", description: "Consultar registros disponíveis" },
  ])}`;
}

function renderHome() {
  if (state.role === "professor") return renderProfessorHome();
  if (state.role === "adm") return renderAdmHome();
  if (state.role === "desenvolvedor") return renderDeveloperHome();
  return renderStudentHome();
}

function renderServices() {
  const categories = ["Todos", ...new Set(services.map((service) => service.category))];
  const query = state.filters.service.toLowerCase();
  const filtered = services.filter((service) => `${service.title} ${service.group} ${service.category}`.toLowerCase().includes(query) && (state.filters.category === "Todos" || service.category === state.filters.category));
  const canRequest = ["aluno", "professor"].includes(state.role);
  return `${pageHead("MARKETPLACE PEDAGÓGICO", "Serviços que movem projetos.", "Compare competências, negocie créditos e transforme o acordo aceito em contrato rastreável.", canRequest ? `<button class="primary-button" type="button" data-action="request-service">${icon("plus")} Abrir negociação</button>` : "")}
  <div class="toolbar"><label class="search-box" for="serviceSearch">${icon("search")}<input id="serviceSearch" type="search" placeholder="Buscar serviço, área ou grupo" value="${escapeHtml(state.filters.service)}" /></label><select class="filter-select" id="categoryFilter" aria-label="Filtrar por categoria">${categories.map((category) => `<option ${state.filters.category === category ? "selected" : ""}>${category}</option>`).join("")}</select></div>
  ${filtered.length ? `<section class="service-grid" aria-label="Serviços disponíveis">${filtered.map((service) => `<article class="service-card"><div class="service-top"><span class="service-icon">${icon(service.icon)}</span><span class="service-category">${escapeHtml(service.category)}</span></div><h3>${escapeHtml(service.title)}</h3><p>${escapeHtml(service.description)}</p><div class="service-group"><span class="mini-avatar">${service.initials}</span><strong>${escapeHtml(service.group)}</strong></div><div class="service-footer"><span class="service-price"><small>A PARTIR DE</small><strong>${service.price}</strong><span>créditos negociáveis</span></span>${canRequest ? `<button class="secondary-button" type="button" data-action="request-service" data-service-id="${service.id}">Negociar ${icon("arrowRight")}</button>` : `<span class="read-only-badge">Somente consulta</span>`}</div></article>`).join("")}</section>` : `<div class="empty-state"><span>${icon("search")}</span><h3>Nenhum serviço encontrado</h3><p>Tente outro termo ou categoria.</p></div>`}`;
}

function renderContracts() {
  const statuses = ["Todos", "Em andamento", "Em análise", "Aguardando validação", "Em negociação", "Concluído"];
  const filtered = state.contracts.filter((contract) => state.filters.contract === "Todos" || contract.status === state.filters.contract);
  const heading = state.role === "professor" ? "Entregas e validações" : state.role === "adm" ? "Contratos demonstrativos" : "Contratos do grupo";
  const copy = ["aluno", "professor"].includes(state.role) ? "Compare ofertas, envie contrapropostas e reserve créditos somente depois do aceite." : state.role === "desenvolvedor" ? "Este perfil não tem acesso a contratos; consulte somente serviços e eventos técnicos." : "Consulte contratos e movimentações demonstrativas da unidade.";
  const action = ["aluno", "professor"].includes(state.role) ? `<button class="primary-button" type="button" data-action="request-service">${icon("plus")} Nova negociação</button>` : "";
  return `${pageHead("OPERAÇÕES RASTREÁVEIS", heading, copy, action)}<div class="toolbar"><label class="filter-label" for="contractFilter">Situação</label><select class="filter-select" id="contractFilter">${statuses.map((status) => `<option ${state.filters.contract === status ? "selected" : ""}>${status}</option>`).join("")}</select></div><div class="table-wrap"><table class="data-table"><caption class="sr-only">Lista de contratos e respectivas situações</caption><thead><tr><th scope="col">Contrato</th><th scope="col">Partes</th><th scope="col">Valor</th><th scope="col">Prazo</th><th scope="col">Situação</th><th scope="col"><span class="sr-only">Ações</span></th></tr></thead><tbody>${filtered.map((contract) => `<tr><td><strong>${contract.id}</strong><span>${escapeHtml(contract.title)}</span></td><td><strong>${escapeHtml(contract.from)}</strong><span>→ ${escapeHtml(contract.to)}</span></td><td><strong>${contract.value}</strong><span>créditos</span></td><td><strong>${contract.deadline}</strong></td><td>${statusBadge(contract.status)}</td><td><div class="table-actions"><button class="table-action" type="button" aria-label="Imprimir ${contract.id}" title="Imprimir contrato" data-action="print-contract-direct" data-contract-id="${contract.id}">${icon("printer")}</button><button class="table-action" type="button" aria-label="Abrir ${contract.id}: ${escapeHtml(contract.title)}" data-action="view-contract" data-contract-id="${contract.id}">${icon("arrowRight")}</button></div></td></tr>`).join("")}</tbody></table></div>`;
}

function renderWallet() {
  const isProfessor = state.role === "professor";
  const transactionTotal = state.transactions.length;
  const incoming = state.transactions.filter((item) => item.type === "entrada").reduce((total, item) => total + Number(item.value || 0), 0);
  const outgoing = state.transactions.filter((item) => item.type === "saida").reduce((total, item) => total + Number(item.value || 0), 0);
  const reserved = state.transactions.filter((item) => item.type === "reserva").reduce((total, item) => total + Number(item.value || 0), 0);
  const available = isProfessor ? 40 : state.negotiationBalance;
  const limit = isProfessor ? 50 : 10;
  const progress = Math.max(0, Math.min(100, Math.round((available / limit) * 100)));
  const professorHistory = [
    { id: "CN-042", title: "Créditos para a Equipe Vértice", group: "Concessão pedagógica • DS2", value: 12, type: "saida", date: "Hoje, 10:20" },
    { id: "CN-041", title: "Créditos para Mecatrônica 03", group: "Concessão pedagógica • MEC2", value: 10, type: "saida", date: "Ontem, 15:10" },
    { id: "CN-040", title: "Créditos para Comunicação Visual 02", group: "Concessão pedagógica • CV1", value: 10, type: "saida", date: "22 ago, 11:45" },
    { id: "CN-039", title: "Créditos para Eletrônica 04", group: "Concessão pedagógica • EL2", value: 8, type: "saida", date: "21 ago, 09:30" },
  ];
  const studentEvents = [
    ...state.transactions,
    { id: "EVT-031", title: "Proposta enviada para análise", group: "Comunicação Visual 02 • CTR-031", value: 3, type: "pendente", date: "Hoje, 09:15" },
    { id: "EVT-030", title: "Contraproposta recebida", group: "Mecatrônica 03 • CTR-030", value: 4, type: "pendente", date: "Ontem, 16:40" },
    { id: "EVT-029", title: "Serviço aguardando validação", group: "Desenvolvimento 05 • CTR-029", value: 2, type: "validacao", date: "Ontem, 14:10" },
  ];
  const history = isProfessor ? professorHistory : studentEvents;
  const historyLabel = isProfessor ? "Concessões e justificativas recentes" : "Movimentações e eventos da Equipe Vértice";
  const metricCards = isProfessor
    ? [["users", "Grupos atendidos", "4", "no período"], ["file", "Justificativas", "4", "registradas"], ["clock", "Validações", "1", "pendente"], ["shield", "Limite pedagógico", "50", "créditos"]]
    : [["lock", "Em reserva", reserved, "créditos"], ["arrowDown", "Entradas", incoming, "créditos"], ["award", "Obtidos por serviços", state.noteBalance, "créditos"], ["file", "Registros", transactionTotal + 3, "eventos"]];
  return `${pageHead(isProfessor ? "GESTÃO PEDAGÓGICA" : "CONTA DE SERVIÇOS", isProfessor ? "Créditos concedidos" : "Carteira de créditos", isProfessor ? "Acompanhe concessões, justificativas e o alcance dos créditos pedagógicos nas turmas." : "Acompanhe o saldo do grupo, reservas e transferências de serviços — sempre sem dinheiro real.", `<button class="secondary-button wallet-export-button" type="button" data-action="export-statement">${icon("download")} Exportar extrato</button>`)}
  <section class="wallet-overview" aria-label="Resumo da carteira">
    <article class="wallet-balance-card">
      <div class="wallet-balance-head"><span class="wallet-balance-icon">${icon(isProfessor ? "school" : "wallet")}</span><span class="wallet-demo-tag">AMBIENTE DEMONSTRATIVO</span></div>
      <div class="wallet-balance-copy"><span>${isProfessor ? "CONCEDIDOS NO PERÍODO" : "SALDO DISPONÍVEL"}</span><div><strong>${available}</strong><small>créditos</small></div><p>${isProfessor ? "Distribuídos com justificativa e rastreabilidade pedagógica." : "Use para contratar competências de outros grupos."}</p></div>
      <div class="wallet-limit"><div><span>${isProfessor ? "Uso do limite pedagógico" : "Saldo inicial disponível"}</span><strong>${progress}%</strong></div><i><b style="width:${progress}%"></b></i><small>${isProfessor ? `${available} de ${limit} créditos registrados` : `${available} de ${limit} créditos livres para negociar`}</small></div>
      <div class="wallet-balance-actions">${isProfessor ? `<button type="button" data-action="grant-credits">${icon("plus")} Conceder créditos</button><button type="button" data-action="open-management">Ver grupos ${icon("arrowRight")}</button>` : `<button type="button" data-action="open-services">${icon("briefcase")} Negociar serviço</button><button type="button" data-action="open-contracts">Ver contratos ${icon("arrowRight")}</button>`}</div>
    </article>
    <div class="wallet-metric-grid">${metricCards.map(([metricIcon, label, value, unit]) => `<article class="wallet-metric-card"><span>${icon(metricIcon)}</span><div><small>${label}</small><strong>${value}</strong><em>${unit}</em></div></article>`).join("")}</div>
  </section>
  <section class="wallet-content-grid">
    <article class="panel wallet-history-panel"><header class="panel-head"><div><span class="eyebrow">MOVIMENTAÇÕES</span><h2>Histórico da carteira</h2><p>${historyLabel}</p></div><span class="status concluido">ATUALIZADO</span></header><div class="wallet-history-list">${history.map((transaction) => {
      const isEntry = transaction.type === "entrada";
      const isExit = transaction.type === "saida";
      const isPending = transaction.type === "pendente";
      const valuePrefix = isEntry ? "+" : isExit ? "−" : "";
      const valueSuffix = isPending || transaction.type === "validacao" ? " cr" : "";
      const iconName = isEntry ? "arrowDown" : isExit ? "arrowUp" : transaction.type === "validacao" ? "clock" : "file";
      return `<div class="wallet-history-item"><span class="wallet-transaction-icon ${transaction.type}">${icon(iconName)}</span><div class="wallet-transaction-copy"><strong>${escapeHtml(transaction.title)}</strong><span>${escapeHtml(transaction.group)}</span><small>${transaction.date} • ${escapeHtml(transaction.id || "REGISTRO")}</small></div><div class="wallet-transaction-value ${isEntry ? "positive" : isExit ? "negative" : "pending"}"><strong>${valuePrefix}${transaction.value}${valueSuffix}</strong><span>${isEntry ? "entrada" : isExit ? "saída" : transaction.type === "validacao" ? "em validação" : "sem reserva"}</span></div></div>`;
    }).join("")}</div></article>
    <aside class="wallet-side-column" aria-label="Informações da carteira">
      <article class="panel wallet-distribution-card"><header><div><span class="eyebrow">VISÃO DO SALDO</span><h2>${isProfessor ? "Distribuição do limite" : "Disponibilidade"}</h2></div><span class="wallet-donut" style="--wallet-progress:${progress * 3.6}deg"><b>${progress}%</b></span></header><div class="wallet-legend"><div><i class="available"></i><span>${isProfessor ? "Concedido" : "Disponível"}</span><strong>${available} cr</strong></div><div><i class="reserved"></i><span>${isProfessor ? "Ainda disponível" : "Em reserva"}</span><strong>${isProfessor ? limit - available : reserved} cr</strong></div><div><i class="earned"></i><span>${isProfessor ? "Grupos atendidos" : "Obtido por serviços"}</span><strong>${isProfessor ? "4" : `${state.noteBalance} cr`}</strong></div></div></article>
      <article class="wallet-rules-card"><span class="wallet-rules-icon">${icon("shield")}</span><div><span class="eyebrow">REGRA DO CAIXA</span><h2>Créditos são pedagógicos</h2><p>Não representam dinheiro real. A reserva acontece apenas depois do aceite e a transferência após a entrega validada.</p><button type="button" data-action="open-tutorial">Entender o fluxo ${icon("arrowRight")}</button></div></article>
    </aside>
  </section>`;
}

function exportWalletStatement() {
  const rows = [["ID", "Descrição", "Origem ou grupo", "Data", "Tipo", "Créditos"], ...state.transactions.map((item) => [item.id, item.title, item.group, item.date, item.type, item.value])];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(";")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `extrato-caixa-senai-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  toast("Extrato exportado", "O arquivo CSV da carteira foi gerado com sucesso.", "download");
}

function renderGroup() {
  return `${pageHead("EQUIPE VÉRTICE", "Meu grupo", "Dados do projeto, integrantes e responsabilidades em um único lugar.", `<button class="secondary-button" type="button" data-action="edit-group">Editar dados</button>`)}<section class="section-grid"><article class="panel"><header class="panel-head"><div><h2>Integrantes</h2><p>${members.length} participantes vinculados</p></div></header><div class="member-list">${members.map((member) => `<div class="member-item"><span class="member-avatar">${member.initials}</span><div class="member-copy"><strong>${escapeHtml(member.name)}</strong><span>${escapeHtml(member.role)}</span></div><span class="member-role">Ativo</span></div>`).join("")}</div></article><article class="panel"><header class="panel-head"><div><h2>Projeto</h2><p>Caixa Eletrônico SENAI</p></div></header><div class="info-stack"><div class="info-row"><span>Turma</span><strong>DS2 • 2026</strong></div><div class="info-row"><span>Professor orientador</span><strong>Marcos Lima</strong></div><div class="info-row"><span>Fase</span><strong>Prototipagem funcional</strong></div><div class="info-row"><span>Situação</span><strong>Ativo</strong></div></div></article></section>`;
}

function renderLearning() {
  const completed = Array.isArray(state.learning.completed) ? state.learning.completed : [];
  const progress = Math.round((completed.length / learningModules.length) * 100);
  const nextModule = learningModules.find((module) => !completed.includes(module.id)) || learningModules[0];
  if (state.role === "professor") {
    return `${pageHead("CONTEÚDOS E TRILHAS", "Aprendizagem das turmas", "Organize conteúdos, acompanhe o avanço e identifique alunos que precisam de apoio.", `<button class="primary-button" type="button" data-action="manage-learning" data-module="novo">${icon("plus")} Nova atividade</button>`)}
    <section class="stat-strip" aria-label="Indicadores de aprendizagem"><div class="stat-item"><span>${icon("users")}</span><div><strong>86%</strong><small>alunos ativos</small></div></div><div class="stat-item"><span>${icon("book")}</span><div><strong>${learningModules.length}</strong><small>módulos publicados</small></div></div><div class="stat-item"><span>${icon("target")}</span><div><strong>78%</strong><small>média nas atividades</small></div></div><div class="stat-item"><span>${icon("clock")}</span><div><strong>6</strong><small>precisam de apoio</small></div></div></section>
    <section class="learning-grid">${learningModules.map((module, index) => `<article class="learning-card"><div class="learning-card-top"><span class="learning-icon">${icon(module.icon)}</span><span class="status concluido">PUBLICADA</span></div><span class="eyebrow">MÓDULO ${String(index + 1).padStart(2, "0")} • ${module.level.toUpperCase()}</span><h2>${module.title}</h2><p>${module.summary}</p><div class="learning-meta"><span>${icon("clock")} ${module.duration}</span><span>${icon("users")} ${82 - index * 7}% concluíram</span></div><button class="secondary-button" type="button" data-action="manage-learning" data-module="${module.id}">Gerenciar conteúdo ${icon("arrowRight")}</button></article>`).join("")}</section>`;
  }
  if (state.role === "adm") {
    return `${pageHead("INDICADORES EDUCACIONAIS", "Trilhas da unidade", "Acompanhe adesão, conclusão e qualidade das experiências de educação financeira.", `<button class="secondary-button" type="button" data-action="export-learning">${icon("download")} Exportar relatório</button>`)}
    <section class="journey-hero institutional"><div><span class="eyebrow light">VISÃO CONSOLIDADA</span><h2>Formação conectada à prática.</h2><p>As trilhas preparam os grupos para negociar, documentar e avaliar serviços com responsabilidade.</p></div><div class="journey-progress"><strong>81%</strong><span>participação média</span><i><b style="width:81%"></b></i></div></section>
    <section class="stat-strip"><div class="stat-item"><span>${icon("users")}</span><div><strong>184</strong><small>alunos vinculados</small></div></div><div class="stat-item"><span>${icon("book")}</span><div><strong>4</strong><small>trilhas ativas</small></div></div><div class="stat-item"><span>${icon("check")}</span><div><strong>149</strong><small>conclusões</small></div></div><div class="stat-item"><span>${icon("award")}</span><div><strong>1.280</strong><small>conquistas emitidas</small></div></div></section>
    <section class="panel"><header class="panel-head"><div><h2>Desempenho por trilha</h2><p>Dados demonstrativos da unidade</p></div></header><div class="progress-list">${learningModules.map((module, index) => `<div class="progress-row"><span class="learning-icon">${icon(module.icon)}</span><div><strong>${module.title}</strong><small>${184 - index * 13} participantes</small><i><b style="width:${91 - index * 8}%"></b></i></div><strong>${91 - index * 8}%</strong></div>`).join("")}</div></section>`;
  }
  return `${pageHead("JORNADA FINUP", "Trilhas de aprendizagem", "Aprenda no seu ritmo, pratique no Caixa e acumule XP a cada etapa concluída.", `<button class="primary-button" type="button" data-action="open-lesson" data-module="${nextModule.id}">${icon("play")} Continuar trilha</button>`)}
  <section class="journey-hero"><div><span class="eyebrow light">SEU PROGRESSO</span><h2>${completed.length} de ${learningModules.length} módulos concluídos</h2><p>Complete as aulas e depois teste seus conhecimentos nas atividades.</p></div><div class="journey-progress"><strong>${progress}%</strong><span>${state.learning.xp} XP conquistados</span><i><b style="width:${progress}%"></b></i></div></section>
  <section class="learning-grid" aria-label="Módulos da trilha">${learningModules.map((module, index) => { const done = completed.includes(module.id); return `<article class="learning-card ${done ? "completed" : ""}"><div class="learning-card-top"><span class="learning-icon">${icon(module.icon)}</span>${done ? `<span class="status concluido">CONCLUÍDA</span>` : `<span class="module-number">${String(index + 1).padStart(2, "0")}</span>`}</div><span class="eyebrow">${module.level.toUpperCase()} • ${module.xp} XP</span><h2>${module.title}</h2><p>${module.summary}</p><div class="learning-meta"><span>${icon("clock")} ${module.duration}</span><span>${module.topics.length} tópicos</span></div><button class="${done ? "secondary-button" : "primary-button"}" type="button" data-action="open-lesson" data-module="${module.id}">${done ? "Revisar" : "Começar"} ${icon("arrowRight")}</button></article>`; }).join("")}</section>`;
}

function renderActivities() {
  if (state.role === "professor") {
    const evaluations = [["Equipe Vértice", "Quiz: negociação", "92%", "Concluído"], ["Mecatrônica 03", "Estudo de caso", "—", "Aguardando validação"], ["Comunicação Visual 02", "Quiz: contratos", "84%", "Em análise"], ["Eletrônica 04", "Plano de créditos", "76%", "Concluído"]];
    return `${pageHead("AVALIAÇÕES", "Atividades das turmas", "Revise resultados, devolutivas e evidências enviadas pelos grupos.", `<button class="primary-button" type="button" data-action="manage-learning" data-module="avaliacao">${icon("plus")} Criar avaliação</button>`)}<section class="stat-strip"><div class="stat-item"><span>${icon("target")}</span><div><strong>12</strong><small>atividades abertas</small></div></div><div class="stat-item"><span>${icon("clock")}</span><div><strong>3</strong><small>aguardando correção</small></div></div><div class="stat-item"><span>${icon("check")}</span><div><strong>78%</strong><small>média geral</small></div></div><div class="stat-item"><span>${icon("award")}</span><div><strong>436</strong><small>XP distribuídos</small></div></div></section><div class="table-wrap"><table class="data-table"><thead><tr><th>Grupo</th><th>Atividade</th><th>Resultado</th><th>Situação</th><th><span class="sr-only">Ação</span></th></tr></thead><tbody>${evaluations.map(([group, activity, result, status]) => `<tr><td><strong>${group}</strong><span>Turma vinculada</span></td><td><strong>${activity}</strong></td><td><strong>${result}</strong></td><td>${statusBadge(status)}</td><td><button class="table-action" type="button" data-action="review-activity" data-group="${group}" aria-label="Revisar atividade de ${group}">${icon("arrowRight")}</button></td></tr>`).join("")}</tbody></table></div>`;
  }
  if (state.role === "adm") {
    return `${pageHead("AVALIAÇÕES E ADESÃO", "Resultados educacionais", "Compare a participação das turmas e acompanhe a evolução das competências financeiras.", `<button class="secondary-button" type="button" data-action="export-learning">${icon("download")} Exportar indicadores</button>`)}<section class="stat-strip"><div class="stat-item"><span>${icon("target")}</span><div><strong>88%</strong><small>participação</small></div></div><div class="stat-item"><span>${icon("check")}</span><div><strong>79%</strong><small>média geral</small></div></div><div class="stat-item"><span>${icon("users")}</span><div><strong>32</strong><small>grupos avaliados</small></div></div><div class="stat-item"><span>${icon("star")}</span><div><strong>+14%</strong><small>evolução mensal</small></div></div></section><section class="section-grid"><article class="panel"><header class="panel-head"><div><h2>Competências desenvolvidas</h2><p>Índice médio por tema</p></div></header><div class="progress-list"><div class="progress-row"><span class="learning-icon">${icon("wallet")}</span><div><strong>Organização de créditos</strong><i><b style="width:84%"></b></i></div><strong>84%</strong></div><div class="progress-row"><span class="learning-icon">${icon("briefcase")}</span><div><strong>Negociação responsável</strong><i><b style="width:78%"></b></i></div><strong>78%</strong></div><div class="progress-row"><span class="learning-icon">${icon("file")}</span><div><strong>Contratos e registros</strong><i><b style="width:75%"></b></i></div><strong>75%</strong></div></div></article><article class="panel"><header class="panel-head"><div><h2>Atenções da unidade</h2><p>Pontos para acompanhamento pedagógico</p></div></header><div class="activity-list"><div class="activity-item"><span class="transaction-icon">${icon("alert")}</span><div class="activity-copy"><strong>6 alunos sem atividade recente</strong><span>Encaminhar aos professores responsáveis</span></div></div><div class="activity-item"><span class="transaction-icon">${icon("clock")}</span><div class="activity-copy"><strong>3 avaliações perto do prazo</strong><span>Vencimento nos próximos 5 dias</span></div></div></div></article></section>`;
  }
  if (typeof state.learning.quizScore === "number") {
    return `${pageHead("ATIVIDADES", "Resultado do quiz", "Revise seu desempenho e tente novamente quando quiser.")}<section class="quiz-result"><span>${icon(state.learning.quizScore >= 70 ? "award" : "target")}</span><div><span class="eyebrow">SEU RESULTADO</span><h2>${state.learning.quizScore}% de acertos</h2><p>${state.learning.quizScore >= 70 ? "Parabéns! Você dominou os fundamentos e ganhou XP pela atividade." : "Revise as trilhas e tente novamente para chegar a 70%."}</p><button class="primary-button" type="button" data-action="redo-quiz">Refazer quiz ${icon("refresh")}</button><button class="secondary-button" type="button" data-action="open-learning">Revisar trilhas</button></div></section>`;
  }
  return `${pageHead("ATIVIDADES", "Quiz: decisões no Caixa", "Responda às três questões. Você recebe XP pela primeira tentativa concluída.")}<form id="quizForm" class="quiz-shell">${quizQuestions.map((question, index) => `<fieldset class="quiz-question"><legend><span>${String(index + 1).padStart(2, "0")}</span>${question.prompt}</legend><div>${question.options.map(([value, label], optionIndex) => `<label><input type="radio" name="${question.id}" value="${value}" ${optionIndex === 0 ? "required" : ""} /><span>${label}</span></label>`).join("")}</div></fieldset>`).join("")}<div class="quiz-actions"><span>${icon("target")} Nota mínima: 70%</span><button class="primary-button" type="submit">Corrigir respostas ${icon("arrowRight")}</button></div></form>`;
}

function renderAchievements() {
  const groupXp = 720 + Number(state.learning.xp || 0);
  const level = Math.floor(groupXp / 300) + 1;
  const levelProgress = groupXp % 300;
  const ranking = leaderboard.map((item) => item.name === "Equipe Vértice" ? { ...item, xp: groupXp } : item).sort((a, b) => b.xp - a.xp);
  if (state.role !== "aluno") {
    const title = state.role === "professor" ? "Desempenho das turmas" : "Ranking e evolução";
    return `${pageHead("EVOLUÇÃO", title, "Acompanhe XP, participação e conquistas sem transformar a aprendizagem em competição excludente.", `<button class="secondary-button" type="button" data-action="export-learning">${icon("download")} Exportar desempenho</button>`)}${roleBanner(state.role, state.role === "professor" ? "Uso pedagógico do ranking" : "Visão institucional", "Os indicadores ajudam a reconhecer avanços e orientar apoio; não substituem a avaliação pedagógica.")}<section class="section-grid"><article class="panel"><header class="panel-head"><div><h2>Ranking de grupos</h2><p>XP por participação e conclusão</p></div></header><div class="ranking-list">${ranking.map((item, index) => `<div class="ranking-row"><span class="ranking-position">${index + 1}</span><span class="member-avatar">${item.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span><div><strong>${item.name}</strong><small>${item.className}</small></div><b>${item.xp} XP</b></div>`).join("")}</div></article><article class="panel"><header class="panel-head"><div><h2>Reconhecimentos</h2><p>Conquistas mais desbloqueadas</p></div></header><div class="badge-grid compact"><article class="badge-card earned"><span>${icon("book")}</span><strong>Primeiros passos</strong><small>149 alunos</small></article><article class="badge-card earned"><span>${icon("briefcase")}</span><strong>Bom negociador</strong><small>116 alunos</small></article><article class="badge-card earned"><span>${icon("file")}</span><strong>Contrato claro</strong><small>98 alunos</small></article><article class="badge-card"><span>${icon("star")}</span><strong>Projeto destaque</strong><small>32 grupos</small></article></div></article></section>`;
  }
  const badges = [
    ["book", "Primeiros passos", "Concluiu a primeira trilha", true],
    ["briefcase", "Bom negociador", "Abriu uma proposta completa", state.contracts.length > 3],
    ["target", "Aprendiz aplicado", "Atingiu 70% no quiz", Number(state.learning.quizScore) >= 70],
    ["file", "Contrato claro", "Concluiu o módulo de contratos", state.learning.completed.includes("contratos")],
    ["star", "Projeto destaque", "Alcance 1.500 XP", groupXp >= 1500],
    ["accessibility", "Inclusão em prática", "Visitou a central de acessibilidade", true],
  ];
  return `${pageHead("EVOLUÇÃO", "XP, níveis e conquistas", "Seu progresso reúne aprendizagem, colaboração e boas práticas dentro do Caixa.", `<button class="primary-button" type="button" data-action="open-activities">${icon("target")} Fazer atividade</button>`)}<section class="achievement-hero"><div><span class="level-mark">NÍVEL ${level}</span><h2>Equipe Vértice</h2><p>${groupXp} XP acumulados</p><i><b style="width:${Math.round((levelProgress / 300) * 100)}%"></b></i><small>${300 - levelProgress} XP para o próximo nível</small></div><span class="achievement-trophy">${icon("award")}</span></section><section class="section-grid"><article class="panel"><header class="panel-head"><div><h2>Conquistas</h2><p>${badges.filter((badge) => badge[3]).length} de ${badges.length} desbloqueadas</p></div></header><div class="badge-grid">${badges.map(([ico, title, copy, earned]) => `<article class="badge-card ${earned ? "earned" : "locked"}"><span>${icon(ico)}</span><strong>${title}</strong><small>${copy}</small><b>${earned ? "DESBLOQUEADA" : "BLOQUEADA"}</b></article>`).join("")}</div></article><article class="panel"><header class="panel-head"><div><h2>Ranking</h2><p>Grupos da unidade</p></div></header><div class="ranking-list">${ranking.map((item, index) => `<div class="ranking-row ${item.name === "Equipe Vértice" ? "current" : ""}"><span class="ranking-position">${index + 1}</span><div><strong>${item.name}</strong><small>${item.className}</small></div><b>${item.xp} XP</b></div>`).join("")}</div></article></section>`;
}

function renderProfile() {
  const profile = profileData[state.role];
  const roleNames = { aluno: "Aluno", professor: "Docente", adm: "ADM", desenvolvedor: "Desenvolvedor" };
  const permissionsByRole = {
    aluno: ["Negociar serviços do grupo", "Acompanhar contratos", "Realizar trilhas e atividades"],
    professor: ["Acompanhar turmas", "Validar entregas e atividades", "Conceder créditos pedagógicos"],
    adm: ["Consultar registros demonstrativos", "Acompanhar indicadores da unidade", "Auditar operações e integrações"],
    desenvolvedor: ["Verificar serviços de demonstração", "Consultar estado das integrações", "Analisar eventos de demonstração"],
  };
  const summaries = {
    aluno: "Acompanhe seu grupo, seus créditos pedagógicos e o que falta para avançar no projeto.",
    professor: "Acompanhe suas turmas e mantenha em dia as avaliações, entregas e concessões pedagógicas.",
    adm: "Consulte a visão institucional e os registros demonstrativos dentro do escopo administrativo.",
    desenvolvedor: "Confira o estado técnico da demonstração sem acesso aos registros acadêmicos.",
  };
  const permissions = permissionsByRole[state.role] || permissionsByRole.aluno;
  const department = state.role === "aluno" ? "DS2 • 2026" : state.role === "professor" ? "Docência • DS2 / MEC2" : state.role === "desenvolvedor" ? "Tecnologia • TESTE" : "Administração • SENAI-SP";
  return `${pageHead("SUA CONTA", "Meu perfil", "Seus dados, seu escopo de acesso e as preferências desta demonstração.", `<button class="secondary-button" type="button" data-action="logout">${icon("logout")} Sair</button>`)}
  <section class="profile-screen">
    <article class="profile-summary-card">
      <div class="profile-identity"><span class="profile-large-avatar">${escapeHtml(profile.initials)}</span><span class="profile-active-badge">${icon("check")} Perfil ativo</span></div>
      <span class="eyebrow">${escapeHtml(roleNames[state.role])} • DEMONSTRAÇÃO</span>
      <h2>${escapeHtml(profile.name)}</h2>
      <p class="profile-label">${escapeHtml(profile.label)}</p>
      <p class="profile-summary-copy">${summaries[state.role] || summaries.aluno}</p>
      <div class="profile-unit-chip">${icon("building")} SENAI-SP <span aria-hidden="true">•</span> ${escapeHtml(department)}</div>
      <button class="secondary-button profile-assistant-action" type="button" data-action="choose-assistant">${icon("bot")} Assistente: ${escapeHtml(assistantChoiceLabel())}</button>
    </article>
    <div class="profile-panels">
      <article class="panel profile-detail-panel">
        <header class="panel-head"><div><span class="eyebrow">IDENTIDADE</span><h2>Dados da conta</h2><p>Informações fictícias usadas nesta experiência.</p></div><span class="status concluido">ATIVA</span></header>
        <div class="info-stack">
          <div class="info-row"><span>Perfil</span><strong>${escapeHtml(roleNames[state.role] || "Aluno")}</strong></div>
          <div class="info-row"><span>Unidade</span><strong>SENAI-SP</strong></div>
          <div class="info-row"><span>Turma ou setor</span><strong>${escapeHtml(department)}</strong></div>
          <div class="info-row"><span>Ambiente</span><strong>Demonstrativo • dados fictícios</strong></div>
        </div>
      </article>
      <article class="panel profile-permissions-panel">
        <header class="panel-head"><div><span class="eyebrow">SEU ESCOPO</span><h2>O que você pode fazer</h2><p>As opções abaixo correspondem ao perfil atual.</p></div></header>
        <ul class="accessible-checklist">${permissions.map((permission) => `<li>${escapeHtml(permission)}</li>`).join("")}</ul>
      </article>
      <article class="panel profile-preferences">
        <header class="panel-head"><div><span class="eyebrow">PERSONALIZAÇÃO</span><h2>Preferências rápidas</h2><p>Ajustes locais que acompanham seu uso em qualquer perfil.</p></div></header>
        <div class="profile-preference-grid">
          <button class="quick-action" type="button" data-action="toggle-theme" aria-label="${state.theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}" aria-pressed="${state.theme === "dark"}"><span>${icon(state.theme === "dark" ? "sun" : "moon")}</span><strong>${state.theme === "dark" ? "Modo escuro ativo" : "Modo claro ativo"}</strong><small>${state.theme === "dark" ? "Toque para usar o modo claro" : "Toque para usar o modo escuro"}</small></button>
          <button class="quick-action" type="button" data-action="high-contrast" aria-label="Alto contraste" aria-pressed="${state.highContrast}"><span>${icon("contrast")}</span><strong>${state.highContrast ? "Alto contraste ativo" : "Alto contraste"}</strong><small>${state.highContrast ? "Toque para desativar" : "Reforçar cores, bordas e foco"}</small></button>
          <button class="quick-action" type="button" data-action="open-accessibility-hub"><span>${icon("accessibility")}</span><strong>Acessibilidade</strong><small>Texto, leitura, movimento e mais opções</small></button>
        </div>
      </article>
    </div>
  </section>`;
}

function renderManagement() {
  const title = state.role === "adm" ? "Visão institucional" : "Turmas e grupos";
  const copy = state.role === "adm" ? "Indicadores consolidados da unidade, sem alterar registros acadêmicos diretamente." : "Acompanhe apenas as turmas e grupos vinculados à sua orientação.";
  const groups = [{ name: "Equipe Vértice", className: "DS2", balance: 10, active: 3 }, { name: "Mecatrônica 03", className: "MEC2", balance: 8, active: 3 }, { name: "Comunicação Visual 02", className: "CV1", balance: 12, active: 2 }, { name: "Eletrônica 04", className: "EL2", balance: 7, active: 4 }];
  return `${pageHead("ACOMPANHAMENTO", title, copy, state.role === "professor" ? `<button class="primary-button" type="button" data-action="grant-credits">${icon("plus")} Conceder créditos</button>` : "")}${roleBanner(state.role, state.role === "adm" ? "Escopo ADM" : "Escopo docente", state.role === "adm" ? "O perfil ADM consulta os dados consolidados, o registro demonstrativo e a auditoria da unidade." : "O perfil docente visualiza somente turmas sob sua responsabilidade pedagógica.")}<section class="management-layout"><div class="table-wrap"><table class="data-table"><caption class="sr-only">Grupos acompanhados e indicadores demonstrativos</caption><thead><tr><th scope="col">Grupo</th><th scope="col">Turma</th><th scope="col">Saldo</th><th scope="col">Contratos ativos</th><th scope="col"><span class="sr-only">Ações</span></th></tr></thead><tbody>${groups.map((group) => `<tr><td><strong>${group.name}</strong><span>Projeto demonstrativo</span></td><td><strong>${group.className}</strong></td><td><strong>${group.balance}</strong><span>créditos de exemplo</span></td><td><strong>${group.active}</strong></td><td><button class="table-action" type="button" aria-label="Inspecionar ${group.name}" data-action="inspect-group" data-group="${group.name}">${icon("arrowRight")}</button></td></tr>`).join("")}</tbody></table></div></section>`;
}

function renderAudit() {
  const developerEvents = [
    { title: "Ambiente demonstrativo ativo", detail: "A interface está usando dados locais de apresentação; nenhuma API bancária live está conectada.", time: "Agora" },
    { title: "Integração institucional pendente", detail: "A configuração pode ser consultada sem expor credenciais ou dados acadêmicos.", time: "Hoje" },
    { title: "Serviços de exemplo disponíveis", detail: `${services.length} serviços demonstrativos carregados na interface.`, time: "Hoje" },
  ];
  const events = state.role === "desenvolvedor" ? developerEvents : state.audit;
  const title = state.role === "professor" ? "Ocorrências e histórico" : state.role === "desenvolvedor" ? "Eventos técnicos" : "Auditoria da unidade";
  const scope = state.role === "professor" ? "Turmas vinculadas" : state.role === "desenvolvedor" ? "Estado não sensível do ambiente de demonstração" : "Operações institucionais demonstrativas";
  return `${pageHead("HISTÓRICO E EVENTOS", title, "Consulte eventos com contexto e respeite o escopo de cada perfil.", `<button class="secondary-button" type="button" data-action="export-audit">${icon("download")} Exportar</button>`)}<section class="panel"><header class="panel-head"><div><h2>Eventos recentes</h2><p>${scope}</p></div><span class="status concluido">DADOS DEMONSTRATIVOS</span></header><div>${events.map((item) => `<article class="audit-item"><span class="audit-mark"></span><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></div><time>${escapeHtml(item.time)}</time></article>`).join("")}</div></section>`;
}

function renderRegistry() {
  const query = state.filters.registry.trim().toLowerCase();
  const filtered = state.registry.filter((person) => `${person.id} ${person.name} ${person.type} ${person.unit} ${person.className}`.toLowerCase().includes(query));
  return `${pageHead("BASE DEMONSTRATIVA", "Registro geral", "Consulte os perfis fictícios usados para apresentar a visão administrativa da unidade.", `<span class="status concluido">DADOS DE TESTE</span>`)}${roleBanner("adm", "Acesso do perfil ADM", "Esta lista é local e demonstrativa. Nenhuma matrícula ou informação acadêmica oficial é consultada.")}<div class="toolbar"><label class="search-box" for="registrySearch">${icon("search")}<input id="registrySearch" type="search" placeholder="Buscar por nome, matrícula ou perfil" value="${escapeHtml(state.filters.registry)}" /></label></div><div class="table-wrap"><table class="data-table"><caption class="sr-only">Amostra demonstrativa do registro geral</caption><thead><tr><th scope="col">Registro</th><th scope="col">Nome</th><th scope="col">Perfil</th><th scope="col">Unidade / turma</th><th scope="col">Situação</th></tr></thead><tbody>${filtered.map((person) => `<tr><td><strong>${escapeHtml(person.id)}</strong></td><td><strong>${escapeHtml(person.name)}</strong></td><td>${escapeHtml(person.type)}</td><td><strong>${escapeHtml(person.unit)}</strong><span>${escapeHtml(person.className)}</span></td><td>${statusBadge(person.status)}</td></tr>`).join("")}</tbody></table></div>${filtered.length ? "" : `<div class="empty-state"><span>${icon("search")}</span><h3>Nenhum registro encontrado</h3><p>Revise o termo informado.</p></div>`}`;
}

function renderIntegration() {
  return `${pageHead("AMBIENTE DE DEMONSTRAÇÃO", "Backend e permissões", "Veja quais recursos estão realmente ativos nesta versão de teste, sem depender de contas ou APIs oficiais.", `<button class="secondary-button" type="button" data-action="refresh-platform">${icon("refresh")} Verificar serviços</button>`)}${testModeStatusCard()}<section class="section-grid"><article class="panel"><header class="panel-head"><div><h2>Sessão de teste</h2><p>Autenticação temporária controlada no servidor</p></div><span class="status concluido">ATIVA</span></header><div class="info-stack"><div class="info-row"><span>Token</span><strong>Aleatório e armazenado como hash</strong></div><div class="info-row"><span>Cookie</span><strong>Secure, HttpOnly e SameSite=Lax</strong></div><div class="info-row"><span>Persistência</span><strong>Banco D1 com expiração</strong></div><div class="info-row"><span>Duração</span><strong>Até 4 horas</strong></div></div></article><article class="panel"><header class="panel-head"><div><h2>Dados demonstrativos</h2><p>Nenhuma informação acadêmica oficial é consultada</p></div></header><div class="info-stack"><div class="info-row"><span>Perfis</span><strong>Aluno, docente, ADM e desenvolvedor</strong></div><div class="info-row"><span>Saldo inicial</span><strong>10 créditos pedagógicos</strong></div><div class="info-row"><span>Serviços</span><strong>Valores negociáveis</strong></div><div class="info-row"><span>CPF ou senha</span><strong>Nunca solicitados</strong></div></div></article></section><section class="panel"><header class="panel-head"><div><h2>Módulos funcionais</h2><p>Recursos disponíveis para apresentação e testes</p></div></header><div class="permission-matrix"><article class="permission-card"><h3>${icon("wallet")} Operações</h3><ul><li>Carteira com saldo inicial</li><li>Ofertas e contrapropostas</li><li>Contratos e impressão</li></ul></article><article class="permission-card"><h3>${icon("message")} Colaboração</h3><ul><li>Chat persistente entre turmas</li><li>Caixa IA no backend</li><li>Histórico e auditoria</li></ul></article><article class="permission-card"><h3>${icon("accessibility")} Acessibilidade</h3><ul><li>VLibras e leitura em voz alta</li><li>Contraste e texto ampliado</li><li>Teclado e redução de movimento</li></ul></article></div></section><section class="panel"><header class="panel-head"><div><h2>Matriz de permissões</h2><p>O backend reconhece o perfil escolhido no login</p></div></header><div class="permission-matrix"><article class="permission-card"><h3>Aluno</h3><ul><li>Negocia serviços do grupo</li><li>Registra entregas</li><li>Consulta saldos próprios</li></ul></article><article class="permission-card"><h3>Docente</h3><ul><li>Acompanha turmas</li><li>Valida entregas</li><li>Concede créditos</li></ul></article><article class="permission-card"><h3>ADM</h3><ul><li>Consulta registros demonstrativos</li><li>Visualiza auditoria institucional</li><li>Acompanha indicadores da unidade</li></ul></article><article class="permission-card"><h3>Desenvolvedor</h3><ul><li>Verifica serviços de demonstração</li><li>Consulta configuração de integrações</li><li>Não acessa registro acadêmico</li></ul></article></div></section>`;
}

function renderChatMessages() {
  if (chatStatus === "loading") return `<div class="chat-placeholder" role="status">Carregando mensagens seguras…</div>`;
  if (chatStatus === "error") return `<div class="chat-placeholder error"><strong>Chat temporariamente indisponível</strong><span>Verifique a conexão e tente atualizar.</span><button class="secondary-button" type="button" data-action="refresh-chat">${icon("refresh")} Tentar novamente</button></div>`;
  if (!chatMessages.length) return `<div class="chat-placeholder"><strong>A comunidade está silenciosa.</strong><span>Envie a primeira mensagem para outras turmas.</span></div>`;
  return chatMessages.map((message) => `<article class="community-message"><span class="message-avatar">${escapeHtml(message.initials || "CS")}</span><div><header><strong>${escapeHtml(message.authorName)}</strong><span>${escapeHtml(message.roleLabel)} • ${escapeHtml(message.turma)}</span><time datetime="${escapeHtml(message.createdAt)}">${escapeHtml(message.displayTime)}</time></header><p>${escapeHtml(message.content)}</p></div></article>`).join("");
}

function renderChat() {
  const profile = profileData[state.role];
  const turma = state.role === "aluno" ? "DS2" : state.role === "professor" ? "Docência" : state.role === "desenvolvedor" ? "Tecnologia" : "Administração";
  const localMode = isStandaloneDemo();
  const description = localMode
    ? "Demonstração local: as mensagens ficam somente neste dispositivo e não são enviadas à comunidade hospedada."
    : "Converse com alunos, docentes, ADM e desenvolvimento pelo serviço de chat da hospedagem.";
  const connectionLabel = localMode ? "Mensagens locais • só neste dispositivo" : "Chat conectado ao serviço da hospedagem";
  const privacyNote = localMode
    ? "Até 500 caracteres. Esta mensagem será salva somente neste navegador."
    : "Até 500 caracteres. Seu e-mail não é exibido nas mensagens.";
  return `${pageHead("COMUNIDADE SENAI", "Chat entre turmas", description, `<button class="secondary-button" type="button" data-action="refresh-chat">${icon("refresh")} Atualizar</button>`)}
  <section class="community-shell"><aside class="community-sidebar"><div class="community-brand">${icon("message")}<span><strong># geral-intergrupos</strong><small>Canal demonstrativo</small></span></div><div class="community-rules"><strong>Convivência segura</strong><ul><li>Não compartilhe dados pessoais.</li><li>Mantenha o foco nos projetos.</li><li>Registros podem ser moderados.</li></ul></div><div class="online-summary"><i></i><span>${connectionLabel}</span></div></aside><article class="community-panel"><div class="community-messages" id="classChatMessages" aria-live="polite" aria-label="Mensagens do canal">${renderChatMessages()}</div><form id="classChatForm" class="community-compose"><div class="compose-identity"><label for="chatName">Perfil de teste</label><input id="chatName" name="name" maxlength="80" value="${escapeHtml(profile.name)}" readonly aria-readonly="true" /><label for="chatTurma">Turma</label><input id="chatTurma" name="turma" maxlength="40" value="${escapeHtml(turma)}" minlength="2" required /></div><label class="sr-only" for="chatMessage">Mensagem</label><div class="compose-row"><textarea id="chatMessage" name="content" minlength="2" maxlength="500" rows="2" placeholder="Escreva para a comunidade…" required></textarea><button class="primary-button" type="submit" aria-label="Enviar mensagem">${icon("arrowRight")}</button></div><small>${privacyNote}</small></form></article></section>`;
}

function renderSupport() {
  const assistant = getActiveAssistant();
  const suggestions = ["Como negocio um serviço?", "Explique os contratos", "Como usar o VLibras?", "Qual é meu perfil?"];
  return `${pageHead("SUPORTE INTELIGENTE", assistant.name, "Seu assistente para dúvidas sobre o Caixa.", `<button class="secondary-button" type="button" data-action="choose-assistant">Trocar assistente</button>`)}
  <section class="ai-layout"><aside class="ai-sidebar"><img class="ai-assistant-avatar" src="${assistantAsset("01-o-que-e-o-caixa", "png")}" alt="${assistant.name} em pixel art" /><h2>${assistant.name}</h2><p>Ajuda rápida sobre serviços, contratos e créditos.</p><div class="ai-status"><i></i><span>Assistente disponível</span></div></aside><article class="ai-chat"><div class="ai-messages" id="supportAiMessages" aria-live="polite">${state.aiConversation.map((message) => `<div class="ai-message ${message.from}"><span>${message.from === "ai" ? `<img src="${assistantAsset("01-o-que-e-o-caixa", "png")}" alt="" />` : escapeHtml(profileData[state.role].initials)}</span><p>${escapeHtml(message.text)}</p></div>`).join("")}</div><div class="ai-suggestions">${suggestions.map((question) => `<button type="button" data-action="ask-ai" data-question="${escapeHtml(question)}">${escapeHtml(question)}</button>`).join("")}</div><form id="supportAiForm" class="ai-compose"><label class="sr-only" for="supportQuestion">Pergunta para ${assistant.name}</label><input id="supportQuestion" name="question" minlength="2" maxlength="300" placeholder="Pergunte sobre o projeto…" required /><button class="primary-button" type="submit">Enviar ${icon("arrowRight")}</button></form></article></section>`;
}

const tutorialSteps = [
  { number: "01", title: "Entenda", asset: "01-o-que-e-o-caixa", icon: "help", copy: "Créditos pedagógicos conectam grupos — sem valor monetário." },
  { number: "02", title: "Negocie", asset: "02-negocie-servicos", icon: "briefcase", copy: "Combine serviço, prazo, valor e critérios de aceite." },
  { number: "03", title: "Formalize", asset: "03-formalize-contrato", icon: "file", copy: "O acordo vira contrato e mantém tudo registrado." },
  { number: "04", title: "Conclua", asset: "04-receba-creditos", icon: "award", copy: "A entrega é validada e os créditos entram no histórico." },
];

function assistantPickerMarkup() {
  const active = getActiveAssistant();
  const options = assistantIds.map((id) => {
    const assistant = assistants[id];
    const selected = state.assistantMode === id;
    return `<button class="assistant-option ${selected ? "selected" : ""}" type="button" role="radio" aria-checked="${selected}" data-action="select-assistant" data-assistant="${id}">
      <img src="./assets/images/tutorial-caixa/assistants/${assistant.folder}/01-o-que-e-o-caixa.png" alt="" />
      <span><strong>${assistant.name}</strong><small>${assistant.role}</small></span>${selected ? icon("check") : ""}
    </button>`;
  }).join("");
  const randomSelected = state.assistantMode === "random";
  return `<section class="assistant-picker" aria-label="Escolha do assistente">
    <div class="assistant-picker-current"><img src="${assistantAsset("01-o-que-e-o-caixa", "png")}" alt="" /><span><small>Assistente atual</small><strong>${assistantChoiceLabel()}</strong></span></div>
    <div class="assistant-options" role="radiogroup" aria-label="Assistentes disponíveis">${options}
      <button class="assistant-option random ${randomSelected ? "selected" : ""}" type="button" role="radio" aria-checked="${randomSelected}" data-action="select-assistant" data-assistant="random">
        <span class="assistant-random-icon">${icon("refresh")}</span>
        <span><strong>Aleatório</strong><small>Escolhe um dos cinco</small></span>${randomSelected ? icon("check") : ""}
      </button>
    </div>
  </section>`;
}

function selectAssistant(mode) {
  if (![...assistantIds, "random"].includes(mode)) return;
  state.assistantMode = mode;
  state.assistantId = mode === "random" ? assistantIds[Math.floor(Math.random() * assistantIds.length)] : mode;
  saveState();
  syncAssistantUi();
  closeModal();
  if (state.loggedIn && ["tutorial", "suporte"].includes(state.activeView)) renderView();
  const assistant = getActiveAssistant();
  toast("Assistente atualizado", mode === "random" ? `O modo aleatório escolheu ${assistant.name}.` : `${assistant.name} será seu guia.`, "check");
}

function openAssistantPicker() {
  openModal("Escolha seu assistente", "PERSONALIZE A EXPERIÊNCIA", `${assistantPickerMarkup()}<div class="modal-actions"><button class="secondary-button" type="button" data-action="close-modal">Fechar</button></div>`);
}

function tutorialMarkup({ compact = false } = {}) {
  const assistant = getActiveAssistant();
  return `<section class="tutorial-shell ${compact ? "compact" : ""}">
    <div class="tutorial-guide">
      <div class="tutorial-guide-character" aria-hidden="true">
        <img class="tutorial-animation" src="${assistantAsset("01-o-que-e-o-caixa")}" alt="" />
        <img class="tutorial-poster" src="${assistantAsset("01-o-que-e-o-caixa", "png")}" alt="" />
      </div>
      <div class="tutorial-guide-copy">
        <span class="eyebrow">${assistant.name.toUpperCase()} EXPLICA</span>
        <h2>O Caixa conecta grupos por meio de serviços.</h2>
        <p>Um grupo ajuda o outro e recebe créditos pedagógicos. Simples, acompanhado e sem dinheiro real.</p>
        <button class="assistant-change-button" type="button" data-action="choose-assistant"><img src="${assistantAsset("01-o-que-e-o-caixa", "png")}" alt="" /><span>${assistantChoiceLabel()}</span>${icon("chevron-down")}</button>
      </div>
    </div>
    <ol class="tutorial-steps" aria-label="Quatro etapas para usar o Caixa">
      ${tutorialSteps.map((step) => `<li class="tutorial-step-card">
        <div class="tutorial-step-visual">
          <span class="tutorial-step-number">${step.number}</span>
          <img class="tutorial-animation" src="${assistantAsset(step.asset)}" alt="${assistant.name} em pixel art: ${step.title.toLowerCase()}" />
          <img class="tutorial-poster" src="${assistantAsset(step.asset, "png")}" alt="${assistant.name} em pixel art: ${step.title.toLowerCase()}" />
        </div>
        <div class="tutorial-step-copy"><span class="tutorial-step-icon">${icon(step.icon)}</span><h3>${step.title}</h3><p>${step.copy}</p></div>
      </li>`).join("")}
    </ol>
  </section>`;
}

function renderTutorial() {
  return `${pageHead("PRIMEIROS PASSOS", "Como funciona o Caixa", "Quatro etapas para entender e começar.")}${tutorialMarkup()}<div class="tutorial-cta"><span>Pronto para testar?</span><button class="primary-button" type="button" data-action="open-services">Explorar serviços ${icon("arrowRight")}</button></div>`;
}

function openTutorial() {
  if (state.loggedIn) return navigate("tutorial");
  openModal("Como funciona o Caixa", "TUTORIAL ANIMADO", `${tutorialMarkup({ compact: true })}<div class="modal-actions tutorial-modal-actions"><button class="primary-button" type="button" data-action="close-modal">Entendi ${icon("arrowRight")}</button></div>`);
}

function accessibilityToggle(action, iconName, title, copy, active) {
  return `<button class="accessibility-card ${active ? "active" : ""}" type="button" data-action="${action}" aria-pressed="${active}"><span>${icon(iconName)}</span><div><strong>${title}</strong><small>${copy}</small></div><i aria-hidden="true"></i></button>`;
}

function renderAccessibility() {
  return `${pageHead("INCLUSÃO DIGITAL", "Central de acessibilidade", "Personalize leitura, visual, movimento e navegação. As preferências ficam salvas neste dispositivo.", `<button class="secondary-button" type="button" data-action="reset-accessibility">${icon("refresh")} Restaurar padrões</button><button class="primary-button" type="button" data-action="open-vlibras">${icon("accessibility")} Abrir VLibras</button>`)}
  <section class="accessibility-feature"><div><span class="accessibility-feature-icon">${icon("accessibility")}</span><div><span class="eyebrow">LIBRAS</span><h2>Conteúdo com tradução automática</h2><p>Abra o widget oficial do VLibras para traduzir textos da interface. Em atividades avaliativas ou conversas sensíveis, solicite também mediação humana.</p></div></div><button class="primary-button" type="button" data-action="open-vlibras">Ativar VLibras ${icon("arrowRight")}</button></section>
  <section class="accessibility-grid" aria-label="Preferências de acessibilidade">
    ${accessibilityToggle("read-page", "volume", "Leitura em voz alta", speechActive ? "Parar leitura da página atual" : "Ouvir títulos, textos e controles", speechActive)}
    ${accessibilityToggle("high-contrast", "contrast", "Alto contraste", "Reforçar cores, bordas e foco", state.highContrast)}
    ${accessibilityToggle("text-size", "type", "Texto ampliado", `Tamanho atual: ${state.textSize === "normal" ? "padrão" : state.textSize === "large" ? "grande" : "muito grande"}`, state.textSize !== "normal")}
    ${accessibilityToggle("readable-font", "type", "Fonte legível", "Usar tipografia simples e mais aberta", state.readableFont)}
    ${accessibilityToggle("wide-spacing", "type", "Espaçamento ampliado", "Aumentar linhas, palavras e parágrafos", state.wideSpacing)}
    ${accessibilityToggle("monochrome", "contrast", "Modo monocromático", "Remover dependência das cores", state.monochrome)}
    ${accessibilityToggle("reduce-motion", "motion", "Reduzir movimento", "Minimizar animações e rolagem suave", state.reducedMotion)}
    ${accessibilityToggle("highlight-links", "link", "Destacar ações", "Sublinhar links e controles interativos", state.highlightLinks)}
    ${accessibilityToggle("reading-guide", "speed", "Guia de leitura", "Acompanhar o ponteiro com uma faixa horizontal", state.readingGuide)}
  </section>
  <section class="section-grid accessibility-help"><article class="panel"><header class="panel-head"><div><h2>Navegação por teclado</h2><p>Atalhos disponíveis em todas as telas</p></div></header><div class="shortcut-grid"><div><kbd>Tab</kbd><span>Avançar entre controles</span></div><div><kbd>Shift</kbd> + <kbd>Tab</kbd><span>Voltar um controle</span></div><div><kbd>Alt</kbd> + <kbd>L</kbd><span>Iniciar ou parar leitura</span></div><div><kbd>Alt</kbd> + <kbd>A</kbd><span>Abrir menu rápido</span></div><div><kbd>Esc</kbd><span>Fechar janela ou parar leitura</span></div></div></article><article class="panel"><header class="panel-head"><div><h2>Compatibilidade assistiva</h2><p>Estrutura pensada para diferentes formas de acesso</p></div></header><ul class="accessible-checklist"><li>Regiões semânticas e títulos hierárquicos</li><li>Estados anunciados por leitores de tela</li><li>Modais com foco contido e retorno ao acionador</li><li>Contraste e foco visível reforçados</li><li>Campos com rótulos e mensagens de erro</li><li>Movimento reduzido conforme preferência</li></ul></article></section>`;
}

const renderers = { inicio: renderHome, tutorial: renderTutorial, trilhas: renderLearning, atividades: renderActivities, conquistas: renderAchievements, servicos: renderServices, contratos: renderContracts, carteira: renderWallet, grupo: renderGroup, gestao: renderManagement, auditoria: renderAudit, registro: renderRegistry, integracao: renderIntegration, chat: renderChat, suporte: renderSupport, acessibilidade: renderAccessibility, perfil: renderProfile };

function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((node) => { node.innerHTML = icon(node.dataset.icon); node.removeAttribute("data-icon"); });
}

function renderView({ focusMain = false } = {}) {
  if (!availableViewsForRole(state.role).includes(state.activeView)) state.activeView = "inicio";
  renderNav();
  const [eyebrow, title] = viewMeta[state.activeView];
  const profile = profileData[state.role];
  document.getElementById("topbarEyebrow").textContent = eyebrow;
  document.getElementById("topbarTitle").textContent = title;
  document.getElementById("main-content").innerHTML = renderers[state.activeView]();
  document.getElementById("profileName").textContent = profile.name;
  document.getElementById("profileAvatar").textContent = profile.initials;
  document.getElementById("profileRole").textContent = profile.label;
  syncAssistantUi();
  const roleSource = document.getElementById("identityRoleSource");
  if (roleSource) roleSource.textContent = profile.label;
  document.title = `${title} | SENAI FinUp`;
  hydrateIcons();
  applyAccessibility();
  saveState();
  announce(`${title} carregado para o perfil ${state.role}.`);
  if (state.activeView === "chat") startChatPolling();
  else { clearInterval(chatPollTimer); chatPollTimer = null; }
  if (focusMain) document.getElementById("main-content").focus({ preventScroll: true });
}

function setLoggedIn(loggedIn) {
  state.loggedIn = loggedIn;
  document.getElementById("loginScreen").classList.toggle("is-hidden", loggedIn);
  document.getElementById("appShell").classList.toggle("is-hidden", !loggedIn);
  saveState();
  if (loggedIn) renderView();
  else {
    clearInterval(chatPollTimer);
    chatPollTimer = null;
    stopPageReading({ announceStop: false });
  }
}

function applySessionProfile(user) {
  const requestedRole = user?.role === "diretor" || user?.role === "admin" ? "adm" : user?.role;
  const role = ["aluno", "professor", "adm", "desenvolvedor"].includes(requestedRole) ? requestedRole : "aluno";
  const name = String(user?.name || "Usuário de teste").trim().slice(0, 120) || "Usuário de teste";
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "SN";
  const roleNames = { aluno: "Aluno", professor: "Docente", adm: "ADM", desenvolvedor: "Desenvolvedor" };
  const detail = String(user?.matricula || "").trim();
  profileData[role] = { name, initials, label: `${roleNames[role]}${detail ? ` • ${detail}` : " • TESTE"}` };
  state.role = role;
  state.activeView = "inicio";
}

function isStandaloneDemo() {
  return window.FINUP_LITE === true || window.location.protocol === "file:" || new URLSearchParams(window.location.search).get("offline") === "1";
}

function localDemoUser(role) {
  const users = {
    aluno: { role: "aluno", name: "Kaique dos Santos Silva", matricula: "DS2 • DEMO" },
    professor: { role: "professor", name: "Marcos Lima", matricula: "DOCÊNCIA • DEMO" },
    adm: { role: "adm", name: "Ana Paula Rocha", matricula: "ADM • DEMO" },
    desenvolvedor: { role: "desenvolvedor", name: "Equipe FinUp", matricula: "DESENVOLVIMENTO • DEMO" },
  };
  return users[role] || users.aluno;
}

function openLocalDemo(role, requestVersion = authRequestVersion) {
  if (requestVersion !== authRequestVersion) return;
  applySessionProfile(localDemoUser(role));
  setLoggedIn(true);
  announce(`Modo demonstrativo local iniciado como ${role}.`);
  toast("Acesso liberado", `Você entrou como ${role}. O modo local funciona sem conexão com o backend.`, "check");
}

function openRequestedScreen() {
  if (!isStandaloneDemo()) return false;
  const params = new URLSearchParams(window.location.search);
  const role = params.get("perfil");
  const view = params.get("tela");
  if (!["aluno", "professor", "adm", "desenvolvedor"].includes(role)) return false;
  applySessionProfile(localDemoUser(role));
  if (view && availableViewsForRole(role).includes(view)) state.activeView = view;
  setLoggedIn(true);
  return true;
}

async function restoreTestSession() {
  if (isStandaloneDemo()) {
    setLoggedIn(false);
    return;
  }
  const requestVersion = authRequestVersion;
  try {
    const response = await fetch("/api/auth/test/session", { headers: { Accept: "application/json" }, cache: "no-store" });
    const payload = await response.json();
    if (requestVersion !== authRequestVersion) return;
    if (!response.ok || !payload.authenticated || !payload.user) {
      setLoggedIn(false);
      return;
    }
    applySessionProfile(payload.user);
    setLoggedIn(true);
    announce(`Sessão de teste restaurada para o perfil ${state.role}.`);
  } catch {
    if (requestVersion === authRequestVersion) setLoggedIn(false);
  }
}

async function startTestLogin(role) {
  if (!["aluno", "professor", "adm", "desenvolvedor"].includes(role)) return;
  const requestVersion = ++authRequestVersion;
  const status = document.getElementById("testLoginStatus");
  const buttons = [...document.querySelectorAll('[data-action="login-test"]')];
  buttons.forEach((button) => { button.disabled = true; button.setAttribute("aria-busy", "true"); });
  if (status) {
    status.textContent = `Criando sessão segura para o perfil ${role}…`;
    status.className = "test-login-status loading";
  }
  if (isStandaloneDemo()) {
    openLocalDemo(role, requestVersion);
    return;
  }
  try {
    const response = await fetch("/api/auth/test/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ role }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.authenticated || !payload.user) throw new Error(payload.message || "Sessão indisponível.");
    if (requestVersion !== authRequestVersion) return;
    applySessionProfile(payload.user);
    setLoggedIn(true);
    announce(`Modo de teste iniciado como ${role}.`);
    toast("Sessão de teste iniciada", `Você entrou como ${role}. Todos os dados são demonstrativos.`, "check");
  } catch {
    if (requestVersion !== authRequestVersion) return;
    const message = "Não foi possível iniciar a sessão no servidor. Verifique a conexão e tente novamente.";
    if (status) {
      status.textContent = message;
      status.className = "test-login-status error";
    }
    buttons.forEach((button) => {
      button.disabled = false;
      button.removeAttribute("aria-busy");
    });
    announce(message);
    toast("Sessão indisponível", message, "alert");
  }
}

async function logoutTestSession() {
  authRequestVersion += 1;
  if (!isStandaloneDemo()) {
    try {
      const response = await fetch("/api/auth/test/logout", { method: "POST", headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("O servidor não confirmou o encerramento da sessão.");
    } catch {
      toast("Não foi possível sair", "A sessão não foi encerrada pelo servidor. Tente novamente.", "alert");
      return;
    }
  }
  state.loggedIn = false;
  closeMenus();
  setLoggedIn(false);
  announce("Sessão de teste encerrada.");
  const status = document.getElementById("testLoginStatus");
  if (status) {
    status.textContent = "Selecione um perfil para começar.";
    status.className = "test-login-status";
  }
  document.querySelectorAll('[data-action="login-test"]').forEach((button) => {
    button.disabled = false;
    button.removeAttribute("aria-busy");
  });
}

function navigate(view) {
  if (!availableViewsForRole(state.role).includes(view)) {
    toast("Acesso restrito", "Esta área não está disponível para o perfil atual.", "lock");
    return;
  }
  stopPageReading({ announceStop: false });
  state.activeView = view;
  closeMobileMenu();
  closeMenus();
  renderView({ focusMain: true });
  window.scrollTo({ top: 0, behavior: state.reducedMotion ? "auto" : "smooth" });
}

function openMobileMenu() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("mobileOverlay").classList.add("open");
}

function closeMobileMenu() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("mobileOverlay").classList.remove("open");
}

function closeMenus({ restoreFocus = false } = {}) {
  const profileMenu = document.getElementById("profileMenu");
  const accessibilityMenu = document.getElementById("accessibilityMenu");
  const openProfile = profileMenu?.classList.contains("open");
  const openAccessibility = accessibilityMenu?.classList.contains("open");
  profileMenu?.classList.remove("open");
  accessibilityMenu?.classList.remove("open");
  document.querySelectorAll('[data-action="profile-menu"], [data-action="accessibility-menu"]').forEach((button) => button.setAttribute("aria-expanded", "false"));
  if (restoreFocus && openProfile) document.querySelector('[data-action="profile-menu"]')?.focus();
  if (restoreFocus && openAccessibility) document.querySelector('[data-action="accessibility-menu"]')?.focus();
}

function openModal(title, eyebrow, body) {
  lastFocusedElement = document.activeElement;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalEyebrow").textContent = eyebrow;
  document.getElementById("modalBody").innerHTML = body;
  const backdrop = document.getElementById("modalBackdrop");
  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden", "false");
  document.getElementById("appShell").inert = true;
  document.getElementById("loginScreen").inert = true;
  document.body.style.overflow = "hidden";
  hydrateIcons(backdrop);
  setTimeout(() => backdrop.querySelector("input, select, textarea, button, [tabindex='0']")?.focus(), 30);
}

function closeModal() {
  const backdrop = document.getElementById("modalBackdrop");
  if (!backdrop.classList.contains("open")) return;
  backdrop.classList.remove("open");
  backdrop.setAttribute("aria-hidden", "true");
  document.getElementById("appShell").inert = false;
  document.getElementById("loginScreen").inert = false;
  document.body.style.overflow = "";
  lastFocusedElement?.focus?.();
  lastFocusedElement = null;
}

function trapModalFocus(event) {
  const modal = document.querySelector("#modalBackdrop.open .modal");
  if (!modal || event.key !== "Tab") return;
  const focusable = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')];
  if (!focusable.length) { event.preventDefault(); modal.focus(); return; }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

function toast(title, message, iconName = "check") {
  const element = document.createElement("div");
  element.className = "toast";
  element.innerHTML = `<span>${icon(iconName)}</span><div><strong>${escapeHtml(title)}</strong><small>${escapeHtml(message)}</small></div>`;
  document.getElementById("toastRegion").appendChild(element);
  announce(`${title}. ${message}`);
  setTimeout(() => element.remove(), 3900);
}

function fieldValidationMessage(field) {
  const validity = field.validity;
  const quizLabel = field.closest(".quiz-question")?.querySelector("legend")?.textContent.trim();
  const label = field.labels?.[0]?.textContent.trim() || field.getAttribute("aria-label") || quizLabel || "Este campo";
  if (field.type === "radio" && validity.valueMissing) return `Selecione uma alternativa para: ${label}`;
  if (validity.valueMissing) return `${label}: preencha este campo.`;
  if (validity.typeMismatch) return field.type === "email" ? "Informe um e-mail válido." : `${label}: confira o formato informado.`;
  if (validity.badInput) return `${label}: informe um valor válido.`;
  if (validity.rangeUnderflow) return `${label}: o valor mínimo é ${field.min}.`;
  if (validity.rangeOverflow) return `${label}: o valor máximo é ${field.max}.`;
  if (validity.stepMismatch) return `${label}: informe um valor válido para este campo.`;
  if (validity.tooShort) return `${label}: informe pelo menos ${field.minLength} caracteres.`;
  if (validity.tooLong) return `${label}: use no máximo ${field.maxLength} caracteres.`;
  if (validity.patternMismatch) return `${label}: confira o formato informado.`;
  return `${label}: confira o valor informado.`;
}

function showFieldValidation(field, message) {
  if (!field) return false;
  const fieldset = field.closest(".quiz-question");
  const host = field.closest(".form-field") || fieldset || field.parentElement;
  if (!host) return false;
  const errorId = `${field.id || field.name || "field"}-validation-error`;
  let error = document.getElementById(errorId);
  if (!error) {
    error = document.createElement("span");
    error.id = errorId;
    error.className = "field-error";
    error.setAttribute("role", "alert");
    host.appendChild(error);
  }
  error.textContent = message;
  const group = field.type === "radio" ? [...field.form.elements].filter((item) => item.type === "radio" && item.name === field.name) : [field];
  group.forEach((item) => {
    item.setAttribute("aria-invalid", "true");
    const descriptions = new Set((item.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    descriptions.add(errorId);
    item.setAttribute("aria-describedby", [...descriptions].join(" "));
  });
  return true;
}

function clearFieldValidation(field) {
  const group = field.type === "radio" ? [...field.form.elements].filter((item) => item.type === "radio" && item.name === field.name) : [field];
  group.forEach((item) => {
    const errorId = `${item.id || item.name || "field"}-validation-error`;
    if (item.getAttribute("aria-invalid") !== "true") return;
    const error = document.getElementById(errorId);
    error?.remove();
    item.removeAttribute("aria-invalid");
    const descriptions = (item.getAttribute("aria-describedby") || "").split(/\s+/).filter((id) => id && id !== errorId);
    if (descriptions.length) item.setAttribute("aria-describedby", descriptions.join(" "));
    else item.removeAttribute("aria-describedby");
  });
}

function validateForm(form) {
  for (const field of form.elements) {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) continue;
    if (field.disabled || field.readOnly || ["button", "submit", "reset", "hidden"].includes(field.type)) continue;
    if (field.required && !String(field.value || "").trim()) {
      showFieldValidation(field, fieldValidationMessage(field));
      field.focus();
      return false;
    }
    if (field.minLength > 0 && String(field.value || "").trim().length < field.minLength) {
      showFieldValidation(field, `${field.labels?.[0]?.textContent.trim() || "Este campo"}: informe pelo menos ${field.minLength} caracteres, sem contar espaços extras.`);
      field.focus();
      return false;
    }
    if (!field.checkValidity()) {
      showFieldValidation(field, fieldValidationMessage(field));
      field.focus();
      return false;
    }
  }
  return true;
}

function futureDateInputValue(daysAhead = 14) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function rejectField(form, name, message) {
  const field = form.querySelector(`[name="${name}"]`);
  if (!showFieldValidation(field, message)) toast("Dados inválidos", message, "alert");
  field?.focus();
  return false;
}

function isValidFutureDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= futureDateInputValue(0);
}

function requestServiceModal(serviceId) {
  if (!["aluno", "professor"].includes(state.role)) return toast("Ação não permitida", "Alunos e professores podem abrir negociações de serviço.", "lock");
  const service = services.find((item) => item.id === Number(serviceId));
  const suggested = Math.min(service?.price || 3, state.negotiationBalance || 1);
  openModal("Negociar serviço", "PROPOSTA INTERGRUPOS", `<form id="requestForm"><div class="negotiation-notice"><strong>Valor negociável</strong><p>O preço do catálogo é apenas uma referência. O contrato só nasce depois que as partes aceitam valor, prazo, escopo e critérios.</p></div><div class="form-grid"><div class="form-field full"><label for="serviceTitle">Serviço solicitado</label><input id="serviceTitle" name="title" required minlength="3" maxlength="120" value="${escapeHtml(service?.title || "")}" placeholder="Ex.: Modelagem 3D do gabinete" /></div><div class="form-field"><label for="providerGroup">Grupo prestador</label><input id="providerGroup" name="provider" required minlength="2" maxlength="80" value="${escapeHtml(service?.group || "")}" /></div><div class="form-field"><label for="creditValue">Sua oferta em créditos</label><input id="creditValue" name="value" type="number" min="1" max="${state.negotiationBalance}" step="1" required value="${suggested}" /><span class="form-helper">Disponível para reservar após aceite: ${state.negotiationBalance} créditos</span></div><div class="form-field"><label for="deadline">Prazo proposto</label><input id="deadline" name="deadline" type="date" min="${futureDateInputValue(0)}" required value="${futureDateInputValue()}" /></div><div class="form-field"><label for="revisionCount">Ciclos de revisão</label><select id="revisionCount" name="revisions"><option>1 ciclo</option><option selected>2 ciclos</option><option>3 ciclos</option></select></div><div class="form-field full"><label for="description">Descrição e entregáveis</label><textarea id="description" name="description" required minlength="10" maxlength="1000">${escapeHtml(service?.description || "")}</textarea></div><div class="form-field full"><label for="criteria">Critérios objetivos de aceite</label><textarea id="criteria" name="criteria" required minlength="10" maxlength="600" placeholder="Ex.: arquivo editável, contraste AA e duas revisões"></textarea></div><div class="form-field full"><label for="proposalNote">Mensagem da proposta</label><textarea id="proposalNote" name="proposalNote" required minlength="10" maxlength="600" placeholder="Explique o valor e as condições sugeridas"></textarea></div></div><div class="modal-actions"><button class="secondary-button" type="button" data-action="close-modal">Cancelar</button><button class="primary-button" type="submit">${icon("arrowRight")} Enviar oferta</button></div></form>`);
}

function grantCreditsModal() {
  if (state.role !== "professor") return toast("Ação não permitida", "A concessão pedagógica é exclusiva do professor responsável.", "lock");
  openModal("Conceder créditos", "OPERAÇÃO PEDAGÓGICA", `<form id="grantForm"><div class="form-grid"><div class="form-field full"><label for="grantGroup">Grupo</label><select id="grantGroup" name="group" required><option>Equipe Vértice • DS2</option><option>Mecatrônica 03 • MEC2</option><option>Comunicação Visual 02 • CV1</option><option>Eletrônica 04 • EL2</option></select></div><div class="form-field"><label for="grantType">Tipo de crédito</label><select id="grantType" name="type" required><option value="negotiation">Negociação</option><option value="note">Destinado à nota</option></select></div><div class="form-field"><label for="grantValue">Quantidade</label><input id="grantValue" name="value" type="number" min="1" max="500" step="1" value="5" required /></div><div class="form-field full"><label for="grantReason">Justificativa</label><textarea id="grantReason" name="reason" minlength="10" maxlength="500" required></textarea></div></div><div class="modal-actions"><button class="secondary-button" type="button" data-action="close-modal">Cancelar</button><button class="primary-button" type="submit">${icon("check")} Confirmar concessão</button></div></form>`);
}

function renderContractDocument(contract) {
  const safe = {
    id: escapeHtml(contract.id), title: escapeHtml(contract.title), from: escapeHtml(contract.from),
    to: escapeHtml(contract.to), deadline: escapeHtml(contract.deadline), status: escapeHtml(contract.status),
    description: escapeHtml(contract.description), criteria: escapeHtml(contract.criteria), value: Number(contract.value) || 0,
  };
  return `<article class="contract-document" id="printableContract">
    <header class="contract-document-head"><img src="./assets/images/senai-logo.png" alt="SENAI" /><div><span>PROJETO INTERGRUPOS</span><h3>Contrato de Assessoria Técnica</h3><p>${safe.id} • Documento pedagógico obrigatório</p></div>${statusBadge(contract.status)}</header>
    <div class="contract-notice"><strong>Natureza pedagógica</strong><p>Este instrumento organiza a colaboração acadêmica e os créditos internos do projeto. Não cria vínculo trabalhista, comercial ou financeiro.</p></div>
    <section><h4>1. Identificação das partes</h4><div class="contract-fields"><p><span>Grupo contratante</span><strong>${safe.from}</strong></p><p><span>Grupo prestador</span><strong>${safe.to}</strong></p><p><span>Curso/turma contratante</span><strong>DS2 • 2026</strong></p><p><span>Projeto</span><strong>Caixa Eletrônico SENAI</strong></p><p><span>Representante contratante</span><strong>Kaique dos Santos Silva</strong></p><p><span>Contato institucional</span><strong>Via plataforma Caixa SENAI</strong></p></div></section>
    <section><h4>2. Objeto, escopo e aceite</h4><p><strong>Serviço:</strong> ${safe.title}.</p><p><strong>Descrição e entregáveis:</strong> ${safe.description}</p><p><strong>Critérios objetivos de aceite:</strong> ${safe.criteria}</p><p><strong>Fora do escopo e dependências:</strong> alterações não registradas, licenças externas e materiais não disponibilizados pelas partes.</p><p><strong>Canal de entrega:</strong> área de contratos desta plataforma, com arquivo, evidência e versão identificados.</p></section>
    <section><h4>3. Créditos e liberação</h4><div class="contract-fields"><p><span>Valor total</span><strong>${safe.value} créditos pedagógicos</strong></p><p><span>Tipo</span><strong>Créditos de negociação</strong></p><p><span>Reserva</span><strong>Após aceite da proposta</strong></p><p><span>Transferência</span><strong>Após entrega validada</strong></p></div><p>Os créditos não possuem valor monetário e servem somente à dinâmica pedagógica autorizada.</p></section>
    <section><h4>4. Prazo, marcos e comunicação</h4><p><strong>Prazo final:</strong> ${safe.deadline}. Marcos intermediários, impedimentos e mudanças deverão ser comunicados nesta plataforma. Toda alteração exige justificativa e ciência das partes.</p></section>
    <section><h4>5. Fluxo obrigatório</h4><ol class="contract-flow"><li>Solicitação</li><li>Proposta e negociação</li><li>Aceite e reserva</li><li>Execução e status</li><li>Entrega, evidência e versão</li><li>Validação ou revisão</li><li>Finalização e transferência</li></ol></section>
    <section><h4>6. Responsabilidades</h4><div class="contract-columns"><div><strong>Contratante</strong><ul><li>Fornecer informações e materiais necessários.</li><li>Responder dúvidas e validar no prazo.</li><li>Solicitar revisões somente dentro do escopo.</li></ul></div><div><strong>Prestador</strong><ul><li>Executar o serviço conforme escopo e prazo.</li><li>Registrar progresso, riscos e impedimentos.</li><li>Entregar arquivos, evidências e versão identificada.</li></ul></div></div></section>
    <section><h4>7. Entrega, validação e revisões</h4><p>A entrega será conferida pelos critérios da cláusula 2. Estão previstos até dois ciclos de revisão objetiva. O professor poderá validar, devolver para correção ou registrar ocorrência.</p></section>
    <section><h4>8. Alterações de escopo</h4><p>Qualquer ampliação de entregáveis, prazo ou créditos deverá ser registrada como aditivo, com motivo, impacto e novo aceite. Solicitações informais não alteram este contrato.</p></section>
    <section><h4>9. Descumprimento, cancelamento e medidas</h4><p>O atraso ou descumprimento deverá ser comunicado. A orientação poderá mediar, ajustar prazos, liberar reservas, cancelar a operação ou aplicar medida pedagógica prevista nas regras do projeto.</p></section>
    <section><h4>10. Auditoria e confidencialidade</h4><p>Eventos, versões e movimentações ficam registrados para auditoria acadêmica. Dados pessoais, credenciais, códigos sigilosos e materiais restritos não poderão ser divulgados fora do escopo autorizado.</p></section>
    <section><h4>11. Mediação</h4><p>Divergências serão encaminhadas primeiro ao professor orientador e, quando necessário, à direção ou coordenação da unidade.</p></section>
    <section><h4>12. Vigência e disposições finais</h4><p>O contrato vigora do aceite até a conclusão, cancelamento ou mediação final. A versão registrada na plataforma prevalece para fins pedagógicos.</p></section>
    <section><h4>13. Registro de entrega e aceite</h4><div class="contract-fields"><p><span>Situação atual</span><strong>${safe.status}</strong></p><p><span>Versão entregue</span><strong>____</strong></p><p><span>Evidência</span><strong>____</strong></p><p><span>Transação de créditos</span><strong>____</strong></p></div><div class="contract-checks"><span>□ Entrega conferida</span><span>□ Critérios atendidos</span><span>□ Revisão solicitada</span><span>□ Créditos transferidos</span></div></section>
    <section><h4>14. Assinaturas e validação institucional</h4><div class="signature-grid"><p><span>Representante contratante</span><strong>________________________________</strong></p><p><span>Representante prestador</span><strong>________________________________</strong></p><p><span>Professor orientador</span><strong>________________________________</strong></p><p><span>Validação institucional</span><strong>________________________________</strong></p></div><footer><span>Data: ____ / ____ / ______</span><span>${safe.id} • Caixa Eletrônico SENAI</span></footer></section>
  </article>`;
}

function viewContractModal(contractId) {
  const contract = state.contracts.find((item) => item.id === contractId);
  if (!contract) return;
  let action = "";
  const canNegotiate = (state.role === "aluno" && [contract.from, contract.to].includes("Equipe Vértice")) || (state.role === "professor" && contract.from.startsWith("Prof. Marcos Lima"));
  if (canNegotiate && contract.status === "Em negociação") action = `<button class="secondary-button" type="button" data-action="counteroffer" data-contract-id="${contract.id}">${icon("refresh")} Fazer contraproposta</button><button class="primary-button" type="button" data-action="accept-contract" data-contract-id="${contract.id}">${icon("check")} Aceitar e reservar</button>`;
  if (state.role === "aluno" && contract.status === "Em andamento") action = `<button class="primary-button" type="button" data-action="deliver-contract" data-contract-id="${contract.id}">${icon("upload")} Registrar entrega</button>`;
  if (state.role === "professor" && contract.status === "Aguardando validação") action = `<button class="primary-button" type="button" data-action="approve-contract" data-contract-id="${contract.id}">${icon("check")} Validar entrega</button>`;
  const history = contract.offerHistory?.length ? `<section class="negotiation-history no-print"><h3>Histórico da negociação</h3>${contract.offerHistory.map((offer) => `<div><span>${escapeHtml(offer.author)}</span><strong>${offer.value} créditos</strong><small>${escapeHtml(offer.note)} • ${escapeHtml(offer.time)}</small></div>`).join("")}</section>` : "";
  openModal(`Contrato ${contract.id}`, "DOCUMENTO COMPLETO", `<div class="contract-detail">${history}${renderContractDocument(contract)}<div class="modal-actions no-print"><button class="secondary-button" type="button" data-action="print-contract">${icon("printer")} Imprimir contrato</button>${action}</div></div>`);
}

function negotiateContractModal(contractId) {
  const contract = state.contracts.find((item) => item.id === contractId);
  const canNegotiate = contract && ((state.role === "aluno" && [contract.from, contract.to].includes("Equipe Vértice")) || (state.role === "professor" && contract.from.startsWith("Prof. Marcos Lima")));
  if (!canNegotiate) return toast("Ação não permitida", "Seu perfil não pode enviar esta contraproposta.", "lock");
  openModal(`Contraproposta ${contract.id}`, "NEGOCIAÇÃO DE SERVIÇO", `<form id="negotiationForm"><input type="hidden" name="contractId" value="${escapeHtml(contract.id)}" /><div class="negotiation-notice"><strong>Proposta atual: ${contract.value} créditos</strong><p>O novo valor ficará visível no histórico e ainda precisará ser aceito antes da reserva.</p></div><div class="form-grid"><div class="form-field"><label for="counterValue">Novo valor</label><input id="counterValue" name="value" type="number" min="1" max="${state.negotiationBalance}" step="1" value="${Math.min(contract.value, state.negotiationBalance)}" required /><span class="form-helper">Saldo disponível: ${state.negotiationBalance}</span></div><div class="form-field"><label for="counterDeadline">Prazo proposto</label><input id="counterDeadline" name="deadline" type="date" min="${futureDateInputValue(0)}" value="${futureDateInputValue()}" required /></div><div class="form-field full"><label for="counterNote">Justificativa e condições</label><textarea id="counterNote" name="note" minlength="10" maxlength="600" required placeholder="Explique a contraproposta"></textarea></div></div><div class="modal-actions"><button class="secondary-button" type="button" data-action="close-modal">Cancelar</button><button class="primary-button" type="submit">${icon("refresh")} Enviar contraproposta</button></div></form>`);
}

function simpleModal(title, eyebrow, content, action = "") {
  openModal(title, eyebrow, `<div class="contract-detail">${content}${action ? `<div class="modal-actions">${action}</div>` : ""}</div>`);
}

function lookupApiModal() {
  if (state.role !== "adm") return toast("Acesso restrito", "A consulta demonstrativa ao registro geral é exclusiva do perfil ADM.", "lock");
  openModal("Consultar registro SENAI", "INTEGRAÇÃO INSTITUCIONAL", `<form id="registryLookupForm"><div class="form-grid"><div class="form-field"><label for="modalLookupType">Tipo</label><select id="modalLookupType" name="tipo" required><option value="aluno">Aluno</option><option value="professor">Docente</option><option value="adm">ADM</option></select></div><div class="form-field"><label for="modalLookupRegistry">Matrícula ou registro</label><input id="modalLookupRegistry" name="registro" minlength="2" maxlength="100" required autocomplete="off" /></div></div><div class="modal-actions"><button class="secondary-button" type="button" data-action="close-modal">Cancelar</button><button class="primary-button" type="submit">${icon("search")} Consultar</button></div></form>`);
}

function handleRequestSubmit(form) {
  const data = new FormData(form);
  const value = Number(data.get("value"));
  if (!Number.isInteger(value) || value < 1 || value > state.negotiationBalance) return rejectField(form, "value", `Informe um número inteiro entre 1 e ${state.negotiationBalance} créditos.`);
  if (!isValidFutureDate(String(data.get("deadline") || ""))) return rejectField(form, "deadline", "Escolha hoje ou uma data futura para o prazo.");
  const id = `CTR-${String(28 + state.contracts.length).padStart(3, "0")}`;
  const date = new Date(`${data.get("deadline")}T12:00:00`);
  const deadline = `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase()}`;
  const requester = state.role === "professor" ? "Prof. Marcos Lima • DS2" : "Equipe Vértice";
  state.contracts.unshift({ id, title: String(data.get("title")), from: requester, to: String(data.get("provider")), value, deadline, status: "Em negociação", description: String(data.get("description")), criteria: String(data.get("criteria")), offerHistory: [{ author: requester, value, note: String(data.get("proposalNote")), time: "Agora" }] });
  state.audit.unshift({ title: "Negociação aberta", detail: `${id} recebeu uma oferta de ${value} créditos para ${data.get("provider")}.`, time: "Agora" });
  closeModal();
  saveState();
  toast("Oferta enviada", `${id} entrou em negociação. Nenhum crédito foi reservado ainda.`);
  navigate("contratos");
}

function handleNegotiationSubmit(form) {
  const data = new FormData(form);
  const contract = state.contracts.find((item) => item.id === data.get("contractId"));
  const value = Number(data.get("value"));
  if (!contract) return toast("Contrato indisponível", "Não encontramos o contrato para esta contraproposta. Feche e abra os detalhes novamente.", "alert");
  if (!Number.isInteger(value) || value < 1 || value > state.negotiationBalance) return rejectField(form, "value", `Informe um número inteiro entre 1 e ${state.negotiationBalance} créditos.`);
  if (!isValidFutureDate(String(data.get("deadline") || ""))) return rejectField(form, "deadline", "Escolha hoje ou uma data futura para o prazo.");
  const date = new Date(`${data.get("deadline")}T12:00:00`);
  contract.value = value;
  contract.deadline = `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase()}`;
  contract.status = "Em negociação";
  contract.offerHistory = contract.offerHistory || [];
  contract.offerHistory.unshift({ author: profileData[state.role].name, value, note: String(data.get("note")), time: "Agora" });
  state.audit.unshift({ title: "Contraproposta registrada", detail: `${contract.id} foi atualizado para ${value} créditos.`, time: "Agora" });
  closeModal();
  saveState();
  toast("Contraproposta enviada", `Novo valor: ${value} créditos. A reserva depende do aceite.`);
  renderView();
}

function handleGrantSubmit(form) {
  const data = new FormData(form);
  const value = Number(data.get("value"));
  if (!Number.isInteger(value) || value < 1 || value > 500) return rejectField(form, "value", "Informe uma quantidade inteira entre 1 e 500 créditos.");
  if (!String(data.get("reason") || "").trim() || String(data.get("reason")).trim().length < 10) return rejectField(form, "reason", "Explique a finalidade com pelo menos 10 caracteres.");
  if (data.get("type") === "note") state.noteBalance += value;
  else state.negotiationBalance += value;
  state.transactions.unshift({ id: `TRX-${1083 + state.transactions.length}`, title: "Crédito concedido pela orientação", group: String(data.get("group")), value, type: "entrada", date: "Agora" });
  state.audit.unshift({ title: "Créditos concedidos", detail: `${value} créditos registrados para ${data.get("group")}.`, time: "Agora" });
  closeModal();
  saveState();
  toast("Créditos concedidos", `${value} créditos foram registrados com justificativa.`);
  renderView();
}

function updateContract(contractId, nextStatus) {
  const contract = state.contracts.find((item) => item.id === contractId);
  if (!contract) return;
  const ownsNegotiation = (state.role === "aluno" && [contract.from, contract.to].includes("Equipe Vértice")) || (state.role === "professor" && contract.from.startsWith("Prof. Marcos Lima"));
  const permitted = (ownsNegotiation && nextStatus === "Em andamento") || (state.role === "aluno" && nextStatus === "Aguardando validação") || (state.role === "professor" && nextStatus === "Concluído");
  if (!permitted) return toast("Ação não permitida", "O perfil atual não pode executar esta transição.", "lock");
  const outgoing = contract.from === "Equipe Vértice" || contract.from.startsWith("Prof. Marcos Lima");
  if (nextStatus === "Em andamento" && outgoing) {
    if (contract.value > state.negotiationBalance) return toast("Saldo insuficiente", "Aceite uma oferta menor ou solicite créditos ao professor.", "alert");
    state.negotiationBalance -= contract.value;
    state.transactions.unshift({ id: `TRX-${1102 + state.transactions.length}`, title: `Reserva: ${contract.title}`, group: contract.to, value: contract.value, type: "reserva", date: "Agora" });
  }
  contract.status = nextStatus;
  const messages = { "Em andamento": "A proposta foi aceita e os créditos ficaram reservados.", "Aguardando validação": "A entrega foi registrada e aguarda confirmação docente.", Concluído: "A entrega foi validada e a transferência foi registrada." };
  if (nextStatus === "Concluído") {
    state.noteBalance += contract.value;
    state.transactions.unshift({ id: `TRX-${1102 + state.transactions.length}`, title: contract.title, group: contract.from, value: contract.value, type: "entrada", date: "Agora" });
  }
  state.audit.unshift({ title: `Contrato ${nextStatus.toLowerCase()}`, detail: `${contract.id}: ${messages[nextStatus]}`, time: "Agora" });
  closeModal();
  saveState();
  toast(`Contrato ${nextStatus.toLowerCase()}`, messages[nextStatus]);
  renderView();
}

function stopPageReading({ announceStop = true } = {}) {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  speechQueue = [];
  const wasActive = speechActive;
  speechActive = false;
  document.getElementById("readingIndicator")?.classList.add("is-hidden");
  document.querySelectorAll('[data-action="read-page"]').forEach((button) => button.setAttribute("aria-pressed", "false"));
  const label = document.getElementById("readPageLabel");
  if (label) label.textContent = "Iniciar leitura em voz alta";
  if (wasActive && announceStop) announce("Leitura em voz alta encerrada.");
}

function speakNextChunk() {
  if (!speechActive || !speechQueue.length) return stopPageReading({ announceStop: false });
  const utterance = new SpeechSynthesisUtterance(speechQueue.shift());
  utterance.lang = "pt-BR";
  utterance.rate = state.readingSpeed;
  utterance.onend = () => speakNextChunk();
  utterance.onerror = () => stopPageReading({ announceStop: false });
  window.speechSynthesis.speak(utterance);
}

function togglePageReading() {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return toast("Leitura não suportada", "Este navegador não oferece síntese de voz.", "alert");
  if (speechActive) return stopPageReading();
  const readingRoot = state.loggedIn ? document.getElementById("main-content") : document.getElementById("loginScreen");
  const content = readingRoot?.innerText.trim();
  if (!content) return toast("Nada para ler", "Abra uma página com conteúdo antes de iniciar a leitura.", "alert");
  speechQueue = content.match(/[^.!?\n]+[.!?]?/g)?.reduce((chunks, sentence) => {
    const trimmed = sentence.trim();
    if (!trimmed) return chunks;
    if (!chunks.length || `${chunks[chunks.length - 1]} ${trimmed}`.length > 220) chunks.push(trimmed);
    else chunks[chunks.length - 1] += ` ${trimmed}`;
    return chunks;
  }, []) || [content.slice(0, 220)];
  speechActive = true;
  document.getElementById("readingIndicator")?.classList.remove("is-hidden");
  document.querySelectorAll('[data-action="read-page"]').forEach((button) => button.setAttribute("aria-pressed", "true"));
  const label = document.getElementById("readPageLabel");
  if (label) label.textContent = "Parar leitura em voz alta";
  announce("Leitura em voz alta iniciada.");
  speakNextChunk();
}

function getAiAnswer(question) {
  const text = question.toLowerCase();
  if (/negoci|oferta|contraproposta|servi[cç]o/.test(text)) return "Escolha um serviço, informe valor, prazo, escopo e critérios. O outro grupo pode aceitar ou registrar uma contraproposta. O valor do catálogo é apenas referência e nenhum crédito é reservado antes do aceite.";
  if (/contrato|aceite|entrega|revis[aã]o|prazo/.test(text)) return "O fluxo passa por oferta, contrapropostas, aceite com reserva, execução, entrega com evidência, validação e transferência. Na aba Contratos você pode abrir o documento completo e imprimir.";
  if (/cr[eé]dito|saldo|carteira|nota/.test(text)) return `Cada grupo começa com 10 créditos de negociação. O saldo atual da Equipe Vértice é ${state.negotiationBalance}. A reserva ocorre após o aceite e a transferência somente depois da entrega validada. Créditos são pedagógicos e não têm valor monetário.`;
  if (/libras|surdo|surd[ae]|int[eé]rprete/.test(text)) return "Use o botão flutuante do VLibras para tradução automática do conteúdo em Libras. A ferramenta amplia o acesso, mas não substitui intérprete humano em situações que exigem mediação especializada.";
  if (/cego|leitura|voz|acessibilidade|contraste|fonte/.test(text)) return "Abra a Central de acessibilidade ou o menu do topo. Há leitura em voz alta, velocidade ajustável, texto ampliado, fonte legível, espaçamento, alto contraste, modo monocromático, redução de movimento, destaque de ações e guia de leitura. Alt + L inicia ou encerra a voz.";
  if (/chat|turma|comunidade|mensagem/.test(text)) return "O Chat entre turmas permite simular conversas da comunidade. No arquivo ZIP, as mensagens são salvas localmente neste navegador. Evite dados pessoais e mantenha a conversa relacionada aos projetos.";
  if (/perfil|aluno|professor|docente|diretor|adm|desenvolvedor|permiss[aã]o/.test(text)) return `Você está no perfil ${state.role}. Alunos negociam serviços e acompanham créditos; docentes acompanham turmas, validam entregas e concedem créditos; o ADM consulta o registro e a governança demonstrativa; desenvolvedores verificam o ambiente e as integrações técnicas.`;
  if (/login|senha|identidade|saml|entrar com senai|modo de teste/.test(text)) return "Esta versão usa somente o modo demonstrativo. Escolha Aluno, Docente, ADM ou Desenvolvedor; o acesso local não solicita CPF ou senha. Todos os dados exibidos são fictícios.";
  if (/ngrok/.test(text)) return "A integração ngrok é uma ponte técnica opcional, consultada somente no servidor e com responsáveis autorizados. O perfil Desenvolvedor ou ADM pode verificar a configuração demonstrativa.";
  if (/registro geral|auditoria/.test(text)) return state.role === "adm"
    ? "O perfil ADM consulta registros e auditoria somente com dados demonstrativos. A consulta institucional real depende de integração aprovada e configurada pela unidade."
    : state.role === "desenvolvedor"
      ? "O perfil Desenvolvedor consulta apenas o estado técnico do ambiente. Registros acadêmicos e auditoria institucional ficam restritos ao perfil ADM."
      : "O Registro Geral e a auditoria institucional são recursos administrativos; alunos e docentes acessam apenas os dados de seu escopo pedagógico.";
  if (/api|registro|senai|matr[ií]cula/.test(text)) return "A consulta ao Registro Geral passa por uma rota segura no servidor. Tokens de SENAI e ngrok nunca são enviados ao navegador. Os endpoints oficiais precisam ser configurados pela unidade.";
  return "Posso ajudar com negociações de serviços, contratos, créditos, perfis, Registro Geral, integrações, chat, VLibras e leitura em voz alta. Em decisão pedagógica ou conflito, procure o professor ou a direção.";
}

async function askSupportAi(question) {
  const clean = String(question || "").trim().slice(0, 300);
  if (!clean) return;
  const pendingId = `pending-${Date.now()}`;
  state.aiConversation.push({ from: "user", text: clean }, { id: pendingId, from: "ai", text: "Consultando a base segura do Caixa SENAI…" });
  state.aiConversation = state.aiConversation.slice(-20);
  const questionField = document.getElementById("supportQuestion");
  if (questionField) questionField.value = "";
  saveState();
  renderView();
  let answer;
  let requestError = "";
  if (isStandaloneDemo()) {
    answer = getAiAnswer(clean);
  } else {
    try {
      const response = await fetch("/api/support/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ question: clean, role: state.role, negotiationBalance: state.negotiationBalance }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.answer) throw new Error(payload.message || "Resposta indisponível.");
      answer = payload.answer;
    } catch (error) {
      requestError = error instanceof Error ? error.message : "Não foi possível consultar o assistente agora.";
      answer = "Não foi possível obter uma resposta do serviço neste momento. Tente novamente em instantes.";
    }
  }
  state.aiConversation = state.aiConversation.filter((message) => message.id !== pendingId);
  state.aiConversation.push({ from: "ai", text: answer });
  state.aiConversation = state.aiConversation.slice(-20);
  saveState();
  renderView();
  if (requestError) toast("Caixa IA indisponível", requestError, "alert");
  setTimeout(() => {
    const messages = document.getElementById("supportAiMessages");
    if (messages) messages.scrollTop = messages.scrollHeight;
    document.getElementById("supportQuestion")?.focus();
  }, 0);
}

const LOCAL_CHAT_KEY = "caixa-senai-chat-local-v1";

function getLocalChatMessages() {
  const fallback = [
    { id: "local-1", authorName: "Marcos Lima", role: "professor", turma: "Docência", content: "Bom trabalho, equipes! Registrem os critérios de aceite antes de confirmar os contratos.", createdAt: "2026-08-25T13:20:00.000Z" },
    { id: "local-2", authorName: "Arthur Garcia", role: "aluno", turma: "DS2", content: "A Equipe Vértice publicou uma nova proposta de identidade visual.", createdAt: "2026-08-25T13:32:00.000Z" },
    { id: "local-3", authorName: "Ana Paula Rocha", role: "adm", turma: "Administração", content: "Lembrete: o Caixa é um ambiente pedagógico e não movimenta dinheiro real.", createdAt: "2026-08-25T13:45:00.000Z" },
  ];
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_CHAT_KEY));
    return Array.isArray(saved) && saved.length
      ? saved.map((message) => message?.role === "diretor" || message?.role === "admin"
        ? { ...message, role: "adm", turma: "Administração" }
        : message)
      : fallback;
  } catch {
    return fallback;
  }
}

function addLocalChatMessage(data) {
  const messages = getLocalChatMessages();
  messages.push({ id: `local-${Date.now()}`, authorName: String(data.get("name") || profileData[state.role].name), role: state.role, turma: String(data.get("turma") || "Comunidade"), content: String(data.get("content") || "").slice(0, 500), createdAt: new Date().toISOString() });
  localStorage.setItem(LOCAL_CHAT_KEY, JSON.stringify(messages.slice(-60)));
  chatMessages = messages.slice(-60).map(formatChatMessage);
  chatStatus = "ready";
}

function formatChatMessage(message) {
  const created = new Date(message.createdAt);
  const initials = String(message.authorName || "CS").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const roleLabels = { aluno: "Aluno", professor: "Docente", adm: "ADM", desenvolvedor: "Desenvolvedor" };
  return { ...message, initials, roleLabel: roleLabels[message.role] || "Comunidade", displayTime: Number.isNaN(created.getTime()) ? "agora" : created.toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) };
}

async function loadChatMessages({ quiet = false } = {}) {
  if (!quiet) chatStatus = "loading";
  try {
    if (isStandaloneDemo()) {
      chatMessages = getLocalChatMessages().map(formatChatMessage);
      chatStatus = "ready";
    } else {
      const response = await fetch("/api/chat", { headers: { Accept: "application/json" }, cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Não foi possível carregar o chat.");
      chatMessages = (payload.messages || []).map(formatChatMessage);
      chatStatus = "ready";
    }
  } catch (error) {
    if (!quiet || !chatMessages.length) {
      chatMessages = [];
      chatStatus = "error";
    }
    if (!quiet) {
      const message = error instanceof Error ? error.message : "Não foi possível carregar o chat.";
      toast("Chat indisponível", message, "alert");
    }
  }
  const container = document.getElementById("classChatMessages");
  if (container) {
    container.innerHTML = renderChatMessages();
    hydrateIcons(container);
    if (chatMessages.length && !quiet) container.scrollTop = container.scrollHeight;
  }
}

function startChatPolling() {
  clearInterval(chatPollTimer);
  loadChatMessages();
  if (isStandaloneDemo()) return;
  chatPollTimer = setInterval(() => {
    if (state.loggedIn && state.activeView === "chat" && document.visibilityState === "visible") loadChatMessages({ quiet: true });
  }, 15000);
}

async function sendChatMessage(form) {
  const data = new FormData(form);
  const turma = String(data.get("turma") || "").trim();
  const content = String(data.get("content") || "").trim();
  if (turma.length < 2 || turma.length > 40) return rejectField(form, "turma", "Informe uma turma entre 2 e 40 caracteres.");
  if (content.length < 2 || content.length > 500) return rejectField(form, "content", "A mensagem deve ter entre 2 e 500 caracteres.");
  data.set("turma", turma);
  data.set("content", content);
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  if (isStandaloneDemo()) {
    try {
      addLocalChatMessage(data);
      form.querySelector('[name="content"]').value = "";
      const container = document.getElementById("classChatMessages");
      if (container) {
        container.innerHTML = renderChatMessages();
        container.scrollTop = container.scrollHeight;
      }
      toast("Mensagem salva localmente", "Ela fica apenas neste dispositivo e não é enviada à comunidade.", "check");
    } catch {
      toast("Mensagem não salva", "O armazenamento local deste navegador não está disponível.", "alert");
    } finally {
      submit.disabled = false;
    }
    return;
  }
  try {
    const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ name: data.get("name"), turma: data.get("turma"), role: state.role, channel: "geral", content: data.get("content") }) });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "Não foi possível enviar a mensagem.");
    form.querySelector('[name="content"]').value = "";
    await loadChatMessages({ quiet: true });
    const container = document.getElementById("classChatMessages");
    if (container) container.scrollTop = container.scrollHeight;
    toast("Mensagem enviada", "Sua mensagem já está visível para a comunidade.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível enviar a mensagem.";
    toast("Mensagem não enviada", message, "alert");
  } finally {
    submit.disabled = false;
  }
}

async function checkSenaiApi(showFeedback = true) {
  state.integration = { status: "checking", message: "Verificando configuração segura…", checkedAt: new Date().toISOString() };
  if (state.loggedIn && ["inicio", "integracao"].includes(state.activeView) && ["adm", "desenvolvedor"].includes(state.role)) renderView();
  if (isStandaloneDemo()) {
    state.integration = { status: "unconfigured", message: "Modo leve ativo. A integração oficial pode ser conectada depois sem bloquear a demonstração.", checkedAt: new Date().toISOString() };
    saveState();
    if (state.loggedIn && ["adm", "desenvolvedor"].includes(state.role) && ["inicio", "integracao"].includes(state.activeView)) renderView();
    if (showFeedback) toast("Modo leve ativo", state.integration.message, "check");
    return;
  }
  try {
    const response = await fetch("/api/senai/registro?status=1", { headers: { Accept: "application/json" }, cache: "no-store" });
    const payload = await response.json();
    state.integration = { status: payload.configured ? "configured" : "unconfigured", message: payload.message || (payload.configured ? "Conector pronto para consultas." : "Informe endpoint, caminho e credencial da API oficial."), checkedAt: new Date().toISOString() };
  } catch {
    state.integration = { status: "error", message: "Não foi possível consultar o estado da integração no servidor.", checkedAt: new Date().toISOString() };
  }
  saveState();
  if (state.loggedIn && ["adm", "desenvolvedor"].includes(state.role) && ["inicio", "integracao"].includes(state.activeView)) renderView();
  if (showFeedback) {
    const configured = state.integration.status === "configured";
    const title = configured ? "Integração pronta" : state.integration.status === "error" ? "Verificação indisponível" : "Configuração pendente";
    toast(title, state.integration.message, configured ? "check" : "alert");
  }
}

function updatePlatformStatusUi() {
  const container = document.getElementById("platformStatus");
  if (!container) return;
  const label = container.querySelector(".platform-status-label");
  if (label) label.textContent = state.platformStatus.message;
  container.classList.toggle("ready", state.platformStatus.status === "ready");
  container.classList.toggle("error", state.platformStatus.status === "error");
}

async function checkPlatformStatus(showFeedback = false) {
  state.platformStatus = { status: "checking", message: "Verificando os serviços seguros do Caixa SENAI…" };
  updatePlatformStatusUi();
  if (isStandaloneDemo()) {
    state.platformStatus = { status: "ready", message: `Modo local ativo • ${services.length} serviços demonstrativos disponíveis` };
    saveState();
    updatePlatformStatusUi();
    if (showFeedback) toast("Demonstração pronta", state.platformStatus.message, "check");
    return;
  }
  try {
    const response = await fetch("/api/platform/status", { headers: { Accept: "application/json" }, cache: "no-store" });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.message || "Serviços indisponíveis.");
    const available = Number(payload.servicesAvailable || 0);
    state.platformStatus = { status: "ready", message: `Backend ativo • ${available} serviços disponíveis` };
  } catch {
    state.platformStatus = { status: "error", message: "Não foi possível verificar o backend. Tente novamente." };
  }
  saveState();
  updatePlatformStatusUi();
  if (showFeedback) toast(state.platformStatus.status === "ready" ? "Serviços online" : "Verificação indisponível", state.platformStatus.message, state.platformStatus.status === "ready" ? "check" : "alert");
}

async function checkNgrokApi(showFeedback = true) {
  if (!["adm", "desenvolvedor"].includes(state.role)) return toast("Acesso restrito", "A verificação técnica da ponte ngrok é exclusiva dos perfis ADM e Desenvolvedor.", "lock");
  state.ngrokIntegration = { status: "checking", message: "Consultando o endpoint ngrok com segurança…", endpoint: null, checkedAt: new Date().toISOString() };
  if (state.activeView === "integracao") renderView();
  if (isStandaloneDemo()) {
    state.ngrokIntegration = { status: "unconfigured", message: "Modo leve ativo. A ponte ngrok permanece opcional.", endpoint: null, checkedAt: new Date().toISOString() };
    saveState();
    if (state.activeView === "integracao") renderView();
    if (showFeedback) toast("Modo leve ativo", state.ngrokIntegration.message, "check");
    return;
  }
  try {
    const response = await fetch("/api/ngrok/status", { headers: { Accept: "application/json" }, cache: "no-store" });
    const payload = await response.json();
    state.ngrokIntegration = { status: payload.configured ? "configured" : "unconfigured", message: payload.message || (payload.configured ? "Endpoint ngrok verificado." : "Informe chave, endpoint e responsáveis autorizados."), endpoint: payload.endpoint || null, checkedAt: new Date().toISOString() };
    if (!response.ok && response.status !== 503) state.ngrokIntegration.status = "error";
  } catch {
    state.ngrokIntegration = { status: "error", message: "Não foi possível consultar a ponte ngrok no servidor.", endpoint: null, checkedAt: new Date().toISOString() };
  }
  saveState();
  if (state.activeView === "integracao") renderView();
  if (showFeedback) {
    const configured = state.ngrokIntegration.status === "configured";
    const title = configured ? "ngrok verificado" : state.ngrokIntegration.status === "error" ? "Verificação indisponível" : "Configuração ngrok pendente";
    toast(title, state.ngrokIntegration.message, configured ? "check" : "alert");
  }
}

function openLocalRegistryResult(form) {
  const query = String(new FormData(form).get("registro") || "").trim().toLowerCase();
  const match = state.registry.find((person) => `${person.id} ${person.name}`.toLowerCase().includes(query));
  if (match) openModal("Resultado demonstrativo", "REGISTRO LOCAL", `<div class="contract-detail"><div class="contract-banner"><h3>${escapeHtml(match.name)}</h3><p>Consulta realizada na base fictícia incluída no pacote.</p></div><div class="detail-grid"><div><span>Registro</span><strong>${escapeHtml(match.id)}</strong></div><div><span>Perfil</span><strong>${escapeHtml(match.type)}</strong></div><div><span>Unidade</span><strong>${escapeHtml(match.unit)}</strong></div><div><span>Turma / setor</span><strong>${escapeHtml(match.className)}</strong></div></div><div class="modal-actions"><button class="primary-button" type="button" data-action="close-modal">Fechar</button></div></div>`);
  else toast("Registro não encontrado", "Use um dos registros fictícios exibidos no Registro geral.", "search");
}

async function handleRegistryLookup(form) {
  if (state.role !== "adm") return toast("Acesso restrito", "Somente o perfil ADM pode consultar o registro geral demonstrativo.", "lock");
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.setAttribute("aria-busy", "true");
  if (isStandaloneDemo()) {
    openLocalRegistryResult(form);
    submit.disabled = false;
    submit.removeAttribute("aria-busy");
    return;
  }
  try {
    const query = new URLSearchParams(new FormData(form));
    const response = await fetch(`/api/senai/registro?${query.toString()}`, { headers: { Accept: "application/json" }, cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "A consulta não pôde ser concluída.");
    openModal("Resultado institucional", "API SENAI", `<div class="contract-detail"><div class="contract-banner"><h3>Consulta concluída</h3><p>Resposta recebida pela camada segura do servidor.</p></div><pre class="api-result" aria-label="Resultado da consulta">${escapeHtml(JSON.stringify(payload.data, null, 2))}</pre><div class="modal-actions"><button class="primary-button" type="button" data-action="close-modal">Fechar</button></div></div>`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "A consulta ao registro não foi concluída.";
    toast("Consulta indisponível", message, "alert");
  } finally {
    submit.disabled = false;
    submit.removeAttribute("aria-busy");
  }
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  const isDark = state.theme === "dark";
  const themeIcon = document.getElementById("themeIcon");
  const loginThemeIcon = document.getElementById("loginThemeIcon");
  if (themeIcon) themeIcon.innerHTML = icon(isDark ? "sun" : "moon");
  if (loginThemeIcon) loginThemeIcon.innerHTML = icon(isDark ? "sun" : "moon");
  document.querySelectorAll('[data-action="toggle-theme"]').forEach((button) => {
    button.setAttribute("aria-label", isDark ? "Ativar tema claro" : "Ativar tema escuro");
    button.setAttribute("aria-pressed", String(isDark));
    const iconElement = button.querySelector("svg");
    if (iconElement?.parentElement) iconElement.parentElement.innerHTML = icon(isDark ? "sun" : "moon");
    const description = button.querySelector("small");
    if (description) description.textContent = isDark ? "Usar modo claro" : "Usar modo escuro";
    const title = button.querySelector("strong");
    if (title && button.closest(".profile-preference-grid")) title.textContent = isDark ? "Modo escuro ativo" : "Modo claro ativo";
  });
  const loginThemeLabel = document.getElementById("loginThemeLabel");
  if (loginThemeLabel) loginThemeLabel.textContent = isDark ? "Modo claro" : "Modo escuro";
}

function applyAccessibility() {
  document.documentElement.dataset.textSize = state.textSize;
  document.documentElement.dataset.contrast = state.highContrast ? "high" : "normal";
  document.documentElement.dataset.reducedMotion = String(state.reducedMotion);
  document.documentElement.dataset.highlightLinks = String(state.highlightLinks);
  document.documentElement.dataset.readableFont = String(state.readableFont);
  document.documentElement.dataset.wideSpacing = String(state.wideSpacing);
  document.documentElement.dataset.monochrome = String(state.monochrome);
  document.documentElement.dataset.readingGuide = String(state.readingGuide);
  const sizeLabels = { normal: "Padrão", large: "Grande", larger: "Muito grande" };
  const speedLabels = { "0.8": "Calma — 0,8×", "1": "Normal — 1×", "1.25": "Rápida — 1,25×" };
  const label = document.getElementById("textSizeLabel");
  if (label) label.textContent = sizeLabels[state.textSize];
  const speedLabel = document.getElementById("readingSpeedLabel");
  if (speedLabel) speedLabel.textContent = speedLabels[String(state.readingSpeed)] || speedLabels["1"];
  document.querySelectorAll('[data-action="text-size"]').forEach((button) => button.setAttribute("aria-pressed", String(state.textSize !== "normal")));
  document.querySelectorAll('[data-action="high-contrast"]').forEach((button) => button.setAttribute("aria-pressed", String(state.highContrast)));
  document.querySelectorAll(".profile-preference-grid [data-action='high-contrast']").forEach((button) => {
    const title = button.querySelector("strong");
    const description = button.querySelector("small");
    if (title) title.textContent = state.highContrast ? "Alto contraste ativo" : "Alto contraste";
    if (description) description.textContent = state.highContrast ? "Toque para desativar" : "Reforçar cores, bordas e foco";
  });
  document.querySelectorAll('[data-action="reduce-motion"]').forEach((button) => button.setAttribute("aria-pressed", String(state.reducedMotion)));
  document.querySelectorAll('[data-action="highlight-links"]').forEach((button) => button.setAttribute("aria-pressed", String(state.highlightLinks)));
  document.querySelectorAll('[data-action="readable-font"]').forEach((button) => button.setAttribute("aria-pressed", String(state.readableFont)));
  document.querySelectorAll('[data-action="wide-spacing"]').forEach((button) => button.setAttribute("aria-pressed", String(state.wideSpacing)));
  document.querySelectorAll('[data-action="monochrome"]').forEach((button) => button.setAttribute("aria-pressed", String(state.monochrome)));
  document.querySelectorAll('[data-action="reading-guide"]').forEach((button) => button.setAttribute("aria-pressed", String(state.readingGuide)));
}

function resetAccessibility() {
  stopPageReading({ announceStop: false });
  Object.assign(state, {
    textSize: "normal",
    highContrast: false,
    reducedMotion: false,
    readingSpeed: 1,
    highlightLinks: false,
    readableFont: false,
    wideSpacing: false,
    monochrome: false,
    readingGuide: false,
  });
  applyAccessibility();
  saveState();
  renderView({ focusMain: true });
  announce("Preferências de acessibilidade restauradas.");
  toast("Preferências restauradas", "Os recursos de acessibilidade voltaram aos valores padrão.");
}

function openLessonModal(moduleId) {
  const lesson = learningModules.find((item) => item.id === moduleId);
  if (!lesson) return;
  const completed = state.learning.completed.includes(lesson.id);
  simpleModal(lesson.title, `${lesson.level.toUpperCase()} • ${lesson.duration} • ${lesson.xp} XP`, `<div class="lesson-modal"><span class="lesson-modal-icon">${icon(lesson.icon)}</span><p>${lesson.summary}</p><h3>Você vai aprender</h3><ol>${lesson.topics.map((topic) => `<li>${topic}</li>`).join("")}</ol><div class="lesson-note"><strong>Atividade prática</strong><p>Use o conteúdo nesta demonstração do Caixa e depois responda ao quiz para consolidar o aprendizado.</p></div></div>`, `<button class="secondary-button" type="button" data-action="close-modal">Fechar</button><button class="primary-button" type="button" data-action="complete-lesson" data-module="${lesson.id}">${completed ? "Revisão concluída" : `Concluir e ganhar ${lesson.xp} XP`} ${icon("check")}</button>`);
}

function manageLearningModal(moduleId) {
  if (state.role !== "professor") return toast("Acesso restrito", "Somente o professor pode gerenciar conteúdos e avaliações.", "lock");
  const lesson = learningModules.find((item) => item.id === moduleId);
  const title = lesson ? lesson.title : moduleId === "avaliacao" ? "Nova avaliação" : "Novo conteúdo";
  openModal(title, "GESTÃO PEDAGÓGICA", `<form id="learningManagerForm"><div class="form-grid"><div class="form-field full"><label for="learningTitle">Título</label><input id="learningTitle" name="title" minlength="3" maxlength="120" value="${escapeHtml(lesson?.title || "")}" required /></div><div class="form-field"><label for="learningType">Tipo</label><select id="learningType" name="type" required><option>Trilha</option><option ${moduleId === "avaliacao" ? "selected" : ""}>Avaliação</option><option>Estudo de caso</option></select></div><div class="form-field"><label for="learningXp">Recompensa</label><input id="learningXp" name="xp" type="number" min="0" max="500" step="1" value="${lesson?.xp || 100}" required /></div><div class="form-field full"><label for="learningSummary">Orientações</label><textarea id="learningSummary" name="summary" minlength="10" maxlength="1000" required>${escapeHtml(lesson?.summary || "")}</textarea></div></div><div class="modal-actions"><button class="secondary-button" type="button" data-action="close-modal">Cancelar</button><button class="primary-button" type="submit">Salvar e publicar ${icon("check")}</button></div></form>`);
}

function reviewActivityModal(group) {
  if (state.role !== "professor") return toast("Acesso restrito", "A correção pertence ao perfil de professor.", "lock");
  simpleModal(`Atividade de ${group}`, "DEVOLUTIVA PEDAGÓGICA", `<div class="contract-banner"><h3>Evidência recebida</h3><p>O grupo apresentou justificativa, critérios e uma simulação de negociação no Caixa.</p></div><div class="detail-grid"><div><span>Compreensão</span><strong>Atendeu</strong></div><div><span>Aplicação prática</span><strong>Atendeu</strong></div><div><span>Clareza</span><strong>Revisar</strong></div><div><span>XP sugerido</span><strong>100 XP</strong></div></div>`, `<button class="secondary-button" type="button" data-action="close-modal">Solicitar revisão</button><button class="primary-button" type="button" data-action="approve-activity" data-group="${escapeHtml(group)}">Aprovar atividade ${icon("check")}</button>`);
}

function handleQuizSubmit(form) {
  const data = new FormData(form);
  const missing = quizQuestions.find((question) => !data.get(question.id));
  if (missing) {
    const firstChoice = form.querySelector(`[name="${missing.id}"]`);
    showFieldValidation(firstChoice, `Questão ${quizQuestions.indexOf(missing) + 1}: selecione uma alternativa.`);
    firstChoice?.focus();
    return;
  }
  const correct = quizQuestions.filter((question) => data.get(question.id) === question.correct).length;
  const score = Math.round((correct / quizQuestions.length) * 100);
  const firstAttempt = typeof state.learning.quizScore !== "number";
  state.learning.quizScore = score;
  if (firstAttempt) state.learning.xp += correct * 40;
  saveState();
  renderView({ focusMain: true });
  toast(score >= 70 ? "Atividade concluída" : "Resultado registrado", `${correct} de ${quizQuestions.length} respostas corretas${firstAttempt ? ` • +${correct * 40} XP` : ""}.`, score >= 70 ? "award" : "target");
}

let vlibrasLoading = false;

function openVlibras() {
  const openWidget = () => {
    const button = document.querySelector("[vw-access-button]");
    if (!button) return false;
    button.click();
    announce("VLibras aberto.");
    return true;
  };

  if (window.VLibras) {
    document.documentElement.dataset.vlibras = "active";
    openWidget();
    return;
  }
  if (vlibrasLoading) {
    toast("VLibras carregando", "A ferramenta será aberta assim que terminar de carregar.", "accessibility");
    return;
  }
  if (navigator.onLine === false) {
    toast("Internet necessária", "O VLibras é carregado somente quando solicitado e precisa de conexão.", "alert");
    return;
  }

  vlibrasLoading = true;
  const script = document.createElement("script");
  script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
  script.async = true;
  script.onload = () => {
    vlibrasLoading = false;
    if (!window.VLibras) return toast("VLibras indisponível", "Tente novamente quando houver conexão estável.", "alert");
    document.documentElement.dataset.vlibras = "active";
    new window.VLibras.Widget("https://vlibras.gov.br/app");
    setTimeout(() => {
      if (!openWidget()) toast("VLibras pronto", "Toque novamente em Abrir VLibras.", "accessibility");
    }, 600);
  };
  script.onerror = () => {
    vlibrasLoading = false;
    toast("VLibras indisponível", "Não foi possível carregar a ferramenta agora.", "alert");
  };
  document.head.appendChild(script);
  toast("Carregando VLibras", "Apenas este recurso externo será baixado.", "accessibility");
}

function handleAction(action, target) {
  const routes = { "open-services": "servicos", "open-contracts": "contratos", "open-wallet": "carteira", "open-management": "gestao", "open-audit": "auditoria", "open-registry": "registro", "open-integration": "integracao", "open-learning": "trilhas", "open-activities": "atividades", "open-achievements": "conquistas", "open-chat": "chat", "open-support": "suporte", "open-accessibility-hub": "acessibilidade", "open-profile": "perfil" };
  if (routes[action]) return navigate(routes[action]);
  switch (action) {
    case "reset-accessibility": resetAccessibility(); break;
    case "login-test": startTestLogin(target.dataset.role); break;
    case "open-tutorial": openTutorial(); break;
    case "choose-assistant": openAssistantPicker(); break;
    case "select-assistant": selectAssistant(target.dataset.assistant); break;
    case "open-lesson": openLessonModal(target.dataset.module); break;
    case "complete-lesson": {
      const lesson = learningModules.find((item) => item.id === target.dataset.module);
      if (lesson && !state.learning.completed.includes(lesson.id)) {
        state.learning.completed.push(lesson.id);
        state.learning.xp += lesson.xp;
        saveState();
        toast("Módulo concluído", `${lesson.title} adicionou ${lesson.xp} XP ao seu progresso.`, "award");
      } else if (lesson) toast("Revisão concluída", `${lesson.title} já estava registrado no seu progresso.`, "check");
      closeModal();
      if (state.activeView === "trilhas") renderView();
      break;
    }
    case "manage-learning": manageLearningModal(target.dataset.module); break;
    case "review-activity": reviewActivityModal(target.dataset.group); break;
    case "approve-activity": closeModal(); toast("Atividade aprovada", `${target.dataset.group} recebeu a devolutiva e o XP sugerido.`, "check"); break;
    case "redo-quiz": state.learning.quizScore = null; saveState(); renderView({ focusMain: true }); break;
    case "export-learning": toast("Relatório preparado", "Os indicadores demonstrativos foram organizados para exportação.", "download"); break;
    case "refresh-platform": checkPlatformStatus(true); break;
    case "open-menu": openMobileMenu(); break;
    case "close-menu": closeMobileMenu(); break;
    case "profile-menu": {
      const menu = document.getElementById("profileMenu");
      const opening = !menu.classList.contains("open");
      closeMenus();
      menu.classList.toggle("open", opening);
      target.setAttribute("aria-expanded", String(opening));
      break;
    }
    case "accessibility-menu": {
      const menu = document.getElementById("accessibilityMenu");
      const opening = !menu.classList.contains("open");
      closeMenus();
      menu.classList.toggle("open", opening);
      target.setAttribute("aria-expanded", String(opening));
      break;
    }
    case "text-size": {
      const sizes = ["normal", "large", "larger"];
      state.textSize = sizes[(sizes.indexOf(state.textSize) + 1) % sizes.length];
      applyAccessibility();
      saveState();
      announce(`Tamanho do texto: ${document.getElementById("textSizeLabel").textContent}.`);
      break;
    }
    case "high-contrast": state.highContrast = !state.highContrast; applyAccessibility(); saveState(); announce(`Alto contraste ${state.highContrast ? "ativado" : "desativado"}.`); break;
    case "reduce-motion": state.reducedMotion = !state.reducedMotion; applyAccessibility(); saveState(); announce(`Redução de movimento ${state.reducedMotion ? "ativada" : "desativada"}.`); break;
    case "readable-font": state.readableFont = !state.readableFont; applyAccessibility(); saveState(); renderView(); announce(`Fonte legível ${state.readableFont ? "ativada" : "desativada"}.`); break;
    case "wide-spacing": state.wideSpacing = !state.wideSpacing; applyAccessibility(); saveState(); renderView(); announce(`Espaçamento ampliado ${state.wideSpacing ? "ativado" : "desativado"}.`); break;
    case "monochrome": state.monochrome = !state.monochrome; applyAccessibility(); saveState(); renderView(); announce(`Modo monocromático ${state.monochrome ? "ativado" : "desativado"}.`); break;
    case "reading-guide": state.readingGuide = !state.readingGuide; applyAccessibility(); saveState(); renderView(); announce(`Guia de leitura ${state.readingGuide ? "ativado" : "desativado"}.`); break;
    case "open-vlibras": {
      openVlibras();
      break;
    }
    case "read-page": togglePageReading(); break;
    case "reading-speed": {
      const speeds = [0.8, 1, 1.25];
      state.readingSpeed = speeds[(speeds.indexOf(Number(state.readingSpeed)) + 1) % speeds.length];
      if (speechActive) stopPageReading({ announceStop: false });
      applyAccessibility();
      saveState();
      announce(`Velocidade da voz: ${document.getElementById("readingSpeedLabel")?.textContent}.`);
      break;
    }
    case "highlight-links": state.highlightLinks = !state.highlightLinks; applyAccessibility(); saveState(); announce(`Destaque de links ${state.highlightLinks ? "ativado" : "desativado"}.`); break;
    case "toggle-theme": state.theme = state.theme === "dark" ? "light" : "dark"; applyTheme(); saveState(); announce(`Tema ${state.theme === "dark" ? "escuro" : "claro"} ativado.`); break;
    case "notifications":
      state.notificationRead = true;
      document.getElementById("notificationDot").classList.add("is-hidden");
      saveState();
      simpleModal("Notificações", "ATUALIZAÇÕES", `<div class="activity-list"><div class="activity-item"><span class="transaction-icon">${icon("check")}</span><div class="activity-copy"><strong>Entrega pronta para validação</strong><span>CTR-021 • há 18 minutos</span></div></div><div class="activity-item"><span class="transaction-icon">${icon("clock")}</span><div class="activity-copy"><strong>Prazo se aproxima</strong><span>CTR-024 vence em 6 dias</span></div></div></div>`);
      break;
    case "request-service": requestServiceModal(target.dataset.serviceId); break;
    case "grant-credits": grantCreditsModal(); break;
    case "view-contract": viewContractModal(target.dataset.contractId); break;
    case "counteroffer": negotiateContractModal(target.dataset.contractId); break;
    case "print-contract-direct": viewContractModal(target.dataset.contractId); setTimeout(() => window.print(), 80); break;
    case "close-modal": closeModal(); break;
    case "accept-contract": updateContract(target.dataset.contractId, "Em andamento"); break;
    case "deliver-contract": updateContract(target.dataset.contractId, "Aguardando validação"); break;
    case "approve-contract": updateContract(target.dataset.contractId, "Concluído"); break;
    case "print-contract": window.print(); break;
    case "refresh-chat": loadChatMessages(); break;
    case "ask-ai": askSupportAi(target.dataset.question); break;
    case "clear-ai": state.aiConversation = makeDefaultState().aiConversation; saveState(); renderView(); announce("Nova conversa iniciada no Caixa IA."); break;
    case "check-api": checkSenaiApi(true); break;
    case "check-ngrok": checkNgrokApi(true); break;
    case "lookup-api": lookupApiModal(); break;
    case "help": navigate("suporte"); break;
    case "support-request": closeModal(); toast("Solicitação registrada", "A orientação receberá o contexto informado."); break;
    case "export-statement": exportWalletStatement(); break;
    case "export-audit": toast("Arquivo preparado", "A exportação demonstrativa foi registrada.", "download"); break;
    case "edit-group": simpleModal("Editar grupo", "DADOS DO PROJETO", `<div class="contract-banner"><h3>Alterações controladas</h3><p>A edição de integrantes depende de permissão institucional.</p></div>`, `<button class="primary-button" type="button" data-action="close-modal">Entendi</button>`); break;
    case "inspect-group": simpleModal(target.dataset.group, "ACOMPANHAMENTO DO GRUPO", `<div class="detail-grid"><div><span>Saldo inicial</span><strong>10 créditos</strong></div><div><span>Contratos ativos</span><strong>3</strong></div><div><span>Integrantes</span><strong>5 alunos</strong></div><div><span>Situação</span><strong>Projeto ativo</strong></div></div>`); break;
    case "logout": logoutTestSession(); break;
  }
}

document.addEventListener("click", (event) => {
  const viewTarget = event.target.closest("[data-view]");
  if (viewTarget) return navigate(viewTarget.dataset.view);
  const actionTarget = event.target.closest("[data-action]");
  if (actionTarget) handleAction(actionTarget.dataset.action, actionTarget);
  if (!event.target.closest(".profile-button, .profile-menu, .accessibility-menu, [data-action='accessibility-menu']")) closeMenus();
});

document.addEventListener("input", (event) => {
  const field = event.target;
  if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
  if (field.getAttribute("aria-invalid") !== "true") return;
  if (field.checkValidity() && String(field.value || "").trim()) clearFieldValidation(field);
});

document.addEventListener("change", (event) => {
  const field = event.target;
  if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
  if (field.type === "radio") {
    if (field.checked && field.getAttribute("aria-invalid") === "true") clearFieldValidation(field);
    return;
  }
  if (field.getAttribute("aria-invalid") === "true" && field.checkValidity() && String(field.value || "").trim()) clearFieldValidation(field);
});

document.addEventListener("invalid", (event) => {
  const field = event.target;
  if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
  event.preventDefault();
  showFieldValidation(field, fieldValidationMessage(field));
  field.focus();
}, true);

document.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm(event.target)) return;
  if (event.target.id === "requestForm") handleRequestSubmit(event.target);
  if (event.target.id === "negotiationForm") handleNegotiationSubmit(event.target);
  if (event.target.id === "grantForm") handleGrantSubmit(event.target);
  if (event.target.id === "registryLookupForm") handleRegistryLookup(event.target);
  if (event.target.id === "classChatForm") sendChatMessage(event.target);
  if (event.target.id === "supportAiForm") {
    const question = String(new FormData(event.target).get("question") || "").trim();
    if (question.length < 2 || question.length > 300) return rejectField(event.target, "question", "Escreva uma pergunta entre 2 e 300 caracteres.");
    askSupportAi(question);
  }
  if (event.target.id === "quizForm") handleQuizSubmit(event.target);
  if (event.target.id === "learningManagerForm") {
    const data = new FormData(event.target);
    const title = String(data.get("title") || "").trim();
    const xp = Number(data.get("xp"));
    if (title.length < 3 || title.length > 120) return rejectField(event.target, "title", "Informe um título entre 3 e 120 caracteres.");
    if (!Number.isInteger(xp) || xp < 0 || xp > 500) return rejectField(event.target, "xp", "Informe uma recompensa inteira entre 0 e 500 XP.");
    if (String(data.get("summary") || "").trim().length < 10) return rejectField(event.target, "summary", "Escreva orientações com pelo menos 10 caracteres.");
    closeModal();
    toast("Conteúdo publicado", `${title} foi salvo nesta demonstração.`, "check");
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "serviceSearch") {
    state.filters.service = event.target.value;
    document.getElementById("main-content").innerHTML = renderServices();
    hydrateIcons(document.getElementById("main-content"));
    document.getElementById("serviceSearch")?.focus();
  }
  if (event.target.id === "registrySearch") {
    state.filters.registry = event.target.value;
    document.getElementById("main-content").innerHTML = renderRegistry();
    hydrateIcons(document.getElementById("main-content"));
    document.getElementById("registrySearch")?.focus();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "categoryFilter") { state.filters.category = event.target.value; renderView(); }
  if (event.target.id === "contractFilter") { state.filters.contract = event.target.value; renderView(); }
});

document.addEventListener("keydown", (event) => {
  trapModalFocus(event);
  if (event.altKey && event.key.toLowerCase() === "l") { event.preventDefault(); togglePageReading(); }
  if (event.altKey && event.key.toLowerCase() === "a") { event.preventDefault(); document.querySelector('[data-action="accessibility-menu"]')?.click(); }
  if (event.key === "Escape") { stopPageReading(); closeModal(); closeMobileMenu(); closeMenus({ restoreFocus: true }); }
});

document.addEventListener("pointermove", (event) => {
  if (state.readingGuide) document.documentElement.style.setProperty("--reading-guide-y", `${event.clientY}px`);
}, { passive: true });

applyTheme();
applyAccessibility();
hydrateIcons();
syncAssistantUi();
document.getElementById("notificationDot").classList.toggle("is-hidden", state.notificationRead);
setLoggedIn(false);
checkPlatformStatus(false);
if (!openRequestedScreen()) restoreTestSession();
