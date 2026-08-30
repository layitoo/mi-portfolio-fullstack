const VisitasModel = require("../models/visitas.model");

exports.incrementar = async (req, res) => {
  try {
    const total = await VisitasModel.incrementar();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar visita", detalle: error.message });
  }
};

exports.obtener = async (req, res) => {
  try {
    const stats = await VisitasModel.obtener();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener visitas", detalle: error.message });
  }
};
