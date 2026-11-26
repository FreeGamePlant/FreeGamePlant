/* ============================================================
FGP TECHNOLOGIES — utils.js
Funções auxiliares compartilhadas entre módulos.
Contém apenas utilitários puros, sem dependências de DOM ou estado.
============================================================ */

/**
 * Escapa caracteres HTML para prevenir XSS ao inserir conteúdo dinâmico.
 * @param {any} str - Valor a ser escapado (será convertido para string)
 * @returns {string} - String com caracteres HTML escapados
 */
export function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str == null ? '' : str);
    return div.innerHTML;
}

/**
 * Formata o tamanho de um arquivo em bytes para uma representação legível.
 * @param {number} bytes - Tamanho do arquivo em bytes
 * @returns {string} - Tamanho formatado (ex: "1.5 MB", "320 KB", "512 B")
 */
export function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
