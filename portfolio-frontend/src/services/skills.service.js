import api from "./api";

export const obtenerSkills = () => api.get("/skills").then((res) => res.data);
export const crearSkill = (datos) => api.post("/skills", datos).then((res) => res.data);
export const actualizarSkill = (id, datos) => api.put(`/skills/${id}`, datos).then((res) => res.data);
export const eliminarSkill = (id) => api.delete(`/skills/${id}`);
