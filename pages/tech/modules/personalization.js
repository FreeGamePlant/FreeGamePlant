/* ============================================================
PERSONALIZAÇÃO DE CORES
============================================================ */
import { COLOR_STORAGE_KEY, DEFAULT_PALETTE, COLOR_PRESETS, dom } from './state.js';

export function initPersonalization() {
    setupColorPanel();
    applyPalette(loadPalette());
}

function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
        r: parseInt(h.substr(0, 2), 16),
        g: parseInt(h.substr(2, 2), 16),
        b: parseInt(h.substr(4, 2), 16)
    };
}

function mixHex(a, b, t) {
    const A = hexToRgb(a);
    const B = hexToRgb(b);
    const r = Math.round(A.r + (B.r - A.r) * t);
    const g = Math.round(A.g + (B.g - A.g) * t);
    const bl = Math.round(A.b + (B.b - A.b) * t);
    return `rgb(${r}, ${g}, ${bl})`;
}

export function applyPalette(p) {
    const root = document.documentElement;
    root.style.setProperty('--primary', p.primary);
    root.style.setProperty('--accent', p.accent);
    root.style.setProperty('--bg', p.bg);
    root.style.setProperty('--text', p.text);
    root.style.setProperty('--surface', mixHex(p.bg, p.text, 0.06));
    root.style.setProperty('--surface-strong', mixHex(p.bg, p.text, 0.10));
    root.style.setProperty('--border', mixHex(p.bg, p.text, 0.16));
    root.style.setProperty('--text-muted', mixHex(p.text, p.bg, 0.42));

    const $p = document.getElementById('primaryColor');
    const $a = document.getElementById('accentColor');
    const $b = document.getElementById('bgColor');
    const $t = document.getElementById('textColor');
    if ($p) $p.value = p.primary;
    if ($a) $a.value = p.accent;
    if ($b) $b.value = p.bg;
    if ($t) $t.value = p.text;
}

function savePalette(p) {
    try { localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(p)); } catch (_) {}
}

function loadPalette() {
    try {
        const raw = localStorage.getItem(COLOR_STORAGE_KEY);
        return raw ? { ...DEFAULT_PALETTE, ...JSON.parse(raw) } : { ...DEFAULT_PALETTE };
    } catch (_) {
        return { ...DEFAULT_PALETTE };
    }
}

function setupColorPanel() {
    const panel = dom.colorPanel();
    const overlay = dom.sideOverlay();
    const openBtn = document.getElementById('colorBtn');
    const closeBtn = document.getElementById('closeColorBtn');
    const resetBtn = document.getElementById('resetColors');
    const presetsBox = document.getElementById('colorPresets');

    if (!panel || !openBtn) return;

    COLOR_PRESETS.forEach(preset => {
        const btn = document.createElement('button');
        btn.className = 'preset-btn';
        btn.type = 'button';
        btn.innerHTML = `<div class="dots"><span style="background:${preset.palette.primary}"></span><span style="background:${preset.palette.accent}"></span><span style="background:${preset.palette.bg};border:1px solid #666"></span></div> ${preset.name}`;
        btn.addEventListener('click', () => {
            applyPalette(preset.palette);
            savePalette(preset.palette);
        });
        presetsBox.appendChild(btn);
    });

    openBtn.addEventListener('click', () => {
        panel.classList.add('open');
        overlay.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.remove('open');
        if (!dom.sideMenu().classList.contains('open')) overlay.classList.remove('open');
    });

    ['primaryColor', 'accentColor', 'bgColor', 'textColor'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', () => {
            const p = {
                primary: document.getElementById('primaryColor').value,
                accent: document.getElementById('accentColor').value,
                bg: document.getElementById('bgColor').value,
                text: document.getElementById('textColor').value
            };
            applyPalette(p);
            savePalette(p);
        });
    });

    resetBtn?.addEventListener('click', () => {
        applyPalette(DEFAULT_PALETTE);
        savePalette(DEFAULT_PALETTE);
    });
}
