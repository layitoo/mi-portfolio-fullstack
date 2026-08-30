const PerfilModel = require("../models/perfil.model");

exports.obtener = async (req, res) => {
  try {
    const perfil = await PerfilModel.obtener();
    res.json(perfil || {});
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil", detalle: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const perfilActualizado = await PerfilModel.actualizar(req.body);
    res.json(perfilActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar perfil", detalle: error.message });
  }
};
