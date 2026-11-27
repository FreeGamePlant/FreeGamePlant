/* ============================================================
FGP TECHNOLOGIES — assistant.js
Jornada guiada (FGP Assistant): 7 etapas de atendimento
progressivo, navegação, upload de arquivos, revisão final
e envio via Forminit.
============================================================ */

// CORREÇÃO CRÍTICA: CATEGORIES_DB deve vir de './state.js', NUNCA de './catalog.js'
import {
    CATEGORIES_DB,
    JourneyState,
    ASSISTANT_MESSAGES,
    JOURNEY_TOTAL_BASE_STEPS,
    dom
} from './state.js';

import { escapeHtml, formatFileSize } from './utils.js';
import {
    MAX_FILE_SIZE,
    ALLOWED_TYPES,
    buildForminitPayload,
    submitToForminit
} from './forminit.js';
import { closeSideMenu } from './navigation.js';

/* ============================================================
INIT
============================================================ */
export function initAssistant() {
    setupJourney();
}

/* ============================================================
HELPERS — ACESSO AO CATÁLOGO
============================================================ */
function getJourneyCategory() {
    return JourneyState.category
        ? CATEGORIES_DB.find(c => c.id === JourneyState.category)
        : null;
}

function getJourneySubcategory() {
    const cat = getJourneyCategory();
    if (!cat || !JourneyState.subcategory) return null;
    return cat.subcategories.find(s => s.id === JourneyState.subcategory) || null;
}

function parseProjectTypeName(raw) {
    if (!raw) return '';
    const parts = raw.split(/\s+—\s+/);
    return parts[0] || raw;
}

function parseProjectTypeDesc(raw) {
    if (!raw) return '';
    const parts = raw.split(/\s+—\s+/);
    return parts[1] || '';
}

/* ============================================================
ETAPAS ATIVAS
============================================================ */
function getActiveJourneySteps() {
    const steps = [1, 2];
    const sub = getJourneySubcategory();
    if (!JourneyState.subcategory) {
        steps.push(3);
    } else if (sub && sub.projectTypes && sub.projectTypes.length > 0) {
        steps.push(3);
    }
    steps.push(4, 5, 6, 7);
    return steps;
}

/* ============================================================
RESET
============================================================ */
function resetJourneyState() {
    JourneyState.step = 1;
    JourneyState.category = null;
    JourneyState.subcategory = null;
    JourneyState.projectType = null;
    JourneyState.title = '';
    JourneyState.description = '';
    JourneyState.payment = null;
    JourneyState.maintenance = null;
    JourneyState.file = null;
    resetJourneyFile();
}

function resetJourneyFile() {
    const fileInput = document.getElementById('journeyFileInput');
    const uploadArea = document.getElementById('journeyUploadArea');
    const preview = document.getElementById('journeyUploadPreview');
    if (!fileInput || !uploadArea || !preview) return;

    fileInput.value = '';
    preview.classList.remove('visible');
    uploadArea.style.display = '';
    document.getElementById('journeyPreviewImg').src = '';
    document.getElementById('journeyPreviewFilename').textContent = '';
    document.getElementById('journeyPreviewFilesize').textContent = '';
    document.getElementById('journeyFileError').classList.remove('visible');
}

/* ============================================================
ABRIR / FECHAR JORNADA
============================================================ */
function openJourney() {
    resetJourneyState();
    JourneyState.step = 1;
    openJourneyModal();
    renderJourneyStep();
}

export function openJourneyFromCatalog(catId, subId) {
    resetJourneyState();
    JourneyState.category = catId;
    JourneyState.subcategory = subId;

    const cat = getJourneyCategory();
    const sub = getJourneySubcategory();
    if (cat && sub) {
        JourneyState.title = `Solicitação de desenvolvimento — ${sub.title}`;
        JourneyState.description =
            `Olá! Tenho interesse no desenvolvimento de ${sub.title.toLowerCase()} (${cat.title}) e gostaria de conhecer as condições de contratação.`;
    }

    if (sub && sub.projectTypes && sub.projectTypes.length > 0) {
        JourneyState.step = 3;
    } else {
        JourneyState.step = 4;
    }

    openJourneyModal();
    renderJourneyStep();
}

function openJourneyModal() {
    const modal = dom.journeyModal();
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeJourneyWithConfirm() {
    const modal = dom.journeyModal();
    if (!modal || !modal.classList.contains('open')) return;

    const hasData = JourneyState.category || JourneyState.subcategory ||
        JourneyState.title || JourneyState.description ||
        JourneyState.payment || JourneyState.maintenance || JourneyState.file;

    if (hasData) {
        if (!window.confirm('Você tem informações preenchidas. Deseja realmente sair da jornada?')) {
            return;
        }
    }

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resetJourneyState();
}

/* ============================================================
NAVEGAÇÃO ENTRE ETAPAS
============================================================ */
function handleJourneyNext() {
    const step = JourneyState.step;

    if (step === 1) {
        if (!JourneyState.category) {
            showJourneyAlert('Escolha uma categoria para continuar.');
            return;
        }
    } else if (step === 2) {
        if (!JourneyState.subcategory) {
            showJourneyAlert('Escolha um serviço para continuar.');
            return;
        }
    } else if (step === 3) {
        if (!JourneyState.projectType) {
            showJourneyAlert('Escolha o tipo de projeto para continuar.');
            return;
        }
    } else if (step === 4) {
        const titleEl = document.getElementById('journeyTitleField');
        const descEl = document.getElementById('journeyDescField');
        const title = (titleEl?.value || '').trim();
        const desc = (descEl?.value || '').trim();

        if (!title) {
            document.getElementById('journeyTitleError').classList.add('visible');
            titleEl?.classList.add('error');
            titleEl?.focus();
            return;
        }
        if (!desc) {
            document.getElementById('journeyDescError').classList.add('visible');
            descEl?.classList.add('error');
            descEl?.focus();
            return;
        }
        JourneyState.title = title;
        JourneyState.description = desc;
    } else if (step === 5) {
        if (!JourneyState.payment) {
            showJourneyAlert('Escolha uma forma de pagamento para continuar.');
            return;
        }
    } else if (step === 6) {
        if (!JourneyState.maintenance) {
            showJourneyAlert('Escolha uma preferência de manutenção para continuar.');
            return;
        }
    } else if (step === 7) {
        submitJourney();
        return;
    }

    const activeSteps = getActiveJourneySteps();
    const idx = activeSteps.indexOf(step);
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

/* ============================================================
FEEDBACK VISUAL
============================================================ */
let journeyAlertTimer = null;

function showJourneyAlert(msg) {
    const bubble = document.getElementById('journeyAssistantText');
    if (!bubble) return;

    const originalText = ASSISTANT_MESSAGES[JourneyState.step] || bubble.textContent;

    if (journeyAlertTimer) clearTimeout(journeyAlertTimer);

    bubble.textContent = '⚠ ' + msg;
    bubble.classList.add('journey-assistant-bubble-alert');

    journeyAlertTimer = setTimeout(() => {
        bubble.textContent = originalText;
        bubble.classList.remove('journey-assistant-bubble-alert');
    }, 2800);
}

/* ============================================================
RENDER GERAL DA ETAPA ATUAL
============================================================ */
function renderJourneyStep() {
    document.querySelectorAll('.journey-step').forEach(el => el.style.display = 'none');

    const current = document.querySelector(`.journey-step[data-step="${JourneyState.step}"]`);
    if (current) current.style.display = '';

    const assistant = document.getElementById('journeyAssistantText');
    if (assistant) {
        assistant.textContent = ASSISTANT_MESSAGES[JourneyState.step] || '';
        assistant.classList.remove('journey-assistant-bubble-alert');
    }

    updateJourneyProgress();

    const backBtn = document.getElementById('journeyBackBtn');
    const nextBtn = document.getElementById('journeyNextBtn');
    const activeSteps = getActiveJourneySteps();
    const idx = activeSteps.indexOf(JourneyState.step);

    if (backBtn) backBtn.style.display = idx > 0 ? '' : 'none';
    if (nextBtn) {
        if (JourneyState.step === 7) {
            nextBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar pedido';
        } else {
            nextBtn.innerHTML = 'Continuar <i class="fas fa-arrow-right"></i>';
        }
    }

    if (JourneyState.step === 1) renderJourneyCategories();
    else if (JourneyState.step === 2) renderJourneyServices();
    else if (JourneyState.step === 3) renderJourneyTypes();
    else if (JourneyState.step === 4) renderJourneyForm();
    else if (JourneyState.step === 5) renderJourneyPayment();
    else if (JourneyState.step === 6) renderJourneyMaintenance();
    else if (JourneyState.step === 7) renderJourneyReview();
}

/* ============================================================
PROGRESSO
============================================================ */
function updateJourneyProgress() {
    const fill = document.getElementById('journeyProgressFill');
    const text = document.getElementById('journeyProgressText');
    if (!fill || !text) return;

    const activeSteps = getActiveJourneySteps();
    const idx = activeSteps.indexOf(JourneyState.step);
    const total = activeSteps.length;
    const current = idx >= 0 ? idx + 1 : 1;
    const percent = Math.min(100, (current / total) * 100);

    fill.style.width = percent + '%';
    text.textContent = `Etapa ${current} de ${total}`;
}

/* ============================================================
ETAPA 1 — Categorias
============================================================ */
function renderJourneyCategories() {
    const grid = document.getElementById('journeyCategoriesGrid');
    if (!grid) return;

    grid.innerHTML = CATEGORIES_DB.map(cat => `
        <button class="journey-card ${JourneyState.category === cat.id ? 'selected' : ''}"
                data-category="${cat.id}" type="button">
            <div class="journey-card-icon">
                <i class="fas ${cat.icon}"></i>
            </div>
            <div class="journey-card-title">${escapeHtml(cat.title)}</div>
            <div class="journey-card-desc">${escapeHtml(cat.description)}</div>
            <div class="journey-card-meta">
                <i class="fas fa-layer-group"></i>
                ${cat.subcategories.length} ${cat.subcategories.length === 1 ? 'serviço' : 'serviços'}
            </div>
        </button>
    `).join('');

    grid.querySelectorAll('[data-category]').forEach(btn => {
        btn.addEventListener('click', () => {
            const newCat = btn.dataset.category;
            if (newCat !== JourneyState.category) {
                JourneyState.category = newCat;
                JourneyState.subcategory = null;
                JourneyState.projectType = null;
            }
            renderJourneyCategories();
        });
    });
}

/* ============================================================
ETAPA 2 — Serviços
============================================================ */
function renderJourneyServices() {
    const grid = document.getElementById('journeyServicesGrid');
    if (!grid) return;

    const cat = getJourneyCategory();
    if (!cat) {
        grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">Selecione uma categoria primeiro.</p>';
        return;
    }

    grid.innerHTML = cat.subcategories.map(sub => `
        <button class="journey-card ${JourneyState.subcategory === sub.id ? 'selected' : ''}"
                data-subcategory="${sub.id}" type="button">
            <div class="journey-card-icon">
                <i class="fas ${sub.icon}"></i>
            </div>
            <div class="journey-card-title">${escapeHtml(sub.title)}</div>
            <div class="journey-card-desc">${escapeHtml(sub.description)}</div>
            ${sub.priceRange ? `<div class="journey-card-price">${escapeHtml(sub.priceRange)}</div>` : ''}
        </button>
    `).join('');

    grid.querySelectorAll('[data-subcategory]').forEach(btn => {
        btn.addEventListener('click', () => {
            const newSub = btn.dataset.subcategory;
            if (newSub !== JourneyState.subcategory) {
                JourneyState.subcategory = newSub;
                JourneyState.projectType = null;
            }
            renderJourneyServices();
        });
    });
}

/* ============================================================
ETAPA 3 — Tipos de projeto
============================================================ */
function renderJourneyTypes() {
    const grid = document.getElementById('journeyTypesGrid');
    if (!grid) return;

    const sub = getJourneySubcategory();
    if (!sub || !sub.projectTypes || sub.projectTypes.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">Este serviço não possui subdivisões. Continue para a próxima etapa.</p>';
        return;
    }

    grid.innerHTML = sub.projectTypes.map((raw, idx) => {
        const name = parseProjectTypeName(raw);
        const desc = parseProjectTypeDesc(raw);
        return `
            <button class="journey-card ${JourneyState.projectType === raw ? 'selected' : ''}"
                    data-type-index="${idx}" type="button">
                <div class="journey-card-title">${escapeHtml(name)}</div>
                ${desc ? `<div class="journey-card-desc">${escapeHtml(desc)}</div>` : ''}
            </button>
        `;
    }).join('');

    grid.querySelectorAll('[data-type-index]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.typeIndex, 10);
            const s = getJourneySubcategory();
            if (s && s.projectTypes[idx] !== undefined) {
                JourneyState.projectType = s.projectTypes[idx];
                renderJourneyTypes();
            }
        });
    });
}

/* ============================================================
ETAPA 4 — Formulário
============================================================ */
function renderJourneyForm() {
    const titleEl = document.getElementById('journeyTitleField');
    const descEl = document.getElementById('journeyDescField');
    if (!titleEl || !descEl) return;

    titleEl.value = JourneyState.title || '';
    descEl.value = JourneyState.description || '';

    document.getElementById('journeyTitleError').classList.remove('visible');
    document.getElementById('journeyDescError').classList.remove('visible');
    titleEl.classList.remove('error');
    descEl.classList.remove('error');
}

/* ============================================================
ETAPA 5 — Pagamento
============================================================ */
function renderJourneyPayment() {
    const grid = document.getElementById('journeyPaymentGrid');
    if (!grid) return;
    grid.querySelectorAll('[data-payment]').forEach(card => {
        card.classList.toggle('selected', card.dataset.payment === JourneyState.payment);
    });
}

/* ============================================================
ETAPA 6 — Manutenção
============================================================ */
function renderJourneyMaintenance() {
    const grid = document.getElementById('journeyMaintenanceGrid');
    if (!grid) return;
    grid.querySelectorAll('[data-maintenance]').forEach(card => {
        card.classList.toggle('selected', card.dataset.maintenance === JourneyState.maintenance);
    });
}

/* ============================================================
ETAPA 7 — Revisão
============================================================ */
function renderJourneyReview() {
    const summary = document.getElementById('journeyReviewSummary');
    if (!summary) return;

    const cat = getJourneyCategory();
    const sub = getJourneySubcategory();
    const typeName = JourneyState.projectType ? parseProjectTypeName(JourneyState.projectType) : '';

    const items = [];
    items.push({ label: 'Categoria', value: cat ? cat.title : '—' });
    items.push({ label: 'Serviço', value: sub ? sub.title : '—' });
    if (typeName) items.push({ label: 'Tipo de projeto', value: typeName });
    items.push({ label: 'Título do pedido', value: JourneyState.title || '—' });
    items.push({ label: 'Descrição inicial', value: JourneyState.description || '—' });
    items.push({ label: 'Pagamento da produção', value: JourneyState.payment || '—' });
    items.push({ label: 'Preferência de manutenção', value: JourneyState.maintenance || '—' });

    summary.innerHTML = items.map(item => `
        <div class="journey-review-item">
            <div class="journey-review-label">${escapeHtml(item.label)}</div>
            <div class="journey-review-value">${escapeHtml(item.value)}</div>
        </div>
    `).join('');

    const preview = document.getElementById('journeyUploadPreview');
    const uploadArea = document.getElementById('journeyUploadArea');
    if (JourneyState.file) {
        if (preview) preview.classList.add('visible');
        if (uploadArea) uploadArea.style.display = 'none';
    } else {
        if (preview) preview.classList.remove('visible');
        if (uploadArea) uploadArea.style.display = '';
    }

    const feedback = document.getElementById('journeySubmitFeedback');
    if (feedback) feedback.classList.remove('visible', 'success', 'error');
}

/* ============================================================
UPLOAD DE IMAGEM
============================================================ */
function handleJourneyFileSelect(file) {
    const errorEl = document.getElementById('journeyFileError');
    errorEl.classList.remove('visible');

    if (!ALLOWED_TYPES.includes(file.type)) {
        errorEl.innerHTML = '<i class="fas fa-circle-exclamation"></i> Formato inválido. Envie apenas JPEG, PNG ou WebP.';
        errorEl.classList.add('visible');
        JourneyState.file = null;
        resetJourneyFile();
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        errorEl.innerHTML = `<i class="fas fa-circle-exclamation"></i> Arquivo muito grande. Máximo: 5 MB (${formatFileSize(file.size)}).`;
        errorEl.classList.add('visible');
        JourneyState.file = null;
        resetJourneyFile();
        return;
    }

    JourneyState.file = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('journeyPreviewImg').src = e.target.result;
    };
    reader.readAsDataURL(file);

    document.getElementById('journeyPreviewFilename').textContent = file.name;
    document.getElementById('journeyPreviewFilesize').textContent = formatFileSize(file.size);
    document.getElementById('journeyUploadArea').style.display = 'none';
    document.getElementById('journeyUploadPreview').classList.add('visible');
}

function setupJourneyUpload() {
    const uploadArea = document.getElementById('journeyUploadArea');
    const fileInput = document.getElementById('journeyFileInput');
    const removeBtn = document.getElementById('journeyRemoveFileBtn');
    if (!uploadArea || !fileInput || !removeBtn) return;

    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleJourneyFileSelect(e.target.files[0]);
        }
    });
    removeBtn.addEventListener('click', () => {
        JourneyState.file = null;
        resetJourneyFile();
        fileInput.value = '';
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleJourneyFileSelect(e.dataTransfer.files[0]);
        }
    });
}

/* ============================================================
SUBMIT DA JORNADA
============================================================ */
async function submitJourney() {
    const submitFeedback = document.getElementById('journeySubmitFeedback');
    const nextBtn = document.getElementById('journeyNextBtn');

    if (!JourneyState.category || !JourneyState.subcategory) {
        showJourneyAlert('Escolha categoria e serviço antes de enviar.');
        return;
    }
    if (!JourneyState.title || !JourneyState.description) {
        showJourneyAlert('Preencha título e descrição antes de enviar.');
        return;
    }
    if (!JourneyState.payment) {
        showJourneyAlert('Escolha uma forma de pagamento.');
        return;
    }
    if (!JourneyState.maintenance) {
        showJourneyAlert('Escolha uma preferência de manutenção.');
        return;
    }

    const cat = getJourneyCategory();
    const sub = getJourneySubcategory();
    const typeName = JourneyState.projectType ? parseProjectTypeName(JourneyState.projectType) : '';
    const fullType = typeName
        ? `${cat.title} > ${sub.title} > ${typeName}`
        : `${cat.title} > ${sub.title}`;

    const payloadData = {
        title: JourneyState.title,
        requestType: fullType,
        category: cat.title,
        subcategory: sub.title,
        projectType: JourneyState.projectType || 'Não especificado',
        description: JourneyState.description,
        productionPayment: JourneyState.payment,
        maintenancePreference: JourneyState.maintenance,
        file: JourneyState.file
    };

    const formData = buildForminitPayload(payloadData, true);

    nextBtn.disabled = true;
    const originalBtnHtml = nextBtn.innerHTML;
    nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitFeedback.classList.remove('visible', 'success', 'error');

    const result = await submitToForminit(formData);

    if (result.success) {
        submitFeedback.className = 'journey-submit-feedback success visible';
        submitFeedback.innerHTML = `<i class="fas fa-circle-check"></i> ${result.message}`;
        submitFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            const modal = dom.journeyModal();
            if (modal) {
                modal.classList.remove('open');
                modal.setAttribute('aria-hidden', 'true');
            }
            document.body.style.overflow = '';
            resetJourneyState();
        }, 3500);
    } else {
        submitFeedback.className = 'journey-submit-feedback error visible';
        submitFeedback.innerHTML = `<i class="fas fa-circle-exclamation"></i> ${result.message}`;
        submitFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    nextBtn.disabled = false;
    nextBtn.innerHTML = originalBtnHtml;
}

/* ============================================================
SETUP DA JORNADA
============================================================ */
function setupJourney() {
    document.getElementById('heroStartBtn')?.addEventListener('click', openJourney);
    document.getElementById('sideMenuStartBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        closeSideMenu();
        openJourney();
    });

    document.getElementById('journeyNextBtn')?.addEventListener('click', handleJourneyNext);
    document.getElementById('journeyBackBtn')?.addEventListener('click', handleJourneyBack);
    document.getElementById('closeJourneyBtn')?.addEventListener('click', closeJourneyWithConfirm);

    const journeyModal = dom.journeyModal();
    if (journeyModal) {
        journeyModal.addEventListener('click', (e) => {
            if (e.target === journeyModal) closeJourneyWithConfirm();
        });
    }

    const titleEl = document.getElementById('journeyTitleField');
    const descEl = document.getElementById('journeyDescField');
    titleEl?.addEventListener('input', (e) => {
        JourneyState.title = e.target.value;
        if (e.target.value.trim()) {
            document.getElementById('journeyTitleError').classList.remove('visible');
            e.target.classList.remove('error');
        }
    });
    descEl?.addEventListener('input', (e) => {
        JourneyState.description = e.target.value;
        if (e.target.value.trim()) {
            document.getElementById('journeyDescError').classList.remove('visible');
            e.target.classList.remove('error');
        }
    });

    document.querySelectorAll('#journeyPaymentGrid [data-payment]').forEach(card => {
        card.addEventListener('click', () => {
            JourneyState.payment = card.dataset.payment;
            renderJourneyPayment();
        });
    });

    document.querySelectorAll('#journeyMaintenanceGrid [data-maintenance]').forEach(card => {
        card.addEventListener('click', () => {
            JourneyState.maintenance = card.dataset.maintenance;
            renderJourneyMaintenance();
        });
    });

    setupJourneyUpload();
}
