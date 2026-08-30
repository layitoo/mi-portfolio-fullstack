const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/proyectos.controller");
const requireAuth = require("../middlewares/requireAuth");
const validar = require("../middlewares/validar");
const upload = require("../middlewares/upload");

const requireRole = require("../middlewares/requireRole");

// Rutas públicas
router.get("/", ctrl.listar);
router.get("/:id", ctrl.obtenerUno);

// Rutas protegidas (Admin / Editor)
router.put("/reordenar", requireAuth, ctrl.reordenar);

router.post(
  "/",
  requireAuth,
  [
    body("titulo").notEmpty().withMessage("El título es obligatorio"),
    body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
  ],
  validar,
  ctrl.crear
);

router.put(
  "/:id",
  requireAuth,
  [
    body("titulo").optional().notEmpty().withMessage("El título no puede estar vacío"),
  ],
  validar,
  ctrl.actualizar
);

router.patch("/:id/destacar", requireAuth, ctrl.destacar);

// Solo admin puede eliminar proyectos (Reto 5)
router.delete("/:id", requireAuth, requireRole("admin"), ctrl.eliminar);

// Subida de imagen a Cloudinary/Multer
router.post("/:id/imagen", requireAuth, upload.single("imagen"), ctrl.subirImagen);

module.exports = router;
