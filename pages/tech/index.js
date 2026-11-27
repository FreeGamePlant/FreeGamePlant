/* ============================================================
   FGP TECHNOLOGIES — index.js
   Ponto de entrada: inicializa os módulos na ordem correta e
   conecta eventos de front-end que cruzam módulos.
   ============================================================ */

import { initNavigation } from './modules/navigation.js';
import { initPersonalization } from './modules/personalization.js';
import { initCatalog } from './modules/catalog.js';
import { initAssistant, openJourney, closeJourney } from './modules/assistant.js';
import { initModals } from './modules/modals.js';
import { CATEGORIES_DB } from './modules/state.js';

/* ============================================================
   1. Helpers locais
   ============================================================ */

function $(id) {
  return document.getElementById(id);
}

function safeCall(label, fn) {
  try {
    if (typeof fn === 'function') fn();
  } catch (err) {
    console.error(`[FGP][index] Erro ao inicializar "${label}":`, err);
  }
}

/* ============================================================
   2. Botões que abrem a jornada
   ============================================================ */

function bindJourneyTriggers() {
  const resetStart = () => openJourney({ reset: true });

  $('heroStartBtn')?.addEventListener('click', resetStart);
  $('sideMenuStartBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    // Fecha o menu lateral se estiver aberto
    $('sideMenu')?.classList.remove('open');
    $('sideOverlay')?.classList.remove('open');
    document.body.classList.remove('menu-open');
    resetStart();
  });

  // Qualquer elemento com [data-open-journey]
  document.querySelectorAll('[data-open-journey]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openJourney({
        reset: el.dataset.reset !== 'false',
        category: el.dataset.category || undefined,
        subcategory: el.dataset.subcategory || undefined
      });
    });
  });
}

/* ============================================================
   3. Fechar jornada com clique fora e tecla ESC
   ============================================================ */

function bindJourneyOverlayDismiss() {
  const modal = $('journeyModal');
  if (!modal) return;

  // Clicar fora do container fecha (mas com confirmação implícita
  // — preserva o estado, então reabrir continua de onde parou)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeJourney();
  });

  // ESC fecha qualquer modal aberto
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    const journey = $('journeyModal');
    if (journey?.classList.contains('open')) {
      closeJourney();
      return;
    }

    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      m.setAttribute('aria-hidden', 'true');
    });
    document.body.classList.remove('modal-open');
  });
}

/* ============================================================
   4. Reveal on scroll (animações suaves das seções)
   ============================================================ */

function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ============================================================
   5. Smooth scroll para âncoras internas
   ============================================================ */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerOffset = 70;
      const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   6. Fallback de imagem com erro (logos, ícones)
   ============================================================ */

function initImageFallbacks() {
  document.querySelectorAll('img[onerror]').forEach(img => {
    // O atributo onerror inline já trata; nada a fazer aqui.
    // Mantido para futuras substituições programáticas.
    img.addEventListener('error', () => {
      img.style.visibility = 'hidden';
    }, { once: true });
  });
}

/* ============================================================
   7. Log de inicialização (dev)
   ============================================================ */

function logBootInfo() {
  const env = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'dev' : 'prod';
  console.info(
    `%c FGP Technologies %c ${env} `,
    'background:#3b82f6;color:#fff;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:700;',
    'background:#06b6d4;color:#0a0e17;padding:2px 6px;border-radius:0 4px 4px 0;font-weight:700;'
  );
  console.info(
    `[FGP] ${CATEGORIES_DB.length} categorias carregadas, ` +
    `${CATEGORIES_DB.reduce((a, c) => a + c.subcategories.length, 0)} serviços disponíveis.`
  );
}

/* ============================================================
   8. BOOT
   ============================================================ */

function boot() {
  // Ordem importa: personalização define as CSS vars antes do restante
  safeCall('Personalization', initPersonalization);
  safeCall('Navigation', initNavigation);
  safeCall('Modals', initModals);
  safeCall('Catalog', initCatalog);
  safeCall('Assistant', initAssistant);

  // Eventos que dependem de múltiplos módulos
  bindJourneyTriggers();
  bindJourneyOverlayDismiss();

  // Melhorias de UI
  initReveal();
  initSmoothScroll();
  initImageFallbacks();

  logBootInfo();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}

/* ============================================================
   9. API global (opcional, para debug)
   ============================================================ */

window.FGP = window.FGP || {};
window.FGP.openJourney = openJourney;
window.FGP.closeJourney = closeJourney;
