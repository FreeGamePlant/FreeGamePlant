//<script>
    /* ============================================================
       1. DADOS DOS JOGOS — preservados do código original
       ============================================================ */
    const GAMES_DB = [
      {
        id: "siu2d",
        title: "SIU2D",
        description: "Simulador do Universo em Cartoon 2D. Explore planetas, estrelas e galáxias num sandbox espacial educativo. Mais de 10 idiomas!",
        icon: "../src/assets/images/SIU2D.jpg",
        cover: "../src/assets/images/SIU2D.jpg",
        status: "available",
        downloads: "~100",
        stars: "Estrelas:⭐⭐⭐⭐⭐",
        platforms: ["android", "windows"],
        releaseDate: "25 de junho de 2025",
        genre: "Sandbox / Educacional / Simulação",
        dev: "Elai Leonel Figueroa - Free Game Plant",
        downloadsList: [
          { name: "Android APK - Play Store", icon: "fab fa-google-play",
            url: "https://play.google.com/store/apps/details?id=com.freegameplant.siu2d&hl=pt_BR", type: "external" },
          { name: "Windows EXE (MediaFire)", icon: "fab fa-windows",
            url: "https://www.mediafire.com/file/lzluc7gav5a1tnq/siu2d.exe/file", size: "164MB" },
          { name: "itch.io", icon: "fas fa-gamepad",
            url: "https://freegameplant.itch.io/siu2d-simulador-ofthe-incredible-universe", type: "external" },
          { name: "Game Jolt", icon: "fas fa-bolt",
            url: "https://gamejolt.com/games/siu2d/1047341", type: "external" }
        ]
      },
      {
        id: "chess",
        title: "Chess RPG",
        description: "RPG de xadrez! Evolua suas peças, desbloqueie skins e domine o tabuleiro em batalhas épicas. Cada peça é um herói.",
        icon: "../src/assets/images/Chess.jpg",
        cover: "../src/assets/images/Chess.jpg",
        status: "soon",
        stars: "Estrelas: Em Breve...",
        platforms: ["android", "windows"],
        genre: "RPG / Estratégia",
        dev: "Elai Leonel Figueroa - Free Game Plant",
        downloadsList: []
      },
      {
        id: "atoms",
        title: "The Life of Atoms",
        description: "Simulador de átomos cartoon 2D. Entenda a matéria de forma divertida.",
        icon: "../src/assets/images/atoms.jpg",
        cover: "../src/assets/images/atoms.jpg",
        status: "available",
        downloads: "~10",
        stars: "Estrelas:⭐⭐⭐⭐⭐",
        platforms: ["android", "windows"],
        releaseDate: "15 de novembro de 2025",
        genre: "Educacional / Simulação / História / Aventura",
        dev: "Elai Leonel Figueroa - Free Game Plant",
        downloadsList: [
          { name: "Acesso Antecipado! - Play Store", icon: "fab fa-google-play",
            url: "mailto:freegameplantplaystory@gmail.com?subject=Ajuda com SIU2D&body=Olá,%20não%20encontrei%20o%20jogo%20na%20Play%20Store.",
            type: "external" },
          { name: "Android APK - Play Store", icon: "fab fa-google-play",
            url: "https://play.google.com/store/apps/details?id=com.freegameplant.tloa&hl=pt_BR", type: "external" },
          { name: "Windows EXE (MediaFire)", icon: "fab fa-windows",
            url: "https://www.mediafire.com/file/egyc22ad3fgalax/TLOA.exe/file", size: "164MB" },
          { name: "itch.io", icon: "fas fa-gamepad",
            url: "https://freegameplant.itch.io/the-life-of-atoms", type: "external" },
          { name: "Game Jolt", icon: "fas fa-bolt",
            url: "https://gamejolt.com/games/tloa/1073210", type: "external" }
        ]
      },
      {
        id: "ovynay",
        title: "Ovynay: The Red Dust",
        description: "Em breve..",
        icon: "../src/assets/images/Ovynay the time traveler.png",
        cover: "../src/assets/images/Ovynay the time traveler.png",
        status: "soon",
        stars: "Estrelas: Em Breve...",
        platforms: ["windows"],
        genre: "Em Breve..",
        dev: "Elai Leonel Figueroa - Free Game Plant",
        downloadsList: []
      }
    ];

    /* ============================================================
       2. SISTEMA DE CORES (localStorage)
       ============================================================ */
    const COLOR_STORAGE_KEY = 'fgp_store_palette';

    const DEFAULT_PALETTE = {
      primary: '#22c55e',
      accent:  '#f97316',
      bg:      '#0a0e17',
      text:    '#f1f5f9'
    };

    const COLOR_PRESETS = [
      { name: 'FGP Store',  palette: { primary: '#22c55e', accent: '#f97316', bg: '#0a0e17', text: '#f1f5f9' } },
      { name: 'Arcade',     palette: { primary: '#ef4444', accent: '#facc15', bg: '#0f0a0a', text: '#fef2f2' } },
      { name: 'Roxo Neon',  palette: { primary: '#a855f7', accent: '#ec4899', bg: '#0f0a1e', text: '#f5f3ff' } },
      { name: 'Claro',      palette: { primary: '#16a34a', accent: '#ea580c', bg: '#f8fafc', text: '#0f172a' } }
    ];

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

    function applyPalette(p) {
      const root = document.documentElement;
      root.style.setProperty('--primary', p.primary);
      root.style.setProperty('--accent', p.accent);
      root.style.setProperty('--bg', p.bg);
      root.style.setProperty('--text', p.text);

      root.style.setProperty('--surface',        mixHex(p.bg, p.text, 0.06));
      root.style.setProperty('--surface-strong', mixHex(p.bg, p.text, 0.10));
      root.style.setProperty('--border',         mixHex(p.bg, p.text, 0.16));
      root.style.setProperty('--text-muted',     mixHex(p.text, p.bg, 0.42));

      const $p = document.getElementById('primaryColor');
      const $a = document.getElementById('accentColor');
      const $b = document.getElementById('bgColor');
      const $t = document.getElementById('textColor');
      if ($p) $p.value = p.primary;
      if ($a) $a.value = p.accent;
      if ($b) $b.value = p.bg;
      if ($t) $t.value = p.text;

      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', p.bg);
    }

    function savePalette(p) {
      try { localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(p)); } catch (_) {}
    }

    function loadPalette() {
      try {
        const raw = localStorage.getItem(COLOR_STORAGE_KEY);
        if (!raw) return { ...DEFAULT_PALETTE };
        return { ...DEFAULT_PALETTE, ...JSON.parse(raw) };
      } catch (_) { return { ...DEFAULT_PALETTE }; }
    }

    /* ============================================================
       3. VIEW SWITCHER
       ============================================================ */
    function showView(name) {
      // Oculta todas
      document.querySelectorAll('.store-view').forEach(v => v.classList.add('hidden'));
      // Mostra a alvo
      const target = document.getElementById(name + '-view');
      if (target) {
        target.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // Atualiza nav ativo
      document.querySelectorAll('.main-nav a').forEach(a => {
        if (a.dataset.view === name) a.classList.add('active');
        else a.classList.remove('active');
      });
      // Fecha menus
      closeSideMenu();
    }

    // Delegação global — qualquer [data-view] troca de view
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-view]');
      if (el) {
        e.preventDefault();
        showView(el.dataset.view);
      }
    });

    /* ============================================================
       4. RENDERIZAÇÃO DE JOGOS
       ============================================================ */
    let activeFilter = "all";
    let searchTerm = "";

    function renderGames() {
      const container = document.getElementById("gamesGrid");
      if (!container) return;

      const filtered = GAMES_DB.filter(game => {
        const matchesFilter =
          activeFilter === "all" ||
          (activeFilter === "available" && game.status === "available") ||
          (activeFilter === "soon" && game.status === "soon") ||
          (activeFilter === "android" && game.platforms.includes("android")) ||
          (activeFilter === "windows" && game.platforms.includes("windows"));

        const matchesSearch =
          game.title.toLowerCase().includes(searchTerm) ||
          game.description.toLowerCase().includes(searchTerm);

        return matchesFilter && matchesSearch;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-box-open"></i>
            <h3>Nenhum jogo encontrado</h3>
            <p>Tente ajustar a busca ou os filtros.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map((game, idx) => `
        <div class="game-card" data-game-id="${game.id}" style="animation: fadeUp 0.4s ${idx * 0.05}s ease both;">
          <div class="card-media">
            <img src="${game.icon}" alt="${game.title}" loading="lazy" onerror="this.style.opacity='0'" />
            ${game.status === "soon"
              ? '<div class="card-badge soon"><i class="fas fa-clock"></i> Em breve</div>'
              : '<div class="card-badge"><i class="fas fa-check-circle"></i> Disponível</div>'}
          </div>
          <div class="card-content">
            <h3 class="game-title">${game.title}</h3>
            <div class="game-meta">
              <span><i class="fas fa-tag"></i> ${game.genre || "Indie"}</span>
              <span><i class="fas fa-calendar"></i> ${game.releaseDate || "Em breve"}</span>
            </div>
            <div class="game-stats">
              <span><i class="fas fa-download"></i> ${game.downloads || "0"} DLs</span>
              <span><i class="fas fa-star"></i> ${game.stars || ""}</span>
            </div>
            <button class="btn-primary open-modal" data-id="${game.id}">
              <i class="fas ${game.status === "available" ? "fa-download" : "fa-eye"}"></i>
              ${game.status === "available" ? "ACESSAR JOGO" : "SAIBA MAIS"}
            </button>
            <div class="ad-tag"><i class="fas fa-ad"></i> Anúncios + compras internas</div>
          </div>
        </div>
      `).join("");

      container.querySelectorAll(".open-modal").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          openGameModal(btn.dataset.id);
        });
      });
    }

    /* ============================================================
       5. MODAL DO JOGO
       ============================================================ */
    function openGameModal(gameId) {
      const game = GAMES_DB.find(g => g.id === gameId);
      if (!game) return;

      const existing = document.getElementById("gameModal");
      if (existing) existing.remove();

      const hasDownloads = game.downloadsList && game.downloadsList.length > 0 && game.status !== "soon";

      const downloadsHtml = hasDownloads ? `
        <h3 style="margin: 20px 0 10px; font-size:1rem;"><i class="fas fa-download" style="color:var(--primary);margin-right:6px;"></i> Plataformas disponíveis</h3>
        <div class="download-grid">
          ${game.downloadsList.map(dl => {
            const isMailto = dl.url && dl.url.startsWith("mailto:");
            const target = isMailto ? "" : 'target="_blank" rel="noopener noreferrer"';
            return `
              <div class="download-item">
                <i class="${dl.icon} fa-2x"></i>
                <div class="download-item-info">
                  <strong>${dl.name}</strong>
                  ${dl.size ? `<small>${dl.size}</small>` : ""}
                </div>
                <a href="${dl.url}" ${target} class="btn-download-link">Baixar →</a>
              </div>
            `;
          }).join("")}
        </div>
      ` : `
        <div class="modal-soon">
          <i class="fas fa-hourglass-half"></i>
          <p>Este jogo estará disponível em breve. Fique ligado!</p>
        </div>
      `;

      const modal = document.createElement("div");
      modal.className = "modal-overlay open";
      modal.id = "gameModal";
      modal.innerHTML = `
        <div class="modal-container">
          <button class="modal-close" id="closeModalBtn" aria-label="Fechar">&times;</button>
          <div class="modal-header">
            <img src="${game.icon}" alt="${game.title}" class="modal-icon" onerror="this.style.opacity='0'" />
            <div>
              <h2 class="modal-title">${game.title}</h2>
              <p class="modal-dev"><i class="fas fa-code-branch"></i> ${game.dev}</p>
              <div class="ad-tag"><i class="fas fa-ad"></i> Anúncios + compras internas</div>
            </div>
          </div>
          <div class="modal-body">
            <p class="modal-desc">${game.description}</p>
            <div class="modal-info-row">
              <span><i class="fas fa-gamepad"></i> Gênero: ${game.genre}</span>
              <span><i class="fas fa-laptop"></i> Plataformas: ${game.platforms.map(p => p === "android" ? "Android" : "Windows").join(", ")}</span>
            </div>
            ${downloadsHtml}
            <div class="modal-help">
              <i class="fas fa-envelope"></i> Precisa de ajuda?
              <a href="mailto:freegameplantplaystory@gmail.com">Contate o suporte</a>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.style.overflow = "hidden";

      const closeBtn = modal.querySelector("#closeModalBtn");
      closeBtn.addEventListener("click", () => {
        modal.remove();
        document.body.style.overflow = "";
      });
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.remove();
          document.body.style.overflow = "";
        }
      });
    }

    /* ============================================================
       6. FILTROS + BUSCA
       ============================================================ */
    function setupFilters() {
      const filterBtns = document.querySelectorAll(".filter-btn");
      filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          filterBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          activeFilter = btn.dataset.filter;
          renderGames();
        });
      });

      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          searchTerm = e.target.value.toLowerCase();
          renderGames();
        });
      }
    }

    /* ============================================================
       7. PAINEL DE CORES
       ============================================================ */
    function setupColorPanel() {
      const panel = document.getElementById('colorPanel');
      const overlay = document.getElementById('sideOverlay');
      const openBtn = document.getElementById('colorBtn');
      const closeBtn = document.getElementById('closeColorBtn');
      const resetBtn = document.getElementById('resetColors');
      const presetsBox = document.getElementById('colorPresets');

      const inputPrimary = document.getElementById('primaryColor');
      const inputAccent = document.getElementById('accentColor');
      const inputBg = document.getElementById('bgColor');
      const inputText = document.getElementById('textColor');

      COLOR_PRESETS.forEach(preset => {
        const btn = document.createElement('button');
        btn.className = 'preset-btn';
        btn.type = 'button';
        btn.innerHTML = `
          <div class="dots">
            <span style="background:${preset.palette.primary}"></span>
            <span style="background:${preset.palette.accent}"></span>
            <span style="background:${preset.palette.bg};border:1px solid #666"></span>
          </div>
          ${preset.name}
        `;
        btn.addEventListener('click', () => {
          applyPalette(preset.palette);
          savePalette(preset.palette);
        });
        presetsBox.appendChild(btn);
      });

      applyPalette(loadPalette());

      openBtn.addEventListener('click', () => {
        panel.classList.add('open');
        overlay.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
      });

      function closePanel() {
        panel.classList.remove('open');
        if (!document.getElementById('sideMenu').classList.contains('open')) {
          overlay.classList.remove('open');
        }
        panel.setAttribute('aria-hidden', 'true');
      }
      closeBtn.addEventListener('click', closePanel);

      function liveUpdate() {
        const p = {
          primary: inputPrimary.value,
          accent:  inputAccent.value,
          bg:      inputBg.value,
          text:    inputText.value
        };
        applyPalette(p);
        savePalette(p);
      }
      [inputPrimary, inputAccent, inputBg, inputText].forEach(inp => {
        inp.addEventListener('input', liveUpdate);
      });

      resetBtn.addEventListener('click', () => {
        applyPalette(DEFAULT_PALETTE);
        savePalette(DEFAULT_PALETTE);
      });
    }

    /* ============================================================
       8. SIDE MENU
       ============================================================ */
    function closeSideMenu() {
      const menu = document.getElementById('sideMenu');
      const overlay = document.getElementById('sideOverlay');
      const colorPanel = document.getElementById('colorPanel');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      if (!colorPanel.classList.contains('open')) {
        overlay.classList.remove('open');
      }
    }

    function setupSideMenu() {
      const menu = document.getElementById('sideMenu');
      const overlay = document.getElementById('sideOverlay');
      const openBtn = document.getElementById('hamburgerBtn');

      openBtn.addEventListener('click', () => {
        menu.classList.add('open');
        overlay.classList.add('open');
        menu.setAttribute('aria-hidden', 'false');
      });

      overlay.addEventListener('click', () => {
        closeSideMenu();
        const colorPanel = document.getElementById('colorPanel');
        if (colorPanel.classList.contains('open')) {
          colorPanel.classList.remove('open');
          colorPanel.setAttribute('aria-hidden', 'true');
        }
      });

      // Link "Acessos" no menu
      document.getElementById('accessosSideBtn').addEventListener('click', (e) => {
        e.preventDefault();
        closeSideMenu();
        openAccessosModal();
      });

      // ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeSideMenu();
          const cp = document.getElementById('colorPanel');
          if (cp.classList.contains('open')) {
            cp.classList.remove('open');
            cp.setAttribute('aria-hidden', 'true');
          }
          closeAccessosModal();
        }
      });
    }

    /* ============================================================
       9. MODAL ACESSOS
       ============================================================ */
    function openAccessosModal() {
      const modal = document.getElementById('accessosModal');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeAccessosModal() {
      const modal = document.getElementById('accessosModal');
      if (modal.classList.contains('open')) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
    function setupAccessosModal() {
      const modal = document.getElementById('accessosModal');
      document.getElementById('closeAccessosBtn').addEventListener('click', closeAccessosModal);
      document.getElementById('accessosFooterBtn').addEventListener('click', openAccessosModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAccessosModal();
      });
    }

    /* ============================================================
       10. PAINEL DE CONTEÚDO DO MOD
       ============================================================ */
    function setupModContent() {
      const contentButton = document.getElementById("contentButton");
      const contentPanel = document.getElementById("contentPanel");
      const contentTab = document.getElementById("contentTab");
      const recipesTab = document.getElementById("recipesTab");
      const itemsView = document.getElementById("itemsView");
      const recipesView = document.getElementById("recipesView");

      if (!contentButton || !contentPanel) return;

      contentButton.addEventListener("click", () => {
        const opened = contentPanel.classList.toggle("active");
        if (opened) {
          contentButton.innerHTML = '<i class="fas fa-eye-slash"></i> OCULTAR';
          setTimeout(() => {
            contentPanel.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 60);
        } else {
          contentButton.innerHTML = '<i class="fas fa-book"></i> CONTEÚDO';
        }
      });

      contentTab.addEventListener("click", () => {
        contentTab.classList.add("active");
        recipesTab.classList.remove("active");
        itemsView.classList.add("active");
        recipesView.classList.remove("active");
      });

      recipesTab.addEventListener("click", () => {
        recipesTab.classList.add("active");
        contentTab.classList.remove("active");
        recipesView.classList.add("active");
        itemsView.classList.remove("active");
      });
    }

    /* ============================================================
       11. HEADER SHADOW
       ============================================================ */
    function setupHeaderScroll() {
      const header = document.getElementById('siteHeader');
      const onScroll = () => {
        if (window.scrollY > 10) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* ============================================================
       12. INIT
       ============================================================ */
    document.addEventListener("DOMContentLoaded", () => {
      setupColorPanel();
      setupSideMenu();
      setupAccessosModal();
      setupFilters();
      renderGames();
      setupModContent();
      setupHeaderScroll();
    });