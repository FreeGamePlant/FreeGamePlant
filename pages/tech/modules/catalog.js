/* ============================================================
FGP TECHNOLOGIES — catalog.js
Catálogo hierárquico: categorias, subcategorias, detalhes
comerciais, breadcrumb e navegação entre níveis.
============================================================ */

import { CATEGORIES_DB, NavState, dom } from './state.js';
import { escapeHtml } from './utils.js';

export function initCatalog() {
    renderCategories();
    showLevel(1);
}

/* ============================================================
NAVEGAÇÃO ENTRE NÍVEIS
============================================================ */
function showLevel(level) {
    const intro = dom.categoriesIntro();
    const breadcrumb = dom.breadcrumb();
    const cats = dom.categoriesContainer();
    const subs = dom.subcategoriesContainer();
    const dets = dom.detailsContainer();

    if (level === 1) {
        intro?.classList.remove('hidden');
        breadcrumb?.classList.add('hidden');
        cats?.classList.remove('hidden');
        subs?.classList.add('hidden');
        dets?.classList.add('hidden');
    } else if (level === 2) {
        intro?.classList.add('hidden');
        breadcrumb?.classList.remove('hidden');
        cats?.classList.add('hidden');
        subs?.classList.remove('hidden');
        dets?.classList.add('hidden');
    } else if (level === 3) {
        intro?.classList.add('hidden');
        breadcrumb?.classList.remove('hidden');
        cats?.classList.add('hidden');
        subs?.classList.add('hidden');
        dets?.classList.remove('hidden');
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

export function openCategory(categoryId) {
    const cat = CATEGORIES_DB.find(c => c.id === categoryId);
    if (!cat) return;
    NavState.currentCategory = categoryId;
    NavState.currentSubcategory = null;
    renderSubcategories(cat);
    renderBreadcrumb();
    showLevel(2);
    scrollToCategories();
}

export function openSubcategory(subcategoryId) {
    const cat = CATEGORIES_DB.find(c => c.id === NavState.currentCategory);
    if (!cat) return;
    const sub = cat.subcategories.find(s => s.id === subcategoryId);
    if (!sub) return;
    NavState.currentSubcategory = subcategoryId;
    renderDetails(cat, sub);
    renderBreadcrumb();
    showLevel(3);
    scrollToCategories();
}

export function backToCategories() {
    NavState.currentCategory = null;
    NavState.currentSubcategory = null;
    renderBreadcrumb();
    showLevel(1);
    scrollToCategories();
}

export function backToSubcategories() {
    NavState.currentSubcategory = null;
    renderBreadcrumb();
    showLevel(2);
    scrollToCategories();
}

/* ============================================================
RENDERIZAÇÃO — NÍVEL 1 (categorias)
============================================================ */
function renderCategories() {
    const container = dom.categoriesContainer();
    if (!container) return;

    container.innerHTML = CATEGORIES_DB.map(cat => `
        <article class="category-card">
            <div class="category-card-icon">
                <i class="fas ${cat.icon}"></i>
            </div>
            <h3>${escapeHtml(cat.title)}</h3>
            <p class="category-card-desc">${escapeHtml(cat.description)}</p>
            <ul class="category-card-features">
                ${cat.features.map(f => `<li><i class="fas fa-check"></i> ${escapeHtml(f)}</li>`).join('')}
            </ul>
            <div class="category-card-meta">
                <span class="category-card-count">
                    <i class="fas fa-layer-group"></i> ${cat.subcategories.length} ${cat.subcategories.length === 1 ? 'subcategoria' : 'subcategorias'}
                </span>
                <button class="btn-open" data-category="${cat.id}">
                    Abrir <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </article>
    `).join('');

    container.querySelectorAll('.btn-open').forEach(btn => {
        btn.addEventListener('click', () => openCategory(btn.dataset.category));
    });
}

/* ============================================================
RENDERIZAÇÃO — NÍVEL 2 (subcategorias)
============================================================ */
function renderSubcategories(cat) {
    const container = dom.subcategoriesContainer();
    if (!container) return;

    container.innerHTML = `
        <div class="subcategories-header">
            <div class="subcategories-header-text">
                <h2>${escapeHtml(cat.title)}</h2>
                <p>${escapeHtml(cat.description)}</p>
            </div>
            <button class="btn-back" id="backToCatsBtn">
                <i class="fas fa-arrow-left"></i> Voltar às categorias
            </button>
        </div>
        <div class="subcategories-grid">
            ${cat.subcategories.map(sub => `
                <article class="subcategory-card" data-subcategory="${sub.id}">
                    <div class="subcategory-card-header">
                        <div class="subcategory-card-icon">
                            <i class="fas ${sub.icon}"></i>
                        </div>
                        <h3>${escapeHtml(sub.title)}</h3>
                    </div>
                    <p class="subcategory-card-desc">${escapeHtml(sub.description)}</p>
                    <div class="subcategory-card-footer">
                        <span class="subcategory-card-price">${escapeHtml(sub.priceRange)}</span>
                        <button class="btn-view-details" data-subcategory="${sub.id}">
                            Ver detalhes <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </article>
            `).join('')}
        </div>
    `;

    container.querySelector('#backToCatsBtn')?.addEventListener('click', backToCategories);
    container.querySelectorAll('.subcategory-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-view-details')) return;
            openSubcategory(card.dataset.subcategory);
        });
    });
    container.querySelectorAll('.btn-view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openSubcategory(btn.dataset.subcategory);
        });
    });
}

/* ============================================================
RENDERIZAÇÃO — NÍVEL 3 (detalhes)
============================================================ */
function getStatusBadge(status) {
    const map = {
        available:  { label: 'Disponível',            icon: 'fa-circle-check',         cls: 'available' },
        evaluation: { label: 'Sob avaliação técnica', icon: 'fa-triangle-exclamation', cls: 'evaluation' },
        expansion:  { label: 'Em expansão',           icon: 'fa-seedling',             cls: 'expansion' }
    };
    const info = map[status] || map.evaluation;
    return `<span class="status-badge ${info.cls}"><i class="fas ${info.icon}"></i> ${info.label}</span>`;
}

function renderDetails(cat, sub) {
    const container = dom.detailsContainer();
    if (!container) return;

    container.innerHTML = `
        <div class="details-header">
            <button class="btn-back" id="backToSubsBtn">
                <i class="fas fa-arrow-left"></i> Voltar para ${escapeHtml(cat.title)}
            </button>
            ${getStatusBadge(sub.status)}
        </div>
        <div class="details-card">
            <div class="details-top">
                <div class="details-icon">
                    <i class="fas ${sub.icon}"></i>
                </div>
                <div class="details-top-info">
                    <div class="details-category-label">${escapeHtml(cat.title)}</div>
                    <h2 class="details-title">${escapeHtml(sub.title)}</h2>
                    <p class="details-description">${escapeHtml(sub.longDescription || sub.description)}</p>
                </div>
            </div>
            <div class="details-highlight-row">
                <div class="details-highlight">
                    <div class="details-highlight-label">
                        <i class="fas fa-money-bill-wave"></i> Investimento de referência
                    </div>
                    <div class="details-highlight-value">
                        ${escapeHtml(sub.priceRange)}
                        <small>${escapeHtml(sub.priceNote || 'Valor final sujeito ao escopo.')}</small>
                    </div>
                </div>
                <div class="details-highlight">
                    <div class="details-highlight-label">
                        <i class="fas fa-clock"></i> Prazo de desenvolvimento
                    </div>
                    <div class="details-highlight-value">
                        ${escapeHtml(sub.deadline)}
                        <small>Estimativa inicial — pode variar com o escopo.</small>
                    </div>
                </div>
            </div>
            <div class="details-sections">
                <div class="details-section">
                    <h4><i class="fas fa-list-check"></i> Tipos de projeto atendidos</h4>
                    <ul class="details-list">
                        ${sub.projectTypes.map(t => `<li><i class="fas fa-angle-right"></i> ${escapeHtml(t)}</li>`).join('')}
                    </ul>
                </div>
                <div class="details-section">
                    <h4><i class="fas fa-credit-card"></i> Modalidades de pagamento</h4>
                    <ul class="details-list">
                        ${sub.paymentTerms.map(p => `<li><i class="fas fa-angle-right"></i> ${escapeHtml(p)}</li>`).join('')}
                    </ul>
                </div>
                <div class="details-section">
                    <h4><i class="fas fa-receipt"></i> Custos adicionais</h4>
                    <ul class="details-list">
                        ${sub.additionalCosts.map(c => `<li><i class="fas fa-angle-right"></i> ${escapeHtml(c)}</li>`).join('')}
                    </ul>
                </div>
                <div class="details-section">
                    <h4><i class="fas fa-star"></i> Características</h4>
                    <ul class="details-list">
                        ${sub.features.map(f => `<li><i class="fas fa-check"></i> ${escapeHtml(f)}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="details-observations">
                <h4><i class="fas fa-circle-info"></i> Observações importantes</h4>
                <ul>
                    ${sub.observations.map(o => `<li><i class="fas fa-circle-info"></i> ${escapeHtml(o)}</li>`).join('')}
                </ul>
            </div>
            <div class="details-cta">
                <p class="details-cta-note">
                    Os valores e prazos são referências de mercado. O orçamento definitivo será
                    elaborado após a análise do escopo, das funcionalidades e dos requisitos técnicos.
                </p>
                <button class="btn-request-large" data-subcategory="${sub.id}">
                    <i class="fas fa-wand-magic-sparkles"></i> Começar com este serviço
                </button>
            </div>
        </div>
    `;

    container.querySelector('#backToSubsBtn')?.addEventListener('click', backToSubcategories);
    container.querySelector('.btn-request-large')?.addEventListener('click', () => {
        // Importação dinâmica para evitar dependência circular no carregamento
        import('./assistant.js').then(mod => {
            mod.openJourneyFromCatalog(cat.id, sub.id);
        }).catch(err => {
            console.error('Erro ao abrir jornada a partir do catálogo:', err);
        });
    });
}

/* ============================================================
BREADCRUMB
============================================================ */
function renderBreadcrumb() {
    const container = dom.breadcrumb();
    if (!container) return;

    const cat = NavState.currentCategory
        ? CATEGORIES_DB.find(c => c.id === NavState.currentCategory)
        : null;
    const sub = cat && NavState.currentSubcategory
        ? cat.subcategories.find(s => s.id === NavState.currentSubcategory)
        : null;

    if (!cat) {
        container.classList.add('hidden');
        container.innerHTML = '';
        return;
    }

    const items = [];
    items.push(`<button class="breadcrumb-item" data-crumb="root">
        <i class="fas fa-layer-group"></i> Catálogo
    </button>`);

    if (!sub) {
        items.push(`<span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span>`);
        items.push(`<span class="breadcrumb-item current">${escapeHtml(cat.title)}</span>`);
    } else {
        items.push(`<span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span>`);
        items.push(`<button class="breadcrumb-item" data-crumb="category">${escapeHtml(cat.title)}</button>`);
        items.push(`<span class="breadcrumb-sep"><i class="fas fa-chevron-right"></i></span>`);
        items.push(`<span class="breadcrumb-item current">${escapeHtml(sub.title)}</span>`);
    }

    container.innerHTML = items.join('');
    container.querySelector('[data-crumb="root"]')?.addEventListener('click', backToCategories);
    container.querySelector('[data-crumb="category"]')?.addEventListener('click', backToSubcategories);
}
