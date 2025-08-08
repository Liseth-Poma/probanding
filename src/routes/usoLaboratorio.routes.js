const express = require("express")
const usoLaboratorioController = require("../controllers/usoLaboratorio.controller")

const router = express.Router()

// Rutas CRUD para usos de laboratorio
router.post("/", usoLaboratorioController.crear)
router.get("/", usoLaboratorioController.obtenerTodos)
router.get("/reporte", usoLaboratorioController.generarReporte)
router.get("/:id", usoLaboratorioController.obtenerPorId)
router.put("/:id", usoLaboratorioController.actualizar)
router.delete("/:id", usoLaboratorioController.eliminar)

// Rutas específicas para manejo de estados
router.patch("/:id/iniciar", usoLaboratorioController.iniciar)
router.patch("/:id/finalizar", usoLaboratorioController.finalizar)

// Ruta para historial por laboratorio
router.get("/laboratorio/:laboratorioId/historial", usoLaboratorioController.obtenerHistorialLaboratorio)

module.exports = router
