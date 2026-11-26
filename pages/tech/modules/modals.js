/* ============================================================
MODAIS (Legado e Acessos)
============================================================ */
import { dom } from './state.js';
import { escapeHtml, formatFileSize } from './utils.js';
import { FORMINIT_ENDPOINT, MAX_FILE_SIZE, ALLOWED_TYPES, buildForminitPayload, submitToForminit } from './forminit.js';
import { openJourney } from './assistant.js';

let currentFile = null;

export function initModals() {
    setupAccessosModal();
    setupRequestModal();
    setupFileUpload();
}

function setupAccessosModal() {
    const modal = dom.accessosModal();
    if (!modal) return;
    document.getElementById('closeAccessosBtn')?.addEventListener('click', () => closeModal(modal));
    document.getElementById('accessosFooterBtn')?.addEventListener('click', () => openModal(modal));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
}

function openModal(modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

export function openRequestModal(cat, sub) {
    const modal = dom.requestModal();
    if (!modal) return;
    const typeText = `${cat.title} > ${sub.title}`;
    document.getElementById('requestTypeDisplay').textContent = typeText;
    document.getElementById('requestType').value = typeText;
    document.getElementById('requestTitle').value = `Solicitação: ${sub.title}`;
    openModal(modal);
}

function setupRequestModal() {
    const modal = dom.requestModal();
    const form = document.getElementById('requestForm');
    if (!modal || !form) return;

    document.getElementById('closeRequestBtn')?.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });

    // Opções de pagamento (visual)
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

    form.addEventListener('submit', submitLegacyRequest);
}

function updateInstallmentVisibility() {
    const selected = document.querySelector('input[name="productionPayment"]:checked');
    const fields = document.getElementById('installmentFields');
    if (fields) {
        fields.classList.toggle('visible', selected?.value === 'Parcelado');
    }
}

function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const removeBtn = document.getElementById('removeFileBtn');
    if (!uploadArea || !fileInput) return;

    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files?.length) handleFileSelect(e.target.files[0]);
    });
    removeBtn?.addEventListener('click', () => {
        currentFile = null;
        fileInput.value = '';
        document.getElementById('uploadPreview').classList.remove('visible');
        uploadArea.style.display = '';
    });
}

function handleFileSelect(file) {
    const fileError = document.getElementById('fileError');
    fileError.classList.remove('visible');
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
        fileError.innerHTML = '<i class="fas fa-circle-exclamation"></i> Formato inválido ou arquivo > 5MB.';
        fileError.classList.add('visible');
        return;
    }
    currentFile = file;
    const reader = new FileReader();
    reader.onload = (e) => { document.getElementById('previewImg').src = e.target.result; };
    reader.readAsDataURL(file);
    document.getElementById('previewFilename').textContent = file.name;
    document.getElementById('previewFilesize').textContent = formatFileSize(file.size);
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('uploadPreview').classList.add('visible');
}

async function submitLegacyRequest(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('submitFeedback');

    // Validação simples
    if (!form.requestTitle.value.trim() || !form.projectDescription.value.trim()) {
        alert('Preencha os campos obrigatórios.');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    feedback.classList.remove('visible', 'success', 'error');

    const prodPayment = document.querySelector('input[name="productionPayment"]:checked');
    const maintPref = document.querySelector('input[name="maintenancePreference"]:checked');

    const payloadData = {
        title: form.requestTitle.value,
        requestType: form.requestType.value,
        category: 'Solicitação Direta',
        subcategory: 'Solicitação Direta',
        projectType: 'Não especificado',
        initialDescription: form.initialDescription.value,
        description: form.projectDescription.value,
        productionPayment: prodPayment ? prodPayment.value : 'Não informado',
        maintenancePreference: maintPref ? maintPref.value : 'Não informado',
        file: currentFile
    };

    const formData = buildForminitPayload(payloadData, false);
    const result = await submitToForminit(formData);

    if (result.success) {
        feedback.className = 'submit-feedback success visible';
        feedback.innerHTML = `<i class="fas fa-circle-check"></i> ${result.message}`;
        setTimeout(() => {
            closeModal(dom.requestModal());
            form.reset();
            currentFile = null;
            document.getElementById('uploadPreview').classList.remove('visible');
            document.getElementById('uploadArea').style.display = '';
        }, 4000);
    } else {
        feedback.className = 'submit-feedback error visible';
        feedback.innerHTML = `<i class="fas fa-circle-exclamation"></i> ${result.message}`;
    }

    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
}
