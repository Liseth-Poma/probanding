const express = require("express")
const router = express.Router()
const InscripcionAsignatura = require("../models/inscripcionAsignatura.model")

// Crear inscripción
router.post("/", async (req, res) => {
  try {
    const { estudiante_id, asignatura_id } = req.body
    const inscripcion = await InscripcionAsignatura.create({ estudiante_id, asignatura_id })
    res.status(201).json({ success: true, data: inscripcion })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Obtener todas las inscripciones
router.get("/", async (req, res) => {
  try {
    const inscripciones = await InscripcionAsignatura.findAll()
    res.json(inscripciones)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Obtener inscripción por ID
router.get("/:id", async (req, res) => {
  //deberia de ir el token, mas no el id (cambiar a todas las rutas) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  try {
    const inscripcion = await InscripcionAsignatura.findByPk(req.params.id)
    if (!inscripcion) return res.status(404).json({ success: false, message: "No encontrada" })
    res.json(inscripcion)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Actualizar inscripción
router.put("/:id", async (req, res) => {
  try {
    const { estudiante_id, asignatura_id } = req.body
    const inscripcion = await InscripcionAsignatura.findByPk(req.params.id)
    if (!inscripcion) return res.status(404).json({ success: false, message: "No encontrada" })
    await inscripcion.update({ estudiante_id, asignatura_id })
    res.json({ success: true, data: inscripcion })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Eliminar inscripción
router.delete("/:id", async (req, res) => {
  try {
    const inscripcion = await InscripcionAsignatura.findByPk(req.params.id)
    if (!inscripcion) return res.status(404).json({ success: false, message: "No encontrada" })
    await inscripcion.destroy()
    res.json({ success: true, message: "Eliminada" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router