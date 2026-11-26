/* ============================================================
FGP TECHNOLOGIES — index.js
Ponto de entrada da aplicação modular.
============================================================ */
import { initUtils } from './modules/utils.js';
import { initNavigation } from './modules/navigation.js';
import { initCatalog } from './modules/catalog.js';
import { initAssistant } from './modules/assistant.js';
import { initModals } from './modules/modals.js';
import { initPersonalization } from './modules/personalization.js';

function initializeTech() {
    try {
        initUtils();
        initNavigation();
        initPersonalization();
        initCatalog();
        initModals();
        initAssistant();
        console.log('✅ FGP Technologies inicializado com sucesso.');
    } catch (error) {
        console.error('❌ Erro crítico na inicialização do FGP Technologies:', error);
    }
}

// Garante que o DOM esteja pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTech);
} else {
    initializeTech();
}
