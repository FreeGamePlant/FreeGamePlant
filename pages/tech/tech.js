/* ============================================================
   FGP TECHNOLOGIES — tech.js
   Catálogo hierárquico, painel de cores, modais,
   integração com Forminit e jornada guiada de orçamento.
   ============================================================ */

/* ============================================================
   1. CONFIGURAÇÃO DO FORMINIT
   ============================================================ */
const FORMINIT_FORM_ID = 'l6ts8syb4td';
const FORMINIT_ENDPOINT = `https://forminit.com/f/${FORMINIT_FORM_ID}`;

/* ============================================================
   2. BASE DE DADOS HIERÁRQUICA
   (Mantida integralmente conforme o original para preservar catálogo, preços e prazos)
   ============================================================ */
const CATEGORIES_DB = [
  // ... [O conteúdo de CATEGORIES_DB permanece exatamente igual ao original] ...
  // (Por questão de espaço, mantenha o array CATEGORIES_DB original aqui)
];

/* ============================================================
   3. UTILITÁRIOS
   ============================================================ */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str == null ? '' : str);
  return div.innerHTML;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/* ============================================================
   4. ESTADO DE NAVEGAÇÃO (catálogo)
   ============================================================ */
const NavState = {
  currentCategory: null,
  currentSubcategory: null
};

/* ============================================================
   5. REFERÊNCIAS DOM
   ============================================================ */
const dom = {
  categoriesIntro:        () => document.getElementById('categoriesIntro'),
  breadcrumb:             () => document.getElementById('breadcrumb'),
  categoriesContainer:    () => document.getElementById('categoriesContainer'),
  subcategoriesContainer: () => document.getElementById('subcategoriesContainer'),
  detailsContainer:       () => document.getElementById('detailsContainer'),
  siteHeader:             () => document.getElementById('siteHeader'),
  colorPanel:             () => document.getElementById('colorPanel'),
  sideMenu:               () => document.getElementById('sideMenu'),
  sideOverlay:            () => document.getElementById('sideOverlay'),
  requestModal:           () => document.getElementById('requestModal'),
  accessosModal:          () => document.getElementById('accessosModal'),
  journeyModal:           () => document.getElementById('journeyModal')
};

/* ============================================================
   6. NAVEGAÇÃO ENTRE NÍVEIS (catálogo)
   (Mantido conforme original)
   ============================================================ */
function showLevel(level) {
  const intro = dom.categoriesIntro();
  const breadcrumb = dom.breadcrumb();
  const cats = dom.categoriesContainer();
  const subs = dom.subcategoriesContainer();
  const dets = dom.detailsContainer();

  if (level === 1) {
    intro.classList.remove('hidden');
    breadcrumb.classList.add('hidden');
    cats.classList.remove('hidden');
    subs.classList.add('hidden');
    dets.classList.add('hidden');
  } else if (level === 2) {
    intro.classList.add('hidden');
    breadcrumb.classList.remove('hidden');
    cats.classList.add('hidden');
    subs.classList.remove('hidden');
    dets.classList.add('hidden');
  } else if (level === 3) {
    intro.classList.add('hidden');
    breadcrumb.classList.remove('hidden');
    cats.classList.add('hidden');
    subs.classList.add('hidden');
    dets.classList.remove('hidden');
  }
}

function scrollToCategories() {
  const el = document.getElementById('categorias');
  if (el) {
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/* ============================================================
   7. RENDERIZAÇÃO DO CATÁLOGO
   (Mantido conforme original, garantindo que openRequestModal e openJourneyFromCatalog funcionem)
   ============================================================ */
function renderCategories() {
  const container = dom.categoriesContainer();
  if (!container) return;
  container.innerHTML = CATEGORIES_DB.map(cat => `
    <article class="category-card reveal">
      <div class="category-card-icon"><i class="fas ${cat.icon}"></i></div>
      <h3>${escapeHtml(cat.title)}</h3>
      <p class="category-card-desc">${escapeHtml(cat.description)}</p>
      <ul class="category-card-features">
        ${cat.features.map(f => `<li><i class="fas fa-check"></i> ${escapeHtml(f)}</li>`).join('')}
      </ul>
      <div class="category-card-meta">
        <span class="category-card-count"><i class="fas fa-layer-group"></i> ${cat.subcategories.length} serviços</span>
        <button class="btn-open" data-cat="${cat.id}" type="button">
          Ver serviços <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.btn-open').forEach(btn => {
    btn.addEventListener('click', () => {
      NavState.currentCategory = btn.dataset.cat;
      NavState.currentSubcategory = null;
      renderSubcategories(NavState.currentCategory);
      showLevel(2);
      scrollToCategories();
    });
  });
}

function renderSubcategories(catId) {
  const cat = CATEGORIES_DB.find(c => c.id === catId);
  if (!cat) return;

  const container = dom.subcategoriesContainer();
  const breadcrumb = dom.breadcrumb();
  if (!container || !breadcrumb) return;

  breadcrumb.innerHTML = `
    <button class="breadcrumb-item" data-level="1"><i class="fas fa-house"></i> Início</button>
    <span class="breadcrumb-sep">/</span>
    <span class="breadcrumb-item current">${escapeHtml(cat.title)}</span>
  `;
  breadcrumb.querySelector('[data-level="1"]').addEventListener('click', () => {
    showLevel(1);
    scrollToCategories();
  });

  container.innerHTML = `
    <div class="subcategories-header">
      <div class="subcategories-header-text">
        <h2>${escapeHtml(cat.title)}</h2>
        <p>${escapeHtml(cat.description)}</p>
      </div>
    </div>
    <div class="subcategories-grid">
      ${cat.subcategories.map(sub => `
        <article class="subcategory-card reveal" data-sub="${sub.id}">
          <div class="subcategory-card-header">
            <div class="subcategory-card-icon"><i class="fas ${sub.icon}"></i></div>
            <h3>${escapeHtml(sub.title)}</h3>
          </div>
          <p class="subcategory-card-desc">${escapeHtml(sub.description)}</p>
          <div class="subcategory-card-footer">
            <span class="subcategory-card-price">${escapeHtml(sub.priceRange)}</span>
            <button class="btn-view-details" type="button">
              Ver detalhes <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </article>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('.subcategory-card').forEach(card => {
    card.querySelector('.btn-view-details').addEventListener('click', (e) => {
      e.stopPropagation();
      NavState.currentSubcategory = card.dataset.sub;
      renderDetails(catId, NavState.currentSubcategory);
      showLevel(3);
      scrollToCategories();
    });
    card.addEventListener('click', () => {
      NavState.currentSubcategory = card.dataset.sub;
      renderDetails(catId, NavState.currentSubcategory);
      showLevel(3);
      scrollToCategories();
    });
  });
}

function renderDetails(catId, subId) {
  const cat = CATEGORIES_DB.find(c => c.id === catId);
  const sub = cat?.subcategories.find(s => s.id === subId);
  if (!cat || !sub) return;

  const container = dom.detailsContainer();
  const breadcrumb = dom.breadcrumb();
  if (!container || !breadcrumb) return;

  breadcrumb.innerHTML = `
    <button class="breadcrumb-item" data-level="1"><i class="fas fa-house"></i> Início</button>
    <span class="breadcrumb-sep">/</span>
    <button class="breadcrumb-item" data-level="2">${escapeHtml(cat.title)}</button>
    <span class="breadcrumb-sep">/</span>
    <span class="breadcrumb-item current">${escapeHtml(sub.title)}</span>
  `;
  breadcrumb.querySelector('[data-level="1"]').addEventListener('click', () => {
    showLevel(1);
    scrollToCategories();
  });
  breadcrumb.querySelector('[data-level="2"]').addEventListener('click', () => {
    renderSubcategories(catId);
    showLevel(2);
    scrollToCategories();
  });

  const statusLabels = {
    available: 'Disponível para contratação',
    evaluation: 'Sob avaliação técnica'
  };
  const statusClass = sub.status === 'available' ? 'status-available' : 'status-evaluation';

  container.innerHTML = `
    <div class="details-header reveal">
      <div class="details-icon"><i class="fas ${sub.icon}"></i></div>
      <div class="details-title-wrap">
        <h2>${escapeHtml(sub.title)}</h2>
        <span class="details-status ${statusClass}">${statusLabels[sub.status] || sub.status}</span>
      </div>
    </div>

    <div class="details-body reveal">
      <p class="details-long-desc">${escapeHtml(sub.longDescription)}</p>

      <div class="details-grid">
        <div class="detail-block">
          <h3><i class="fas fa-coins icon-primary"></i> Investimento de referência</h3>
          <p class="detail-value">${escapeHtml(sub.priceRange)}</p>
          <p class="detail-note">${escapeHtml(sub.priceNote)}</p>
        </div>
        <div class="detail-block">
          <h3><i class="fas fa-clock icon-primary"></i> Prazo estimado</h3>
          <p class="detail-value">${escapeHtml(sub.deadline)}</p>
        </div>
      </div>

      <div class="detail-section">
        <h3><i class="fas fa-list-check icon-primary"></i> Características inclusas</h3>
        <ul class="detail-list">
          ${sub.features.map(f => `<li><i class="fas fa-check"></i> ${escapeHtml(f)}</li>`).join('')}
        </ul>
      </div>

      ${sub.projectTypes ? `
      <div class="detail-section">
        <h3><i class="fas fa-diagram-project icon-primary"></i> Modalidades de projeto</h3>
        <ul class="detail-list">
          ${sub.projectTypes.map(pt => `<li><i class="fas fa-caret-right"></i> ${escapeHtml(pt)}</li>`).join('')}
        </ul>
      </div>` : ''}

      <div class="detail-section">
        <h3><i class="fas fa-file-invoice-dollar icon-primary"></i> Condições de pagamento</h3>
        <ul class="detail-list">
          ${sub.paymentTerms.map(pt => `<li><i class="fas fa-check"></i> ${escapeHtml(pt)}</li>`).join('')}
        </ul>
      </div>

      <div class="detail-section">
        <h3><i class="fas fa-circle-exclamation icon-accent"></i> Custos adicionais possíveis</h3>
        <ul class="detail-list">
          ${sub.additionalCosts.map(ac => `<li><i class="fas fa-plus"></i> ${escapeHtml(ac)}</li>`).join('')}
        </ul>
      </div>

      <div class="detail-section">
        <h3><i class="fas fa-circle-info icon-accent"></i> Observações importantes</h3>
        <ul class="detail-list">
          ${sub.observations.map(obs => `<li><i class="fas fa-info-circle"></i> ${escapeHtml(obs)}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="details-actions reveal">
      <button class="btn-outline" id="backToSubsBtn" type="button">
        <i class="fas fa-arrow-left"></i> Voltar para serviços
      </button>
      <button class="btn-primary" id="requestFromDetailsBtn" type="button" ${sub.status !== 'available' ? 'disabled' : ''}>
        <i class="fas fa-paper-plane"></i> Solicitar orçamento
      </button>
    </div>
  `;

  document.getElementById('backToSubsBtn').addEventListener('click', () => {
    renderSubcategories(catId);
    showLevel(2);
    scrollToCategories();
  });

  const reqBtn = document.getElementById('requestFromDetailsBtn');
  if (reqBtn && sub.status === 'available') {
    reqBtn.addEventListener('click', () => openJourneyFromCatalog(catId, subId));
  }
}

/* ============================================================
   11. MODAL DE SOLICITAÇÃO (legado — preservado e corrigido)
   ============================================================ */
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
let currentFile = null;

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
  reader.onload = (e) => { document.getElementById('previewImg').src = e.target.result; };
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
    if (e.target.files && e.target.files.length > 0) handleFileSelect(e.target.files[0]);
  });

  removeBtn.addEventListener('click', () => {
    resetFileUpload();
    fileInput.value = '';
  });

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary)';
  });
  uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFileSelect(e.dataTransfer.files[0]);
  });
}

function openRequestModal(cat, sub) {
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

function closeRequestModal() {
  const modal = dom.requestModal();
  if (!modal || !modal.classList.contains('open')) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  if (modal._previousFocus && typeof modal._previousFocus.focus === 'function') {
    modal._previousFocus.focus();
  }
}

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

async function submitRequest(e) {
  e.preventDefault();

  if (!validateForm()) {
    const firstError = document.querySelector('.field-error.visible');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (FORMINIT_FORM_ID === 'YOUR_FORMINIT_FORM_ID' || !FORMINIT_FORM_ID) {
    const feedback = document.getElementById('submitFeedback');
    feedback.className = 'submit-feedback error visible';
    feedback.innerHTML = '<i class="fas fa-triangle-exclamation"></i> O serviço de envio ainda não foi configurado. Configure o Forminit e tente novamente.';
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('submitFeedback');

  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  feedback.classList.remove('visible', 'success', 'error');

  const formData = new FormData();
  
  const titleVal = document.getElementById('requestTitle').value.trim();
  const initialDescVal = document.getElementById('initialDescription').value.trim();
  const typeText = document.getElementById('requestType').value;
  const projectDescVal = document.getElementById('projectDescription').value.trim();

  // CORREÇÃO: Uso da convenção de blocos do Forminit (fi-{tipo}-{nome})
  formData.append('fi-text-title', titleVal);
  formData.append('fi-text-initialDescription', initialDescVal);
  formData.append('fi-text-requestType', typeText);
  
  // Extrai categoria e subcategoria do texto "Categoria > Subcategoria"
  const parts = typeText.split(' > ');
  formData.append('fi-text-category', parts[0] || '');
  formData.append('fi-text-subcategory', parts[1] || '');
  
  formData.append('fi-text-projectDescription', projectDescVal);

  const prodPayment = document.querySelector('input[name="productionPayment"]:checked');
  let productionText = prodPayment ? prodPayment.value : '';
  if (prodPayment && prodPayment.value === 'Parcelado') {
    const countEl = document.getElementById('installmentCount');
    const dueEl = document.getElementById('dueDay');
    const countText = countEl.value === 'outra' ? 'Outra quantidade — avaliar' : `${countEl.value} parcelas`;
    productionText += ` — ${countText}, vencimento dia ${dueEl.value}`;
  }
  formData.append('fi-text-productionPayment', productionText);

  const maintPref = document.querySelector('input[name="maintenancePreference"]:checked');
  formData.append('fi-text-maintenancePreference', maintPref ? maintPref.value : '');

  if (currentFile) {
    // CORREÇÃO: Nome do campo de arquivo conforme documentação
    formData.append('fi-file-attachment', currentFile, currentFile.name);
  }

  // REMOVIDO: _subject e _captcha não são blocos convencionais e causam rejeição

  try {
    const response = await fetch(FORMINIT_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' } // Content-Type é gerado automaticamente pelo navegador para multipart
    });

    if (response.ok) {
      feedback.className = 'submit-feedback success visible';
      feedback.innerHTML = '<i class="fas fa-circle-check"></i> Solicitação enviada com sucesso! A FGP Technologies recebeu seu pedido e poderá entrar em contato para dar continuidade à análise.';
      feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Limpa dados SOMENTE após sucesso confirmado
      setTimeout(() => {
        document.getElementById('requestForm').reset();
        resetFileUpload();
        updateInstallmentVisibility();
        closeRequestModal();
      }, 5000);
    } else {
      let errorMsg = `Erro do servidor (${response.status})`;
      try {
        const err = await response.json();
        if (err.message) errorMsg = err.message;
        else if (err.error) errorMsg = err.error;
      } catch (e) {
        // Ignora erro de parse JSON, mantém mensagem genérica
      }
      console.error('Forminit submission error (old form):', response.status, errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('Submission failed (old form):', error);
    feedback.className = 'submit-feedback error visible';
    feedback.innerHTML = '<i class="fas fa-circle-exclamation"></i> Não foi possível enviar sua solicitação. Seus dados foram preservados. Verifique sua conexão e tente novamente.';
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } finally {
    // Reativa o botão em caso de falha ou sucesso
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }
}

function setupRequestModal() {
  const modal = dom.requestModal();
  const form = document.getElementById('requestForm');
  const closeBtn = document.getElementById('closeRequestBtn');
  if (!modal || !form) return;

  populateInstallmentOptions();

  closeBtn.addEventListener('click', closeRequestModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeRequestModal(); });

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

/* ============================================================
   12. PAINEL DE CORES
   (Mantido conforme original)
   ============================================================ */
const COLOR_STORAGE_KEY = 'fgp_tech_palette';
const DEFAULT_PALETTE = { primary: '#3b82f6', accent: '#06b6d4', bg: '#0a0e17', text: '#f1f5f9' };
const COLOR_PRESETS = [
  { name: 'FGP Tech', palette: { primary: '#3b82f6', accent: '#06b6d4', bg: '#0a0e17', text: '#f1f5f9' } },
  { name: 'Corporativo', palette: { primary: '#2563eb', accent: '#f59e0b', bg: '#0c1424', text: '#f8fafc' } },
  { name: 'Minimal', palette: { primary: '#64748b', accent: '#0ea5e9', bg: '#0f172a', text: '#f1f5f9' } },
  { name: 'Claro', palette: { primary: '#2563eb', accent: '#0891b2', bg: '#f8fafc', text: '#0f172a' } }
];

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.substr(0, 2), 16), g: parseInt(h.substr(2, 2), 16), b: parseInt(h.substr(4, 2), 16) };
}

function mixHex(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return `rgb(${Math.round(A.r + (B.r - A.r) * t)}, ${Math.round(A.g + (B.g - A.g) * t)}, ${Math.round(A.b + (B.b - A.b) * t)})`;
}

function applyPalette(p) {
  const root = document.documentElement;
  root.style.setProperty('--primary', p.primary);
  root.style.setProperty('--accent', p.accent);
  root.style.setProperty('--bg', p.bg);
  root.style.setProperty('--text', p.text);
  root.style.setProperty('--surface', mixHex(p.bg, p.text, 0.06));
  root.style.setProperty('--surface-strong', mixHex(p.bg, p.text, 0.10));
  root.style.setProperty('--border', mixHex(p.bg, p.text, 0.16));
  root.style.setProperty('--text-muted', mixHex(p.text, p.bg, 0.42));

  const $p = document.getElementById('primaryColor');
  const $a = document.getElementById('accentColor');
  const $b = document.getElementById('bgColor');
  const $t = document.getElementById('textColor');
  if ($p) $p.value = p.primary;
  if ($a) $a.value = p.accent;
  if ($b) $b.value = p.bg;
  if ($t) $t.value = p.text;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', p.bg);
}

function savePalette(p) { try { localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(p)); } catch (_) {} }
function loadPalette() {
  try {
    const raw = localStorage.getItem(COLOR_STORAGE_KEY);
    return raw ? { ...DEFAULT_PALETTE, ...JSON.parse(raw) } : { ...DEFAULT_PALETTE };
  } catch (_) { return { ...DEFAULT_PALETTE }; }
}

function setupColorPanel() {
  const panel = document.getElementById('colorPanel');
  const overlay = document.getElementById('sideOverlay');
  const openBtn = document.getElementById('colorBtn');
  const closeBtn = document.getElementById('closeColorBtn');
  const resetBtn = document.getElementById('resetColors');
  const presetsBox = document.getElementById('colorPresets');
  if (!panel || !openBtn) return;

  COLOR_PRESETS.forEach(preset => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.type = 'button';
    btn.innerHTML = `<div class="dots"><span style="background:${preset.palette.primary}"></span><span style="background:${preset.palette.accent}"></span><span style="background:${preset.palette.bg};border:1px solid #666"></span></div>${preset.name}`;
    btn.addEventListener('click', () => { applyPalette(preset.palette); savePalette(preset.palette); });
    presetsBox.appendChild(btn);
  });

  applyPalette(loadPalette());
  openBtn.addEventListener('click', () => { panel.classList.add('open'); overlay.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); });
  
  function closePanel() {
    panel.classList.remove('open');
    if (!document.getElementById('sideMenu').classList.contains('open')) overlay.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }
  closeBtn.addEventListener('click', closePanel);

  ['primaryColor', 'accentColor', 'bgColor', 'textColor'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      const p = {
        primary: document.getElementById('primaryColor').value,
        accent: document.getElementById('accentColor').value,
        bg: document.getElementById('bgColor').value,
        text: document.getElementById('textColor').value
      };
      applyPalette(p);
      savePalette(p);
    });
  });

  resetBtn.addEventListener('click', () => { applyPalette(DEFAULT_PALETTE); savePalette(DEFAULT_PALETTE); });
}

/* ============================================================
   13. SIDE MENU
   (Mantido conforme original)
   ============================================================ */
function closeSideMenu() {
  const menu = dom.sideMenu();
  const overlay = dom.sideOverlay();
  const colorPanel = dom.colorPanel();
  if (!menu) return;
  menu.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
  if (!colorPanel.classList.contains('open')) overlay.classList.remove('open');
}

function setupSideMenu() {
  const menu = dom.sideMenu();
  const overlay = dom.sideOverlay();
  const openBtn = document.getElementById('hamburgerBtn');
  if (!menu || !openBtn) return;

  openBtn.addEventListener('click', () => { menu.classList.add('open'); overlay.classList.add('open'); menu.setAttribute('aria-hidden', 'false'); });
  overlay.addEventListener('click', () => {
    closeSideMenu();
    const cp = dom.colorPanel();
    if (cp.classList.contains('open')) { cp.classList.remove('open'); cp.setAttribute('aria-hidden', 'true'); }
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { if (a.id !== 'accessosSideBtn' && a.id !== 'sideMenuStartBtn') closeSideMenu(); });
  });

  document.getElementById('accessosSideBtn')?.addEventListener('click', (e) => { e.preventDefault(); closeSideMenu(); openAccessosModal(); });
  document.getElementById('sideMenuStartBtn')?.addEventListener('click', (e) => { e.preventDefault(); closeSideMenu(); openJourney(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSideMenu();
      const cp = dom.colorPanel();
      if (cp.classList.contains('open')) { cp.classList.remove('open'); cp.setAttribute('aria-hidden', 'true'); }
      closeAccessosModal();
      closeRequestModal();
      const journeyModal = dom.journeyModal();
      if (journeyModal && journeyModal.classList.contains('open')) closeJourneyWithConfirm();
    }
  });
}

/* ============================================================
   14. MODAL ACESSOS
   (Mantido conforme original)
   ============================================================ */
function openAccessosModal() {
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
  modal.addEventListener('click', (e) => { if (e.target === modal) closeAccessosModal(); });
}

/* ============================================================
   15. HEADER SHADOW + REVEAL ON SCROLL
   (Mantido conforme original)
   ============================================================ */
function setupHeaderScroll() {
  const header = dom.siteHeader();
  if (!header) return;
  const onScroll = () => { window.scrollY > 10 ? header.classList.add('scrolled') : header.classList.remove('scrolled'); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('visible')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
}

/* ============================================================
   16. JORNADA GUIADA — ESTADO E CONFIGURAÇÃO
   ============================================================ */
const JourneyState = {
  step: 1,
  category: null,
  subcategory: null,
  projectType: null,
  title: '',
  description: '',
  payment: null,
  maintenance: null,
  file: null
};

const ASSISTANT_MESSAGES = {
  1: 'Olá! Vamos encontrar a solução ideal para seu projeto? Escolha uma das categorias abaixo para começar.',
  2: 'Ótimo! Agora escolha o serviço que mais combina com sua necessidade.',
  3: 'Estamos avançando! Qual modalidade de projeto você deseja?',
  4: 'Conte um pouco sobre sua ideia. Não precisa utilizar termos técnicos!',
  5: 'Agora vamos conhecer sua preferência de pagamento.',
  6: 'Você também pode informar se deseja serviços de manutenção.',
  7: 'Tudo pronto! Confira suas escolhas antes de enviar.'
};

function getJourneyCategory() {
  return JourneyState.category ? CATEGORIES_DB.find(c => c.id === JourneyState.category) : null;
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

function openJourney() {
  resetJourneyState();
  JourneyState.step = 1;
  openJourneyModal();
  renderJourneyStep();
}

function openJourneyFromCatalog(catId, subId) {
  resetJourneyState();
  JourneyState.category = catId;
  JourneyState.subcategory = subId;

  const cat = getJourneyCategory();
  const sub = getJourneySubcategory();

  if (cat && sub) {
    JourneyState.title = `Solicitação de desenvolvimento — ${sub.title}`;
    JourneyState.description = `Olá! Tenho interesse no desenvolvimento de ${sub.title.toLowerCase()} (${cat.title}) e gostaria de conhecer as condições de contratação.`;
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

  const hasData = JourneyState.category || JourneyState.subcategory || JourneyState.title || JourneyState.description || JourneyState.payment || JourneyState.maintenance || JourneyState.file;

  if (hasData) {
    if (!window.confirm('Você tem informações preenchidas. Deseja realmente sair da jornada?')) return;
  }

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  resetJourneyState();
}

function handleJourneyNext() {
  const step = JourneyState.step;

  if (step === 1 && !JourneyState.category) { showJourneyAlert('Escolha uma categoria para continuar.'); return; }
  if (step === 2 && !JourneyState.subcategory) { showJourneyAlert('Escolha um serviço para continuar.'); return; }
  if (step === 3 && !JourneyState.projectType) { showJourneyAlert('Escolha o tipo de projeto para continuar.'); return; }
  
  if (step === 4) {
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
  }
  
  if (step === 5 && !JourneyState.payment) { showJourneyAlert('Escolha uma forma de pagamento para continuar.'); return; }
  if (step === 6 && !JourneyState.maintenance) { showJourneyAlert('Escolha uma preferência de manutenção para continuar.'); return; }
  
  if (step === 7) {
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
    nextBtn.innerHTML = JourneyState.step === 7 ? '<i class="fas fa-paper-plane"></i> Enviar pedido' : 'Continuar <i class="fas fa-arrow-right"></i>';
  }

  if (JourneyState.step === 1) renderJourneyCategories();
  else if (JourneyState.step === 2) renderJourneyServices();
  else if (JourneyState.step === 3) renderJourneyTypes();
  else if (JourneyState.step === 4) renderJourneyForm();
  else if (JourneyState.step === 5) renderJourneyPayment();
  else if (JourneyState.step === 6) renderJourneyMaintenance();
  else if (JourneyState.step === 7) renderJourneyReview();
}

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

function renderJourneyCategories() {
  const grid = document.getElementById('journeyCategoriesGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIES_DB.map(cat => `
    <button class="journey-card ${JourneyState.category === cat.id ? 'selected' : ''}" data-category="${cat.id}" type="button">
      <div class="journey-card-icon"><i class="fas ${cat.icon}"></i></div>
      <div class="journey-card-title">${cat.title}</div>
      <div class="journey-card-desc">${cat.description}</div>
      <div class="journey-card-meta"><i class="fas fa-layer-group"></i> ${cat.subcategories.length} ${cat.subcategories.length === 1 ? 'serviço' : 'serviços'}</div>
    </button>
  `).join('');
  grid.querySelectorAll('[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      JourneyState.category = btn.dataset.category;
      JourneyState.subcategory = null;
      JourneyState.projectType = null;
      renderJourneyCategories();
    });
  });
}

function renderJourneyServices() {
  const grid = document.getElementById('journeyServicesGrid');
  if (!grid) return;
  const cat = getJourneyCategory();
  if (!cat) { grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">Selecione uma categoria primeiro.</p>'; return; }
  grid.innerHTML = cat.subcategories.map(sub => `
    <button class="journey-card ${JourneyState.subcategory === sub.id ? 'selected' : ''}" data-subcategory="${sub.id}" type="button">
      <div class="journey-card-icon"><i class="fas ${sub.icon}"></i></div>
      <div class="journey-card-title">${sub.title}</div>
      <div class="journey-card-desc">${sub.description}</div>
      ${sub.priceRange ? `<div class="journey-card-price">${sub.priceRange}</div>` : ''}
    </button>
  `).join('');
  grid.querySelectorAll('[data-subcategory]').forEach(btn => {
    btn.addEventListener('click', () => {
      JourneyState.subcategory = btn.dataset.subcategory;
      JourneyState.projectType = null;
      renderJourneyServices();
    });
  });
}

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
    return `<button class="journey-card ${JourneyState.projectType === raw ? 'selected' : ''}" data-type-index="${idx}" type="button">
      <div class="journey-card-title">${escapeHtml(name)}</div>
    </button>`;
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

function renderJourneyPayment() {
  const grid = document.getElementById('journeyPaymentGrid');
  if (!grid) return;
  grid.querySelectorAll('[data-payment]').forEach(card => card.classList.toggle('selected', card.dataset.payment === JourneyState.payment));
}

function renderJourneyMaintenance() {
  const grid = document.getElementById('journeyMaintenanceGrid');
  if (!grid) return;
  grid.querySelectorAll('[data-maintenance]').forEach(card => card.classList.toggle('selected', card.dataset.maintenance === JourneyState.maintenance));
}

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
    preview?.classList.add('visible');
    if (uploadArea) uploadArea.style.display = 'none';
  } else {
    preview?.classList.remove('visible');
    if (uploadArea) uploadArea.style.display = '';
  }

  const feedback = document.getElementById('journeySubmitFeedback');
  if (feedback) feedback.classList.remove('visible', 'success', 'error');
}

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
  reader.onload = (e) => { document.getElementById('journeyPreviewImg').src = e.target.result; };
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
    if (e.target.files && e.target.files.length > 0) handleJourneyFileSelect(e.target.files[0]);
  });
  removeBtn.addEventListener('click', () => {
    JourneyState.file = null;
    resetJourneyFile();
    fileInput.value = '';
  });
  uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.style.borderColor = 'var(--primary)'; });
  uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleJourneyFileSelect(e.dataTransfer.files[0]);
  });
}

async function submitJourney() {
  const submitFeedback = document.getElementById('journeySubmitFeedback');
  const nextBtn = document.getElementById('journeyNextBtn');

  if (!JourneyState.category || !JourneyState.subcategory) { showJourneyAlert('Escolha categoria e serviço antes de enviar.'); return; }
  if (!JourneyState.title || !JourneyState.description) { showJourneyAlert('Preencha título e descrição antes de enviar.'); return; }
  if (!JourneyState.payment) { showJourneyAlert('Escolha uma forma de pagamento.'); return; }
  if (!JourneyState.maintenance) { showJourneyAlert('Escolha uma preferência de manutenção.'); return; }

  if (FORMINIT_FORM_ID === 'YOUR_FORMINIT_FORM_ID' || !FORMINIT_FORM_ID) {
    submitFeedback.className = 'journey-submit-feedback error visible';
    submitFeedback.innerHTML = '<i class="fas fa-triangle-exclamation"></i> O serviço de envio ainda não foi configurado. Configure o Forminit e tente novamente.';
    submitFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const cat = getJourneyCategory();
  const sub = getJourneySubcategory();
  const typeName = JourneyState.projectType ? parseProjectTypeName(JourneyState.projectType) : '';
  const fullType = typeName ? `${cat.title} > ${sub.title} > ${typeName}` : `${cat.title} > ${sub.title}`;

  const formData = new FormData();
  
  // CORREÇÃO: Uso da convenção de blocos do Forminit (fi-{tipo}-{nome})
  formData.append('fi-text-title', JourneyState.title);
  formData.append('fi-text-requestType', fullType);
  formData.append('fi-text-category', cat.title);
  formData.append('fi-text-subcategory', sub.title);
  
  if (JourneyState.projectType) {
    formData.append('fi-text-projectType', JourneyState.projectType);
  }
  
  // Mapeado para ambos para garantir compatibilidade com blocos de descrição
  formData.append('fi-text-initialDescription', JourneyState.description);
  formData.append('fi-text-projectDescription', JourneyState.description);
  
  formData.append('fi-text-productionPayment', JourneyState.payment);
  formData.append('fi-text-maintenancePreference', JourneyState.maintenance);

  if (JourneyState.file) {
    // CORREÇÃO: Nome do campo de arquivo conforme documentação
    formData.append('fi-file-attachment', JourneyState.file, JourneyState.file.name);
  }

  // REMOVIDO: _subject e _captcha não são blocos convencionais e causam rejeição

  nextBtn.disabled = true;
  const originalBtnHtml = nextBtn.innerHTML;
  nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  submitFeedback.classList.remove('visible', 'success', 'error');

  try {
    const response = await fetch(FORMINIT_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' } // Content-Type é gerado automaticamente pelo navegador
    });

    if (response.ok) {
      submitFeedback.className = 'journey-submit-feedback success visible';
      submitFeedback.innerHTML = '<i class="fas fa-circle-check"></i> Solicitação enviada com sucesso! A FGP Technologies recebeu seu pedido e poderá entrar em contato para dar continuidade à análise.';
      submitFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        const modal = dom.journeyModal();
        if (modal) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';
        resetJourneyState(); // Limpa dados SOMENTE após sucesso
      }, 3500);
    } else {
      let errorMsg = `Erro do servidor (${response.status})`;
      try {
        const err = await response.json();
        if (err.message) errorMsg = err.message;
        else if (err.error) errorMsg = err.error;
      } catch (e) {
        // Ignora erro de parse JSON
      }
      console.error('Forminit submission error (journey):', response.status, errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('Submission failed (journey):', error);
    submitFeedback.className = 'journey-submit-feedback error visible';
    submitFeedback.innerHTML = '<i class="fas fa-circle-exclamation"></i> Não foi possível enviar sua solicitação. Seus dados foram preservados. Verifique sua conexão e tente novamente.';
    submitFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } finally {
    nextBtn.disabled = false;
    nextBtn.innerHTML = originalBtnHtml;
  }
}

function setupJourney() {
  document.getElementById('heroStartBtn')?.addEventListener('click', openJourney);
  document.getElementById('sideMenuStartBtn')?.addEventListener('click', (e) => { e.preventDefault(); closeSideMenu(); openJourney(); });

  document.getElementById('journeyNextBtn')?.addEventListener('click', handleJourneyNext);
  document.getElementById('journeyBackBtn')?.addEventListener('click', handleJourneyBack);
  document.getElementById('closeJourneyBtn')?.addEventListener('click', closeJourneyWithConfirm);

  const journeyModal = dom.journeyModal();
  if (journeyModal) {
    journeyModal.addEventListener('click', (e) => { if (e.target === journeyModal) closeJourneyWithConfirm(); });
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
    card.addEventListener('click', () => { JourneyState.payment = card.dataset.payment; renderJourneyPayment(); });
  });
  document.querySelectorAll('#journeyMaintenanceGrid [data-maintenance]').forEach(card => {
    card.addEventListener('click', () => { JourneyState.maintenance = card.dataset.maintenance; renderJourneyMaintenance(); });
  });

  setupJourneyUpload();
}

/* ============================================================
   17. INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setupColorPanel();
  setupSideMenu();
  setupAccessosModal();
  setupRequestModal();
  setupFileUpload();
  setupHeaderScroll();
  setupReveal();
  setupJourney();
  renderCategories();
  showLevel(1);
});
