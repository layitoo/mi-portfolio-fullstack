import api from "./api";

export const login = (credenciales) => api.post("/auth/login", credenciales).then((res) => res.data);
export const registro = (datos) => api.post("/auth/registro", datos).then((res) => res.data);
export const obtenerMiPerfil = () => api.get("/auth/me").then((res) => res.data);
