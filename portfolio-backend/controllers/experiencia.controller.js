const ExperienciaModel = require("../models/experiencia.model");

exports.listar = async (req, res) => {
  try {
    const experiencias = await ExperienciaModel.obtenerTodos();
    res.json(experiencias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener experiencias", detalle: error.message });
  }
};

exports.obtenerUno = async (req, res) => {
  try {
    const experiencia = await ExperienciaModel.obtenerPorId(req.params.id);
    if (!experiencia) {
      return res.status(404).json({ error: "Experiencia no encontrada" });
    }
    res.json(experiencia);
  } catch (error) {
    res.status(400).json({ error: "ID inválido o error en consulta", detalle: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const { empresa, puesto } = req.body;
    if (!empresa || !puesto) {
      return res.status(400).json({ error: "La empresa y el puesto son obligatorios" });
    }
    const nueva = await ExperienciaModel.crear(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: "Error al crear experiencia", detalle: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    await ExperienciaModel.actualizar(req.params.id, req.body);
    res.json({ mensaje: "Experiencia actualizada correctamente" });
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar", detalle: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await ExperienciaModel.eliminar(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar", detalle: error.message });
  }
};
