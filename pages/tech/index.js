/* ============================================================
FGP TECHNOLOGIES — index.js
Ponto de entrada da aplicação modular (ES Modules).
Responsável apenas por importar e inicializar os módulos.
============================================================ */

import { initUtils } from './modules/utils.js';
import { initNavigation } from './modules/navigation.js';
import { initPersonalization } from './modules/personalization.js';
import { initCatalog } from './modules/catalog.js';
import { initModals } from './modules/modals.js';
import { initAssistant } from './modules/assistant.js';

/**
 * Orquestra a inicialização de todos os módulos da aplicação.
 * A ordem é importante: utilitários e navegação primeiro, 
 * seguidos pelos componentes visuais e, por fim, a jornada guiada.
 */
function initializeTech() {
    try {
        initUtils();
        initNavigation();
        initPersonalization();
        initCatalog();
        initModals();
        initAssistant();
        
        console.log('✅ FGP Technologies inicializado com sucesso (Arquitetura Modular).');
    } catch (error) {
        console.error('❌ Erro crítico na inicialização do FGP Technologies:', error);
    }
}

// Garante que a inicialização ocorra apenas após o DOM estar totalmente carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTech);
} else {
    // Caso o script seja carregado de forma assíncrona após o DOM já estar pronto
    initializeTech();
}
