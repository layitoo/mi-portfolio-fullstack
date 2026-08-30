import api from "./api";

export const enviarContacto = (datos) => api.post("/contacto", datos).then((res) => res.data);
