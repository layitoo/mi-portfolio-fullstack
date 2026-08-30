import api from "./api";

export const obtenerPerfil = () => api.get("/perfil").then((res) => res.data);
export const actualizarPerfil = (datos) => api.put("/perfil", datos).then((res) => res.data);
