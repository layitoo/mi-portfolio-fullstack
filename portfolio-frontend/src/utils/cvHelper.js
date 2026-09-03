/**
 * Obtiene la URL completa para descargar o visualizar el CV según los datos del perfil
 * @param {object} perfil - Datos del perfil cargados desde la API
 * @param {boolean} forzarDescarga - Si es true, añade ?download=true para obligar al navegador a descargar el archivo
 * @returns {string} URL absoluta o relativa lista para usarse en un <a>
 */
export function obtenerUrlDescargaCv(perfil, forzarDescarga = false) {
  const rutaCv = perfil?.redes?.cv;

  if (!rutaCv) {
    return "/LeandroLalandaCV.pdf";
  }

  // Si ya es una URL absoluta externa (Google Drive, Cloudinary, etc.)
  if (rutaCv.startsWith("http://") || rutaCv.startsWith("https://")) {
    return rutaCv;
  }

  // Si es una ruta interna de la API (/api/perfil/cv)
  if (rutaCv.startsWith("/api")) {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
    const servidorBase = apiBase.replace(/\/api\/?$/, "");
    const urlBase = `${servidorBase}${rutaCv}`;
    if (forzarDescarga) {
      return urlBase.includes("?") ? `${urlBase}&download=true` : `${urlBase}?download=true`;
    }
    return urlBase;
  }

  return rutaCv;
}

/**
 * Obtiene el nombre sugerido para la descarga del archivo de CV
 * @param {object} perfil - Objeto del perfil
 * @returns {string} Nombre del archivo (ej. "LeandroLalandaCV.pdf")
 */
export function obtenerNombreCv(perfil) {
  return perfil?.cvInfo?.nombreOriginal || "LeandroLalandaCV.pdf";
}

/**
 * Formatea bytes a un texto legible (KB / MB)
 * @param {number} bytes 
 * @returns {string}
 */
export function formatearTamanoBytes(bytes) {
  if (!bytes || isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
