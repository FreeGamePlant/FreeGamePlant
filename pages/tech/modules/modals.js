/* ============================================================
FGP TECHNOLOGIES — modals.js
Modal de solicitação legado + Modal de acessos.
Consuma o módulo forminit.js para o envio real.
============================================================ */

import { dom } from './state.js';
import { formatFileSize } from './utils.js';
import {
    MAX_FILE_SIZE,
    ALLOWED_TYPES,
    buildForminitPayload,
    submitToForminit
} from './forminit.js';

/* ============================================================
ESTADO LOCAL DO UPLOAD (legado)
============================================================ */
let currentFile = null;

/* ============================================================
INIT
============================================================ */
export function initModals() {
    setupAccessosModal();
    setupRequestModal();
    setupFileUpload();
}

/* ============================================================
MODAL DE ACESSOS
============================================================ */
export function openAccessosModal() {
    const modal = dom.accessosModal();
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeAccessosModal() {
    const modal = dom.accessosModal();
    if (!modal || !modal.classList.contains('open')) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

function setupAccessosModal() {
    const modal = dom.accessosModal();
    if (!modal) return;

    document.getElementById('closeAccessosBtn')?.addEventListener('click', closeAccessosModal);
    document.getElementById('accessosFooterBtn')?.addEventListener('click', openAccessosModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAccessosModal();
    });
}

/* ============================================================
MODAL DE SOLICITAÇÃO — POPULATE DE SELECTS
============================================================ */
function populateInstallmentOptions() {
    const selCount = document.getElementById('installmentCount');
    const selDay = document.getElementById('dueDay');
    if (!selCount || !selDay) return;

    const countOpts = ['<option value="">Selecione...</option>'];
    for (let i = 3; i <= 27; i++) {
        countOpts.push(`<option value="${i}">${i}x</option>`);
    }
    countOpts.push('<option value="outra">Outra quantidade — avaliar</option>');
    selCount.innerHTML = countOpts.join('');

    const dayOpts = ['<option value="">Selecione...</option>'];
    for (let i = 1; i <= 28; i++) {
        dayOpts.push(`<option value="${i}">Dia ${i}</option>`);
    }
    selDay.innerHTML = dayOpts.join('');
}

function updateInstallmentVisibility() {
    const selected = document.querySelector('input[name="productionPayment"]:checked');
    const isParcelado = selected && selected.value === 'Parcelado';
    const fields = document.getElementById('installmentFields');
    if (!fields) return;

    if (isParcelado) {
        fields.classList.add('visible');
    } else {
        fields.classList.remove('visible');
        document.getElementById('installmentCount')?.classList.remove('error');
        document.getElementById('dueDay')?.classList.remove('error');
        document.getElementById('installmentCountError')?.classList.remove('visible');
        document.getElementById('dueDayError')?.classList.remove('visible');
    }
}

/* ============================================================
MODAL DE SOLICITAÇÃO — HELPERS DE UI
============================================================ */
function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select')
        .forEach(el => el.classList.remove('error'));
}

function resetFileUpload() {
    currentFile = null;
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const preview = document.getElementById('uploadPreview');
    if (!fileInput || !uploadArea || !preview) return;

    fileInput.value = '';
    preview.classList.remove('visible');
    uploadArea.style.display = '';
    uploadArea.classList.remove('has-file');
    document.getElementById('previewImg').src = '';
    document.getElementById('previewFilename').textContent = '';
    document.getElementById('previewFilesize').textContent = '';
    document.getElementById('fileError').classList.remove('visible');
}

function handleFileSelect(file) {
    const fileError = document.getElementById('fileError');
    fileError.classList.remove('visible');

    if (!ALLOWED_TYPES.includes(file.type)) {
        fileError.innerHTML = '<i class="fas fa-circle-exclamation"></i> Formato inválido. Envie apenas JPEG, PNG ou WebP.';
        fileError.classList.add('visible');
        resetFileUpload();
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        fileError.innerHTML = `<i class="fas fa-circle-exclamation"></i> Arquivo muito grande. Máximo: 5 MB (seu arquivo: ${formatFileSize(file.size)}).`;
        fileError.classList.add('visible');
        resetFileUpload();
        return;
    }

    currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('previewImg').src = e.target.result;
    };
    reader.readAsDataURL(file);

    document.getElementById('previewFilename').textContent = file.name;
    document.getElementById('previewFilesize').textContent = formatFileSize(file.size);
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('uploadPreview').classList.add('visible');
}

function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const removeBtn = document.getElementById('removeFileBtn');
    if (!uploadArea || !fileInput || !removeBtn) return;

    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
    removeBtn.addEventListener('click', () => {
        resetFileUpload();
        fileInput.value = '';
    });

    // Drag & drop
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
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });
}

/* ============================================================
MODAL DE SOLICITAÇÃO — ABRIR / FECHAR
============================================================ */
export function openRequestModal(cat, sub) {
    const modal = dom.requestModal();
    if (!modal) return;

    const typeText = `${cat.title} > ${sub.title}`;
    document.getElementById('requestTypeDisplay').textContent = typeText;
    document.getElementById('requestType').value = typeText;
    document.getElementById('requestTitle').value = `Solicitação de desenvolvimento — ${sub.title}`;
    document.getElementById('initialDescription').value =
        `Olá! Tenho interesse no desenvolvimento de ${sub.title.toLowerCase()} (${cat.title}) e gostaria de conhecer as condições de contratação.`;
    document.getElementById('projectDescription').value = '';

    document.querySelectorAll('input[name="productionPayment"]').forEach(r => r.checked = false);
    document.querySelectorAll('input[name="maintenancePreference"]').forEach(r => r.checked = false);
    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));

    const instCount = document.getElementById('installmentCount');
    const dueDay = document.getElementById('dueDay');
    if (instCount) instCount.value = '';
    if (dueDay) dueDay.value = '';

    updateInstallmentVisibility();
    resetFileUpload();
    clearErrors();

    const feedback = document.getElementById('submitFeedback');
    feedback.classList.remove('visible', 'success', 'error');

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    setTimeout(() => document.getElementById('requestTitle').focus(), 100);
    modal._previousFocus = document.activeElement;
}

export function closeRequestModal() {
    const modal = dom.requestModal();
    if (!modal || !modal.classList.contains('open')) return;

    modal.classList.remove('open');
    document.body.style.overflow = '';

    if (modal._previousFocus && typeof modal._previousFocus.focus === 'function') {
        modal._previousFocus.focus();
    }
}

/* ============================================================
MODAL DE SOLICITAÇÃO — VALIDAÇÃO
============================================================ */
function validateForm() {
    clearErrors();
    let valid = true;

    const title = document.getElementById('requestTitle');
    const initialDesc = document.getElementById('initialDescription');
    const projectDesc = document.getElementById('projectDescription');

    if (!title.value.trim()) {
        title.classList.add('error');
        document.getElementById('titleError').classList.add('visible');
        valid = false;
    }
    if (!initialDesc.value.trim()) {
        initialDesc.classList.add('error');
        document.getElementById('initialDescError').classList.add('visible');
        valid = false;
    }
    if (!projectDesc.value.trim()) {
        projectDesc.classList.add('error');
        document.getElementById('projectDescError').classList.add('visible');
        valid = false;
    }

    const production = document.querySelector('input[name="productionPayment"]:checked');
    if (!production) {
        document.getElementById('productionPaymentError').classList.add('visible');
        valid = false;
    } else if (production.value === 'Parcelado') {
        const instCount = document.getElementById('installmentCount');
        const dueDay = document.getElementById('dueDay');
        if (!instCount.value) {
            instCount.classList.add('error');
            document.getElementById('installmentCountError').classList.add('visible');
            valid = false;
        }
        if (!dueDay.value) {
            dueDay.classList.add('error');
            document.getElementById('dueDayError').classList.add('visible');
            valid = false;
        }
    }

    const maintenance = document.querySelector('input[name="maintenancePreference"]:checked');
    if (!maintenance) {
        document.getElementById('maintenanceError').classList.add('visible');
        valid = false;
    }

    return valid;
}

/* ============================================================
MODAL DE SOLICITAÇÃO — SUBMIT (usando forminit.js)
============================================================ */
async function submitRequest(e) {
    e.preventDefault();

    if (!validateForm()) {
        const firstError = document.querySelector('.field-error.visible');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('submitFeedback');

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    feedback.classList.remove('visible', 'success', 'error');

    // Monta dados para o payload
    const prodPayment = document.querySelector('input[name="productionPayment"]:checked');
    let productionText = prodPayment ? prodPayment.value : '';
    if (prodPayment && prodPayment.value === 'Parcelado') {
        const countEl = document.getElementById('installmentCount');
        const dueEl = document.getElementById('dueDay');
        const countText = countEl.value === 'outra' ? 'Outra quantidade — avaliar' : `${countEl.value} parcelas`;
        productionText += ` — ${countText}, vencimento dia ${dueEl.value}`;
    }

    const maintPref = document.querySelector('input[name="maintenancePreference"]:checked');
    const requestType = document.getElementById('requestType').value;

    const payloadData = {
        title: document.getElementById('requestTitle').value.trim(),
        requestType: requestType,
        category: 'Solicitação Direta',
        subcategory: 'Solicitação Direta',
        projectType: 'Não especificado',
        initialDescription: document.getElementById('initialDescription').value.trim(),
        description: document.getElementById('projectDescription').value.trim(),
        productionPayment: productionText,
        maintenancePreference: maintPref ? maintPref.value : 'Não informado',
        file: currentFile
    };

    const formData = buildForminitPayload(payloadData, false);
    const result = await submitToForminit(formData);

    if (result.success) {
        feedback.className = 'submit-feedback success visible';
        feedback.innerHTML = `<i class="fas fa-circle-check"></i> ${result.message}`;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => closeRequestModal(), 5000);
    } else {
        feedback.className = 'submit-feedback error visible';
        feedback.innerHTML = `<i class="fas fa-circle-exclamation"></i> ${result.message}`;
        feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
}

/* ============================================================
MODAL DE SOLICITAÇÃO — SETUP
============================================================ */
function setupRequestModal() {
    const modal = dom.requestModal();
    const form = document.getElementById('requestForm');
    const closeBtn = document.getElementById('closeRequestBtn');
    if (!modal || !form) return;

    populateInstallmentOptions();

    closeBtn.addEventListener('click', closeRequestModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeRequestModal();
    });

    // Seleção visual de opções de pagamento
    document.querySelectorAll('.payment-options').forEach(group => {
        group.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', () => {
                group.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                const radio = option.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    if (radio.name === 'productionPayment') updateInstallmentVisibility();
                }
            });
        });
    });

    // Limpa erros ao alterar selects de parcelas
    document.getElementById('installmentCount')?.addEventListener('change', (e) => {
        if (e.target.value) {
            e.target.classList.remove('error');
            document.getElementById('installmentCountError').classList.remove('visible');
        }
    });
    document.getElementById('dueDay')?.addEventListener('change', (e) => {
        if (e.target.value) {
            e.target.classList.remove('error');
            document.getElementById('dueDayError').classList.remove('visible');
        }
    });

    form.addEventListener('submit', submitRequest);
}
