/* ============================================================
FGP TECHNOLOGIES — forminit.js
Integração com Forminit: construção do FormData com block keys
obrigatórios (fi-text-*, fi-file-*), envio via fetch e
tratamento de respostas HTTP.

IMPORTANTE:
- O Content-Type NÃO é definido manualmente. O navegador gera
  automaticamente o boundary do multipart/form-data.
- Os nomes dos campos DEVEM seguir o padrão fi-{tipo}-{nome}
  conforme a documentação oficial do Forminit.
- O honeypot _gotcha é o mecanismo antispam documentado.
- _subject é um metadado especial aceito pelo Forminit.
============================================================ */

/* ============================================================
CONFIGURAÇÃO DO FORMINIT
============================================================ */
export const FORMINIT_FORM_ID = 'l6ts8syb4td';
export const FORMINIT_ENDPOINT = `https://forminit.com/f/${FORMINIT_FORM_ID}`;

/* ============================================================
CONFIGURAÇÃO DE ANEXOS
============================================================ */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/* ============================================================
CONSTRUÇÃO DO PAYLOAD
Monta o FormData com os block keys obrigatórios do Forminit.

@param {Object} data - Dados da solicitação
@param {boolean} isJourney - true se veio da jornada guiada
@returns {FormData} - FormData pronto para envio
============================================================ */
export function buildForminitPayload(data, isJourney = false) {
    const formData = new FormData();

    // --- Block keys textuais obrigatórios ---
    formData.append('fi-text-title', data.title || 'Solicitação FGP Tech');
    formData.append('fi-text-requestType', data.requestType || 'Não especificado');
    formData.append('fi-text-category', data.category || 'Geral');
    formData.append('fi-text-subcategory', data.subcategory || 'Geral');
    formData.append('fi-text-projectType', data.projectType || 'Não especificado');
    formData.append('fi-text-initialDescription', data.initialDescription || '');
    formData.append('fi-text-projectDescription', data.projectDescription || data.description || '');
    formData.append('fi-text-productionPayment', data.productionPayment || 'Não informado');
    formData.append('fi-text-maintenancePreference', data.maintenancePreference || 'Não informado');

    // --- Campos adicionais da jornada guiada (briefing evoluído) ---
    if (isJourney && data.clientType) {
        formData.append('fi-text-clientType', data.clientType);
        if (data.clientName) formData.append('fi-text-clientName', data.clientName);
        if (data.clientEmail) formData.append('fi-text-clientEmail', data.clientEmail);
        if (data.clientPhone) formData.append('fi-text-clientPhone', data.clientPhone);
        if (data.companyName) formData.append('fi-text-companyName', data.companyName);
        if (data.companySegment) formData.append('fi-text-companySegment', data.companySegment);
        if (data.projectGoal) formData.append('fi-text-projectGoal', data.projectGoal);
        if (data.targetAudience) formData.append('fi-text-targetAudience', data.targetAudience);
        if (data.hasLogo) formData.append('fi-text-hasLogo', data.hasLogo);
        if (data.hasDomain) formData.append('fi-text-hasDomain', data.hasDomain);
        if (data.desiredDeadline) formData.append('fi-text-desiredDeadline', data.desiredDeadline);
    }

    // --- Anexo (arquivo) ---
    if (data.file instanceof File) {
        formData.append('fi-file-attachment', data.file, data.file.name);
    }

    // --- Metadados especiais do Forminit ---
    formData.append('_subject', `Nova solicitação: ${data.requestType || 'FGP Tech'} | FGP Technologies`);

    // Honeypot antispam (documentado pelo Forminit)
    formData.append('_gotcha', '');

    return formData;
}

/* ============================================================
ENVIO DA SOLICITAÇÃO
Realiza o POST para o endpoint do Forminit.

IMPORTANTE:
- Não define Content-Type manualmente.
- Retorna um objeto padronizado { success, message }.
- Nunca presume que a resposta contém JSON válido.

@param {FormData} formData - Dados montados por buildForminitPayload
@returns {Promise<{success: boolean, message: string}>}
============================================================ */
export async function submitToForminit(formData) {
    // Verificação de segurança: ID configurado corretamente
    if (!FORMINIT_FORM_ID || FORMINIT_FORM_ID === 'YOUR_FORMINIT_FORM_ID') {
        return {
            success: false,
            message: 'O serviço de envio ainda não foi configurado. Entre em contato com a FGP.'
        };
    }

    try {
        const response = await fetch(FORMINIT_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
                // Content-Type é definido automaticamente pelo navegador
            }
        });

        // --- Sucesso confirmado pelo servidor ---
        if (response.ok) {
            return {
                success: true,
                message: 'Solicitação enviada com sucesso! A FGP Technologies recebeu seu pedido e poderá entrar em contato para dar continuidade à análise.'
            };
        }

        // --- Erros HTTP específicos ---
        if (response.status === 429) {
            return {
                success: false,
                message: 'Muitas solicitações em curto período. Aguarde alguns instantes e tente novamente.'
            };
        }

        if (response.status === 413) {
            return {
                success: false,
                message: 'O arquivo anexado é muito grande. Reduza o tamanho e tente novamente.'
            };
        }

        // --- Tenta extrair mensagem de erro da resposta ---
        let errorMessage = 'Falha no envio. Tente novamente.';
        try {
            const errData = await response.json();
            if (errData && typeof errData === 'object') {
                if (errData.message) errorMessage = errData.message;
                else if (errData.error) errorMessage = errData.error;
                else if (errData.reason) errorMessage = errData.reason;
            }
        } catch (_) {
            // Resposta não é JSON válido — usa mensagem genérica
        }

        return {
            success: false,
            message: errorMessage
        };

    } catch (error) {
        // --- Falha de conexão ou erro de rede ---
        console.error('[Forminit] Erro de envio:', error);
        return {
            success: false,
            message: 'Não foi possível enviar sua solicitação. Seus dados foram preservados. Verifique sua conexão e tente novamente.'
        };
    }
}

/* ============================================================
VALIDAÇÃO DE ARQUIVO
Verifica se um arquivo atende aos critérios de tipo e tamanho.

@param {File} file - Arquivo a ser validado
@returns {{valid: boolean, error: string|null}}
============================================================ */
export function validateFile(file) {
    if (!file) {
        return { valid: true, error: null };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: 'Formato inválido. Envie apenas JPEG, PNG ou WebP.'
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `Arquivo muito grande. Máximo: 5 MB.`
        };
    }

    return { valid: true, error: null };
}
