/* ============================================================
NAVEGAÇÃO E UI
============================================================ */
import { dom } from './state.js';
import { openAccessosModal } from './modals.js'; // Se necessário, ou importar a função diretamente
import { openJourney } from './assistant.js';

export function initNavigation() {
    setupSideMenu();
    setupHeaderScroll();
    setupReveal();
}

function setupSideMenu() {
    const menu = dom.sideMenu();
    const overlay = dom.sideOverlay();
    const openBtn = document.getElementById('hamburgerBtn');
    if (!menu || !openBtn) return;

    openBtn.addEventListener('click', () => {
        menu.classList.add('open');
        overlay.classList.add('open');
    });

    overlay.addEventListener('click', () => {
        menu.classList.remove('open');
        dom.colorPanel()?.classList.remove('open');
        overlay.classList.remove('open');
    });

    document.getElementById('accessosSideBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        menu.classList.remove('open');
        overlay.classList.remove('open');
        // Chamar modal de acessos (importado ou via evento global se preferir)
        const modal = dom.accessosModal();
        if(modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
    });

    document.getElementById('sideMenuStartBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        menu.classList.remove('open');
        overlay.classList.remove('open');
        openJourney();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            menu.classList.remove('open');
            dom.colorPanel()?.classList.remove('open');
            dom.sideOverlay()?.classList.remove('open');
        }
    });
}

function setupHeaderScroll() {
    const header = dom.siteHeader();
    if (!header) return;
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

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
