/* ============================================================
FGP TECHNOLOGIES — navigation.js
Menu lateral, header scroll, reveal animations e navegação.
============================================================ */

import { dom } from './state.js';

export function initNavigation() {
    setupSideMenu();
    setupHeaderScroll();
    setupReveal();
    setupGlobalKeyboard();
}

/* ============================================================
SIDE MENU
============================================================ */
function setupSideMenu() {
    const menu = dom.sideMenu();
    const overlay = dom.sideOverlay();
    const openBtn = document.getElementById('hamburgerBtn');
    if (!menu || !openBtn) return;

    openBtn.addEventListener('click', () => {
        menu.classList.add('open');
        overlay.classList.add('open');
        menu.setAttribute('aria-hidden', 'false');
    });

    overlay.addEventListener('click', () => {
        closeSideMenu();
        const cp = dom.colorPanel();
        if (cp && cp.classList.contains('open')) {
            cp.classList.remove('open');
            cp.setAttribute('aria-hidden', 'true');
        }
    });

    // Fecha menu ao clicar em links (exceto os especiais)
    menu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            if (a.id !== 'accessosSideBtn' && a.id !== 'sideMenuStartBtn') {
                closeSideMenu();
            }
        });
    });
}

function closeSideMenu() {
    const menu = dom.sideMenu();
    const overlay = dom.sideOverlay();
    const colorPanel = dom.colorPanel();
    if (!menu) return;
    
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    if (colorPanel && !colorPanel.classList.contains('open')) {
        overlay.classList.remove('open');
    }
}

/* ============================================================
HEADER SCROLL EFFECT
============================================================ */
function setupHeaderScroll() {
    const header = dom.siteHeader();
    if (!header) return;
    
    const onScroll = () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ============================================================
REVEAL ANIMATIONS
============================================================ */
function setupReveal() {
    const items = document.querySelectorAll('.reveal');
    
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('visible'));
        return;
    }
    
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    
    items.forEach(el => io.observe(el));
}

/* ============================================================
GLOBAL KEYBOARD (ESC)
============================================================ */
function setupGlobalKeyboard() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSideMenu();
            
            const cp = dom.colorPanel();
            if (cp && cp.classList.contains('open')) {
                cp.classList.remove('open');
                cp.setAttribute('aria-hidden', 'true');
            }
            
            // Fecha modais (serão chamados via eventos customizados ou imports diretos)
            // Esta função será complementada pelos módulos de modals e assistant
        }
    });
}

/* ============================================================
EXPORTS PARA OUTROS MÓDULOS
============================================================ */
export { closeSideMenu };
