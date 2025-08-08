const express = require("express")
const guiaLaboratorioController = require("../controllers/guiaLaboratorio.controller")
const { auth } = require("../middlewares/auth")

const router = express.Router()

router.use(auth)

router.post("/", guiaLaboratorioController.crear)
router.get("/", guiaLaboratorioController.obtenerTodas)
router.get("/:id", guiaLaboratorioController.obtenerPorId)
router.put("/:id", guiaLaboratorioController.actualizar)
router.delete("/:id", guiaLaboratorioController.eliminar)

module.exports = router
