
/* ========================================
   FREE GAME PLANT
   FUNCIONALIDADES GERAIS
   Arquivo: js/main.js
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. Indica que o JavaScript está funcionando
    document.documentElement.classList.add("js-enabled");


    // 2. Atualiza automaticamente o ano do copyright
    const currentYear = new Date().getFullYear();

    document.querySelectorAll("[data-current-year]").forEach(element => {
        element.textContent = currentYear;
    });


    // 3. Proteção adicional para links em novas abas
    document.querySelectorAll('a[target="_blank"]').forEach(link => {

        const relValues = new Set(
            (link.getAttribute("rel") || "").split(/\s+/).filter(Boolean)
        );

        relValues.add("noopener");
        relValues.add("noreferrer");

        link.setAttribute("rel", [...relValues].join(" "));
    });


    // 4. Identifica o carregamento da página
    document.body.classList.add("page-loaded");

});
