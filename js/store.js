
/* ==================================================
   FGP STORE — MAIN SCRIPT
   Free Game Plant
================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==============================================
    // DATABASE
    // ==============================================

    const games = window.FGP_STORE_GAMES || [];
    const minelabs = window.FGP_STORE_MINELABS || [];
    const products = window.FGP_STORE_PRODUCTS || [];

    // ==============================================
    // ELEMENTS
    // ==============================================

    const gamesGrid = document.getElementById("gamesGrid");
    const gameSearch = document.getElementById("gameSearch");
    const gameFilters = document.getElementById("gameFilters");
    const gamesCount = document.getElementById("gamesCount");
    const gamesEmpty = document.getElementById("gamesEmpty");

    const gameModal = document.getElementById("gameModal");
    const gameModalContent = document.getElementById("gameModalContent");
    const closeGameModal = document.getElementById("closeGameModal");

    const vanillaContentButton =
        document.getElementById("vanillaContentButton");

    const vanillaContent =
        document.getElementById("vanillaContent");


    // ==============================================
    // UTILITIES
    // ==============================================

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function getStatusLabel(status) {
        const labels = {
            available: "Disponível",
            "coming-soon": "Em breve"
        };

        return labels[status] || "Indefinido";
    }

    function getPlatformLabel(platform) {
        return escapeHTML(platform);
    }


    // ==============================================
    // GAME CARDS
    // ==============================================

    function createGameCard(game) {

        const image = game.image
            ? `<img src="${escapeHTML(game.image)}"
                   alt="${escapeHTML(game.name)}"
                   loading="lazy">`
            : "";

        const genres = (game.genre || [])
            .map(genre =>
                `<span class="store-tag">${escapeHTML(genre)}</span>`
            )
            .join("");

        return `
            <article class="game-card">

                <div class="game-card-image">
                    ${image}
                </div>

                <div class="game-card-content">

                    <span class="store-status ${escapeHTML(game.status)}">
                        ${getStatusLabel(game.status)}
                    </span>

                    <h3>${escapeHTML(game.name)}</h3>

                    <p>${escapeHTML(game.description)}</p>

                    <div class="game-card-meta">
                        ${genres}
                    </div>

                    <div class="game-card-actions">

                        <button
                            class="store-button store-button-primary"
                            data-game-details="${escapeHTML(game.id)}"
                            type="button">
                            Detalhes
                        </button>

                    </div>

                </div>

            </article>
        `;
    }


    // ==============================================
    // GAME FILTERS
    // ==============================================

    let currentFilter = "all";
    let currentSearch = "";

    function filterGames() {

        const filteredGames = games.filter(game => {

            const searchText = [
                game.name,
                game.fullName,
                game.description,
                ...(game.genre || []),
                ...(game.platforms || [])
            ].join(" ").toLowerCase();

            const matchesSearch =
                searchText.includes(currentSearch);

            let matchesFilter = true;

            switch (currentFilter) {

                case "available":
                    matchesFilter = game.status === "available";
                    break;

                case "soon":
                    matchesFilter = game.status === "coming-soon";
                    break;

                case "android":
                    matchesFilter =
                        (game.platforms || []).includes("Android");
                    break;

                case "windows":
                    matchesFilter =
                        (game.platforms || []).includes("Windows");
                    break;

                default:
                    matchesFilter = true;
            }

            return matchesSearch && matchesFilter;
        });

        renderGames(filteredGames);
    }


    // ==============================================
    // RENDER GAMES
    // ==============================================

    function renderGames(list) {

        if (!gamesGrid) return;

        gamesGrid.innerHTML = list
            .map(createGameCard)
            .join("");

        if (gamesCount) {
            gamesCount.textContent =
                `${list.length} ${list.length === 1 ? "jogo" : "jogos"}`;
        }

        if (gamesEmpty) {
            gamesEmpty.hidden = list.length > 0;
        }
    }


    // ==============================================
    // SEARCH
    // ==============================================

    if (gameSearch) {

        gameSearch.addEventListener("input", event => {

            currentSearch = event.target.value
                .trim()
                .toLowerCase();

            filterGames();
        });
    }


    // ==============================================
    // FILTER BUTTONS
    // ==============================================

    if (gameFilters) {

        gameFilters.addEventListener("click", event => {

            const button = event.target.closest("[data-filter]");

            if (!button) return;

            currentFilter = button.dataset.filter;

            gameFilters
                .querySelectorAll("[data-filter]")
                .forEach(filter => {
                    filter.classList.toggle(
                        "active",
                        filter === button
                    );
                });

            filterGames();
        });
    }


    // ==============================================
    // GAME DETAILS MODAL
    // ==============================================

    function openGameModal(gameId) {

        const game = games.find(item => item.id === gameId);

        if (!game || !gameModal || !gameModalContent) return;

        const platforms = (game.platforms || [])
            .map(platform =>
                `<span class="store-tag">${getPlatformLabel(platform)}</span>`
            )
            .join("");

        const genres = (game.genre || [])
            .map(genre =>
                `<span class="store-tag">${escapeHTML(genre)}</span>`
            )
            .join("");

        const links = (game.links || [])
            .map(link => {

                const safeURL = escapeHTML(link.url);

                return `
                    <a
                        class="store-button store-button-secondary"
                        href="${safeURL}"
                        target="_blank"
                        rel="noopener noreferrer">

                        ${escapeHTML(link.name)}

                    </a>
                `;
            })
            .join("");

        gameModalContent.innerHTML = `

            <h2>${escapeHTML(game.fullName || game.name)}</h2>

            <span class="store-status ${escapeHTML(game.status)}">
                ${getStatusLabel(game.status)}
            </span>

            <p>${escapeHTML(game.description)}</p>

            <h3>Desenvolvedor</h3>
            <p>${escapeHTML(game.developer)}</p>

            <h3>Gêneros</h3>
            <div class="game-card-meta">
                ${genres}
            </div>

            <h3>Plataformas</h3>
            <div class="game-card-meta">
                ${platforms}
            </div>

            <h3>Acessar jogo</h3>

            <div class="mine-actions">
                ${links || "<p>Links ainda não disponíveis.</p>"}
            </div>

        `;

        gameModal.hidden = false;
        document.body.style.overflow = "hidden";
    }


    function closeModal() {

        if (!gameModal) return;

        gameModal.hidden = true;
        document.body.style.overflow = "";
    }


    if (gamesGrid) {

        gamesGrid.addEventListener("click", event => {

            const button = event.target.closest("[data-game-details]");

            if (!button) return;

            openGameModal(button.dataset.gameDetails);
        });
    }


    if (closeGameModal) {
        closeGameModal.addEventListener("click", closeModal);
    }


    if (gameModal) {

        gameModal.addEventListener("click", event => {

            if (event.target === gameModal) {
                closeModal();
            }
        });
    }


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeModal();
        }
    });


    // ==============================================
    // MAIN STORE TABS
    // ==============================================

    const storeTabs = document.querySelectorAll("[data-store-tab]");
    const storePanels = document.querySelectorAll("[data-store-panel]");

    storeTabs.forEach(button => {

        button.addEventListener("click", () => {

            const selectedTab = button.dataset.storeTab;

            storeTabs.forEach(tab => {
                const active = tab === button;

                tab.classList.toggle("active", active);
                tab.setAttribute("aria-selected", String(active));
            });

            storePanels.forEach(panel => {

                panel.hidden =
                    panel.dataset.storePanel !== selectedTab;

            });

        });
    });


    // ==============================================
    // MINELABS CONTENT PANEL
    // ==============================================

    if (vanillaContentButton && vanillaContent) {

        vanillaContentButton.addEventListener("click", () => {

            const isHidden = vanillaContent.hidden;

            vanillaContent.hidden = !isHidden;

            vanillaContentButton.setAttribute(
                "aria-expanded",
                String(isHidden)
            );

            vanillaContentButton.textContent = isHidden
                ? "Ocultar conteúdo"
                : "Ver conteúdo";
        });
    }


    // ==============================================
    // MINELABS CONTENT TABS
    // ==============================================

    const vanillaTabs =
        document.querySelectorAll("[data-vanilla-tab]");

    const vanillaViews =
        document.querySelectorAll("[data-vanilla-view]");

    vanillaTabs.forEach(button => {

        button.addEventListener("click", () => {

            const selectedView = button.dataset.vanillaTab;

            vanillaTabs.forEach(tab => {

                const active = tab === button;

                tab.classList.toggle("active", active);
                tab.setAttribute("aria-selected", String(active));

            });

            vanillaViews.forEach(view => {

                view.hidden =
                    view.dataset.vanillaView !== selectedView;

            });

        });
    });


    // ==============================================
    // INITIALIZATION
    // ==============================================

    renderGames(games);

    console.log("FGP Store inicializada!");
    console.log("Jogos:", games.length);
    console.log("Projetos MineLabs:", minelabs.length);
    console.log("Produtos:", products.length);

});
