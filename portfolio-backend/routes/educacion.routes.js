const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/educacion.controller");
const requireAuth = require("../middlewares/requireAuth");
const validar = require("../middlewares/validar");

router.get("/", ctrl.listar);
router.get("/:id", ctrl.obtenerUno);

router.post(
  "/",
  requireAuth,
  [
    body("institucion").notEmpty().withMessage("La institución es obligatoria"),
    body("titulo").notEmpty().withMessage("El título es obligatorio"),
  ],
  validar,
  ctrl.crear
);

router.put("/:id", requireAuth, ctrl.actualizar);
router.delete("/:id", requireAuth, ctrl.eliminar);

module.exports = router;
