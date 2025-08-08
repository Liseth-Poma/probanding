const guiaLaboratorioService = require("../services/guiaLaboratorio.service")

class GuiaLaboratorioController {
  async crear(req, res) {
    try {
      const guia = await guiaLaboratorioService.crearGuia(req.body)
      res.status(201).json({
        success: true,
        message: "Guía creada exitosamente",
        data: guia,
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
        laboratorio_id: req.query.laboratorio_id,
        asignatura_id: req.query.asignatura_id,
        docente_id: req.query.docente_id,
        busqueda: req.query.busqueda,
      }

      const guias = await guiaLaboratorioService.obtenerGuias(filtros)
      res.json({
        success: true,
        data: guias,
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
      const guia = await guiaLaboratorioService.obtenerGuia(req.params.id)
      res.json({
        success: true,
        data: guia,
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
      const guia = await guiaLaboratorioService.actualizarGuia(req.params.id, req.body)
      res.json({
        success: true,
        message: "Guía actualizada exitosamente",
        data: guia,
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
      await guiaLaboratorioService.eliminarGuia(req.params.id)
      res.json({
        success: true,
        message: "Guía eliminada exitosamente",
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }
}


module.exports = new GuiaLaboratorioController()
