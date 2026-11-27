/* ============================================================
   FGP TECHNOLOGIES — modals.js
   Gerencia os modais legados (#accessosModal e #requestModal).
   O #journeyModal é controlado pelo assistant.js e não é
   manipulador aqui, exceto por delegação genérica de ESC.

   EXPORTA:
   - initModals()
   - openAccessosModal() / closeAccessosModal()
   - openRequestModal(opts) / closeRequestModal()
   ============================================================ */

import { dom } from './state.js';
import { submitRequest } from './forminit.js';

/* ============================================================
   1. HELPERS
   ============================================================ */

function $(id) { return document.getElementById(id); }

function openOverlay(el) {
  if (!el) return;
  el.classList.add('open');
  el.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeOverlay(el) {
  if (!el) return;
  el.classList.remove('open');
  el.setAttribute('aria-hidden', 'true');
  // Só remove o lock se nenhum outro overlay estiver aberto
  if (!document.querySelector('.modal-overlay.open, .journey-modal-overlay.open')) {
    document.body.classList.remove('modal-open');
  }
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatFileSize(bytes) {
  if (!bytes || bytes < 1024) return `${bytes || 0} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

/* ============================================================
   2. ACCESSOS MODAL
   ============================================================ */

export function openAccessosModal() {
  openOverlay(dom.accessosModal());
}

export function closeAccessosModal() {
  closeOverlay(dom.accessosModal());
}

function bindAccessosModal() {
  const modal = dom.accessosModal();
  if (!modal) return;

  // Botões que abrem (side menu + footer)
  $('accessosSideBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openAccessosModal();
  });
  $('accessosFooterBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openAccessosModal();
  });

  // Fechar
  $('closeAccessosBtn')?.addEventListener('click', closeAccessosModal);

  // Clique no backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAccessosModal();
  });
}

/* ============================================================
   3. REQUEST MODAL (LEGADO)
   ============================================================ */

let currentFile = null;

export function openRequestModal(opts = {}) {
  const modal = dom.requestModal();
  if (!modal) return;

  // Preenchimento opcional vindo do catálogo ou de um CTA externo
  const titleEl = $('requestTitle');
  const initialDescEl = $('initialDescription');
  const typeDisplayEl = $('requestTypeDisplay');
  const typeHiddenEl = $('requestType');

  if (titleEl && opts.title) titleEl.value = opts.title;
  if (initialDescEl && opts.description) initialDescEl.value = opts.description;
  if (typeDisplayEl) typeDisplayEl.textContent = opts.type || '—';
  if (typeHiddenEl) typeHiddenEl.value = opts.type || '';

  openOverlay(modal);

  // Foco no primeiro campo após abrir
  setTimeout(() => titleEl?.focus(), 80);
}

export function closeRequestModal() {
  closeOverlay(dom.requestModal());
}

/* ============================================================
   4. FORM DO REQUEST MODAL
   ============================================================ */

function populateInstallmentOptions() {
  const countSel = $('installmentCount');
  const daySel = $('dueDay');

  if (countSel && countSel.options.length === 0) {
    for (let i = 2; i <= 12; i++) {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = `${i}x`;
      countSel.appendChild(opt);
    }
  }

  if (daySel && daySel.options.length === 0) {
    for (let i = 1; i <= 28; i++) {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = `Dia ${i}`;
      daySel.appendChild(opt);
    }
  }
}

function setInstallmentVisibility(visible) {
  const fields = $('installmentFields');
  if (!fields) return;
  fields.classList.toggle('hidden', !visible);
  fields.style.display = visible ? '' : 'none';
}

function bindPaymentOptions() {
  document.querySelectorAll('input[name="productionPayment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      setInstallmentVisibility(radio.value === 'Parcelado' && radio.checked);
      // Atualiza visual da label
      document.querySelectorAll('#productionPaymentOptions .payment-option').forEach(lbl => {
        const input = lbl.querySelector('input[type="radio"]');
        lbl.classList.toggle('selected', !!input?.checked);
      });
    });
  });

  document.querySelectorAll('input[name="maintenancePreference"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('#maintenanceOptions .payment-option').forEach(lbl => {
        const input = lbl.querySelector('input[type="radio"]');
        lbl.classList.toggle('selected', !!input?.checked);
      });
    });
  });
}

/* ============================================================
   5. UPLOAD (requestModal)
   ============================================================ */

function setupUpload() {
  const area = $('uploadArea');
  const input = $('fileInput');
  const preview = $('uploadPreview');
  const previewImg = $('previewImg');
  const nameEl = $('previewFilename');
  const sizeEl = $('previewFilesize');
  const removeBtn = $('removeFileBtn');

  if (!area || !input) return;

  area.addEventListener('click', () => input.click());

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert(`Arquivo muito grande (${formatFileSize(file.size)}). Máximo: 5 MB.`);
      input.value = '';
      return;
    }
    if (!ACCEPTED_MIME.includes(file.type)) {
      alert('Formato inválido. Envie JPEG, PNG ou WebP.');
      input.value = '';
      return;
    }

    currentFile = file;

    if (preview && previewImg && nameEl && sizeEl) {
      const reader = new FileReader();
      reader.onload = e => {
        previewImg.src = e.target.result;
        nameEl.textContent = file.name;
        sizeEl.textContent = formatFileSize(file.size);
        preview.classList.add('visible');
      };
      reader.readAsDataURL(file);
    }
  });

  removeBtn?.addEventListener('click', () => {
    currentFile = null;
    input.value = '';
    if (previewImg) previewImg.src = '';
    preview?.classList.remove('visible');
  });
}

/* ============================================================
   6. VALIDAÇÃO E SUBMISSÃO DO REQUEST MODAL
   ============================================================ */

function showFeedback(message, type = 'error') {
  const fb = $('submitFeedback');
  if (!fb) return;
  fb.textContent = message;
  fb.className = `submit-feedback visible ${type}`;
}

function clearFeedback() {
  const fb = $('submitFeedback');
  if (!fb) return;
  fb.textContent = '';
  fb.className = 'submit-feedback';
}

function collectRequestForm() {
  const title = $('requestTitle')?.value.trim() || '';
  const initialDescription = $('initialDescription')?.value.trim() || '';
  const requestType = $('requestType')?.value || '';
  const projectDescription = $('projectDescription')?.value.trim() || '';

  const payment = document.querySelector('input[name="productionPayment"]:checked')?.value || '';
  const installments = $('installmentCount')?.value || '';
  const dueDay = $('dueDay')?.value || '';
  const maintenance = document.querySelector('input[name="maintenancePreference"]:checked')?.value || '';

  return {
    title,
    initialDescription,
    requestType,
    projectDescription,
    productionPayment: payment,
    installmentCount: payment === 'Parcelado' ? installments : '',
    dueDay: payment === 'Parcelado' ? dueDay : '',
    maintenancePreference: maintenance
  };
}

function validateRequestForm(data) {
  if (!data.title) {
    showFeedback('Por favor, informe o título do pedido.');
    $('requestTitle')?.focus();
    return false;
  }
  if (!data.initialDescription) {
    showFeedback('Por favor, preencha a descrição inicial.');
    $('initialDescription')?.focus();
    return false;
  }
  if (!data.projectDescription) {
    showFeedback('Por favor, descreva o projeto.');
    $('projectDescription')?.focus();
    return false;
  }
  if (data.productionPayment === 'Parcelado') {
    if (!data.installmentCount) {
      showFeedback('Selecione a quantidade de parcelas.');
      return false;
    }
    if (!data.dueDay) {
      showFeedback('Selecione o dia de vencimento.');
      return false;
    }
  }
  return true;
}

let submitting = false;

async function handleRequestSubmit(e) {
  e.preventDefault();
  if (submitting) return;

  clearFeedback();
  const data = collectRequestForm();
  if (!validateRequestForm(data)) return;

  const btn = $('submitBtn');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('loading');
  }
  submitting = true;

  try {
    const result = await submitRequest(data, currentFile);

    if (!result.ok) {
      showFeedback(result.error || 'Não foi possível enviar. Tente novamente.');
      return;
    }

    showFeedback('Pedido enviado com sucesso! Entraremos em contato em breve.', 'success');

    // Reset após 1.8s e fecha
    setTimeout(() => {
      resetRequestForm();
      closeRequestModal();
    }, 1800);

  } catch (err) {
    console.error('[FGP][modals] Erro no envio do requestModal:', err);
    showFeedback('Erro inesperado ao enviar. Tente novamente.');
  } finally {
    submitting = false;
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('loading');
    }
  }
}

function resetRequestForm() {
  $('requestForm')?.reset();
  currentFile = null;

  const preview = $('uploadPreview');
  preview?.classList.remove('visible');
  const previewImg = $('previewImg');
  if (previewImg) previewImg.src = '';

  const typeDisplay = $('requestTypeDisplay');
  if (typeDisplay) typeDisplay.textContent = '—';
  const typeHidden = $('requestType');
  if (typeHidden) typeHidden.value = '';

  document.querySelectorAll('#productionPaymentOptions .payment-option, #maintenanceOptions .payment-option')
    .forEach(lbl => lbl.classList.remove('selected'));

  setInstallmentVisibility(false);
  clearFeedback();
}

function bindRequestModal() {
  const modal = dom.requestModal();
  const form = $('requestForm');
  if (!modal) return;

  // Preencher selects (idempotente)
  populateInstallmentOptions();
  setInstallmentVisibility(false);

  // Bind payment + maintenance
  bindPaymentOptions();

  // Upload
  setupUpload();

  // Submit
  form?.addEventListener('submit', handleRequestSubmit);
  $('submitBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    handleRequestSubmit(e);
  });

  // Fechar
  $('closeRequestBtn')?.addEventListener('click', closeRequestModal);

  // Backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeRequestModal();
  });

  // ESC
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modal.classList.contains('open')) closeRequestModal();
  });
}

/* ============================================================
   7. INIT
   ============================================================ */

let initialized = false;

export function initModals() {
  if (initialized) return;

  bindAccessosModal();
  bindRequestModal();

  initialized = true;
}
