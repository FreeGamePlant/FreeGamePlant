/* ============================================================
   FGP TECHNOLOGIES — forminit.js
   Integração com o Forminit: envio de solicitações legadas
   (requestModal) e da nova jornada guiada (journeyModal, 13 etapas).

   EXPORTA:
   - submitRequest(payload)         → envio legado (compatível)
   - submitJourney(payload, file)   → novo assistente
   - default                         → alias de submitJourney

   CONTRATO:
   Ambas as funções retornam Promise<{ ok: boolean, error?: string, data?: any }>.
   Nunca lançam para o chamador — o erro é encapsulado em { ok: false }.
   ============================================================ */

/* ============================================================
   1. CONFIGURAÇÃO DO FORMINIT
   ------------------------------------------------------------
   ⚠️ Ajuste estes dois valores conforme o painel do Forminit.
   O endpoint público do Forminit costuma ser algo como:
     https://forminit.com/f/<FORM_ID>
   ou
     https://api.forminit.com/v1/forms/<FORM_ID>/submissions
   Consulte a documentação do painel para o endpoint exato.
   ============================================================ */

const FORMINIT_ENDPOINT = 'https://forminit.com/f/SEU_FORM_ID_AQUI';
const FORMINIT_FORM_ID = 'l6ts8syb4td';

/* ============================================================
   2. HELPERS
   ============================================================ */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function formatFileSize(bytes) {
  if (!bytes || bytes < 1024) return `${bytes || 0} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

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

/**
 * Normaliza qualquer valor para string segura de envio.
 * - null/undefined → ''
 * - arrays → string separada por vírgula
 * - objetos → JSON
 */
function toFieldValue(v) {
  if (v == null) return '';
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

/* ============================================================
   3. ENVIO BASE (multipart/form-data)
   ------------------------------------------------------------
   O Forminit aceita multipart/form-data com o arquivo no campo
   configurado no painel. Usamos `fetch` diretamente para ter
   controle total sobre o FormData e o tratamento de erros.
   ============================================================ */

let activeSubmissions = 0;

async function postToForminit(fields, file) {
  // Bloqueio de envios duplicados
  if (activeSubmissions > 0) {
    return { ok: false, error: 'Já existe um envio em andamento. Aguarde a conclusão.' };
  }
  activeSubmissions++;

  try {
    const formData = new FormData();

    // Campos de texto
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, toFieldValue(value));
    });

    // Metadados úteis
    formData.append('_form_id', FORMINIT_FORM_ID);
    formData.append('_submitted_at', new Date().toISOString());
    formData.append('_source', 'fgp-tech');

    // Arquivo (opcional)
    if (file) {
      const check = validateFile(file);
      if (!check.ok) {
        return { ok: false, error: check.error };
      }
      // O nome "attachment" deve corresponder ao bloco do painel Forminit.
      formData.append('attachment', file, file.name);
    }

    const response = await fetch(FORMINIT_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
      // NÃO definir Content-Type: o browser define o boundary do multipart.
    });

    // Forminit pode responder 200, 201, 202 ou 204 em sucesso.
    if (!response.ok) {
      let errMsg = `Falha no envio (HTTP ${response.status}).`;
      try {
        const data = await response.json();
        if (data && (data.error || data.message)) errMsg = data.error || data.message;
      } catch (_) {
        // Resposta sem JSON — mantém a mensagem padrão.
      }
      return { ok: false, error: errMsg };
    }

    // Sucesso — tenta ler resposta (pode ser vazia).
    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      data = null;
    }

    // Alguns endpoints retornam 200 com { success: false }.
    if (data && data.success === false) {
      return {
        ok: false,
        error: data.error || data.message || 'O Forminit recusou o envio.'
      };
    }

    return { ok: true, data };

  } catch (err) {
    // Erro de rede / CORS / timeout.
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
   Mantém compatibilidade com o fluxo antigo. O payload esperado
   é o mesmo do formulário #requestModal:
     {
       title, initialDescription, requestType, projectDescription,
       productionPayment, installmentCount, dueDay,
       maintenancePreference
     }
   O arquivo, se houver, vem como 4º argumento ou dentro de
   `payload.attachment`.
   ============================================================ */

export async function submitRequest(payload, file = null) {
  const data = payload || {};

  // Validação mínima do lado do cliente
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
   Recebe o payload produzido por assistant.js#buildForminitPayload
   e o arquivo opcional. Achata os grupos em campos
   compreensíveis para o painel Forminit.
   ============================================================ */

export async function submitJourney(payload, file = null) {
  const data = payload || {};

  // Validações essenciais (defesa em profundidade — o assistant.js já valida)
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
     Os nomes à esquerda (chaves) devem corresponder aos blocos
     configurados no painel. Se o painel usar nomes diferentes,
     ajuste APENAS este objeto — o resto do código continua igual.
     ------------------------------------------------------------ */
  const fields = {
    /* --- Solicitante --- */
    tipo_solicitante: data.client_type,
    nome_solicitante: data.client_name || data.contact_name || '',
    nome_empresa: data.company_name || '',
    responsavel: data.contact_name || '',
    email: data.client_email,
    telefone: data.client_phone || '',
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

    /* --- Requisitos (JSON) --- */
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
   6. ALIAS DEFAULT
   ------------------------------------------------------------
   Permite `import forminit from './forminit.js'` e chamar
   `forminit(payload, file)` diretamente — compatível com o
   fallback do assistant.js que procura `submitJourney`,
   `submitRequest`, `submit` ou `default`.
   ============================================================ */

export const submit = submitJourney;

export default submitJourney;
