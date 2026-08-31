const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const ctrl = require("../controllers/contacto.controller");
const validar = require("../middlewares/validar");
const { contactoLimiter } = require("../middlewares/rateLimiters");

router.post(
  "/",
  contactoLimiter,
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Debe ingresar un email válido"),
    body("mensaje").notEmpty().withMessage("El mensaje no puede estar vacío"),
  ],
  validar,
  ctrl.enviar
);

module.exports = router;
