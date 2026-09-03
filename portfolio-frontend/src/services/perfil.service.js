import api from "./api";

export const obtenerPerfil = () => api.get("/perfil").then((res) => res.data);
export const actualizarPerfil = (datos) => api.put("/perfil", datos).then((res) => res.data);

/**
 * Sube un archivo PDF como Currículum Vitae a través del endpoint protegido /perfil/cv
 * @param {File} file - Archivo PDF seleccionado
 * @returns {Promise<{ mensaje: string, url: string, cvInfo: object, perfil: object }>}
 */
export const subirCvPdf = (file) => {
  const formData = new FormData();
  formData.append("cv", file);
  return api
    .post("/perfil/cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

/**
 * Elimina el CV personalizado y restaura el predeterminado
 */
export const eliminarCvPdf = () => api.delete("/perfil/cv").then((res) => res.data);

