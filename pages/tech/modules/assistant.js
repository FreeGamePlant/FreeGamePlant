/* ============================================================
   FGP TECHNOLOGIES — assistant.js
   Assistente de 13 etapas: renderização, navegação, validação,
   telefone internacional, rascunho automático e envio ao Forminit.
   ============================================================ */

import {
  CATEGORIES_DB,
  JourneyState,
  ASSISTANT_MESSAGES,
  JOURNEY_DRAFT_KEY
} from './state.js';

import {
  hideSafely,
  showSafely,
  formatPhone,
  composePhone,
  getCountryByCode,
  extractDigits,
  safeGetJSON,
  safeSetJSON,
  safeRemove,
  debounce
} from './utils.js';

/* ============================================================
   1. REQUISITOS POR CATEGORIA / SUBCATEGORIA
   ============================================================ */

const REQUIREMENTS_BY_SUBCATEGORY = {
  /* ---------- APLICATIVOS ---------- */
  'app-android': [
    { id: 'app_purpose', label: 'Qual será a finalidade principal do aplicativo?', type: 'textarea', required: true, placeholder: 'Ex.: agendamento, delivery, catálogo, rede social...' },
    { id: 'app_features', label: 'Quais funcionalidades principais devem existir?', type: 'textarea', placeholder: 'Ex.: login, cadastro, notificações, pagamento...' },
    { id: 'app_auth', label: 'Será necessário cadastro e autenticação?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'app_database', label: 'Será necessário banco de dados?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'app_admin', label: 'Será necessário painel administrativo?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'app_maps', label: 'Será necessário GPS ou mapas?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'app_offline', label: 'O app precisa funcionar offline?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'app_store', label: 'Será necessário publicar na Play Store?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] }
  ],
  'app-ios': [
    { id: 'app_purpose', label: 'Qual será a finalidade principal do aplicativo?', type: 'textarea', required: true, placeholder: 'Ex.: agendamento, delivery, catálogo...' },
    { id: 'app_features', label: 'Quais funcionalidades principais devem existir?', type: 'textarea' },
    { id: 'app_auth', label: 'Será necessário cadastro e autenticação?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'app_database', label: 'Será necessário banco de dados?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'app_maps', label: 'Será necessário GPS ou mapas?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'app_store', label: 'O cliente já possui conta Apple Developer?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] }
  ],
  'app-multiplataforma': [
    { id: 'app_purpose', label: 'Qual será a finalidade principal do aplicativo?', type: 'textarea', required: true, placeholder: 'Ex.: agendamento, delivery, catálogo...' },
    { id: 'app_platforms', label: 'Quais plataformas devem ser atendidas?', type: 'checkboxes', options: ['Android', 'iOS', 'Web'] },
    { id: 'app_features', label: 'Quais funcionalidades principais devem existir?', type: 'textarea' },
    { id: 'app_auth', label: 'Será necessário cadastro e autenticação?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'app_offline', label: 'O app precisa funcionar offline?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'app_store', label: 'Será necessário publicar nas lojas?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] }
  ],
  'app-custom': [
    { id: 'app_process', label: 'Qual processo ou produto o aplicativo deve atender?', type: 'textarea', required: true },
    { id: 'app_users', label: 'Quantos e quais tipos de usuários existirão?', type: 'textarea', placeholder: 'Ex.: clientes, administradores, entregadores...' },
    { id: 'app_features', label: 'Funcionalidades essenciais do aplicativo', type: 'textarea', required: true },
    { id: 'app_integrations', label: 'Será necessário integrar com sistemas externos?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'app_store', label: 'Será necessário publicar nas lojas oficiais?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] }
  ],

  /* ---------- SITES ---------- */
  'landing-page': [
    { id: 'site_goal', label: 'Qual é o objetivo da landing page?', type: 'textarea', required: true, placeholder: 'Ex.: captar leads, vender produto, divulgar evento...' },
    { id: 'site_sections', label: 'Quais seções devem existir?', type: 'textarea', placeholder: 'Ex.: hero, benefícios, depoimentos, CTA, formulário...' },
    { id: 'site_contact_form', label: 'Será necessário formulário de contato?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'site_integrations', label: 'Precisará integrar com CRM, e-mail marketing ou WhatsApp?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] }
  ],
  'site-institucional': [
    { id: 'site_pages', label: 'Quais páginas ou seções devem existir?', type: 'textarea', required: true, placeholder: 'Ex.: Home, Sobre, Serviços, Portfólio, Contato...' },
    { id: 'site_content_ready', label: 'Os textos institucionais já estão prontos?', type: 'radio', options: ['Sim', 'Parcialmente', 'Não'] },
    { id: 'site_contact_form', label: 'Será necessário formulário de contato?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'site_login', label: 'Será necessário sistema de login ou área restrita?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'site_admin', label: 'Será necessário painel administrativo (CMS)?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'site_seo', label: 'Há preocupação com SEO ou tráfego pago?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] }
  ],
  'portfolio-catalogo': [
    { id: 'site_purpose', label: 'Qual é a finalidade do portfólio / catálogo?', type: 'textarea', required: true },
    { id: 'site_items_count', label: 'Quantos itens, projetos ou produtos serão exibidos?', type: 'text', placeholder: 'Ex.: 10 projetos, 50 produtos...' },
    { id: 'site_filters', label: 'Será necessário filtro ou busca?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'site_admin', label: 'Será necessário painel administrativo?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] }
  ],
  'loja-virtual': [
    { id: 'shop_products', label: 'Quantos produtos serão cadastrados inicialmente?', type: 'text', required: true, placeholder: 'Ex.: 20 produtos, 100 produtos...' },
    { id: 'shop_payment', label: 'Quais formas de pagamento devem ser aceitas?', type: 'textarea', placeholder: 'Ex.: cartão, PIX, boleto...' },
    { id: 'shop_shipping', label: 'Será necessário cálculo de frete?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'shop_integrations', label: 'Será necessário integrar com ERP, estoque ou transportadora?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'shop_platform', label: 'Prefere plataforma pronta ou solução sob medida?', type: 'radio', options: ['Plataforma pronta', 'Sob medida', 'Ainda não sei'] }
  ],
  'webapp-custom': [
    { id: 'webapp_purpose', label: 'Qual é a finalidade da aplicação web?', type: 'textarea', required: true },
    { id: 'webapp_users', label: 'Quais tipos de usuários existirão?', type: 'textarea', placeholder: 'Ex.: clientes, administradores, operadores...' },
    { id: 'webapp_features', label: 'Funcionalidades essenciais', type: 'textarea', required: true },
    { id: 'webapp_auth', label: 'Será necessário login e área restrita?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'webapp_integrations', label: 'Será necessário integrar com outros sistemas?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] }
  ],

  /* ---------- SISTEMAS ---------- */
  'sistema-gestao': [
    { id: 'sys_process', label: 'Qual processo o sistema deverá organizar?', type: 'textarea', required: true, placeholder: 'Ex.: gestão de clientes, pedidos, estoque...' },
    { id: 'sys_users', label: 'Quantas pessoas utilizarão o sistema?', type: 'text', placeholder: 'Ex.: 5, 20, 100+' },
    { id: 'sys_user_types', label: 'Quais tipos de usuários existirão?', type: 'textarea', placeholder: 'Ex.: administrador, vendedor, cliente...' },
    { id: 'sys_permissions', label: 'Será necessário controle de permissões?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'sys_reports', label: 'Será necessário gerar relatórios?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'sys_export', label: 'Será necessário exportar dados?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'sys_existing', label: 'Existe planilha ou sistema atual que deva ser considerado?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'sys_integrations', label: 'Será necessário integrar com outros sistemas?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] }
  ],
  'painel-admin': [
    { id: 'panel_data', label: 'Quais dados ou métricas o painel deve exibir?', type: 'textarea', required: true },
    { id: 'panel_sources', label: 'Quais são as fontes de dados?', type: 'textarea', placeholder: 'Ex.: banco interno, planilha, API externa...' },
    { id: 'panel_permissions', label: 'Haverá diferentes níveis de permissão?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'panel_reports', label: 'Será necessário exportar relatórios?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] }
  ],
  'automacao': [
    { id: 'auto_process', label: 'Qual processo ou tarefa deve ser automatizado?', type: 'textarea', required: true },
    { id: 'auto_systems', label: 'Quais sistemas estão envolvidos?', type: 'textarea', placeholder: 'Ex.: ERP, CRM, planilhas, APIs externas...' },
    { id: 'auto_frequency', label: 'Com que frequência a automação deve rodar?', type: 'radio', options: ['Tempo real', 'Agendada (diária, semanal...)', 'Sob demanda'] },
    { id: 'auto_docs', label: 'Existe documentação das APIs envolvidas?', type: 'radio', options: ['Sim', 'Parcialmente', 'Não'] }
  ],
  'sistema-custom': [
    { id: 'sys_process', label: 'Qual processo precisa ser atendido?', type: 'textarea', required: true },
    { id: 'sys_users', label: 'Quem utilizará o sistema?', type: 'textarea' },
    { id: 'sys_features', label: 'Funcionalidades indispensáveis', type: 'textarea', required: true },
    { id: 'sys_data', label: 'Que tipo de informação será armazenada?', type: 'textarea' },
    { id: 'sys_integrations', label: 'Será necessário integrar com outros sistemas?', type: 'radio', options: ['Sim', 'Não', 'Ainda não sei'] },
    { id: 'sys_local', label: 'O sistema será usado na internet ou localmente?', type: 'radio', options: ['Internet', 'Local', 'Ambos'] }
  ],

  /* ---------- SOLUÇÕES ---------- */
  'identidade-digital': [
    { id: 'brand_goal', label: 'Qual o objetivo da identidade digital?', type: 'textarea', required: true },
    { id: 'brand_deliverables', label: 'O que deve fazer parte da entrega?', type: 'checkboxes', options: ['Logo', 'Paleta de cores', 'Tipografia', 'Materiais gráficos', 'Templates para redes sociais', 'Site institucional'] },
    { id: 'brand_existing', label: 'Já existe algo pronto?', type: 'radio', options: ['Sim, completo', 'Parcial', 'Nada ainda'] }
  ],
  'consultoria-tecnica': [
    { id: 'consult_goal', label: 'Qual é o objetivo da consultoria?', type: 'textarea', required: true, placeholder: 'Ex.: validar viabilidade, definir arquitetura, planejar roadmap...' },
    { id: 'consult_context', label: 'Contexto atual do projeto ou negócio', type: 'textarea' },
    { id: 'consult_format', label: 'Formato preferido', type: 'radio', options: ['Por hora', 'Pacote fechado', 'A definir'] }
  ],
  'manutencao': [
    { id: 'maint_project', label: 'Qual é o projeto que precisa de manutenção?', type: 'textarea', required: true },
    { id: 'maint_problems', label: 'Quais problemas precisam ser resolvidos?', type: 'textarea', required: true },
    { id: 'maint_frequency', label: 'Com que frequência você precisa de suporte?', type: 'radio', options: ['Eventual', 'Semanal', 'Contínuo'] }
  ],
  'integracoes-apis': [
    { id: 'api_systems', label: 'Quais sistemas devem ser integrados?', type: 'textarea', required: true },
    { id: 'api_docs', label: 'Existe documentação das APIs?', type: 'radio', options: ['Sim', 'Parcialmente', 'Não'] },
    { id: 'api_data', label: 'Que tipo de dados será trafegado?', type: 'textarea' },
    { id: 'api_frequency', label: 'Frequência esperada da integração', type: 'radio', options: ['Tempo real', 'Agendada', 'Sob demanda'] }
  ],

  /* ---------- BUSINESS ---------- */
  'publicacao-jogos': [
    { id: 'game_name', label: 'Qual é o nome ou título do jogo?', type: 'text', required: true },
    { id: 'game_platform', label: 'Onde o jogo será publicado?', type: 'checkboxes', options: ['Google Play', 'App Store', 'itch.io', 'Steam', 'Outro'] },
    { id: 'game_status', label: 'Em que estágio o jogo está?', type: 'radio', options: ['Conceito', 'Em desenvolvimento', 'Pronto para build', 'Já publicado'] },
    { id: 'game_engine', label: 'Qual engine foi utilizada?', type: 'text', placeholder: 'Ex.: Unity, Godot, Unreal...' }
  ],
  'mods-minecraft': [
    { id: 'mod_scope', label: 'Qual é o escopo do mod ou add-on?', type: 'textarea', required: true },
    { id: 'mod_items', label: 'Quantos itens, entidades ou mecânicas?', type: 'textarea' },
    { id: 'mod_version', label: 'Versão alvo do Minecraft Bedrock', type: 'text', placeholder: 'Ex.: 1.20, 1.21...' },
    { id: 'mod_distribution', label: 'Como pretende distribuir?', type: 'radio', options: ['Uso pessoal', 'Servidor privado', 'Publicação pública'] }
  ],
  'parceria-dev': [
    { id: 'partner_scope', label: 'Qual é o escopo da parceria?', type: 'textarea', required: true },
    { id: 'partner_frequency', label: 'Qual a frequência esperada de entregas?', type: 'radio', options: ['Semanal', 'Quinzenal', 'Mensal', 'A definir'] },
    { id: 'partner_duration', label: 'Duração estimada da parceria', type: 'text', placeholder: 'Ex.: 3 meses, 1 ano, indefinido' }
  ],
  'consultoria-produto': [
    { id: 'prod_stage', label: 'Em que estágio está o produto?', type: 'radio', required: true, options: ['Ideia', 'MVP', 'Produto em operação', 'Reformulação'] },
    { id: 'prod_goal', label: 'Qual é o objetivo da consultoria?', type: 'textarea', required: true },
    { id: 'prod_context', label: 'Contexto adicional', type: 'textarea' }
  ]
};

const REQUIREMENTS_BY_CATEGORY = {
  apps: [
    { id: 'general_app_goal', label: 'Qual é o objetivo do aplicativo?', type: 'textarea', required: true },
    { id: 'general_app_features', label: 'Funcionalidades desejadas', type: 'textarea' }
  ],
  sites: [
    { id: 'general_site_goal', label: 'Qual é o objetivo do site?', type: 'textarea', required: true },
    { id: 'general_site_pages', label: 'Páginas ou seções necessárias', type: 'textarea' }
  ],
  sistemas: [
    { id: 'general_sys_process', label: 'Qual processo o sistema deve atender?', type: 'textarea', required: true },
    { id: 'general_sys_features', label: 'Funcionalidades essenciais', type: 'textarea' }
  ],
  solucoes: [],
  business: []
};

function getRequirementsFor(categoryId, subcategoryId) {
  if (subcategoryId && REQUIREMENTS_BY_SUBCATEGORY[subcategoryId]) {
    return REQUIREMENTS_BY_SUBCATEGORY[subcategoryId];
  }
  if (categoryId && REQUIREMENTS_BY_CATEGORY[categoryId]) {
    return REQUIREMENTS_BY_CATEGORY[categoryId];
  }
  return [];
}

/* ============================================================
   2. HELPERS LOCAIS
   ============================================================ */

function $id(id) { return document.getElementById(id); }

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function formatFileSize(bytes) {
  if (!bytes || bytes < 1024) return `${bytes || 0} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

function validateFile(file) {
  if (!file) return { ok: false, error: 'Nenhum arquivo selecionado.' };
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: `Arquivo muito grande (${formatFileSize(file.size)}). Máximo: 5 MB.` };
  }
  if (!ACCEPTED_MIME.includes(file.type)) {
    return { ok: false, error: 'Formato inválido. Envie JPEG, PNG ou WebP.' };
  }
  return { ok: true };
}

function findCategoryById(id) { return CATEGORIES_DB.find(c => c.id === id) || null; }
function findSubcategoryById(catId, subId) {
  const cat = findCategoryById(catId);
  return cat ? cat.subcategories.find(s => s.id === subId) || null : null;
}

/* ============================================================
   3. DRAFT — RASCUNHO PERSISTENTE
   ============================================================ */

const DRAFT_VERSION = 1;

function hasMeaningfulDraft(draft) {
  if (!draft || draft._version !== DRAFT_VERSION) return false;
  return Boolean(
    draft.clientType ||
    draft.clientEmail ||
    draft.clientName ||
    draft.companyName ||
    draft.category ||
    draft.projectName
  );
}

function saveDraft() {
  try {
    const snapshot = { ...JourneyState };
    // File não é serializável — dropamos
    delete snapshot.file;
    snapshot._version = DRAFT_VERSION;
    snapshot._savedAt = Date.now();
    safeSetJSON(JOURNEY_DRAFT_KEY, snapshot);
  } catch (err) {
    console.warn('[FGP][assistant] Falha ao salvar rascunho:', err);
  }
}

function loadDraft() {
  const draft = safeGetJSON(JOURNEY_DRAFT_KEY, null);
  if (!hasMeaningfulDraft(draft)) return false;

  Object.keys(draft).forEach(key => {
    if (key === '_version' || key === '_savedAt') return;
    if (key in JourneyState) JourneyState[key] = draft[key];
  });
  JourneyState.file = null;

  // Garante que campos de telefone existem (compatibilidade)
  if (!JourneyState.clientPhoneCountry) JourneyState.clientPhoneCountry = '55';
  if (!JourneyState.clientPhoneNational) JourneyState.clientPhoneNational = '';

  return true;
}

function clearDraft() {
  safeRemove(JOURNEY_DRAFT_KEY);
}

function showDraftBanner(show) {
  const banner = $id('journeyDraftBanner');
  if (banner) banner.style.display = show ? '' : 'none';
}

const debouncedSaveDraft = debounce(() => {
  try { collectStepState(JourneyState.step); } catch (_) {}
  saveDraft();
}, 500);

/* ============================================================
   4. ETAPAS ATIVAS E PROGRESSO
   ============================================================ */

function getActiveSteps() {
  const steps = [1, 2, 3];

  const sub = findSubcategoryById(JourneyState.category, JourneyState.subcategory);
  if (sub && Array.isArray(sub.projectTypes) && sub.projectTypes.length > 0) {
    steps.push(4);
  }

  steps.push(5, 6);

  const reqs = getRequirementsFor(JourneyState.category, JourneyState.subcategory);
  if (reqs.length > 0) steps.push(7);

  steps.push(8, 9, 10, 11, 12, 13);
  return steps;
}

function updateProgressUI() {
  const fill = $id('journeyProgressFill');
  const text = $id('journeyProgressText');
  if (!fill || !text) return;

  const active = getActiveSteps();
  const idx = active.indexOf(JourneyState.step);
  const total = active.length;
  const pos = idx >= 0 ? idx + 1 : 1;

  text.textContent = `Etapa ${pos} de ${total}`;
  fill.style.width = `${(pos / total) * 100}%`;
}

function updateAssistantMessage() {
  const bubble = $id('journeyAssistantText');
  if (!bubble) return;
  bubble.textContent = ASSISTANT_MESSAGES[JourneyState.step] || 'Vamos continuar.';
}

/* ============================================================
   5. NAVEGAÇÃO
   ============================================================ */

function showStep(stepNumber) {
  document.querySelectorAll('#journeyContent .journey-step').forEach(el => {
    el.style.display = 'none';
  });
  const el = document.querySelector(`#journeyContent .journey-step[data-step="${stepNumber}"]`);
  if (el) el.style.display = '';
}

function goToStep(stepNumber) {
  JourneyState.step = stepNumber;
  showStep(stepNumber);
  updateProgressUI();
  updateAssistantMessage();
  syncStateToStep(stepNumber);
  updateFooterButtons();
  scrollJourneyToTop();
  // Save after each navigation
  saveDraft();
}

function scrollJourneyToTop() {
  const content = $id('journeyContent');
  if (content) content.scrollTop = 0;
}

function goNext() {
  if (!validateStep(JourneyState.step)) return;
  collectStepState(JourneyState.step);

  const active = getActiveSteps();
  const idx = active.indexOf(JourneyState.step);
  if (idx < 0 || idx >= active.length - 1) return;
  goToStep(active[idx + 1]);
}

function goPrev() {
  const active = getActiveSteps();
  const idx = active.indexOf(JourneyState.step);
  if (idx <= 0) return;
  goToStep(active[idx - 1]);
}

function updateFooterButtons() {
  const backBtn = $id('journeyBackBtn');
  const nextBtn = $id('journeyNextBtn');
  if (!backBtn || !nextBtn) return;

  const active = getActiveSteps();
  const idx = active.indexOf(JourneyState.step);

  backBtn.style.display = idx > 0 ? '' : 'none';

  const isLast = idx === active.length - 1;
  nextBtn.innerHTML = isLast
    ? '<i class="fas fa-paper-plane"></i> Enviar solicitação'
    : 'Continuar <i class="fas fa-arrow-right"></i>';
}

/* ============================================================
   6. SINCRONIZAÇÃO ESTADO ↔ DOM
   ============================================================ */

function syncStateToStep(step) {
  switch (step) {
    case 1: syncStep1StateToDom(); break;
    case 2: renderCategories(); break;
    case 3: renderServices(); break;
    case 4: renderProjectTypes(); break;
    case 5: syncStep5StateToDom(); break;
    case 6: syncStep6StateToDom(); break;
    case 7: renderRequirements(); break;
    case 8: syncStep8StateToDom(); break;
    case 9: syncStep9StateToDom(); break;
    case 10: syncStep10StateToDom(); break;
    case 11: syncStep11StateToDom(); break;
    case 12: syncStep12StateToDom(); break;
    case 13: renderReview(); break;
  }
}

function collectStepState(step) {
  switch (step) {
    case 1: collectStep1(); break;
    case 5: collectStep5(); break;
    case 6: collectStep6(); break;
    case 7: collectStep7(); break;
    case 8: collectStep8(); break;
    case 9: collectStep9(); break;
    case 10: collectStep10(); break;
    case 11: collectStep11(); break;
    case 12: collectStep12(); break;
  }
}

/* ---------- Etapa 1 ---------- */
function syncStep1StateToDom() {
  document.querySelectorAll('#journeyClientTypeGrid .journey-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.clientType === JourneyState.clientType);
  });

  const indF = $id('journeyIndividualFields');
  const coF = $id('journeyCompanyFields');
  if (indF) indF.style.display = JourneyState.clientType === 'individual' ? '' : 'none';
  if (coF) coF.style.display = JourneyState.clientType === 'company' ? '' : 'none';

  if ($id('journeyClientName')) $id('journeyClientName').value = JourneyState.clientName || '';
  if ($id('journeyClientEmail')) $id('journeyClientEmail').value = JourneyState.clientEmail || '';
  if ($id('journeyCompanyName')) $id('journeyCompanyName').value = JourneyState.companyName || '';
  if ($id('journeyContactName')) $id('journeyContactName').value = JourneyState.contactName || '';
  if ($id('journeyCompanyEmail')) $id('journeyCompanyEmail').value = JourneyState.clientEmail || '';
  if ($id('journeyCompanySegment')) $id('journeyCompanySegment').value = JourneyState.companySegment || '';

  // Telefone: sincroniza os dois grupos (individual + empresa)
  syncPhoneInputs();
}

function collectStep1() {
  if (JourneyState.clientType === 'individual') {
    JourneyState.clientName = ($id('journeyClientName')?.value || '').trim();
    JourneyState.clientEmail = ($id('journeyClientEmail')?.value || '').trim();
    JourneyState.companyName = '';
    JourneyState.contactName = '';
    JourneyState.companySegment = '';
    // clientPhone* já são atualizados pelos listeners de telefone
  } else if (JourneyState.clientType === 'company') {
    JourneyState.companyName = ($id('journeyCompanyName')?.value || '').trim();
    JourneyState.contactName = ($id('journeyContactName')?.value || '').trim();
    JourneyState.clientEmail = ($id('journeyCompanyEmail')?.value || '').trim();
    JourneyState.companySegment = ($id('journeyCompanySegment')?.value || '').trim();
    JourneyState.clientName = '';
  }
}

/* ---------- Etapa 5 ---------- */
function syncStep5StateToDom() {
  if ($id('journeyProjectName')) $id('journeyProjectName').value = JourneyState.projectName || '';
  if ($id('journeyProjectContext')) $id('journeyProjectContext').value = JourneyState.projectContext || '';
  if ($id('journeyProjectProblem')) $id('journeyProjectProblem').value = JourneyState.projectProblem || '';
  if ($id('journeyProjectObjective')) $id('journeyProjectObjective').value = JourneyState.projectObjective || '';
  if ($id('journeyExpectedResult')) $id('journeyExpectedResult').value = JourneyState.expectedResult || '';
}

function collectStep5() {
  JourneyState.projectName = ($id('journeyProjectName')?.value || '').trim();
  JourneyState.projectContext = ($id('journeyProjectContext')?.value || '').trim();
  JourneyState.projectProblem = ($id('journeyProjectProblem')?.value || '').trim();
  JourneyState.projectObjective = ($id('journeyProjectObjective')?.value || '').trim();
  JourneyState.expectedResult = ($id('journeyExpectedResult')?.value || '').trim();
}

/* ---------- Etapa 6 ---------- */
function syncStep6StateToDom() {
  if ($id('journeyTargetAudience')) $id('journeyTargetAudience').value = JourneyState.targetAudience || '';
  if ($id('journeyAudienceAction')) $id('journeyAudienceAction').value = JourneyState.audienceAction || '';
}

function collectStep6() {
  JourneyState.targetAudience = ($id('journeyTargetAudience')?.value || '').trim();
  JourneyState.audienceAction = ($id('journeyAudienceAction')?.value || '').trim();
}

/* ---------- Etapa 7 ---------- */
function renderRequirements() {
  const container = $id('journeyRequirementsContainer');
  if (!container) return;

  const reqs = getRequirementsFor(JourneyState.category, JourneyState.subcategory);
  if (reqs.length === 0) {
    container.innerHTML = '<p class="journey-hint"><i class="fas fa-info-circle"></i> Não há requisitos técnicos específicos para este serviço. Continue para as próximas etapas.</p>';
    return;
  }

  container.innerHTML = reqs.map(r => renderRequirementField(r)).join('');
  reqs.forEach(r => restoreRequirementValue(r));
  reqs.forEach(r => bindRequirementEvents(r));
}

function renderRequirementField(req) {
  const id = `req_${req.id}`;
  const requiredStar = req.required ? ' <span class="required">*</span>' : '';
  const placeholder = req.placeholder ? `placeholder="${escapeHtml(req.placeholder)}"` : '';

  if (req.type === 'textarea') {
    return `
      <div class="journey-form-group">
        <label for="${id}">${escapeHtml(req.label)}${requiredStar}</label>
        <textarea id="${id}" class="journey-textarea" data-req-id="${escapeHtml(req.id)}" rows="3" maxlength="1500" ${placeholder}></textarea>
      </div>`;
  }
  if (req.type === 'text') {
    return `
      <div class="journey-form-group">
        <label for="${id}">${escapeHtml(req.label)}${requiredStar}</label>
        <input type="text" id="${id}" class="journey-input" data-req-id="${escapeHtml(req.id)}" maxlength="300" ${placeholder} />
      </div>`;
  }
  if (req.type === 'radio') {
    const opts = (req.options || []).map(o =>
      `<label class="journey-radio">
         <input type="radio" name="${id}" data-req-id="${escapeHtml(req.id)}" value="${escapeHtml(o)}" />
         ${escapeHtml(o)}
       </label>`).join('');
    return `
      <div class="journey-form-group">
        <label>${escapeHtml(req.label)}${requiredStar}</label>
        <div class="journey-radio-group">${opts}</div>
      </div>`;
  }
  if (req.type === 'checkboxes') {
    const opts = (req.options || []).map(o =>
      `<label class="journey-checkbox">
         <input type="checkbox" name="${id}" data-req-id="${escapeHtml(req.id)}" value="${escapeHtml(o)}" />
         ${escapeHtml(o)}
       </label>`).join('');
    return `
      <div class="journey-form-group">
        <label>${escapeHtml(req.label)}${requiredStar}</label>
        <div class="journey-checkbox-grid">${opts}</div>
      </div>`;
  }
  return '';
}

function restoreRequirementValue(req) {
  const val = JourneyState.requirements[req.id];
  if (req.type === 'textarea' || req.type === 'text') {
    const el = document.querySelector(`[data-req-id="${req.id}"]`);
    if (el && val != null) el.value = val;
    return;
  }
  if (req.type === 'radio') {
    if (val == null) return;
    document.querySelectorAll(`input[type="radio"][data-req-id="${req.id}"]`).forEach(i => {
      i.checked = i.value === val;
    });
    return;
  }
  if (req.type === 'checkboxes') {
    const arr = Array.isArray(val) ? val : [];
    document.querySelectorAll(`input[type="checkbox"][data-req-id="${req.id}"]`).forEach(i => {
      i.checked = arr.includes(i.value);
    });
  }
}

function bindRequirementEvents(req) {
  if (req.type === 'radio') {
    document.querySelectorAll(`input[type="radio"][data-req-id="${req.id}"]`).forEach(i => {
      i.addEventListener('change', () => {
        if (i.checked) JourneyState.requirements[req.id] = i.value;
      });
    });
    return;
  }
  if (req.type === 'checkboxes') {
    if (!Array.isArray(JourneyState.requirements[req.id])) {
      JourneyState.requirements[req.id] = [];
    }
    document.querySelectorAll(`input[type="checkbox"][data-req-id="${req.id}"]`).forEach(i => {
      i.addEventListener('change', () => {
        const arr = JourneyState.requirements[req.id];
        if (i.checked) {
          if (!arr.includes(i.value)) arr.push(i.value);
        } else {
          const idx = arr.indexOf(i.value);
          if (idx >= 0) arr.splice(idx, 1);
        }
      });
    });
    return;
  }
  const el = document.querySelector(`[data-req-id="${req.id}"]`);
  if (!el) return;
  el.addEventListener('input', () => {
    JourneyState.requirements[req.id] = el.value.trim();
  });
}

function collectStep7() {
  const reqs = getRequirementsFor(JourneyState.category, JourneyState.subcategory);
  reqs.forEach(req => {
    const v = JourneyState.requirements[req.id];
    if (typeof v === 'string') JourneyState.requirements[req.id] = v.trim();
  });
}

/* ---------- Etapa 8 ---------- */
function syncStep8StateToDom() {
  document.querySelectorAll('input[name="hasVisualIdentity"]').forEach(r => {
    r.checked = r.value === JourneyState.hasVisualIdentity;
  });
  if ($id('journeyBrandColors')) $id('journeyBrandColors').value = JourneyState.brandColors || '';
  if ($id('journeyReferences')) $id('journeyReferences').value = JourneyState.references || '';
  if ($id('journeyElementsToAvoid')) $id('journeyElementsToAvoid').value = JourneyState.elementsToAvoid || '';
}

function collectStep8() {
  const hv = document.querySelector('input[name="hasVisualIdentity"]:checked');
  JourneyState.hasVisualIdentity = hv ? hv.value : null;
  JourneyState.brandColors = ($id('journeyBrandColors')?.value || '').trim();
  JourneyState.references = ($id('journeyReferences')?.value || '').trim();
  JourneyState.elementsToAvoid = ($id('journeyElementsToAvoid')?.value || '').trim();
}

/* ---------- Etapa 9 ---------- */
function syncStep9StateToDom() {
  const arr = Array.isArray(JourneyState.availableResources) ? JourneyState.availableResources : [];
  document.querySelectorAll('#journeyResourcesGrid input[type="checkbox"]').forEach(i => {
    i.checked = arr.includes(i.value);
  });
  document.querySelectorAll('input[name="needsContentCreation"]').forEach(r => {
    r.checked = r.value === JourneyState.needsContentCreation;
  });
}

function collectStep9() {
  const res = [];
  document.querySelectorAll('#journeyResourcesGrid input[type="checkbox"]:checked').forEach(i => res.push(i.value));
  JourneyState.availableResources = res;

  const ncc = document.querySelector('input[name="needsContentCreation"]:checked');
  JourneyState.needsContentCreation = ncc ? ncc.value : null;
}

/* ---------- Etapa 10 ---------- */
function syncStep10StateToDom() {
  document.querySelectorAll('input[name="hasDomain"]').forEach(r => r.checked = r.value === JourneyState.hasDomain);
  document.querySelectorAll('input[name="hasHosting"]').forEach(r => r.checked = r.value === JourneyState.hasHosting);
  document.querySelectorAll('input[name="needsIntegrations"]').forEach(r => r.checked = r.value === JourneyState.needsIntegrations);
  if ($id('journeyIntegrationDetails')) $id('journeyIntegrationDetails').value = JourneyState.integrationDetails || '';
}

function collectStep10() {
  const d = document.querySelector('input[name="hasDomain"]:checked');
  const h = document.querySelector('input[name="hasHosting"]:checked');
  const i = document.querySelector('input[name="needsIntegrations"]:checked');
  JourneyState.hasDomain = d ? d.value : null;
  JourneyState.hasHosting = h ? h.value : null;
  JourneyState.needsIntegrations = i ? i.value : null;
  JourneyState.integrationDetails = ($id('journeyIntegrationDetails')?.value || '').trim();
}

/* ---------- Etapa 11 ---------- */
function syncStep11StateToDom() {
  document.querySelectorAll('input[name="deadlineType"]').forEach(r => {
    r.checked = r.value === JourneyState.deadlineType;
  });
  const dateGroup = $id('journeyDeadlineDateGroup');
  if (dateGroup) dateGroup.style.display = JourneyState.deadlineType === 'especifica' ? '' : 'none';
  if ($id('journeyDeadlineDate')) $id('journeyDeadlineDate').value = JourneyState.deadlineDate || '';
  if ($id('journeyPriority')) $id('journeyPriority').value = JourneyState.priority || '';
}

function collectStep11() {
  const dt = document.querySelector('input[name="deadlineType"]:checked');
  JourneyState.deadlineType = dt ? dt.value : null;
  JourneyState.deadlineDate = ($id('journeyDeadlineDate')?.value || '').trim();
  JourneyState.priority = ($id('journeyPriority')?.value || '').trim();
}

/* ---------- Etapa 12 ---------- */
function syncStep12StateToDom() {
  document.querySelectorAll('#journeyPaymentGrid .journey-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.payment === JourneyState.payment);
  });
  document.querySelectorAll('#journeyMaintenanceGrid .journey-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.maintenance === JourneyState.maintenance);
  });
  if ($id('journeyCommercialObservations')) {
    $id('journeyCommercialObservations').value = JourneyState.commercialObservations || '';
  }
}

function collectStep12() {
  JourneyState.commercialObservations = ($id('journeyCommercialObservations')?.value || '').trim();
}

/* ============================================================
   7. VALIDAÇÃO
   ============================================================ */

function clearStepErrors() {
  const alert = $id('journeyAlert');
  if (alert) { alert.textContent = ''; alert.classList.remove('visible'); }
  document.querySelectorAll('#journeyContent .journey-field-error').forEach(el => el.classList.remove('visible'));
}

function showStepError(msg) {
  const alert = $id('journeyAlert');
  if (alert) { alert.textContent = msg; alert.classList.add('visible'); }
}

function validateStep(step) {
  clearStepErrors();
  switch (step) {
    case 1: return validateStep1();
    case 2: return validateStep2();
    case 3: return validateStep3();
    case 4: return validateStep4();
    case 5: return validateStep5();
    case 6: return validateStep6();
    case 7: return validateStep7();
    case 12: return validateStep12();
    default: return true;
  }
}

function validateStep1() {
  if (!JourneyState.clientType) {
    showStepError('Selecione se você é pessoa física ou empresa.');
    return false;
  }
  if (JourneyState.clientType === 'individual') {
    const name = ($id('journeyClientName')?.value || '').trim();
    const email = ($id('journeyClientEmail')?.value || '').trim();
    if (!name) {
      $id('journeyClientNameError')?.classList.add('visible');
      showStepError('Informe seu nome completo.');
      return false;
    }
    if (!email || !isValidEmail(email)) {
      $id('journeyClientEmailError')?.classList.add('visible');
      showStepError('Informe um e-mail válido.');
      return false;
    }
  } else {
    const co = ($id('journeyCompanyName')?.value || '').trim();
    const ct = ($id('journeyContactName')?.value || '').trim();
    const em = ($id('journeyCompanyEmail')?.value || '').trim();
    if (!co) {
      $id('journeyCompanyNameError')?.classList.add('visible');
      showStepError('Informe o nome da empresa.');
      return false;
    }
    if (!ct) {
      $id('journeyContactNameError')?.classList.add('visible');
      showStepError('Informe o nome do responsável.');
      return false;
    }
    if (!em || !isValidEmail(em)) {
      $id('journeyCompanyEmailError')?.classList.add('visible');
      showStepError('Informe um e-mail válido.');
      return false;
    }
  }
  return true;
}

function validateStep2() {
  if (!JourneyState.category) { showStepError('Selecione uma categoria.'); return false; }
  return true;
}
function validateStep3() {
  if (!JourneyState.subcategory) { showStepError('Selecione um serviço.'); return false; }
  return true;
}
function validateStep4() {
  if (!JourneyState.projectType) { showStepError('Selecione o tipo de projeto.'); return false; }
  return true;
}
function validateStep5() {
  const name = ($id('journeyProjectName')?.value || '').trim();
  const prob = ($id('journeyProjectProblem')?.value || '').trim();
  if (!name) {
    $id('journeyProjectNameError')?.classList.add('visible');
    showStepError('Informe um nome para o projeto.');
    return false;
  }
  if (!prob) {
    $id('journeyProjectProblemError')?.classList.add('visible');
    showStepError('Descreva o problema a ser resolvido.');
    return false;
  }
  return true;
}
function validateStep6() {
  const t = ($id('journeyTargetAudience')?.value || '').trim();
  if (!t) {
    $id('journeyTargetAudienceError')?.classList.add('visible');
    showStepError('Descreva o público-alvo.');
    return false;
  }
  return true;
}
function validateStep7() {
  const reqs = getRequirementsFor(JourneyState.category, JourneyState.subcategory);
  collectStep7();
  for (const req of reqs) {
    if (!req.required) continue;
    const v = JourneyState.requirements[req.id];
    const empty = v == null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
    if (empty) { showStepError(`Responda: ${req.label}`); return false; }
  }
  return true;
}
function validateStep12() {
  if (!JourneyState.payment) { showStepError('Selecione a forma de pagamento da produção.'); return false; }
  return true;
}

/* ============================================================
   8. RENDERIZAÇÃO — ETAPAS 2, 3, 4
   ============================================================ */

function renderCategories() {
  const grid = $id('journeyCategoriesGrid');
  if (!grid) return;

  grid.innerHTML = CATEGORIES_DB.map(cat => `
    <button class="journey-card ${JourneyState.category === cat.id ? 'selected' : ''}"
            data-category="${escapeHtml(cat.id)}" type="button">
      <div class="journey-card-icon"><i class="fas ${escapeHtml(cat.icon)}"></i></div>
      <div class="journey-card-title">${escapeHtml(cat.title)}</div>
      <div class="journey-card-desc">${escapeHtml(cat.description)}</div>
    </button>
  `).join('');

  grid.querySelectorAll('.journey-card').forEach(card => {
    card.addEventListener('click', () => {
      JourneyState.category = card.dataset.category;
      JourneyState.subcategory = null;
      JourneyState.projectType = '';
      JourneyState.requirements = {};
      renderCategories();
    });
  });
}

function renderServices() {
  const grid = $id('journeyServicesGrid');
  if (!grid) return;
  const cat = findCategoryById(JourneyState.category);
  if (!cat) { grid.innerHTML = '<p class="journey-hint">Selecione uma categoria primeiro.</p>'; return; }

  grid.innerHTML = cat.subcategories.map(sub => `
    <button class="journey-card ${JourneyState.subcategory === sub.id ? 'selected' : ''}"
            data-subcategory="${escapeHtml(sub.id)}" type="button">
      <div class="journey-card-icon"><i class="fas ${escapeHtml(sub.icon)}"></i></div>
      <div class="journey-card-title">${escapeHtml(sub.title)}</div>
      <div class="journey-card-desc">${escapeHtml(sub.description)}</div>
    </button>
  `).join('');

  grid.querySelectorAll('.journey-card').forEach(card => {
    card.addEventListener('click', () => {
      JourneyState.subcategory = card.dataset.subcategory;
      JourneyState.projectType = '';
      JourneyState.requirements = {};
      renderServices();
    });
  });
}

function renderProjectTypes() {
  const grid = $id('journeyTypesGrid');
  if (!grid) return;
  const sub = findSubcategoryById(JourneyState.category, JourneyState.subcategory);
  if (!sub || !Array.isArray(sub.projectTypes) || sub.projectTypes.length === 0) {
    grid.innerHTML = '<p class="journey-hint">Esta opção não exige a escolha de um tipo específico.</p>';
    return;
  }
  grid.innerHTML = sub.projectTypes.map(t => `
    <button class="journey-card ${JourneyState.projectType === t ? 'selected' : ''}"
            data-project-type="${escapeHtml(t)}" type="button">
      <div class="journey-card-icon"><i class="fas fa-diagram-project"></i></div>
      <div class="journey-card-title">${escapeHtml(t)}</div>
    </button>
  `).join('');

  grid.querySelectorAll('.journey-card').forEach(card => {
    card.addEventListener('click', () => {
      JourneyState.projectType = card.dataset.projectType;
      grid.querySelectorAll('.journey-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });
}

/* ============================================================
   9. REVISÃO
   ============================================================ */

function getCategoryTitle() { return findCategoryById(JourneyState.category)?.title || '—'; }
function getSubcategoryTitle() { return findSubcategoryById(JourneyState.category, JourneyState.subcategory)?.title || '—'; }

function renderReview() {
  const container = $id('journeyReviewSummary');
  if (!container) return;

  const sections = [
    renderReviewSection('Dados do solicitante', 1, [
      ['Tipo', JourneyState.clientType === 'company' ? 'Empresa' : 'Pessoa física'],
      ['Nome', JourneyState.clientType === 'company' ? JourneyState.companyName : JourneyState.clientName],
      ['Responsável', JourneyState.contactName],
      ['E-mail', JourneyState.clientEmail],
      ['Telefone', JourneyState.clientPhone],
      ['Segmento', JourneyState.companySegment]
    ]),
    renderReviewSection('Identificação do projeto', 5, [
      ['Nome do projeto', JourneyState.projectName],
      ['Contexto', JourneyState.projectContext],
      ['Problema', JourneyState.projectProblem],
      ['Objetivo', JourneyState.projectObjective],
      ['Resultado esperado', JourneyState.expectedResult]
    ]),
    renderReviewSection('Categoria e tipo de serviço', 2, [
      ['Categoria', getCategoryTitle()],
      ['Serviço', getSubcategoryTitle()],
      ['Tipo de projeto', JourneyState.projectType]
    ]),
    renderReviewSection('Objetivo e público-alvo', 6, [
      ['Público-alvo', JourneyState.targetAudience],
      ['Ação esperada', JourneyState.audienceAction]
    ]),
    renderReviewSection('Requisitos e funcionalidades', 7, buildRequirementsRows()),
    renderReviewSection('Identidade visual e referências', 8, [
      ['Identidade visual', formatYesNo(JourneyState.hasVisualIdentity)],
      ['Cores', JourneyState.brandColors],
      ['Referências', JourneyState.references],
      ['Evitar', JourneyState.elementsToAvoid]
    ]),
    renderReviewSection('Materiais disponíveis', 9, [
      ['Recursos', (JourneyState.availableResources || []).join(', ')],
      ['FGP deve produzir', formatYesNo(JourneyState.needsContentCreation)]
    ]),
    renderReviewSection('Infraestrutura e integrações', 10, [
      ['Domínio', formatYesNo(JourneyState.hasDomain)],
      ['Hospedagem', formatYesNo(JourneyState.hasHosting)],
      ['Integrações', formatYesNo(JourneyState.needsIntegrations)],
      ['Detalhes', JourneyState.integrationDetails]
    ]),
    renderReviewSection('Prazo desejado', 11, [
      ['Tipo de prazo', formatDeadline(JourneyState.deadlineType)],
      ['Data', JourneyState.deadlineDate],
      ['Prioridade', JourneyState.priority]
    ]),
    renderReviewSection('Preferências comerciais', 12, [
      ['Pagamento', JourneyState.payment],
      ['Manutenção', JourneyState.maintenance],
      ['Observações', JourneyState.commercialObservations]
    ])
  ];

  container.innerHTML = sections.join('') + `
    <div class="journey-external-notice">
      <i class="fas fa-circle-info"></i>
      <p>Esta solicitação não representa contratação automática. A FGP avaliará o escopo e retornará com uma proposta personalizada.</p>
    </div>
  `;

  container.querySelectorAll('[data-edit-step]').forEach(btn => {
    btn.addEventListener('click', () => goToStep(Number(btn.dataset.editStep)));
  });
}

function renderReviewSection(title, editStep, rows) {
  const visible = rows.filter(([, v]) => {
    if (v == null) return false;
    if (typeof v === 'string') return v.trim() !== '';
    if (Array.isArray(v)) return v.length > 0;
    return true;
  });

  if (visible.length === 0) {
    return `
      <div class="journey-review-section">
        <div class="journey-review-header">
          <h4>${escapeHtml(title)}</h4>
          <button type="button" class="journey-review-edit" data-edit-step="${editStep}">
            <i class="fas fa-pen"></i> Editar
          </button>
        </div>
        <p class="journey-review-empty">Não informado.</p>
      </div>`;
  }

  return `
    <div class="journey-review-section">
      <div class="journey-review-header">
        <h4>${escapeHtml(title)}</h4>
        <button type="button" class="journey-review-edit" data-edit-step="${editStep}">
          <i class="fas fa-pen"></i> Editar
        </button>
      </div>
      <dl class="journey-review-list">
        ${visible.map(([label, value]) => `
          <div class="journey-review-row">
            <dt>${escapeHtml(label)}</dt>
            <dd>${escapeHtml(String(value))}</dd>
          </div>
        `).join('')}
      </dl>
    </div>`;
}

function buildRequirementsRows() {
  const reqs = getRequirementsFor(JourneyState.category, JourneyState.subcategory);
  const rows = [];
  reqs.forEach(req => {
    const v = JourneyState.requirements[req.id];
    if (v == null) return;
    if (Array.isArray(v) && v.length === 0) return;
    if (typeof v === 'string' && v.trim() === '') return;
    rows.push([req.label, Array.isArray(v) ? v.join(', ') : v]);
  });
  return rows;
}

function formatYesNo(v) {
  if (v === 'sim') return 'Sim';
  if (v === 'nao') return 'Não';
  if (v === 'parcial') return 'Parcialmente';
  if (v == null || v === '') return null;
  return String(v);
}
function formatDeadline(v) {
  const m = { flexivel: 'Flexível', asap: 'O quanto antes', especifica: 'Data específica', indefinido: 'Ainda não definido' };
  return m[v] || null;
}

/* ============================================================
   10. TELEFONE INTERNACIONAL
   ============================================================ */

function applyPhoneMask(inputEl, countryCode) {
  const digits = extractDigits(inputEl.value);
  const country = getCountryByCode(countryCode);
  const limited = digits.slice(0, country.nationalDigits);
  const formatted = formatPhone(limited, countryCode);
  if (inputEl.value !== formatted) {
    inputEl.value = formatted;
    try {
      inputEl.setSelectionRange(formatted.length, formatted.length);
    } catch (_) {}
  }
  return limited;
}

function syncPhoneInputs() {
  const country = JourneyState.clientPhoneCountry || '55';
  const national = JourneyState.clientPhoneNational || '';

  ['journeyClientPhone', 'journeyCompanyPhone'].forEach(prefix => {
    const countryEl = $id(`${prefix}Country`);
    const nationalEl = $id(`${prefix}National`);
    if (countryEl) countryEl.value = country;
    if (nationalEl) {
      nationalEl.value = formatPhone(national, country);
      const countryObj = getCountryByCode(country);
      nationalEl.placeholder = countryObj.example;
      nationalEl.maxLength = Math.max(20, countryObj.nationalDigits + 8);
    }
  });
}

function bindPhoneInputs() {
  const PAIRS = [
    { prefix: 'journeyClientPhone', other: 'journeyCompanyPhone' },
    { prefix: 'journeyCompanyPhone', other: 'journeyClientPhone' }
  ];

  PAIRS.forEach(({ prefix, other }) => {
    const countryEl = $id(`${prefix}Country`);
    const nationalEl = $id(`${prefix}National`);
    if (!countryEl || !nationalEl) return;

    // Input do número nacional
    nationalEl.addEventListener('input', () => {
      const cc = countryEl.value;
      const digits = applyPhoneMask(nationalEl, cc);
      JourneyState.clientPhoneCountry = cc;
      JourneyState.clientPhoneNational = digits;
      JourneyState.clientPhone = composePhone(digits, cc);

      // Sincroniza o outro par (se visível ou não)
      const otherCountry = $id(`${other}Country`);
      const otherNational = $id(`${other}National`);
      if (otherCountry) otherCountry.value = cc;
      if (otherNational) otherNational.value = nationalEl.value;

      debouncedSaveDraft();
    });

    // Troca de país
    countryEl.addEventListener('change', () => {
      const cc = countryEl.value;
      const countryObj = getCountryByCode(cc);
      const digits = extractDigits(nationalEl.value).slice(0, countryObj.nationalDigits);

      const formatted = formatPhone(digits, cc);
      nationalEl.value = formatted;
      nationalEl.placeholder = countryObj.example;
      nationalEl.maxLength = Math.max(20, countryObj.nationalDigits + 8);

      JourneyState.clientPhoneCountry = cc;
      JourneyState.clientPhoneNational = digits;
      JourneyState.clientPhone = composePhone(digits, cc);

      const otherCountry = $id(`${other}Country`);
      const otherNational = $id(`${other}National`);
      if (otherCountry) otherCountry.value = cc;
      if (otherNational) {
        otherNational.value = formatted;
        otherNational.placeholder = countryObj.example;
      }

      debouncedSaveDraft();
    });
  });
}

/* ============================================================
   11. UPLOAD
   ============================================================ */

function setupFileUpload() {
  const area = $id('journeyUploadArea');
  const input = $id('journeyFileInput');
  const preview = $id('journeyUploadPreview');
  const img = $id('journeyPreviewImg');
  const name = $id('journeyPreviewFilename');
  const size = $id('journeyPreviewFilesize');
  const remove = $id('journeyRemoveFileBtn');
  const err = $id('journeyFileError');
  if (!area || !input) return;

  area.addEventListener('click', () => input.click());

  input.addEventListener('change', () => {
    const f = input.files && input.files[0];
    if (!f) return;
    const check = validateFile(f);
    if (!check.ok) {
      if (err) { err.textContent = check.error; err.classList.add('visible'); }
      input.value = '';
      JourneyState.file = null;
      preview?.classList.remove('visible');
      return;
    }
    JourneyState.file = f;
    if (err) err.classList.remove('visible');
    if (preview && img && name && size) {
      const reader = new FileReader();
      reader.onload = e => {
        img.src = e.target.result;
        name.textContent = f.name;
        size.textContent = formatFileSize(f.size);
        preview.classList.add('visible');
      };
      reader.readAsDataURL(f);
    }
  });

  remove?.addEventListener('click', () => {
    JourneyState.file = null;
    input.value = '';
    if (img) img.src = '';
    preview?.classList.remove('visible');
  });
}

/* ============================================================
   12. PAYLOAD E ENVIO
   ============================================================ */

function buildForminitPayload() {
  return {
    client_type: JourneyState.clientType,
    client_name: JourneyState.clientName,
    client_email: JourneyState.clientEmail,
    client_phone: JourneyState.clientPhone,
    company_name: JourneyState.companyName,
    contact_name: JourneyState.contactName,
    company_segment: JourneyState.companySegment,
    category_id: JourneyState.category,
    category_title: getCategoryTitle(),
    subcategory_id: JourneyState.subcategory,
    subcategory_title: getSubcategoryTitle(),
    project_type: JourneyState.projectType,
    project_name: JourneyState.projectName,
    project_context: JourneyState.projectContext,
    project_problem: JourneyState.projectProblem,
    project_objective: JourneyState.projectObjective,
    expected_result: JourneyState.expectedResult,
    target_audience: JourneyState.targetAudience,
    audience_action: JourneyState.audienceAction,
    requirements_json: JSON.stringify(JourneyState.requirements || {}),
    has_visual_identity: JourneyState.hasVisualIdentity,
    brand_colors: JourneyState.brandColors,
    references: JourneyState.references,
    elements_to_avoid: JourneyState.elementsToAvoid,
    available_resources: (JourneyState.availableResources || []).join(', '),
    needs_content_creation: JourneyState.needsContentCreation,
    has_domain: JourneyState.hasDomain,
    has_hosting: JourneyState.hasHosting,
    needs_integrations: JourneyState.needsIntegrations,
    integration_details: JourneyState.integrationDetails,
    deadline_type: JourneyState.deadlineType,
    deadline_date: JourneyState.deadlineDate,
    priority: JourneyState.priority,
    payment: JourneyState.payment,
    maintenance: JourneyState.maintenance,
    commercial_observations: JourneyState.commercialObservations,
    submitted_at: new Date().toISOString(),
    source: 'fgp-tech-journey'
  };
}

let isSubmitting = false;

async function handleSubmit() {
  if (isSubmitting) return;
  if (!validateStep(JourneyState.step)) return;
  collectStepState(JourneyState.step);

  const feedback = $id('journeySubmitFeedback');
  const nextBtn = $id('journeyNextBtn');

  isSubmitting = true;
  if (nextBtn) { nextBtn.disabled = true; nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'; }
  if (feedback) {
    feedback.className = 'journey-submit-feedback visible';
    feedback.textContent = 'Preparando solicitação...';
  }

  try {
    const payload = buildForminitPayload();
    const forminit = await import('./forminit.js');
    const submitFn = forminit.submitJourney || forminit.submitRequest || forminit.submit || forminit.default;
    if (typeof submitFn !== 'function') throw new Error('Nenhuma função de envio disponível em forminit.js.');

    const result = await submitFn(payload, JourneyState.file || null);
    if (result && result.ok === false) throw new Error(result.error || 'O envio não foi confirmado.');

    if (feedback) {
      feedback.className = 'journey-submit-feedback success visible';
      feedback.innerHTML = '<i class="fas fa-circle-check"></i> Solicitação enviada com sucesso! Entraremos em contato em breve.';
    }
    if (nextBtn) nextBtn.innerHTML = '<i class="fas fa-check"></i> Enviado';

    // Limpa rascunho + estado após sucesso
    clearDraft();
    showDraftBanner(false);

    setTimeout(() => {
      resetJourneyState();
      closeJourney();
    }, 2200);
  } catch (err) {
    console.error('[FGP][assistant] Erro no envio:', err);
    if (feedback) {
      feedback.className = 'journey-submit-feedback error visible';
      feedback.innerHTML = `<i class="fas fa-circle-exclamation"></i> ${escapeHtml(err.message || 'Erro ao enviar. Tente novamente.')}`;
    }
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Tentar novamente';
    }
  } finally {
    isSubmitting = false;
  }
}

/* ============================================================
   13. RESET E API PÚBLICA
   ============================================================ */

function resetJourneyState() {
  Object.assign(JourneyState, {
    step: 1,
    clientType: null,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientPhoneCountry: '55',
    clientPhoneNational: '',
    companyName: '',
    contactName: '',
    companySegment: '',
    category: null,
    subcategory: null,
    projectType: '',
    projectName: '',
    projectContext: '',
    projectProblem: '',
    projectObjective: '',
    expectedResult: '',
    targetAudience: '',
    audienceAction: '',
    requirements: {},
    hasVisualIdentity: null,
    brandColors: '',
    references: '',
    elementsToAvoid: '',
    availableResources: [],
    needsContentCreation: null,
    hasDomain: null,
    hasHosting: null,
    needsIntegrations: null,
    integrationDetails: '',
    deadlineType: null,
    deadlineDate: '',
    priority: '',
    payment: null,
    maintenance: null,
    commercialObservations: '',
    file: null
  });
}

export function openJourney(opts = {}) {
  const { category, subcategory, reset = false } = opts;

  if (reset) {
    resetJourneyState();
    clearDraft();
    showDraftBanner(false);
  } else {
    const loaded = loadDraft();
    showDraftBanner(loaded);
  }

  if (category) {
    JourneyState.category = category;
    if (subcategory) JourneyState.subcategory = subcategory;
  }

  // BUG FIX: sempre começa pela etapa 1 (identificação)
  JourneyState.step = 1;

  const modal = $id('journeyModal');
  if (!modal) return;

  showSafely(modal, { focusFirst: false });
  modal.classList.add('open');
  document.body.classList.add('modal-open');

  goToStep(JourneyState.step);
}

export function closeJourney() {
  const modal = $id('journeyModal');
  if (!modal) return;

  // Coleta + salva antes de fechar
  try { collectStepState(JourneyState.step); } catch (_) {}
  saveDraft();

  // Fallback de foco: o botão que costuma abrir a jornada
  const trigger = $id('heroStartBtn') || $id('sideMenuStartBtn');
  hideSafely(modal, { focusFallback: trigger });
  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
}

/* ============================================================
   14. EVENTOS
   ============================================================ */

function bindEventListeners() {
  // Fechar
  $id('closeJourneyBtn')?.addEventListener('click', closeJourney);

  // Navegação
  $id('journeyBackBtn')?.addEventListener('click', goPrev);
  $id('journeyNextBtn')?.addEventListener('click', () => {
    if (JourneyState.step === 13) handleSubmit();
    else goNext();
  });

  // Etapa 1 — seleção do tipo de cliente
  document.querySelectorAll('#journeyClientTypeGrid .journey-card').forEach(card => {
    card.addEventListener('click', () => {
      JourneyState.clientType = card.dataset.clientType;
      syncStep1StateToDom();
      saveDraft();
    });
  });

  // Etapa 11 — data condicional
  document.querySelectorAll('input[name="deadlineType"]').forEach(input => {
    input.addEventListener('change', () => {
      const dateGroup = $id('journeyDeadlineDateGroup');
      if (dateGroup) dateGroup.style.display = input.value === 'especifica' ? '' : 'none';
    });
  });

  // Etapa 12 — cards de pagamento e manutenção
  document.querySelectorAll('#journeyPaymentGrid .journey-card').forEach(card => {
    card.addEventListener('click', () => {
      JourneyState.payment = card.dataset.payment;
      document.querySelectorAll('#journeyPaymentGrid .journey-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });
  document.querySelectorAll('#journeyMaintenanceGrid .journey-card').forEach(card => {
    card.addEventListener('click', () => {
      JourneyState.maintenance = card.dataset.maintenance;
      document.querySelectorAll('#journeyMaintenanceGrid .journey-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Discard draft
  $id('journeyDiscardDraftBtn')?.addEventListener('click', () => {
    clearDraft();
    resetJourneyState();
    showDraftBanner(false);
    goToStep(1);
  });

  // Auto-save em qualquer input dentro do conteúdo da jornada
  const content = $id('journeyContent');
  if (content) {
    content.addEventListener('input', debouncedSaveDraft);
    content.addEventListener('change', debouncedSaveDraft);
  }

  // Upload
  setupFileUpload();

  // Telefone
  bindPhoneInputs();
}

/* ============================================================
   15. INIT
   ============================================================ */

let initialized = false;

export function initAssistant() {
  if (initialized) return;
  bindEventListeners();
  initialized = true;
}
