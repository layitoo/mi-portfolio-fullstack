const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/visitas.controller");

router.post("/", ctrl.incrementar);
router.get("/", ctrl.obtener);

module.exports = router;
