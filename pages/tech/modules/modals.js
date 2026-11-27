/* ============================================================
   FGP TECHNOLOGIES — modals.js
   Gerencia os modais legados (#accessosModal e #requestModal).
   O #journeyModal é controlado pelo assistant.js.

   A11y: usa hideSafely/showSafely (utils.js) para mover o foco
   antes de aplicar aria-hidden + inert, eliminando o warning
   "Blocked aria-hidden on an element because its descendant
   retained focus".

   EXPORTA:
   - initModals()
   - openAccessosModal() / closeAccessosModal()
   - openRequestModal(opts) / closeRequestModal()
   ============================================================ */

import { dom } from './state.js';
import { submitRequest } from './forminit.js';
import {
  hideSafely,
  showSafely,
  validateFile,
  formatFileSize,
  isValidEmail
} from './utils.js';

/* ============================================================
   1. HELPERS LOCAIS
   ============================================================ */

function $id(id) {
  return document.getElementById(id);
}

function isOpen(el) {
  return !!el && el.classList.contains('open');
}

function hasAnyOpenOverlay() {
  return Boolean(document.querySelector(
    '.side-menu.open, .color-panel.open, .modal-overlay.open, .journey-modal-overlay.open'
  ));
}

function releaseBodyLockIfClear() {
  if (!hasAnyOpenOverlay()) {
    document.body.classList.remove('menu-open', 'modal-open');
  }
}

/**
 * Abre qualquer modal-overlay de forma segura.
 * - Adiciona .open
 * - Remove inert e ajusta aria-hidden (via showSafely)
 * - Trava o scroll do body
 * - Registra o trigger para devolver o foco ao fechar
 */
function openOverlaySafe(overlay, trigger) {
  if (!overlay) return;

  overlay.classList.add('open');
  document.body.classList.add('modal-open');

  showSafely(overlay, { focusFirst: true });

  overlay._focusReturn = trigger || null;
}

/**
 * Fecha qualquer modal-overlay de forma segura.
 * - Remove .open
 * - Devolve o foco ao trigger e aplica inert/aria-hidden (via hideSafely)
 * - Libera o scroll apenas se nenhum outro overlay estiver aberto
 */
function closeOverlaySafe(overlay, fallbackTriggerId) {
  if (!overlay) return;

  const focusFallback =
    overlay._focusReturn ||
    (fallbackTriggerId ? $id(fallbackTriggerId) : null);

  overlay.classList.remove('open');
  hideSafely(overlay, { focusFallback });

  releaseBodyLockIfClear();
  overlay._focusReturn = null;
}

/* ============================================================
   2. ACCESSOS MODAL
   ============================================================ */

export function openAccessosModal(trigger) {
  const modal = dom.accessosModal();
  if (!modal) return;
  openOverlaySafe(modal, trigger || $id('accessosSideBtn') || $id('accessosFooterBtn'));
}

export function closeAccessosModal() {
  const modal = dom.accessosModal();
  if (!modal) return;
  closeOverlaySafe(modal, 'accessosSideBtn');
}

function bindAccessosModal() {
  const modal = dom.accessosModal();
  if (!modal) return;

  $id('accessosSideBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openAccessosModal(e.currentTarget);
  });
  $id('accessosFooterBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openAccessosModal(e.currentTarget);
  });

  $id('closeAccessosBtn')?.addEventListener('click', closeAccessosModal);

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

  const trigger =
    opts.trigger ||
    (typeof opts.triggerId === 'string' ? $id(opts.triggerId) : null) ||
    document.activeElement;

  // Pré-preenchimento opcional (usado pelo catálogo)
  const titleEl = $id('requestTitle');
  const initialDescEl = $id('initialDescription');
  const typeDisplayEl = $id('requestTypeDisplay');
  const typeHiddenEl = $id('requestType');

  if (titleEl && opts.title) titleEl.value = opts.title;
  if (initialDescEl && opts.description) initialDescEl.value = opts.description;
  if (typeDisplayEl) typeDisplayEl.textContent = opts.type || '—';
  if (typeHiddenEl) typeHiddenEl.value = opts.type || '';

  openOverlaySafe(modal, trigger);

  // Foco no primeiro campo após a transição
  setTimeout(() => titleEl?.focus(), 100);
}

export function closeRequestModal() {
  const modal = dom.requestModal();
  if (!modal) return;
  closeOverlaySafe(modal, 'submitBtn');
}

/* ============================================================
   4. FORM DO REQUEST MODAL
   ============================================================ */

function populateInstallmentOptions() {
  const countSel = $id('installmentCount');
  const daySel = $id('dueDay');

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
  const fields = $id('installmentFields');
  if (!fields) return;
  fields.classList.toggle('visible', visible);
  fields.classList.toggle('hidden', !visible);
  fields.style.display = visible ? '' : 'none';
}

function bindPaymentOptions() {
  document.querySelectorAll('input[name="productionPayment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      setInstallmentVisibility(radio.checked && radio.value === 'Parcelado');

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
  const area = $id('uploadArea');
  const input = $id('fileInput');
  const preview = $id('uploadPreview');
  const previewImg = $id('previewImg');
  const nameEl = $id('previewFilename');
  const sizeEl = $id('previewFilesize');
  const removeBtn = $id('removeFileBtn');

  if (!area || !input) return;

  area.addEventListener('click', () => input.click());

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (!file) return;

    const check = validateFile(file);
    if (!check.ok) {
      alert(check.error);
      input.value = '';
      currentFile = null;
      preview?.classList.remove('visible');
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
   6. VALIDAÇÃO E SUBMISSÃO
   ============================================================ */

function showFeedback(message, type = 'error') {
  const fb = $id('submitFeedback');
  if (!fb) return;
  fb.textContent = message;
  fb.className = `submit-feedback visible ${type}`;
}

function clearFeedback() {
  const fb = $id('submitFeedback');
  if (!fb) return;
  fb.textContent = '';
  fb.className = 'submit-feedback';
}

function collectRequestForm() {
  return {
    title: ($id('requestTitle')?.value || '').trim(),
    initialDescription: ($id('initialDescription')?.value || '').trim(),
    requestType: $id('requestType')?.value || '',
    projectDescription: ($id('projectDescription')?.value || '').trim(),
    productionPayment: document.querySelector('input[name="productionPayment"]:checked')?.value || '',
    installmentCount: $id('installmentCount')?.value || '',
    dueDay: $id('dueDay')?.value || '',
    maintenancePreference: document.querySelector('input[name="maintenancePreference"]:checked')?.value || ''
  };
}

function validateRequestForm(data) {
  if (!data.title) {
    showFeedback('Por favor, informe o título do pedido.');
    $id('requestTitle')?.focus();
    return false;
  }
  if (!data.initialDescription) {
    showFeedback('Por favor, preencha a descrição inicial.');
    $id('initialDescription')?.focus();
    return false;
  }
  if (!data.projectDescription) {
    showFeedback('Por favor, descreva o projeto.');
    $id('projectDescription')?.focus();
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
  e?.preventDefault?.();
  if (submitting) return;

  clearFeedback();
  const data = collectRequestForm();
  if (!validateRequestForm(data)) return;

  const btn = $id('submitBtn');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('loading');
  }
  submitting = true;

  try {
    const result = await submitRequest(data, currentFile);

    if (!result || result.ok === false) {
      showFeedback(
        (result && result.error) || 'Não foi possível enviar. Tente novamente.',
        'error'
      );
      return;
    }

    showFeedback('Pedido enviado com sucesso! Entraremos em contato em breve.', 'success');

    setTimeout(() => {
      resetRequestForm();
      closeRequestModal();
    }, 1800);
  } catch (err) {
    console.error('[FGP][modals] Erro no envio do requestModal:', err);
    showFeedback('Erro inesperado ao enviar. Tente novamente.', 'error');
  } finally {
    submitting = false;
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('loading');
    }
  }
}

function resetRequestForm() {
  $('requestForm')?.reset?.();
  currentFile = null;

  const preview = $id('uploadPreview');
  preview?.classList.remove('visible');
  const previewImg = $id('previewImg');
  if (previewImg) previewImg.src = '';

  const typeDisplay = $id('requestTypeDisplay');
  if (typeDisplay) typeDisplay.textContent = '—';
  const typeHidden = $id('requestType');
  if (typeHidden) typeHidden.value = '';

  document
    .querySelectorAll('#productionPaymentOptions .payment-option, #maintenanceOptions .payment-option')
    .forEach(lbl => lbl.classList.remove('selected'));

  setInstallmentVisibility(false);
  clearFeedback();
}

function bindRequestModal() {
  const modal = dom.requestModal();
  const form = $id('requestForm');
  if (!modal) return;

  populateInstallmentOptions();
  setInstallmentVisibility(false);
  bindPaymentOptions();
  setupUpload();

  form?.addEventListener('submit', handleRequestSubmit);
  $id('submitBtn')?.addEventListener('click', (e) => {
    // Se o botão não for type="submit" (caso o HTML mude),
    // garantimos o disparo aqui.
    if (form && !$('submitBtn')?.getAttribute('type')) {
      e.preventDefault();
      handleRequestSubmit(e);
    }
  });

  $id('closeRequestBtn')?.addEventListener('click', closeRequestModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeRequestModal();
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

  // Garante estado inicial de a11y (modais vêm inert+aria-hidden do HTML)
  const accessos = dom.accessosModal();
  const request = dom.requestModal();
  if (accessos && !accessos.classList.contains('open')) hideSafely(accessos);
  if (request && !request.classList.contains('open')) hideSafely(request);

  initialized = true;
}
