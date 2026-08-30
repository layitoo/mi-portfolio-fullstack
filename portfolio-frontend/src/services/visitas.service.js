import api from "./api";

export const incrementarVisitas = () => api.post("/visitas").then((res) => res.data);
export const obtenerVisitas = () => api.get("/visitas").then((res) => res.data);
