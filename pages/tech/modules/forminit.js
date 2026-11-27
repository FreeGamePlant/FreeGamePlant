/* ============================================================
   FGP TECHNOLOGIES — forminit.js
   Integração com o Forminit: envio de solicitações legadas
   (requestModal) e da nova jornada guiada (journeyModal, 13 etapas).

   EXPORTA:
   - submitRequest(payload, file)   → envio legado (requestModal)
   - submitJourney(payload, file)   → novo assistente (13 etapas)
   - submit                         → alias de submitJourney
   - default                        → alias de submitJourney

   CONTRATO:
   Todas as funções retornam Promise<{ ok: boolean, error?: string, data?: any }>.
   Nunca lançam para o chamador — o erro é encapsulado em { ok: false }.
   ============================================================ */

import {
  validateFile,
  formatFileSize,
  isValidEmail,
  MAX_FILE_SIZE,
  ACCEPTED_FILE_MIME
} from './utils.js';

/* ============================================================
   1. CONFIGURAÇÃO DO FORMINIT
   ------------------------------------------------------------
   O endpoint é derivado automaticamente do form ID para evitar
   mismatch. Se o seu formulário usa um domínio customizado
   (ex.: https://forms.suaempresa.com/f/xyz), sobrescreva
   FORMINIT_ENDPOINT manualmente.
   ============================================================ */

const FORMINIT_FORM_ID = 'l6ts8syb4td';
const FORMINIT_ENDPOINT = `https://forminit.com/f/${FORMINIT_FORM_ID}`;

/**
 * Timeout máximo por requisição (ms). Se o Forminit não responder
 * nesse intervalo, abortamos e retornamos { ok: false }.
 */
const REQUEST_TIMEOUT_MS = 30_000;

/* ============================================================
   2. HELPERS LOCAIS
   ============================================================ */

/**
 * Normaliza qualquer valor para string segura de envio.
 * - null/undefined → ''
 * - arrays → string separada por vírgula
 * - objetos → JSON
 * - booleanos → 'true'/'false'
 */
function toFieldValue(v) {
  if (v == null) return '';
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return String(v);
}

/**
 * Mensagens de erro conhecidas do Forminit (para fallback
 * quando o servidor não retorna JSON estruturado).
 */
const HTTP_ERROR_HINTS = {
  400: 'Os dados enviados não foram aceitos pelo formulário. Verifique se todos os campos obrigatórios estão configurados no painel.',
  401: 'Formulário não autorizado. Verifique se ele está público no painel do Forminit.',
  403: 'Envio bloqueado. O formulário pode estar restrito ou o domínio não autorizado.',
  404: 'Formulário não encontrado. Verifique o form ID.',
  413: 'Arquivo grande demais para o servidor. Reduza o tamanho do anexo.',
  422: 'Alguns campos foram rejeitados pelo formulário. Verifique a configuração dos blocos no painel.',
  429: 'Muitos envios em pouco tempo. Aguarde alguns minutos e tente novamente.',
  500: 'Erro interno no Forminit. Tente novamente em instantes.',
  502: 'Serviço do Forminit indisponível no momento.',
  503: 'Serviço do Forminit em manutenção. Tente novamente mais tarde.'
};

/* ============================================================
   3. ENVIO BASE (multipart/form-data + timeout)
   ============================================================ */

let activeSubmissions = 0;

async function postToForminit(fields, file) {
  // Defesa contra envios duplicados (o assistant.js/modals.js também bloqueiam)
  if (activeSubmissions > 0) {
    return { ok: false, error: 'Já existe um envio em andamento. Aguarde a conclusão.' };
  }
  activeSubmissions++;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    // Validação do arquivo antes de montar o FormData
    if (file) {
      const check = validateFile(file);
      if (!check.ok) {
        return { ok: false, error: check.error };
      }
    }

    const formData = new FormData();

    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, toFieldValue(value));
    });

    // Metadados úteis (o painel pode ignorar se não houver blocos)
    formData.append('_form_id', FORMINIT_FORM_ID);
    formData.append('_submitted_at', new Date().toISOString());
    formData.append('_source', 'fgp-tech');

    if (file) {
      // O nome "attachment" deve coincidir com o bloco de upload
      // configurado no painel Forminit.
      formData.append('attachment', file, file.name);
    }

    const response = await fetch(FORMINIT_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
      // NÃO definir Content-Type: o browser preenche o boundary.
    });

    clearTimeout(timeoutId);

    // ---- Erros HTTP ----
    if (!response.ok) {
      let serverMessage = '';
      try {
        const data = await response.json();
        serverMessage = data?.error || data?.message || '';
      } catch (_) {
        // Resposta sem JSON — ignora
      }

      const hint = HTTP_ERROR_HINTS[response.status] || `Falha no envio (HTTP ${response.status}).`;
      return {
        ok: false,
        error: serverMessage || hint
      };
    }

    // ---- Sucesso (200/201/202/204) ----
    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      data = null;
    }

    // Alguns endpoints retornam 200 com { success: false }
    if (data && data.success === false) {
      return {
        ok: false,
        error: data.error || data.message || 'O Forminit recusou o envio.'
      };
    }

    return { ok: true, data };

  } catch (err) {
    clearTimeout(timeoutId);

    if (err && err.name === 'AbortError') {
      return {
        ok: false,
        error: 'O envio demorou mais de 30 segundos. Verifique sua conexão e tente novamente.'
      };
    }

    console.error('[FGP][forminit] Erro de rede:', err);
    return {
      ok: false,
      error: 'Não foi possível conectar ao serviço de envio. Verifique sua conexão e tente novamente.'
    };

  } finally {
    activeSubmissions = Math.max(0, activeSubmissions - 1);
  }
}

/* ============================================================
   4. ENVIO LEGADO — requestModal
   ------------------------------------------------------------
   Campos esperados pelo painel (todos opcionais exceto os 2
   obrigatórios marcados com *):
     * titulo
     * descricao_projeto
       descricao_inicial
       tipo_pedido
       pagamento_producao
       parcelas
       dia_vencimento
       manutencao
       origem
       attachment (arquivo)
   ============================================================ */

export async function submitRequest(payload, file = null) {
  const data = payload || {};

  // ---- Validações (mesmas do modals.js, defesa em profundidade) ----
  if (!data.title || !String(data.title).trim()) {
    return { ok: false, error: 'Informe o título do pedido.' };
  }
  if (!data.projectDescription || !String(data.projectDescription).trim()) {
    return { ok: false, error: 'Informe a descrição do projeto.' };
  }
  if (data.productionPayment === 'Parcelado') {
    if (!data.installmentCount) {
      return { ok: false, error: 'Selecione a quantidade de parcelas.' };
    }
    if (!data.dueDay) {
      return { ok: false, error: 'Selecione o dia de vencimento.' };
    }
  }

  const fields = {
    // Identificação do pedido
    titulo: data.title,
    descricao_inicial: data.initialDescription || '',
    tipo_pedido: data.requestType || '',
    descricao_projeto: data.projectDescription,

    // Comercial
    pagamento_producao: data.productionPayment || '',
    parcelas: data.productionPayment === 'Parcelado' ? data.installmentCount : '',
    dia_vencimento: data.productionPayment === 'Parcelado' ? data.dueDay : '',
    manutencao: data.maintenancePreference || '',

    // Meta
    origem: 'requestModal'
  };

  const selectedFile = file || data.attachment || null;
  return postToForminit(fields, selectedFile);
}

/* ============================================================
   5. ENVIO DA JORNADA — journeyModal (13 etapas)
   ------------------------------------------------------------
   Recebe o payload de assistant.js#buildForminitPayload e o
   arquivo opcional. Achata os grupos em campos compreensíveis
   para o painel Forminit.

   CAMPOS OBRIGATÓRIOS no painel Forminit (devem ter bloco):
     - tipo_solicitante
     - email
     - nome_projeto
     - categoria_id / servico_id
     - nome_solicitante OU nome_empresa
     - problema
     - publico_alvo
     - pagamento_producao

   CAMPOS OPCIONAIS (só precisam de bloco se forem ser usados):
     - nome_empresa, responsavel, segmento
     - categoria, servico, tipo_projeto
     - contexto, objetivo, resultado_esperado, acao_esperada
     - requisitos_json
     - possui_identidade_visual, cores, referencias, evitar
     - recursos_disponiveis, fgp_deve_produzir
     - possui_dominio, possui_hospedagem, precisa_integracoes,
       detalhes_integracoes
     - tipo_prazo, data_desejada, prioridade
     - manutencao, observacoes_comerciais
     - telefone_pais, telefone_nacional (componentes do telefone)

   O campo `attachment` (arquivo) é opcional.
   ============================================================ */

export async function submitJourney(payload, file = null) {
  const data = payload || {};

  // ---- Validações essenciais (o assistant.js já valida, defesa extra) ----
  if (!data.client_type) {
    return { ok: false, error: 'Tipo de solicitante não informado.' };
  }
  if (!data.client_email || !isValidEmail(data.client_email)) {
    return { ok: false, error: 'E-mail do solicitante inválido.' };
  }
  if (!data.project_name || !String(data.project_name).trim()) {
    return { ok: false, error: 'Nome do projeto não informado.' };
  }
  if (!data.category_id || !data.subcategory_id) {
    return { ok: false, error: 'Categoria ou serviço não informado.' };
  }

  /* ------------------------------------------------------------
     Mapeamento para os blocos do Forminit.
     Ajuste APENAS este objeto se o painel usar nomes diferentes.
     ------------------------------------------------------------ */
  const fields = {
    /* --- Solicitante --- */
    tipo_solicitante: data.client_type,                    // 'individual' | 'company'
    nome_solicitante: data.client_name || data.contact_name || '',
    nome_empresa: data.company_name || '',
    responsavel: data.contact_name || '',
    email: data.client_email,
    telefone: data.client_phone || '',                     // composto: "+55 (11) 98765-4321"
    telefone_pais: data.client_phone_country || '',        // "55"
    telefone_nacional: data.client_phone_national || '',   // "11987654321"
    segmento: data.company_segment || '',

    /* --- Catálogo --- */
    categoria_id: data.category_id,
    categoria: data.category_title,
    servico_id: data.subcategory_id,
    servico: data.subcategory_title,
    tipo_projeto: data.project_type || '',

    /* --- Projeto --- */
    nome_projeto: data.project_name,
    contexto: data.project_context || '',
    problema: data.project_problem || '',
    objetivo: data.project_objective || '',
    resultado_esperado: data.expected_result || '',
    publico_alvo: data.target_audience || '',
    acao_esperada: data.audience_action || '',

    /* --- Requisitos (JSON serializado) --- */
    requisitos_json: data.requirements_json || '{}',

    /* --- Identidade visual --- */
    possui_identidade_visual: data.has_visual_identity || '',
    cores: data.brand_colors || '',
    referencias: data.references || '',
    evitar: data.elements_to_avoid || '',

    /* --- Materiais --- */
    recursos_disponiveis: data.available_resources || '',
    fgp_deve_produzir: data.needs_content_creation || '',

    /* --- Infraestrutura --- */
    possui_dominio: data.has_domain || '',
    possui_hospedagem: data.has_hosting || '',
    precisa_integracoes: data.needs_integrations || '',
    detalhes_integracoes: data.integration_details || '',

    /* --- Prazo --- */
    tipo_prazo: data.deadline_type || '',
    data_desejada: data.deadline_date || '',
    prioridade: data.priority || '',

    /* --- Comercial --- */
    pagamento_producao: data.payment || '',
    manutencao: data.maintenance || '',
    observacoes_comerciais: data.commercial_observations || '',

    /* --- Meta --- */
    origem: 'journeyModal',
    submetido_em: data.submitted_at || new Date().toISOString()
  };

  return postToForminit(fields, file);
}

/* ============================================================
   6. ALIASES E DEFAULT
   ============================================================ */

export const submit = submitJourney;
export default submitJourney;
