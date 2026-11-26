/* ============================================================
INTEGRAÇÃO COM FORMINIT
============================================================ */
export const FORMINIT_FORM_ID = 'l6ts8syb4td';
export const FORMINIT_ENDPOINT = `https://forminit.com/f/${FORMINIT_FORM_ID}`;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function submitToForminit(formData) {
    try {
        const response = await fetch(FORMINIT_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
            // NOTA: Não defina 'Content-Type': 'multipart/form-data' manualmente.
            // O navegador define isso automaticamente com o boundary correto.
        });

        if (response.ok) {
            return { success: true, message: 'Solicitação enviada com sucesso! A FGP Technologies recebeu seu pedido e entrará em contato.' };
        } else {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Falha no envio. Tente novamente.');
        }
    } catch (error) {
        console.error('Forminit Error:', error);
        return { success: false, message: `Não foi possível enviar sua solicitação. Seus dados foram preservados. Verifique sua conexão e tente novamente. (${error.message})` };
    }
}

export function buildForminitPayload(data, isJourney = false) {
    const formData = new FormData();
    
    // Mapeamento obrigatório de block keys do Forminit
    formData.append('fi-text-title', data.title || 'Solicitação FGP Tech');
    formData.append('fi-text-requestType', data.requestType || 'Não especificado');
    formData.append('fi-text-category', data.category || 'Geral');
    formData.append('fi-text-subcategory', data.subcategory || 'Geral');
    formData.append('fi-text-projectType', data.projectType || 'Não especificado');
    formData.append('fi-text-initialDescription', data.initialDescription || data.description || '');
    formData.append('fi-text-projectDescription', data.description || '');
    formData.append('fi-text-productionPayment', data.productionPayment || 'Não informado');
    formData.append('fi-text-maintenancePreference', data.maintenancePreference || 'Não informado');
    
    // Novos campos de briefing (Evolução do Assistant)
    if (isJourney) {
        formData.append('fi-text-clientType', data.clientType || 'PF');
        formData.append('fi-text-clientName', data.clientName || '');
        formData.append('fi-text-clientEmail', data.clientEmail || '');
        formData.append('fi-text-clientPhone', data.clientPhone || '');
        formData.append('fi-text-companyName', data.companyName || '');
        formData.append('fi-text-companySegment', data.companySegment || '');
        formData.append('fi-text-projectGoal', data.projectGoal || '');
        formData.append('fi-text-targetAudience', data.targetAudience || '');
        formData.append('fi-text-hasLogo', data.hasLogo || 'nao');
        formData.append('fi-text-hasDomain', data.hasDomain || 'nao');
        formData.append('fi-text-desiredDeadline', data.desiredDeadline || 'Flexível');
    }

    // Anexo
    if (data.file) {
        formData.append('fi-file-attachment', data.file, data.file.name);
    }

    // Metadados do Forminit
    formData.append('_subject', `Nova solicitação: ${data.requestType || 'FGP Tech'}`);
    formData.append('_gotcha', ''); // Honeypot antispam

    return formData;
}
