const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/skills.controller");
const requireAuth = require("../middlewares/requireAuth");
const validar = require("../middlewares/validar");

router.get("/", ctrl.listar);
router.get("/:id", ctrl.obtenerUno);

router.post(
  "/",
  requireAuth,
  [
    body("nombre").notEmpty().withMessage("El nombre de la habilidad es obligatorio"),
  ],
  validar,
  ctrl.crear
);

router.put("/:id", requireAuth, ctrl.actualizar);
router.delete("/:id", requireAuth, ctrl.eliminar);

module.exports = router;
