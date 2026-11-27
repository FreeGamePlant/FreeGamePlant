/* ============================================================
   FGP TECHNOLOGIES — catalog.js
   Catálogo público hierárquico: Categorias → Subcategorias → Detalhes.
   Integra com o assistente (openJourney) para iniciar a solicitação
   a partir de um serviço específico.

   EXPORTA:
   - initCatalog()  → inicializa listeners e render inicial
   ============================================================ */

import { CATEGORIES_DB, NavState, dom } from './state.js';
import { openJourney } from './assistant.js';

/* ============================================================
   1. HELPERS
   ============================================================ */

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function findCategory(id) {
  return CATEGORIES_DB.find(c => c.id === id) || null;
}

function findSubcategory(catId, subId) {
  const cat = findCategory(catId);
  if (!cat) return null;
  return cat.subcategories.find(s => s.id === subId) || null;
}

function statusBadge(status) {
  const map = {
    available: { label: 'Disponível', cls: 'status-available' },
    evaluation: { label: 'Sob avaliação', cls: 'status-evaluation' }
  };
  const s = map[status] || { label: status || '', cls: '' };
  return `<span class="status-badge ${s.cls}">${escapeHtml(s.label)}</span>`;
}

/* ============================================================
   2. RENDER — NÍVEL 1: CATEGORIAS
   ============================================================ */

function renderCategories() {
  const container = dom.categoriesContainer();
  if (!container) return;

  container.innerHTML = CATEGORIES_DB.map(cat => `
    <button class="category-card" data-category="${escapeHtml(cat.id)}" type="button">
      <div class="category-card-icon">
        <i class="fas ${escapeHtml(cat.icon)}"></i>
      </div>
      <div class="category-card-body">
        <h3>${escapeHtml(cat.title)}</h3>
        <p>${escapeHtml(cat.description)}</p>
        <ul class="category-card-features">
          ${(cat.features || []).map(f => `<li><i class="fas fa-check"></i> ${escapeHtml(f)}</li>`).join('')}
        </ul>
      </div>
      <div class="category-card-arrow" aria-hidden="true">
        <i class="fas fa-arrow-right"></i>
      </div>
    </button>
  `).join('');
}

/* ============================================================
   3. RENDER — NÍVEL 2: SUBCATEGORIAS
   ============================================================ */

function renderSubcategories(categoryId) {
  const container = dom.subcategoriesContainer();
  if (!container) return;

  const cat = findCategory(categoryId);
  if (!cat) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = cat.subcategories.map(sub => `
    <button class="subcategory-card"
            data-category="${escapeHtml(categoryId)}"
            data-subcategory="${escapeHtml(sub.id)}"
            type="button">
      <div class="subcategory-card-header">
        <div class="subcategory-card-icon">
          <i class="fas ${escapeHtml(sub.icon)}"></i>
        </div>
        ${statusBadge(sub.status)}
      </div>
      <h4>${escapeHtml(sub.title)}</h4>
      <p class="subcategory-card-desc">${escapeHtml(sub.description)}</p>
      <div class="subcategory-card-meta">
        <span class="meta-price"><i class="fas fa-tag"></i> ${escapeHtml(sub.priceRange)}</span>
        <span class="meta-deadline"><i class="fas fa-clock"></i> ${escapeHtml(sub.deadline)}</span>
      </div>
      <span class="subcategory-card-cta">
        Ver detalhes <i class="fas fa-arrow-right"></i>
      </span>
    </button>
  `).join('');
}

/* ============================================================
   4. RENDER — NÍVEL 3: DETALHES
   ============================================================ */

function renderDetails(categoryId, subcategoryId) {
  const container = dom.detailsContainer();
  if (!container) return;

  const cat = findCategory(categoryId);
  const sub = findSubcategory(categoryId, subcategoryId);
  if (!cat || !sub) {
    container.innerHTML = '';
    return;
  }

  const mailSubject = encodeURIComponent(`Sobre: ${cat.title} — ${sub.title}`);

  container.innerHTML = `
    <article class="details-panel"
             data-category="${escapeHtml(categoryId)}"
             data-subcategory="${escapeHtml(subcategoryId)}">

      <header class="details-header">
        <div class="details-header-main">
          <div class="details-icon">
            <i class="fas ${escapeHtml(sub.icon)}"></i>
          </div>
          <div>
            <h2>${escapeHtml(sub.title)}</h2>
            <p class="details-category">${escapeHtml(cat.title)}</p>
          </div>
        </div>
        ${statusBadge(sub.status)}
      </header>

      <p class="details-long-desc">${escapeHtml(sub.longDescription || sub.description)}</p>

      <div class="details-metrics">
        <div class="details-metric">
          <span class="metric-label">Faixa de investimento</span>
          <span class="metric-value">${escapeHtml(sub.priceRange)}</span>
          <span class="metric-note">${escapeHtml(sub.priceNote || '')}</span>
        </div>
        <div class="details-metric">
          <span class="metric-label">Prazo estimado</span>
          <span class="metric-value">${escapeHtml(sub.deadline)}</span>
        </div>
      </div>

      ${sub.features && sub.features.length ? `
        <section class="details-section">
          <h3><i class="fas fa-check-circle"></i> O que está incluso</h3>
          <ul class="details-list">
            ${sub.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
          </ul>
        </section>
      ` : ''}

      ${sub.projectTypes && sub.projectTypes.length ? `
        <section class="details-section">
          <h3><i class="fas fa-diagram-project"></i> Tipos de projeto</h3>
          <ul class="details-list">
            ${sub.projectTypes.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
          </ul>
        </section>
      ` : ''}

      ${sub.paymentTerms && sub.paymentTerms.length ? `
        <section class="details-section">
          <h3><i class="fas fa-credit-card"></i> Condições de pagamento</h3>
          <ul class="details-list">
            ${sub.paymentTerms.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
          </ul>
        </section>
      ` : ''}

      ${sub.additionalCosts && sub.additionalCosts.length ? `
        <section class="details-section">
          <h3><i class="fas fa-receipt"></i> Custos adicionais (externos)</h3>
          <ul class="details-list">
            ${sub.additionalCosts.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
          </ul>
        </section>
      ` : ''}

      ${sub.observations && sub.observations.length ? `
        <section class="details-section details-observations">
          <h3><i class="fas fa-info-circle"></i> Observações importantes</h3>
          <ul class="details-list">
            ${sub.observations.map(o => `<li>${escapeHtml(o)}</li>`).join('')}
          </ul>
        </section>
      ` : ''}

      <div class="details-actions">
        <button class="btn-primary details-start-btn"
                data-category="${escapeHtml(categoryId)}"
                data-subcategory="${escapeHtml(subcategoryId)}"
                type="button">
          <i class="fas fa-wand-magic-sparkles"></i> Começar com este serviço
        </button>
        <a class="btn-outline details-contact-btn"
           href="mailto:fgpfreegameplant@gmail.com?subject=${mailSubject}">
          <i class="fas fa-envelope"></i> Falar com a FGP
        </a>
      </div>

      <p class="details-disclaimer">
        <i class="fas fa-info-circle"></i>
        Os valores e prazos apresentados são referências. A proposta definitiva
        depende da análise do escopo do projeto.
      </p>
    </article>
  `;
}

/* ============================================================
   5. BREADCRUMB
   ============================================================ */

function renderBreadcrumb(level, categoryId = null, subcategoryId = null) {
  const el = dom.breadcrumb();
  if (!el) return;

  if (level === 'categories') {
    el.innerHTML = '';
    el.classList.add('hidden');
    return;
  }

  const cat = findCategory(categoryId);
  const parts = [
    `<button class="breadcrumb-item" data-nav="categories" type="button">
       <i class="fas fa-layer-group"></i> Serviços
     </button>`
  ];

  if (cat) {
    parts.push(`<span class="breadcrumb-sep" aria-hidden="true"><i class="fas fa-chevron-right"></i></span>`);

    if (level === 'details') {
      parts.push(`<button class="breadcrumb-item" data-nav="subcategories" type="button">
        ${escapeHtml(cat.title)}
      </button>`);
    } else {
      parts.push(`<span class="breadcrumb-current">${escapeHtml(cat.title)}</span>`);
    }
  }

  if (level === 'details' && subcategoryId) {
    const sub = findSubcategory(categoryId, subcategoryId);
    if (sub) {
      parts.push(`<span class="breadcrumb-sep" aria-hidden="true"><i class="fas fa-chevron-right"></i></span>`);
      parts.push(`<span class="breadcrumb-current">${escapeHtml(sub.title)}</span>`);
    }
  }

  el.innerHTML = parts.join('');
  el.classList.remove('hidden');
}

/* ============================================================
   6. NAVEGAÇÃO INTERNA
   ============================================================ */

function showCategories() {
  NavState.currentCategory = null;
  NavState.currentSubcategory = null;

  dom.categoriesContainer()?.classList.remove('hidden');
  dom.subcategoriesContainer()?.classList.add('hidden');
  dom.detailsContainer()?.classList.add('hidden');

  renderBreadcrumb('categories');
  renderCategories();
}

function showSubcategories(categoryId) {
  NavState.currentCategory = categoryId;
  NavState.currentSubcategory = null;

  dom.categoriesContainer()?.classList.add('hidden');
  dom.subcategoriesContainer()?.classList.remove('hidden');
  dom.detailsContainer()?.classList.add('hidden');

  renderBreadcrumb('subcategories', categoryId);
  renderSubcategories(categoryId);
}

function showDetails(categoryId, subcategoryId) {
  NavState.currentCategory = categoryId;
  NavState.currentSubcategory = subcategoryId;

  dom.categoriesContainer()?.classList.add('hidden');
  dom.subcategoriesContainer()?.classList.add('hidden');
  dom.detailsContainer()?.classList.remove('hidden');

  renderBreadcrumb('details', categoryId, subcategoryId);
  renderDetails(categoryId, subcategoryId);
}

/* ============================================================
   7. HANDLERS (delegação de eventos)
   ============================================================ */

function handleCategoryClick(e) {
  const card = e.target.closest('.category-card');
  if (!card) return;
  const catId = card.dataset.category;
  if (catId) showSubcategories(catId);
}

function handleSubcategoryClick(e) {
  const card = e.target.closest('.subcategory-card');
  if (!card) return;
  const catId = card.dataset.category;
  const subId = card.dataset.subcategory;
  if (catId && subId) showDetails(catId, subId);
}

function handleDetailsClick(e) {
  const startBtn = e.target.closest('.details-start-btn');
  if (!startBtn) return;
  const catId = startBtn.dataset.category;
  const subId = startBtn.dataset.subcategory;
  if (catId && subId) {
    openJourney({ category: catId, subcategory: subId });
  }
}

function handleBreadcrumbClick(e) {
  const item = e.target.closest('[data-nav]');
  if (!item) return;
  const target = item.dataset.nav;
  if (target === 'categories') {
    showCategories();
  } else if (target === 'subcategories' && NavState.currentCategory) {
    showSubcategories(NavState.currentCategory);
  }
}

/* ============================================================
   8. INIT
   ============================================================ */

let initialized = false;

export function initCatalog() {
  if (initialized) return;

  const categoriesEl = dom.categoriesContainer();
  const subcategoriesEl = dom.subcategoriesContainer();
  const detailsEl = dom.detailsContainer();
  const breadcrumbEl = dom.breadcrumb();

  if (categoriesEl) categoriesEl.addEventListener('click', handleCategoryClick);
  if (subcategoriesEl) subcategoriesEl.addEventListener('click', handleSubcategoryClick);
  if (detailsEl) detailsEl.addEventListener('click', handleDetailsClick);
  if (breadcrumbEl) breadcrumbEl.addEventListener('click', handleBreadcrumbClick);

  // Estado inicial: mostrar apenas as categorias
  showCategories();

  initialized = true;
}
