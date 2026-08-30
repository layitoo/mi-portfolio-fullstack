import api from "./api";

export const obtenerExperiencias = () => api.get("/experiencia").then((res) => res.data);
export const crearExperiencia = (datos) => api.post("/experiencia", datos).then((res) => res.data);
export const actualizarExperiencia = (id, datos) => api.put(`/experiencia/${id}`, datos).then((res) => res.data);
export const eliminarExperiencia = (id) => api.delete(`/experiencia/${id}`);
