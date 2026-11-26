/* ============================================================
FGP ASSISTANT — JORNADA GUIADA EVOLUÍDA
============================================================ */
import { JourneyState, dom } from './state.js';
import { escapeHtml, formatFileSize } from './utils.js';
import { CATEGORIES_DB } from './catalog.js'; // Certifique-se de exportar CATEGORIES_DB do catalog.js ou mova para state.js
import { FORMINIT_ENDPOINT, MAX_FILE_SIZE, ALLOWED_TYPES, buildForminitPayload, submitToForminit } from './forminit.js';

export function initAssistant() {
    document.getElementById('heroStartBtn')?.addEventListener('click', openJourney);
    document.getElementById('sideMenuStartBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        // Lógica para fechar menu lateral deve vir do módulo de navegação
        openJourney();
    });
    setupJourneyNavigation();
    setupJourneyUpload();
}

export function openJourney() {
    resetJourneyState();
    openJourneyModal();
    renderJourneyStep();
}

export function openJourneyFromCatalog(catId, subId) {
    resetJourneyState();
    JourneyState.category = catId;
    JourneyState.subcategory = subId;
    const cat = CATEGORIES_DB.find(c => c.id === catId);
    const sub = cat?.subcategories.find(s => s.id === subId);
    if (cat && sub) {
        JourneyState.title = `Solicitação: ${sub.title}`;
        JourneyState.description = `Interesse em ${sub.title.toLowerCase()} (${cat.title}).`;
    }
    JourneyState.step = 2; // Pula seleção de categoria se veio do catálogo
    openJourneyModal();
    renderJourneyStep();
}

function openJourneyModal() {
    const modal = dom.journeyModal();
    if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

export function closeJourneyWithConfirm() {
    const modal = dom.journeyModal();
    if (!modal || !modal.classList.contains('open')) return;
    
    const hasData = JourneyState.category || JourneyState.title || JourneyState.clientName;
    if (hasData && !window.confirm('Você tem informações preenchidas. Deseja realmente sair?')) {
        return;
    }
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resetJourneyState();
}

function resetJourneyState() {
    Object.assign(JourneyState, {
        step: 1, category: null, subcategory: null, projectType: null,
        clientType: 'PF', clientName: '', clientEmail: '', clientPhone: '',
        companyName: '', companySegment: '', projectName: '', projectGoal: '',
        targetAudience: '', hasLogo: 'nao', hasDomain: 'nao', desiredDeadline: '',
        title: '', description: '', payment: null, maintenance: null, file: null
    });
    resetJourneyFile();
}

function resetJourneyFile() {
    const fileInput = document.getElementById('journeyFileInput');
    const uploadArea = document.getElementById('journeyUploadArea');
    const preview = document.getElementById('journeyUploadPreview');
    if (fileInput) fileInput.value = '';
    if (preview) preview.classList.remove('visible');
    if (uploadArea) uploadArea.style.display = '';
    const err = document.getElementById('journeyFileError');
    if (err) err.classList.remove('visible');
}

function getActiveJourneySteps() {
    const steps = [1]; // 1: Categoria (ou pulado se veio do catálogo)
    if (!JourneyState.category) steps.push(1); 
    steps.push(2, 3, 4, 5, 6, 7, 8, 9); 
    // 2: Identificação, 3: Info Projeto, 4: Específico, 5: Identidade Visual, 6: Prazos, 7: Pagamento, 8: Manutenção, 9: Revisão
    return [...new Set(steps)]; // Remove duplicatas
}

function renderJourneyStep() {
    document.querySelectorAll('.journey-step').forEach(el => el.style.display = 'none');
    const current = document.querySelector(`.journey-step[data-step="${JourneyState.step}"]`);
    if (current) current.style.display = '';

    // Atualiza assistente e progresso
    const assistant = document.getElementById('journeyAssistantText');
    if (assistant) assistant.textContent = getAssistantMessage(JourneyState.step);
    updateJourneyProgress();

    // Botões
    const activeSteps = getActiveJourneySteps();
    const idx = activeSteps.indexOf(JourneyState.step);
    const backBtn = document.getElementById('journeyBackBtn');
    const nextBtn = document.getElementById('journeyNextBtn');
    
    if (backBtn) backBtn.style.display = idx > 0 ? '' : 'none';
    if (nextBtn) {
        nextBtn.innerHTML = JourneyState.step === 9 ? '<i class="fas fa-paper-plane"></i> Enviar pedido' : 'Continuar <i class="fas fa-arrow-right"></i>';
    }

    // Renderiza conteúdo específico da etapa
    if (JourneyState.step === 1) renderJourneyCategories();
    else if (JourneyState.step === 2) renderJourneyIdentification();
    else if (JourneyState.step === 3) renderJourneyProjectInfo();
    else if (JourneyState.step === 4) renderJourneySpecifics();
    else if (JourneyState.step === 5) renderJourneyVisualIdentity();
    else if (JourneyState.step === 6) renderJourneyDeadlines();
    else if (JourneyState.step === 7) renderJourneyPayment();
    else if (JourneyState.step === 8) renderJourneyMaintenance();
    else if (JourneyState.step === 9) renderJourneyReview();
}

function getAssistantMessage(step) {
    const msgs = {
        1: 'Vamos começar! Escolha a categoria do serviço que você procura.',
        2: 'Perfeito. Agora, preciso saber quem está solicitando o serviço para personalizarmos o atendimento.',
        3: 'Conte-me um pouco sobre o projeto. Qual é o nome e o objetivo principal?',
        4: 'Ótimo. Agora, detalhes específicos sobre este tipo de serviço.',
        5: 'Sobre a identidade visual: você já possui alguns materiais ou precisamos criar do zero?',
        6: 'Vamos falar de prazos e infraestrutura. Você já possui domínio ou hospedagem?',
        7: 'Como prefere realizar o pagamento pelo desenvolvimento inicial?',
        8: 'Deseja contratar um plano de manutenção e suporte após a entrega?',
        9: 'Tudo pronto! Confira o resumo do seu briefing antes de enviar.'
    };
    return msgs[step] || 'Estamos avançando!';
}

function updateJourneyProgress() {
    const fill = document.getElementById('journeyProgressFill');
    const text = document.getElementById('journeyProgressText');
    if (!fill || !text) return;
    const activeSteps = getActiveJourneySteps();
    const idx = activeSteps.indexOf(JourneyState.step);
    const percent = Math.min(100, ((idx + 1) / activeSteps.length) * 100);
    fill.style.width = percent + '%';
    text.textContent = `Etapa ${idx + 1} de ${activeSteps.length}`;
}

// --- RENDERIZADORES DE ETAPA (Resumidos para brevidade, mas funcionais) ---
function renderJourneyCategories() {
    const grid = document.getElementById('journeyCategoriesGrid');
    if (!grid) return;
    grid.innerHTML = CATEGORIES_DB.map(cat => `
        <button class="journey-card ${JourneyState.category === cat.id ? 'selected' : ''}" data-category="${cat.id}" type="button">
            <div class="journey-card-icon"><i class="fas ${cat.icon}"></i></div>
            <div class="journey-card-title">${escapeHtml(cat.title)}</div>
            <div class="journey-card-desc">${escapeHtml(cat.description)}</div>
        </button>
    `).join('');
    grid.querySelectorAll('[data-category]').forEach(btn => {
        btn.addEventListener('click', () => {
            JourneyState.category = btn.dataset.category;
            JourneyState.subcategory = null;
            renderJourneyCategories();
        });
    });
}

function renderJourneyIdentification() {
    // Preenche campos do DOM com o estado atual
    const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
    setVal('journeyClientType', JourneyState.clientType);
    setVal('journeyClientName', JourneyState.clientName);
    setVal('journeyClientEmail', JourneyState.clientEmail);
    setVal('journeyClientPhone', JourneyState.clientPhone);
    setVal('journeyCompanyName', JourneyState.companyName);
    setVal('journeyCompanySegment', JourneyState.companySegment);

    // Toggle PF/PJ
    const pfFields = document.getElementById('pfFields');
    const pjFields = document.getElementById('pjFields');
    if(pfFields) pfFields.style.display = JourneyState.clientType === 'PF' ? 'block' : 'none';
    if(pjFields) pjFields.style.display = JourneyState.clientType === 'PJ' ? 'block' : 'none';

    document.getElementById('journeyClientType')?.addEventListener('change', (e) => {
        JourneyState.clientType = e.target.value;
        renderJourneyIdentification();
    });
    
    ['journeyClientName', 'journeyClientEmail', 'journeyClientPhone', 'journeyCompanyName', 'journeyCompanySegment'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', (e) => {
            const key = id.replace('journey', '').replace(/^./, str => str.toLowerCase());
            JourneyState[key] = e.target.value;
        });
    });
}

function renderJourneyProjectInfo() {
    const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
    setVal('journeyProjectName', JourneyState.projectName);
    setVal('journeyProjectGoal', JourneyState.projectGoal);
    setVal('journeyTargetAudience', JourneyState.targetAudience);

    ['journeyProjectName', 'journeyProjectGoal', 'journeyTargetAudience'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', (e) => {
            const key = id.replace('journey', '').replace(/^./, str => str.toLowerCase());
            JourneyState[key] = e.target.value;
        });
    });
}

function renderJourneySpecifics() {
    // Renderiza subcategorias se ainda não escolhido, ou perguntas específicas
    const grid = document.getElementById('journeyServicesGrid');
    if (!grid) return;
    const cat = CATEGORIES_DB.find(c => c.id === JourneyState.category);
    if (!cat) return;

    if (!JourneyState.subcategory) {
        grid.innerHTML = cat.subcategories.map(sub => `
            <button class="journey-card ${JourneyState.subcategory === sub.id ? 'selected' : ''}" data-subcategory="${sub.id}" type="button">
                <div class="journey-card-icon"><i class="fas ${sub.icon}"></i></div>
                <div class="journey-card-title">${escapeHtml(sub.title)}</div>
                <div class="journey-card-desc">${escapeHtml(sub.description)}</div>
            </button>
        `).join('');
        grid.querySelectorAll('[data-subcategory]').forEach(btn => {
            btn.addEventListener('click', () => {
                JourneyState.subcategory = btn.dataset.subcategory;
                renderJourneySpecifics();
            });
        });
    } else {
        grid.innerHTML = `<p class="journey-hint"><i class="fas fa-check-circle"></i> Serviço selecionado: <strong>${cat.subcategories.find(s=>s.id===JourneyState.subcategory).title}</strong>. <button type="button" class="btn-back" style="margin-left:10px; padding:4px 8px; font-size:0.75rem;" onclick="JourneyState.subcategory=null; renderJourneyStep();">Alterar</button></p>`;
    }
}

function renderJourneyVisualIdentity() {
    const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
    setVal('journeyHasLogo', JourneyState.hasLogo);
    setVal('journeyHasDomain', JourneyState.hasDomain);
    
    document.getElementById('journeyHasLogo')?.addEventListener('change', e => JourneyState.hasLogo = e.target.value);
    document.getElementById('journeyHasDomain')?.addEventListener('change', e => JourneyState.hasDomain = e.target.value);
}

function renderJourneyDeadlines() {
    const el = document.getElementById('journeyDesiredDeadline');
    if(el) {
        el.value = JourneyState.desiredDeadline;
        el.addEventListener('input', e => JourneyState.desiredDeadline = e.target.value);
    }
}

function renderJourneyPayment() {
    const grid = document.getElementById('journeyPaymentGrid');
    if (!grid) return;
    grid.querySelectorAll('[data-payment]').forEach(card => {
        card.classList.toggle('selected', card.dataset.payment === JourneyState.payment);
        card.onclick = () => { JourneyState.payment = card.dataset.payment; renderJourneyPayment(); };
    });
}

function renderJourneyMaintenance() {
    const grid = document.getElementById('journeyMaintenanceGrid');
    if (!grid) return;
    grid.querySelectorAll('[data-maintenance]').forEach(card => {
        card.classList.toggle('selected', card.dataset.maintenance === JourneyState.maintenance);
        card.onclick = () => { JourneyState.maintenance = card.dataset.maintenance; renderJourneyMaintenance(); };
    });
}

function renderJourneyReview() {
    const summary = document.getElementById('journeyReviewSummary');
    if (!summary) return;
    const cat = CATEGORIES_DB.find(c => c.id === JourneyState.category);
    const sub = cat?.subcategories.find(s => s.id === JourneyState.subcategory);

    const items = [
        { label: 'Solicitante', value: JourneyState.clientType === 'PF' ? JourneyState.clientName : `${JourneyState.companyName} (Resp: ${JourneyState.clientName})` },
        { label: 'Contato', value: `${JourneyState.clientEmail} | ${JourneyState.clientPhone}` },
        { label: 'Serviço', value: `${cat?.title} > ${sub?.title}` },
        { label: 'Projeto', value: JourneyState.projectName },
        { label: 'Objetivo', value: JourneyState.projectGoal },
        { label: 'Prazo Desejado', value: JourneyState.desiredDeadline || 'Flexível' },
        { label: 'Pagamento', value: JourneyState.payment || 'Não informado' },
        { label: 'Manutenção', value: JourneyState.maintenance || 'Não informado' },
        { label: 'Anexo', value: JourneyState.file ? JourneyState.file.name : 'Nenhum' }
    ];

    summary.innerHTML = items.map(item => `
        <div class="journey-review-item">
            <div class="journey-review-label">${escapeHtml(item.label)}</div>
            <div class="journey-review-value">${escapeHtml(item.value) || '<em>Não informado</em>'}</div>
        </div>
    `).join('');
}

// --- NAVEGAÇÃO E VALIDAÇÃO ---
function setupJourneyNavigation() {
    document.getElementById('journeyNextBtn')?.addEventListener('click', handleJourneyNext);
    document.getElementById('journeyBackBtn')?.addEventListener('click', handleJourneyBack);
    document.getElementById('closeJourneyBtn')?.addEventListener('click', closeJourneyWithConfirm);
    dom.journeyModal()?.addEventListener('click', (e) => {
        if (e.target === dom.journeyModal()) closeJourneyWithConfirm();
    });
}

function handleJourneyNext() {
    // Validações básicas por etapa
    if (JourneyState.step === 1 && !JourneyState.category) return showJourneyAlert('Escolha uma categoria.');
    if (JourneyState.step === 2 && !JourneyState.clientName) return showJourneyAlert('Informe seu nome.');
    if (JourneyState.step === 3 && !JourneyState.projectGoal) return showJourneyAlert('Descreva o objetivo do projeto.');
    if (JourneyState.step === 4 && !JourneyState.subcategory) return showJourneyAlert('Selecione o tipo de serviço.');
    if (JourneyState.step === 7 && !JourneyState.payment) return showJourneyAlert('Escolha uma forma de pagamento.');
    if (JourneyState.step === 8 && !JourneyState.maintenance) return showJourneyAlert('Escolha uma preferência de manutenção.');

    if (JourneyState.step === 9) {
        submitJourney();
        return;
    }

    const activeSteps = getActiveJourneySteps();
    const idx = activeSteps.indexOf(JourneyState.step);
    if (idx < activeSteps.length - 1) {
        JourneyState.step = activeSteps[idx + 1];
        renderJourneyStep();
    }
}

function handleJourneyBack() {
    const activeSteps = getActiveJourneySteps();
    const idx = activeSteps.indexOf(JourneyState.step);
    if (idx > 0) {
        JourneyState.step = activeSteps[idx - 1];
        renderJourneyStep();
    }
}

function showJourneyAlert(msg) {
    const bubble = document.getElementById('journeyAssistantText');
    if (!bubble) return;
    const original = bubble.textContent;
    bubble.textContent = '⚠ ' + msg;
    bubble.classList.add('journey-assistant-bubble-alert');
    setTimeout(() => {
        bubble.textContent = original;
        bubble.classList.remove('journey-assistant-bubble-alert');
    }, 3000);
}

// --- UPLOAD ---
function setupJourneyUpload() {
    const uploadArea = document.getElementById('journeyUploadArea');
    const fileInput = document.getElementById('journeyFileInput');
    const removeBtn = document.getElementById('journeyRemoveFileBtn');
    if (!uploadArea || !fileInput) return;

    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files?.length) handleJourneyFileSelect(e.target.files[0]);
    });
    removeBtn?.addEventListener('click', () => {
        JourneyState.file = null;
        resetJourneyFile();
    });
}

function handleJourneyFileSelect(file) {
    const errorEl = document.getElementById('journeyFileError');
    errorEl.classList.remove('visible');
    
    if (!ALLOWED_TYPES.includes(file.type)) {
        errorEl.innerHTML = '<i class="fas fa-circle-exclamation"></i> Formato inválido. Use JPEG, PNG ou WebP.';
        errorEl.classList.add('visible');
        return;
    }
    if (file.size > MAX_FILE_SIZE) {
        errorEl.innerHTML = `<i class="fas fa-circle-exclamation"></i> Arquivo muito grande. Máx: 5 MB.`;
        errorEl.classList.add('visible');
        return;
    }

    JourneyState.file = file;
    const reader = new FileReader();
    reader.onload = (e) => { document.getElementById('journeyPreviewImg').src = e.target.result; };
    reader.readAsDataURL(file);
    
    document.getElementById('journeyPreviewFilename').textContent = file.name;
    document.getElementById('journeyPreviewFilesize').textContent = formatFileSize(file.size);
    document.getElementById('journeyUploadArea').style.display = 'none';
    document.getElementById('journeyUploadPreview').classList.add('visible');
}

// --- SUBMISSÃO ---
async function submitJourney() {
    const nextBtn = document.getElementById('journeyNextBtn');
    const feedback = document.getElementById('journeySubmitFeedback');
    
    nextBtn.disabled = true;
    const originalHtml = nextBtn.innerHTML;
    nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    feedback.classList.remove('visible', 'success', 'error');

    const cat = CATEGORIES_DB.find(c => c.id === JourneyState.category);
    const sub = cat?.subcategories.find(s => s.id === JourneyState.subcategory);

    const payloadData = {
        title: JourneyState.projectName || JourneyState.title || 'Solicitação FGP',
        requestType: `${cat?.title} > ${sub?.title}`,
        category: cat?.title,
        subcategory: sub?.title,
        projectType: JourneyState.projectType || 'Não especificado',
        initialDescription: `Objetivo: ${JourneyState.projectGoal}. Público: ${JourneyState.targetAudience}.`,
        description: JourneyState.description,
        productionPayment: JourneyState.payment,
        maintenancePreference: JourneyState.maintenance,
        file: JourneyState.file,
        // Campos novos do briefing
        clientType: JourneyState.clientType,
        clientName: JourneyState.clientName,
        clientEmail: JourneyState.clientEmail,
        clientPhone: JourneyState.clientPhone,
        companyName: JourneyState.companyName,
        companySegment: JourneyState.companySegment,
        projectGoal: JourneyState.projectGoal,
        targetAudience: JourneyState.targetAudience,
        hasLogo: JourneyState.hasLogo,
        hasDomain: JourneyState.hasDomain,
        desiredDeadline: JourneyState.desiredDeadline
    };

    const formData = buildForminitPayload(payloadData, true);
    const result = await submitToForminit(formData);

    if (result.success) {
        feedback.className = 'journey-submit-feedback success visible';
        feedback.innerHTML = `<i class="fas fa-circle-check"></i> ${result.message}`;
        setTimeout(() => {
            closeJourneyWithConfirm();
        }, 4000);
    } else {
        feedback.className = 'journey-submit-feedback error visible';
        feedback.innerHTML = `<i class="fas fa-circle-exclamation"></i> ${result.message}`;
        nextBtn.disabled = false;
        nextBtn.innerHTML = originalHtml;
    }
}
