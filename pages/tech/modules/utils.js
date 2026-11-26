/* ============================================================
UTILITÁRIOS E REFERÊNCIAS DOM
============================================================ */
export function initUtils() {
    // Utilitários globais podem ser expostos via window se estritamente necessário,
    // mas preferimos exportar funções para os módulos.
}

export function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str == null ? '' : str);
    return div.innerHTML;
}

export function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export const dom = {
    categoriesIntro: () => document.getElementById('categoriesIntro'),
    breadcrumb: () => document.getElementById('breadcrumb'),
    categoriesContainer: () => document.getElementById('categoriesContainer'),
    subcategoriesContainer: () => document.getElementById('subcategoriesContainer'),
    detailsContainer: () => document.getElementById('detailsContainer'),
    siteHeader: () => document.getElementById('siteHeader'),
    colorPanel: () => document.getElementById('colorPanel'),
    sideMenu: () => document.getElementById('sideMenu'),
    sideOverlay: () => document.getElementById('sideOverlay'),
    requestModal: () => document.getElementById('requestModal'),
    accessosModal: () => document.getElementById('accessosModal'),
    journeyModal: () => document.getElementById('journeyModal')
};
