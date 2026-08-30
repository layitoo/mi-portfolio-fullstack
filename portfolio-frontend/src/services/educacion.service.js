import api from "./api";

export const obtenerEducacion = () => api.get("/educacion").then((res) => res.data);
export const crearEducacion = (datos) => api.post("/educacion", datos).then((res) => res.data);
export const actualizarEducacion = (id, datos) => api.put(`/educacion/${id}`, datos).then((res) => res.data);
export const eliminarEducacion = (id) => api.delete(`/educacion/${id}`);
