const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/perfil.controller");
const requireAuth = require("../middlewares/requireAuth");
const uploadCv = require("../middlewares/uploadCv");

// Middleware wrapper para atrapar errores de Multer (tamaño, tipo de archivo, etc.)
const uploadCvMiddleware = (req, res, next) => {
  uploadCv.single("cv")(req, res, (err) => {
    if (err) {
      let mensajeError = err.message;
      if (err.code === "LIMIT_FILE_SIZE") {
        mensajeError = "El archivo PDF supera el límite máximo permitido de 25MB";
      }
      return res.status(400).json({
        error: mensajeError,
        detalle: err.message,
      });
    }
    next();
  });
};

// Descarga / visualización pública del CV
router.get("/cv", ctrl.descargarCv);

// Perfil general (Público)
router.get("/", ctrl.obtener);

// Protegido (solo admin/editor autenticado)
router.put("/", requireAuth, ctrl.actualizar);

// Subida de nuevo CV en PDF (Protegido)
router.post("/cv", requireAuth, uploadCvMiddleware, ctrl.subirCv);

// Eliminación de CV personalizado (Protegido)
router.delete("/cv", requireAuth, ctrl.eliminarCv);

module.exports = router;

