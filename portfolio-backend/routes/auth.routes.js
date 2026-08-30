const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/auth.controller");
const requireAuth = require("../middlewares/requireAuth");
const validar = require("../middlewares/validar");

router.post(
  "/registro",
  [
    body("email").isEmail().withMessage("Debe ser un email válido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  validar,
  ctrl.registrar
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Debe ser un email válido"),
    body("password").notEmpty().withMessage("La contraseña es requerida"),
  ],
  validar,
  ctrl.login
);

router.get("/me", requireAuth, ctrl.perfil);

module.exports = router;
