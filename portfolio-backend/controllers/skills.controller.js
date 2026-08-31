const SkillsModel = require("../models/skills.model");

exports.listar = async (req, res) => {
  try {
    const { categoria, page, limit } = req.query;
    const opciones = page || limit ? { page, limit } : {};
    const skills = await SkillsModel.obtenerTodos({ categoria }, opciones);
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener skills", detalle: error.message });
  }
};

exports.obtenerUno = async (req, res) => {
  try {
    const skill = await SkillsModel.obtenerPorId(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: "Skill no encontrada" });
    }
    res.json(skill);
  } catch (error) {
    res.status(400).json({ error: "ID inválido o error en consulta", detalle: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: "El nombre de la skill es obligatorio" });
    }
    const nueva = await SkillsModel.crear(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: "Error al crear skill", detalle: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    await SkillsModel.actualizar(req.params.id, req.body);
    res.json({ mensaje: "Skill actualizada correctamente" });
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar", detalle: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    await SkillsModel.eliminar(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar", detalle: error.message });
  }
};
