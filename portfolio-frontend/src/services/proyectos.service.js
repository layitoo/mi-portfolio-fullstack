import api from "./api";

export const obtenerProyectos = (tech) => {
  const url = tech ? `/proyectos?tech=${encodeURIComponent(tech)}` : "/proyectos";
  return api.get(url).then((res) => res.data);
};

export const obtenerProyectoPorId = (id) => api.get(`/proyectos/${id}`).then((res) => res.data);
export const crearProyecto = (datos) => api.post("/proyectos", datos).then((res) => res.data);
export const actualizarProyecto = (id, datos) => api.put(`/proyectos/${id}`, datos).then((res) => res.data);
export const reordenarProyectos = (items) => api.put("/proyectos/reordenar", { items }).then((res) => res.data);
export const destacarProyecto = (id) => api.patch(`/proyectos/${id}/destacar`).then((res) => res.data);
export const eliminarProyecto = (id) => api.delete(`/proyectos/${id}`);
