const laboratorioService = require("../services/laboratorio.service")

class LaboratorioController {
  async crear(req, res) {
    try {
      const laboratorio = await laboratorioService.crearLaboratorio(req.body)
      res.status(201).json({
        success: true,
        message: "Laboratorio creado exitosamente",
        data: laboratorio,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async obtenerTodos(req, res) {
    try {
      const filtros = {
        busqueda: req.query.busqueda,
      }

      const laboratorios = await laboratorioService.obtenerLaboratorios(filtros)
      res.json({
        success: true,
        data: laboratorios,
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
      const laboratorio = await laboratorioService.obtenerLaboratorio(req.params.id)
      res.json({
        success: true,
        data: laboratorio,
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
      const laboratorio = await laboratorioService.actualizarLaboratorio(req.params.id, req.body)
      res.json({
        success: true,
        message: "Laboratorio actualizado exitosamente",
        data: laboratorio,
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
      await laboratorioService.eliminarLaboratorio(req.params.id)
      res.json({
        success: true,
        message: "Laboratorio eliminado exitosamente",
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }
}

module.exports = new LaboratorioController()
