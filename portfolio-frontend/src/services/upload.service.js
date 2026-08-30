import api from "./api";

/**
 * Sube una imagen directamente a Cloudinary a través del endpoint protegido /api/upload
 * @param {File} file - Archivo de imagen seleccionado por el usuario
 * @returns {Promise<{ mensaje: string, url: string, public_id: string }>}
 */
export const subirImagenCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("imagen", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
