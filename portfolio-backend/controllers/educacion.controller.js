const EducacionModel = require("../models/educacion.model");

exports.listar = async (req, res) => {
  try {
    const educacion = await EducacionModel.obtenerTodos();
    res.json(educacion);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener educación", detalle: error.message });
  }
};

exports.obtenerUno = async (req, res) => {
  try {
    const item = await EducacionModel.obtenerPorId(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: "ID inválido o error en consulta", detalle: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const { institucion, titulo } = req.body;
    if (!institucion || !titulo) {
      return res.status(400).json({ error: "La institución y el título son obligatorios" });
    }
    const nuevo = await EducacionModel.crear(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear educación", detalle: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    await EducacionModel.actualizar(req.params.id, req.body);
    res.json({ mensaje: "Registro de educación actualizado" });
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar", detalle: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await EducacionModel.eliminar(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar", detalle: error.message });
  }
};
