const ProyectosModel = require("../models/proyectos.model");

const MAX_DESTACADOS = 3;

exports.destacar = async (id) => {
  const actuales = await ProyectosModel.contarDestacados();
  if (actuales >= MAX_DESTACADOS) {
    throw new Error(`Ya hay ${MAX_DESTACADOS} proyectos destacados, desmarcá uno primero`);
  }
  return ProyectosModel.actualizar(id, { destacado: true });
};

exports.quitarDestacado = async (id) => {
  return ProyectosModel.actualizar(id, { destacado: false });
};
