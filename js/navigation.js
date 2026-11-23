
/* ========================================
   FREE GAME PLANT
   SISTEMA DE NAVEGAÇÃO
   Arquivo: js/navigation.js
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. Seleciona os links internos de navegação
    const navigationLinks = document.querySelectorAll(
        'header nav a[href^="#"]'
    );

    // 2. Seleciona as seções identificadas por ID
    const sections = document.querySelectorAll("section[id]");

    // Encerra se não houver seções ou links
    if (!navigationLinks.length || !sections.length) {
        return;
    }


    // 3. Navegação por âncoras
    navigationLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetSection = document.querySelector(targetId);

            if (!targetSection) {
                return;
            }

            event.preventDefault();

            targetSection.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",

                block: "start"
            });

            // Atualiza o endereço da página
            history.replaceState(null, "", targetId);

        });

    });


    // 4. Identifica a seção atualmente visível
    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) {
                return;
            }

            const currentId = entry.target.id;

            navigationLinks.forEach(link => {

                const isCurrent =
                    link.getAttribute("href") === `#${currentId}`;

                if (isCurrent) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }

            });

        });

    }, {
        root: null,
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
    });


    // 5. Ativa o monitoramento das seções
    sections.forEach(section => {
        observer.observe(section);
    });

});
