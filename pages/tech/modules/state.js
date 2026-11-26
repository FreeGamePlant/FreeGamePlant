/* ============================================================
ESTADO GLOBAL DA APLICAÇÃO
============================================================ */
export const NavState = {
    currentCategory: null,
    currentSubcategory: null
};

export const JourneyState = {
    step: 1,
    category: null,
    subcategory: null,
    projectType: null,
    // Novos campos de evolução do briefing
    clientType: 'PF', // 'PF' ou 'PJ'
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    companyName: '',
    companySegment: '',
    projectName: '',
    projectGoal: '',
    targetAudience: '',
    hasLogo: 'nao',
    hasDomain: 'nao',
    desiredDeadline: '',
    // Campos originais
    title: '',
    description: '',
    payment: null,
    maintenance: null,
    file: null
};

export const COLOR_STORAGE_KEY = 'fgp_tech_palette';
export const DEFAULT_PALETTE = {
    primary: '#3b82f6',
    accent: '#06b6d4',
    bg: '#0a0e17',
    text: '#f1f5f9'
};

export const COLOR_PRESETS = [
    { name: 'FGP Tech', palette: { primary: '#3b82f6', accent: '#06b6d4', bg: '#0a0e17', text: '#f1f5f9' } },
    { name: 'Corporativo', palette: { primary: '#2563eb', accent: '#f59e0b', bg: '#0c1424', text: '#f8fafc' } },
    { name: 'Minimal', palette: { primary: '#64748b', accent: '#0ea5e9', bg: '#0f172a', text: '#f1f5f9' } },
    { name: 'Claro', palette: { primary: '#2563eb', accent: '#0891b2', bg: '#f8fafc', text: '#0f172a' } }
];
