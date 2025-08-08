const express = require("express")
const laboratorioController = require("../controllers/laboratorio.controller")
const { auth } = require("../middlewares/auth")


const router = express.Router()

router.use(auth)

router.post("/", laboratorioController.crear)
router.get("/", laboratorioController.obtenerTodos)
router.get("/:id", laboratorioController.obtenerPorId)
router.put("/:id", laboratorioController.actualizar)
router.delete("/:id", laboratorioController.eliminar)

module.exports = router
