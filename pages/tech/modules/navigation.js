/* ============================================================
   FGP TECHNOLOGIES — navigation.js
   Menu lateral (hamburguer), painel de cores (toggle) e
   comportamentos de navegação do header.

   Não cuida da lógica de cores em si (isso é personalization.js),
   apenas abre/fecha o painel.

   EXPORTA:
   - initNavigation()
   - openSideMenu() / closeSideMenu() / toggleSideMenu()
   - openColorPanel() / closeColorPanel() / toggleColorPanel()
   ============================================================ */

import { dom } from './state.js';

/* ============================================================
   1. HELPERS
   ============================================================ */

function $id(id) { return document.getElementById(id); }

function isOpen(el) {
  return !!el && el.classList.contains('open');
}

/**
 * Sincroniza o atributo aria-hidden com o estado visual.
 * Não remove o body-lock: isso é feito pelo closeMenu/closePanel.
 */
function setAria(el, open) {
  if (el) el.setAttribute('aria-hidden', String(!open));
}

/* ============================================================
   2. SIDE MENU
   ============================================================ */

export function openSideMenu() {
  const menu = dom.sideMenu();
  const overlay = dom.sideOverlay();
  if (!menu) return;

  menu.classList.add('open');
  overlay?.classList.add('open');
  setAria(menu, true);
  document.body.classList.add('menu-open');
}

export function closeSideMenu() {
  const menu = dom.sideMenu();
  const overlay = dom.sideOverlay();
  if (!menu) return;

  menu.classList.remove('open');
  overlay?.classList.remove('open');
  setAria(menu, false);

  // Evita remover o lock se o color panel ou outro overlay estiver aberto
  const otherOpen = document.querySelector(
    '.color-panel.open, .modal-overlay.open, .journey-modal-overlay.open'
  );
  if (!otherOpen) document.body.classList.remove('menu-open');
}

export function toggleSideMenu() {
  isOpen(dom.sideMenu()) ? closeSideMenu() : openSideMenu();
}

function bindSideMenu() {
  // Abrir via hamburguer
  $id('hamburgerBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSideMenu();
  });

  // Fechar ao clicar no overlay
  dom.sideOverlay()?.addEventListener('click', closeSideMenu);

  // Fechar ao clicar em um link de navegação do menu lateral
  dom.sideMenu()?.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', () => {
      // Não fecha imediatamente se for o "Começar" (o index.js abre a jornada)
      if (link.id === 'sideMenuStartBtn') return;
      // Fecha com leve atraso para o scroll começar suave
      setTimeout(closeSideMenu, 60);
    });
  });
}

/* ============================================================
   3. COLOR PANEL
   ============================================================ */

export function openColorPanel() {
  const panel = dom.colorPanel();
  if (!panel) return;

  // Fecha o side menu se estiver aberto (evita sobreposição)
  if (isOpen(dom.sideMenu())) closeSideMenu();

  panel.classList.add('open');
  setAria(panel, true);
  document.body.classList.add('menu-open');
}

export function closeColorPanel() {
  const panel = dom.colorPanel();
  if (!panel) return;

  panel.classList.remove('open');
  setAria(panel, false);

  const otherOpen = document.querySelector(
    '.side-menu.open, .modal-overlay.open, .journey-modal-overlay.open'
  );
  if (!otherOpen) document.body.classList.remove('menu-open');
}

export function toggleColorPanel() {
  isOpen(dom.colorPanel()) ? closeColorPanel() : openColorPanel();
}

function bindColorPanel() {
  $id('colorBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleColorPanel();
  });
  $id('closeColorBtn')?.addEventListener('click', closeColorPanel);
}

/* ============================================================
   4. FECHAR PAINÉIS COM ESC E CLIQUE FORA
   ============================================================ */

function bindGlobalDismiss() {
  // ESC
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    // Prioridade: overlays com maior z-index primeiro
    if (isOpen(dom.journeyModal?.())) {
      // assistant.js já trata — não faz nada aqui.
      return;
    }
    if (isOpen(dom.colorPanel())) {
      closeColorPanel();
      return;
    }
    if (isOpen(dom.sideMenu())) {
      closeSideMenu();
      return;
    }
    if (isOpen(dom.requestModal()) || isOpen(dom.accessosModal())) {
      // modals.js já trata — não faz nada aqui.
      return;
    }
  });

  // Clique fora do painel de cores fecha
  document.addEventListener('click', (e) => {
    const panel = dom.colorPanel();
    if (!panel || !isOpen(panel)) return;

    const clickedInsidePanel = panel.contains(e.target);
    const clickedToggleBtn = e.target.closest('#colorBtn');
    if (!clickedInsidePanel && !clickedToggleBtn) closeColorPanel();
  });
}

/* ============================================================
   5. HEADER — sombra ao rolar
   ============================================================ */

function bindHeaderScroll() {
  const header = dom.siteHeader();
  if (!header) return;

  let lastY = window.pageYOffset;
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const y = window.pageYOffset;
      header.classList.toggle('scrolled', y > 8);
      // Esconde o header suavemente ao descer muito, mostra ao subir
      if (y > lastY && y > 200) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastY = y;
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   6. NAV INTERNA — destaque de seção ativa
   ============================================================ */

function bindSectionHighlight() {
  const links = document.querySelectorAll('.main-nav a[href^="#"], .side-menu-nav a[href^="#"]');
  if (!links.length) return;

  const sections = Array.from(links)
    .map(link => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return null;
      return document.querySelector(id);
    })
    .filter(Boolean);

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      document.querySelectorAll('.main-nav a[href^="#"]').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === id);
      });
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
}

/* ============================================================
   7. INIT
   ============================================================ */

let initialized = false;

export function initNavigation() {
  if (initialized) return;

  bindSideMenu();
  bindColorPanel();
  bindGlobalDismiss();
  bindHeaderScroll();
  bindSectionHighlight();

  // Estado inicial dos aria-hidden
  setAria(dom.sideMenu(), false);
  setAria(dom.colorPanel(), false);

  initialized = true;
}
