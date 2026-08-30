const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const upload = require("../middlewares/upload");

// Middleware wrapper para atrapar errores de Multer (tamaño, formato, etc.)
const uploadMiddleware = (req, res, next) => {
  upload.single("imagen")(req, res, (err) => {
    if (err) {
      let mensajeError = err.message;
      if (err.code === "LIMIT_FILE_SIZE") {
        mensajeError = "La imagen supera el límite permitido (25MB)";
      }
      return res.status(400).json({
        error: mensajeError,
        detalle: err.message,
      });
    }
    next();
  });
};

// Endpoint centralizado para subir cualquier imagen a Cloudinary
router.post("/", requireAuth, uploadMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se envió ningún archivo de imagen" });
    }

    // req.file.path contiene la URL de Cloudinary (HTTPS)
    // req.file.filename contiene el public_id asignado en Cloudinary
    const url = req.file.path || `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    res.json({
      mensaje: "Imagen subida a Cloudinary con éxito ☁️",
      url,
      public_id: req.file.filename || null,
      bytes: req.file.size,
      formato: req.file.mimetype,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al subir la imagen a la nube",
      detalle: error.message,
    });
  }
});

module.exports = router;
