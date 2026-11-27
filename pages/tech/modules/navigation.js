/* ============================================================
   FGP TECHNOLOGIES — navigation.js
   Menu lateral (hamburguer), painel de cores (toggle), header
   com estado scrolled/hidden e destaque de seção ativa.

   A11y: usa hideSafely/showSafely (utils.js) para mover o foco
   antes de aplicar aria-hidden + inert, eliminando o warning
   "Blocked aria-hidden on an element because its descendant
   retained focus".

   EXPORTA:
   - initNavigation()
   - openSideMenu() / closeSideMenu() / toggleSideMenu()
   - openColorPanel() / closeColorPanel() / toggleColorPanel()
   ============================================================ */

import { dom } from './state.js';
import { hideSafely, showSafely } from './utils.js';

/* ============================================================
   1. HELPERS
   ============================================================ */

function $id(id) {
  return document.getElementById(id);
}

function isOpen(el) {
  return !!el && el.classList.contains('open');
}

/**
 * Verifica se algum outro overlay com foco está aberto.
 * Usado para não remover o body-lock cedo demais.
 */
function hasAnyOpenOverlay() {
  return Boolean(document.querySelector(
    '.side-menu.open, .color-panel.open, .modal-overlay.open, .journey-modal-overlay.open'
  ));
}

/**
 * Remove o lock do body apenas quando nenhum overlay
 * (menu, painel, modal, jornada) está aberto.
 */
function releaseBodyLockIfClear() {
  if (!hasAnyOpenOverlay()) {
    document.body.classList.remove('menu-open', 'modal-open');
  }
}

/* ============================================================
   2. SIDE MENU
   ============================================================ */

export function openSideMenu() {
  const menu = dom.sideMenu();
  const overlay = dom.sideOverlay();
  const trigger = $id('hamburgerBtn');
  if (!menu) return;

  // Fecha o color panel se estiver aberto (evita sobreposição)
  if (isOpen(dom.colorPanel())) closeColorPanel();

  menu.classList.add('open');
  overlay?.classList.add('open');
  document.body.classList.add('menu-open');

  // Remove inert + aria-hidden="false" (na ordem correta do showSafely)
  showSafely(menu, { focusFirst: false });

  // Foca o primeiro link do menu (boa prática a11y para diálogos)
  requestAnimationFrame(() => {
    const firstLink = menu.querySelector('.side-menu-nav a, .side-menu-nav button');
    if (firstLink) firstLink.focus({ preventScroll: true });
  });

  // Guarda a referência ao trigger para o foco de retorno
  menu._focusReturn = trigger || null;
}

export function closeSideMenu() {
  const menu = dom.sideMenu();
  const overlay = dom.sideOverlay();
  if (!menu) return;

  // Move o foco para o botão que abriu (ou para o hamburguer)
  const focusFallback = menu._focusReturn || $id('hamburgerBtn');

  menu.classList.remove('open');
  overlay?.classList.remove('open');

  // hideSafely move o foco, aplica inert e depois aria-hidden
  hideSafely(menu, { focusFallback });

  releaseBodyLockIfClear();
  menu._focusReturn = null;
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

  // Fechar ao clicar em um link de navegação do menu lateral.
  // Exceção: #sideMenuStartBtn (o index.js abre a jornada e cuida do fechamento).
  dom.sideMenu()?.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', () => {
      if (link.id === 'sideMenuStartBtn') return;
      // Pequeno delay para o smooth scroll começar antes de fechar
      setTimeout(closeSideMenu, 60);
    });
  });
}

/* ============================================================
   3. COLOR PANEL
   ============================================================ */

export function openColorPanel() {
  const panel = dom.colorPanel();
  const trigger = $id('colorBtn');
  if (!panel) return;

  // Fecha o side menu se estiver aberto (evita sobreposição)
  if (isOpen(dom.sideMenu())) closeSideMenu();

  panel.classList.add('open');
  document.body.classList.add('menu-open');

  showSafely(panel, { focusFirst: false });

  // Foca o primeiro controle de cor
  requestAnimationFrame(() => {
    const firstControl = panel.querySelector('input[type="color"], button');
    if (firstControl) firstControl.focus({ preventScroll: true });
  });

  panel._focusReturn = trigger || null;
}

export function closeColorPanel() {
  const panel = dom.colorPanel();
  if (!panel) return;

  const focusFallback = panel._focusReturn || $id('colorBtn');

  panel.classList.remove('open');
  hideSafely(panel, { focusFallback });

  releaseBodyLockIfClear();
  panel._focusReturn = null;
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
   4. FECHAR PAINÉIS — ESC E CLIQUE FORA
   ============================================================ */

function bindGlobalDismiss() {
  // ESC — ordem de prioridade dos overlays
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    // O assistant.js e o modals.js já tratam ESC dos seus modais.
    // Aqui só cuidamos de side menu e color panel.
    if (isOpen(dom.journeyModal())) return;
    if (isOpen(dom.requestModal()) || isOpen(dom.accessosModal())) return;

    if (isOpen(dom.colorPanel())) {
      closeColorPanel();
      return;
    }
    if (isOpen(dom.sideMenu())) {
      closeSideMenu();
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

  // Clique fora do side menu fecha
  document.addEventListener('click', (e) => {
    const menu = dom.sideMenu();
    if (!menu || !isOpen(menu)) return;

    const clickedInsideMenu = menu.contains(e.target);
    const clickedToggleBtn = e.target.closest('#hamburgerBtn');
    const clickedOverlay = e.target === dom.sideOverlay();

    // O overlay já tem listener próprio; aqui cobrimos cliques
    // no restante do documento.
    if (!clickedInsideMenu && !clickedToggleBtn && !clickedOverlay) {
      closeSideMenu();
    }
  });
}

/* ============================================================
   5. HEADER — sombra + esconder ao rolar
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

      // Esconde ao descer além de 200px; mostra ao subir
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
  const links = document.querySelectorAll(
    '.main-nav a[href^="#"], .side-menu-nav a[href^="#"]'
  );
  if (!links.length) return;

  const sections = Array.from(links)
    .map(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return null;
      return document.querySelector(href);
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

  // Estado inicial: garante aria-hidden="true" + inert nos painéis fechados
  // (o HTML já traz isso, mas reforçamos em caso de re-render)
  const sideMenu = dom.sideMenu();
  const colorPanel = dom.colorPanel();
  if (sideMenu && !sideMenu.classList.contains('open')) {
    hideSafely(sideMenu);
  }
  if (colorPanel && !colorPanel.classList.contains('open')) {
    hideSafely(colorPanel);
  }

  initialized = true;
}
