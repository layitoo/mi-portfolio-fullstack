const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/experiencia.controller");
const requireAuth = require("../middlewares/requireAuth");
const requireRole = require("../middlewares/requireRole");
const validar = require("../middlewares/validar");

// Rutas públicas
router.get("/", ctrl.listar);
router.get("/:id", ctrl.obtenerUno);

// Rutas protegidas con validación
router.post(
  "/",
  requireAuth,
  [
    body("empresa").notEmpty().withMessage("La empresa es obligatoria"),
    body("puesto").notEmpty().withMessage("El puesto es obligatorio"),
  ],
  validar,
  ctrl.crear
);

router.put("/:id", requireAuth, ctrl.actualizar);

// Solo admin puede eliminar (Reto 5)
router.delete("/:id", requireAuth, requireRole("admin"), ctrl.eliminar);

module.exports = router;
