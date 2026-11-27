/* ============================================================
   FGP TECHNOLOGIES — personalization.js
   Paletas prontas, color pickers, persistência e reset.
   Aplica CSS variables no :root e sincroniza o painel de cores.

   NÃO cuida de abrir/fechar o painel (isso é navigation.js).
   Apenas escuta mudanças de cor e cliques nos presets.

   EXPORTA:
   - initPersonalization()
   - applyPalette(palette)
   - resetPalette()
   ============================================================ */

import {
  COLOR_STORAGE_KEY,
  DEFAULT_PALETTE,
  COLOR_PRESETS,
  dom
} from './state.js';

/* ============================================================
   1. HELPERS
   ============================================================ */

function $id(id) { return document.getElementById(id); }

function isValidHex(value) {
  return typeof value === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

function normalizeHex(value) {
  if (!isValidHex(value)) return null;
  let v = value.trim().toLowerCase();
  // Expande #abc → #aabbcc
  if (v.length === 4) {
    v = '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3];
  }
  return v;
}

function clampPalette(palette) {
  const safe = { ...DEFAULT_PALETTE };
  if (!palette || typeof palette !== 'object') return safe;

  Object.keys(safe).forEach(key => {
    const n = normalizeHex(palette[key]);
    if (n) safe[key] = n;
  });
  return safe;
}

/* ============================================================
   2. APLICAÇÃO DE CORES
   ============================================================ */

/**
 * Aplica a paleta às CSS variables no :root.
 * Também atualiza as variáveis "soft" e "glow" usadas no tech.css.
 */
export function applyPalette(palette) {
  const p = clampPalette(palette);
  const root = document.documentElement;

  root.style.setProperty('--primary', p.primary);
  root.style.setProperty('--accent', p.accent);
  root.style.setProperty('--bg', p.bg);
  root.style.setProperty('--text', p.text);

  // Derivadas úteis (o tech.css já define fallbacks literais,
  // mas reforçamos para que mudem junto com a paleta)
  root.style.setProperty('--primary-soft', hexToRgba(p.primary, 0.12));
  root.style.setProperty('--accent-soft', hexToRgba(p.accent, 0.12));
  root.style.setProperty('--primary-glow', hexToRgba(p.primary, 0.35));
  root.style.setProperty('--accent-glow', hexToRgba(p.accent, 0.35));

  // Sincroniza os pickers do painel
  const inputs = {
    primary: $id('primaryColor'),
    accent: $id('accentColor'),
    bg: $id('bgColor'),
    text: $id('textColor')
  };
  Object.entries(inputs).forEach(([key, el]) => {
    if (el && el.value !== p[key]) el.value = p[key];
  });

  // Marca preset ativo (se a paleta atual bate com um preset)
  highlightMatchingPreset(p);
}

/**
 * Converte hex #RRGGBB em rgba() com alfa.
 */
function hexToRgba(hex, alpha) {
  const n = normalizeHex(hex) || '#000000';
  const r = parseInt(n.slice(1, 3), 16);
  const g = parseInt(n.slice(3, 5), 16);
  const b = parseInt(n.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ============================================================
   3. PERSISTÊNCIA
   ============================================================ */

function savePalette(palette) {
  try {
    localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(clampPalette(palette)));
  } catch (err) {
    console.warn('[FGP][personalization] Não foi possível salvar a paleta:', err);
  }
}

function loadPalette() {
  try {
    const raw = localStorage.getItem(COLOR_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PALETTE };
    const parsed = JSON.parse(raw);
    return clampPalette(parsed);
  } catch (err) {
    console.warn('[FGP][personalization] Paleta inválida no storage, usando padrão.');
    return { ...DEFAULT_PALETTE };
  }
}

/* ============================================================
   4. PRESETS
   ============================================================ */

function renderPresets() {
  const container = $id('colorPresets');
  if (!container) return;

  container.innerHTML = COLOR_PRESETS.map((preset, index) => `
    <button type="button"
            class="color-preset"
            data-preset-index="${index}"
            title="${escapeAttr(preset.name)}"
            aria-label="Aplicar paleta ${escapeAttr(preset.name)}">
      <span class="preset-dots" aria-hidden="true">
        <span style="background:${preset.palette.primary}"></span>
        <span style="background:${preset.palette.accent}"></span>
        <span style="background:${preset.palette.bg}"></span>
        <span style="background:${preset.palette.text}"></span>
      </span>
      <span class="preset-name">${escapeHtml(preset.name)}</span>
    </button>
  `).join('');

  container.querySelectorAll('.color-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.presetIndex);
      const preset = COLOR_PRESETS[idx];
      if (!preset) return;
      applyPalette(preset.palette);
      savePalette(preset.palette);
    });
  });
}

function highlightMatchingPreset(current) {
  const container = $id('colorPresets');
  if (!container) return;

  container.querySelectorAll('.color-preset').forEach(btn => {
    const idx = Number(btn.dataset.presetIndex);
    const preset = COLOR_PRESETS[idx];
    if (!preset) return;
    const match =
      preset.palette.primary.toLowerCase() === current.primary &&
      preset.palette.accent.toLowerCase() === current.accent &&
      preset.palette.bg.toLowerCase() === current.bg &&
      preset.palette.text.toLowerCase() === current.text;
    btn.classList.toggle('active', match);
  });
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function escapeAttr(s) { return escapeHtml(s); }

/* ============================================================
   5. COLOR PICKERS INDIVIDUAIS
   ============================================================ */

function bindIndividualPickers() {
  const map = {
    primaryColor: 'primary',
    accentColor: 'accent',
    bgColor: 'bg',
    textColor: 'text'
  };

  Object.entries(map).forEach(([id, key]) => {
    const el = $id(id);
    if (!el) return;

    // 'input' dispara em tempo real enquanto arrasta; 'change' ao soltar
    const handle = () => {
      const value = normalizeHex(el.value);
      if (!value) return;

      const current = loadPalette();
      current[key] = value;
      applyPalette(current);
      savePalette(current);
    };

    el.addEventListener('input', handle);
    el.addEventListener('change', handle);
  });
}

/* ============================================================
   6. RESET
   ============================================================ */

export function resetPalette() {
  applyPalette(DEFAULT_PALETTE);
  savePalette(DEFAULT_PALETTE);

  // Feedback rápido no botão
  const btn = $id('resetColors');
  if (btn) {
    btn.classList.add('reset-feedback');
    setTimeout(() => btn.classList.remove('reset-feedback'), 900);
  }
}

function bindReset() {
  $id('resetColors')?.addEventListener('click', resetPalette);
}

/* ============================================================
   7. ESTILOS AUXILIARES (presets + header)
   ------------------------------------------------------------
   Injetados uma única vez. Se preferir manter tudo no tech.css,
   remova este bloco e mova as regras para lá.
   ============================================================ */

function injectAuxStyles() {
  if ($id('fgp-personalization-styles')) return;

  const style = document.createElement('style');
  style.id = 'fgp-personalization-styles';
  style.textContent = `
    /* Presets no painel de cores */
    .color-preset {
      display: flex; flex-direction: column; gap: 6px;
      padding: 8px; border-radius: 10px;
      background: var(--surface-2);
      border: 1px solid var(--border);
      color: var(--text);
      cursor: pointer;
      transition: border-color 0.2s ease, transform 0.2s ease;
      font-size: 0.72rem;
      text-align: left;
    }
    .color-preset:hover { border-color: var(--primary); }
    .color-preset.active {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-soft);
    }
    .preset-dots {
      display: flex; gap: 3px;
    }
    .preset-dots > span {
      width: 14px; height: 14px; border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .preset-name {
      font-weight: 600; letter-spacing: 0.02em;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    /* Header scrolled / hidden (usados por navigation.js) */
    .site-header.scrolled { box-shadow: 0 4px 18px rgba(0,0,0,0.28); }
    .site-header.header-hidden { transform: translateY(-100%); }
    .site-header { transition: transform 0.28s ease, box-shadow 0.28s ease; }
    .main-nav a.active { color: var(--primary); font-weight: 600; }

    /* Feedback de reset */
    .reset-btn.reset-feedback {
      border-color: var(--success);
      color: var(--success);
    }
  `;
  document.head.appendChild(style);
}

/* ============================================================
   8. INIT
   ============================================================ */

let initialized = false;

export function initPersonalization() {
  if (initialized) return;

  injectAuxStyles();
  renderPresets();
  bindIndividualPickers();
  bindReset();

  // Carrega a paleta salva (ou o padrão) e aplica
  const initial = loadPalette();
  applyPalette(initial);

  // Se o usuário tem uma paleta salva diferente do padrão,
  // garante que ela seja persistida no formato canônico
  savePalette(initial);

  initialized = true;
}
