const express = require("express")
const equipoController = require("../controllers/equipo.controller")
const { auth } = require("../middlewares/auth")


const router = express.Router()

router.use(auth)

router.post("/", equipoController.crear)
router.get("/", equipoController.obtenerTodos)
router.get("/laboratorio/:laboratorioId", equipoController.obtenerPorLaboratorio)
router.get("/:id", equipoController.obtenerPorId)
router.put("/:id", equipoController.actualizar)
router.delete("/:id", equipoController.eliminar)

module.exports = router
