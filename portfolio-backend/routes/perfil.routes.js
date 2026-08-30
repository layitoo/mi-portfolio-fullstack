const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/perfil.controller");
const requireAuth = require("../middlewares/requireAuth");

// Público
router.get("/", ctrl.obtener);

// Protegido (solo admin)
router.put("/", requireAuth, ctrl.actualizar);

module.exports = router;
