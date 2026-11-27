/* ============================================================
   FGP TECHNOLOGIES — utils.js
   Helpers compartilhados: foco/aria, telefone internacional,
   armazenamento seguro e utilitários genéricos.

   Mantido deliberadamente sem dependências para ser importável
   por qualquer módulo (assistant, navigation, modals, catalog).
   ============================================================ */

/* ============================================================
   1. HELPERS GENÉRICOS
   ============================================================ */

export function $id(id) {
  return document.getElementById(id);
}

export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export function formatFileSize(bytes) {
  if (!bytes || bytes < 1024) return `${bytes || 0} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function debounce(fn, delay = 250) {
  let timer = null;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ============================================================
   2. ARIA + FOCO SEGURO
   ------------------------------------------------------------
   Corrige o warning:
   "Blocked aria-hidden on an element because its descendant
    retained focus."

   Estratégia:
   - Ao esconder: se o foco está dentro, move para fora
     (fallback ou blur), aplica `inert` e só então `aria-hidden`.
   - Ao mostrar: remove `inert`, seta `aria-hidden="false"` e
     opcionalmente foca o primeiro elemento focável.
   ============================================================ */

export function hideSafely(el, options = {}) {
  if (!el) return;
  const { focusFallback = null } = options;

  // 1) Move o foco para fora ANTES de esconder
  const active = document.activeElement;
  if (active && el.contains(active)) {
    if (focusFallback && typeof focusFallback.focus === 'function') {
      try { focusFallback.focus(); } catch (_) {}
    } else if (typeof active.blur === 'function') {
      active.blur();
    }
  }

  // 2) Aplica inert (bloqueia foco e AT de uma vez)
  try { el.inert = true; } catch (_) {}
  el.setAttribute('inert', '');

  // 3) Só agora aplica aria-hidden
  el.setAttribute('aria-hidden', 'true');
}

export function showSafely(el, options = {}) {
  if (!el) return;
  const { focusFirst = false } = options;

  // 1) Remove inert — attribute E property, na ordem certa.
  //    removeAttribute primeiro é mais confiável porque alguns
  //    navegadores tratam `el.inert = false` de forma assíncrona.
  el.removeAttribute('inert');
  try { el.inert = false; } catch (_) {}

  // 2) Expõe para AT
  el.setAttribute('aria-hidden', 'false');

  // 3) Fallback de interatividade — se algo externo tiver
  //    setado pointer-events inline, limpamos.
  if (el.style.pointerEvents === 'none') {
    el.style.pointerEvents = '';
  }

  // 4) Foco opcional
  if (focusFirst) {
    requestAnimationFrame(() => {
      const first = el.querySelector(
        'input:not([type="hidden"]):not([disabled]), ' +
        'select:not([disabled]), ' +
        'textarea:not([disabled]), ' +
        'button:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])'
      );
      if (first && typeof first.focus === 'function') {
        try { first.focus({ preventScroll: true }); } catch (_) {}
      }
    });
  }
}

/* ============================================================
   3. TELEFONE INTERNACIONAL
   ------------------------------------------------------------
   - O usuário digita apenas dígitos.
   - Um <select> de país define o código (+xx).
   - O input mostra o número nacional formatado.
   - O valor final composto é: "+xx (11) 98765-4321"
   ============================================================ */

/**
 * Lista de países suportados.
 * `nationalDigits` limita quantos dígitos o número nacional pode ter.
 * `example` é usado como placeholder.
 */
export const PHONE_COUNTRIES = [
  { code: '55',  iso: 'BR', flag: '🇧🇷', name: 'Brasil',         nationalDigits: 11, example: '(11) 98765-4321' },
  { code: '1',   iso: 'US', flag: '🇺🇸', name: 'EUA/Canadá',     nationalDigits: 10, example: '(555) 123-4567' },
  { code: '351', iso: 'PT', flag: '🇵🇹', name: 'Portugal',       nationalDigits: 9,  example: '912 345 678' },
  { code: '54',  iso: 'AR', flag: '🇦🇷', name: 'Argentina',      nationalDigits: 10, example: '11 2345-6789' },
  { code: '56',  iso: 'CL', flag: '🇨🇱', name: 'Chile',          nationalDigits: 9,  example: '9 1234 5678' },
  { code: '57',  iso: 'CO', flag: '🇨🇴', name: 'Colômbia',       nationalDigits: 10, example: '312 345 6789' },
  { code: '52',  iso: 'MX', flag: '🇲🇽', name: 'México',         nationalDigits: 10, example: '55 1234 5678' },
  { code: '44',  iso: 'GB', flag: '🇬🇧', name: 'Reino Unido',    nationalDigits: 10, example: '7400 123456' },
  { code: '49',  iso: 'DE', flag: '🇩🇪', name: 'Alemanha',       nationalDigits: 11, example: '1512 3456789' },
  { code: '33',  iso: 'FR', flag: '🇫🇷', name: 'França',         nationalDigits: 9,  example: '6 12 34 56 78' },
  { code: '34',  iso: 'ES', flag: '🇪🇸', name: 'Espanha',        nationalDigits: 9,  example: '612 34 56 78' },
  { code: '39',  iso: 'IT', flag: '🇮🇹', name: 'Itália',         nationalDigits: 10, example: '312 345 6789' },
  { code: '81',  iso: 'JP', flag: '🇯🇵', name: 'Japão',          nationalDigits: 10, example: '90 1234 5678' },
  { code: '86',  iso: 'CN', flag: '🇨🇳', name: 'China',          nationalDigits: 11, example: '131 2345 6789' },
  { code: '91',  iso: 'IN', flag: '🇮🇳', name: 'Índia',          nationalDigits: 10, example: '98765 43210' },
  { code: '61',  iso: 'AU', flag: '🇦🇺', name: 'Austrália',      nationalDigits: 9,  example: '412 345 678' }
];

export function getCountryByCode(code) {
  return PHONE_COUNTRIES.find(c => c.code === String(code)) || PHONE_COUNTRIES[0];
}

/** Extrai apenas dígitos de qualquer string. */
export function extractDigits(str) {
  return String(str || '').replace(/\D/g, '');
}

/* ---- Formatadores por país ---- */

function formatBR(digits) {
  if (!digits) return '';
  if (digits.length < 3) return digits;
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length === 0) return `(${ddd}`;
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5, 9)}`;
}

function formatUS(digits) {
  if (!digits) return '';
  if (digits.length < 4) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function formatPT(digits) {
  if (!digits) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
}

function formatGeneric(digits) {
  if (!digits) return '';
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
}

const COUNTRY_FORMATTERS = {
  '55': formatBR,
  '1': formatUS,
  '351': formatPT
};

/**
 * Formata o número nacional de acordo com o país.
 * Retorna APENAS o número formatado (sem o código do país).
 */
export function formatPhone(nationalDigits, countryCode) {
  const country = getCountryByCode(countryCode);
  const digits = extractDigits(nationalDigits).slice(0, country.nationalDigits);
  if (!digits) return '';
  const formatter = COUNTRY_FORMATTERS[country.code] || formatGeneric;
  return formatter(digits);
}

/**
 * Monta o valor final completo: "+55 (11) 98765-4321".
 * Se o número estiver vazio, retorna apenas "+55".
 */
export function composePhone(nationalDigits, countryCode) {
  const country = getCountryByCode(countryCode);
  const formatted = formatPhone(nationalDigits, countryCode);
  return formatted ? `+${country.code} ${formatted}` : `+${country.code}`;
}

/**
 * Separa um valor composto de volta em { countryCode, nationalDigits }.
 * Aceita strings como "+55 (11) 98765-4321" ou "5511987654321".
 */
export function parsePhone(value) {
  const allDigits = extractDigits(value);
  if (!allDigits) return { countryCode: '55', nationalDigits: '' };

  // Tenta casar com um código de país (mais longo primeiro)
  const sorted = [...PHONE_COUNTRIES].sort((a, b) => b.code.length - a.code.length);
  for (const c of sorted) {
    if (allDigits.startsWith(c.code)) {
      return {
        countryCode: c.code,
        nationalDigits: allDigits.slice(c.code.length, c.code.length + c.nationalDigits)
      };
    }
  }
  // Fallback: assume Brasil
  return {
    countryCode: '55',
    nationalDigits: allDigits.slice(0, 11)
  };
}

/* ============================================================
   4. ARMAZENAMENTO SEGURO
   ------------------------------------------------------------
   localStorage pode falhar (modo privado, cota cheia, etc.),
   então sempre encapsulamos em try/catch.
   ============================================================ */

export const JOURNEY_DRAFT_KEY = 'fgp_tech_journey_draft';

export function safeGetJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`[FGP][utils] Falha ao ler "${key}":`, err);
    return fallback;
  }
}

export function safeSetJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[FGP][utils] Falha ao salvar "${key}":`, err);
    return false;
  }
}

export function safeRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (_) {
    return false;
  }
}

/* ============================================================
   5. VALIDAÇÃO DE ARQUIVO
   ============================================================ */

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_FILE_MIME = ['image/jpeg', 'image/png', 'image/webp'];

export function validateFile(file) {
  if (!file) return { ok: false, error: 'Nenhum arquivo selecionado.' };
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: `Arquivo muito grande (${formatFileSize(file.size)}). Máximo: 5 MB.` };
  }
  if (!ACCEPTED_FILE_MIME.includes(file.type)) {
    return { ok: false, error: 'Formato inválido. Envie JPEG, PNG ou WebP.' };
  }
  return { ok: true };
}
