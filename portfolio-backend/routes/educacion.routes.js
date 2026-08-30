const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/educacion.controller");
const requireAuth = require("../middlewares/requireAuth");
const requireRole = require("../middlewares/requireRole");

// Rutas públicas
router.get("/", ctrl.listar);
router.get("/:id", ctrl.obtenerUno);

// Rutas protegidas
router.post("/", requireAuth, ctrl.crear);
router.put("/:id", requireAuth, ctrl.actualizar);

// Solo admin puede eliminar (Reto 5)
router.delete("/:id", requireAuth, requireRole("admin"), ctrl.eliminar);

module.exports = router;
