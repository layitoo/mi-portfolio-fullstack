import api from "./api";

export const obtenerProyectos = () => api.get("/proyectos").then((res) => res.data);
export const obtenerProyectoPorId = (id) => api.get(`/proyectos/${id}`).then((res) => res.data);
export const crearProyecto = (datos) => api.post("/proyectos", datos).then((res) => res.data);
export const actualizarProyecto = (id, datos) => api.put(`/proyectos/${id}`, datos).then((res) => res.data);
export const eliminarProyecto = (id) => api.delete(`/proyectos/${id}`);
