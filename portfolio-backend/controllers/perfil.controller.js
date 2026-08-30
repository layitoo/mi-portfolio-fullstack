const PerfilModel = require("../models/perfil.model");

// Reto 6: Caché en memoria con TTL de 5 minutos
let cachePerfil = null;
let cacheTimestamp = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

exports.obtener = async (req, res) => {
  try {
    const ahora = Date.now();
    if (cachePerfil && cacheTimestamp && ahora - cacheTimestamp < CACHE_TTL_MS) {
      res.setHeader("X-Cache", "HIT");
      return res.json(cachePerfil);
    }

    const perfil = await PerfilModel.obtener();
    cachePerfil = perfil || {};
    cacheTimestamp = ahora;

    res.setHeader("X-Cache", "MISS");
    res.json(cachePerfil);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil", detalle: error.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const perfilActualizado = await PerfilModel.actualizar(req.body);
    
    // Invalidación y actualización inmediata de la caché
    cachePerfil = perfilActualizado;
    cacheTimestamp = Date.now();

    res.json(perfilActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar perfil", detalle: error.message });
  }
};
