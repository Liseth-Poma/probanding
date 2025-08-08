const asignaturaService = require("../services/asignatura.service")

class AsignaturaController {
  async crear(req, res) {
    try {
      const asignatura = await asignaturaService.crearAsignatura(req.body)
      res.status(201).json({
        success: true,
        message: "Asignatura creada exitosamente",
        data: asignatura,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async obtenerTodas(req, res) {
    try {
      const filtros = {
        busqueda: req.query.busqueda,
      }

      const asignaturas = await asignaturaService.obtenerAsignaturas(filtros)
      res.json({
        success: true,
        data: asignaturas,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  async obtenerPorId(req, res) {
    try {
      const asignatura = await asignaturaService.obtenerAsignatura(req.params.id)
      res.json({
        success: true,
        data: asignatura,
      })
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      })
    }
  }

  async actualizar(req, res) {
    try {
      const asignatura = await asignaturaService.actualizarAsignatura(req.params.id, req.body)
      res.json({
        success: true,
        message: "Asignatura actualizada exitosamente",
        data: asignatura,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async eliminar(req, res) {
    try {
      await asignaturaService.eliminarAsignatura(req.params.id)
      res.json({
        success: true,
        message: "Asignatura eliminada exitosamente",
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async obtenerPorDocente(req, res) {
    try {
      const { docenteId } = req.params
      const asignaturas = await asignaturaService.obtenerAsignaturasPorDocente(docenteId)
      res.json({
        success: true,
        data: asignaturas,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
}

module.exports = new AsignaturaController()
