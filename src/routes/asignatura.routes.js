const express = require("express")
const asignaturaController = require("../controllers/asignatura.controller")
const { auth } = require("../middlewares/auth")


const router = express.Router()

router.use(auth)

router.post("/", asignaturaController.crear)
router.get("/", asignaturaController.obtenerTodas)
router.get("/docente/:docenteId", asignaturaController.obtenerPorDocente)
router.get("/:id", asignaturaController.obtenerPorId)
router.put("/:id", asignaturaController.actualizar)
router.delete("/:id", asignaturaController.eliminar)

module.exports = router
