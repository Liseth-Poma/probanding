const usoLaboratorioService = require("../services/usoLaboratorio.service")

class UsoLaboratorioController {
  async crear(req, res) {
    try {
      const uso = await usoLaboratorioService.registrarUso(req.body)
      res.status(201).json({
        success: true,
        message: "Uso de laboratorio registrado exitosamente",
        data: uso,
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
        usuario_id: req.query.usuario_id,
        laboratorio_id: req.query.laboratorio_id,
        estado: req.query.estado,
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin,
      }

      const usos = await usoLaboratorioService.obtenerUsos(filtros)
      res.json({
        success: true,
        data: usos,
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
      const uso = await usoLaboratorioService.obtenerUso(req.params.id)
      res.json({
        success: true,
        data: uso,
      })
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      })
    }
  }

  async obtenerHistorialLaboratorio(req, res) {
    try {
      const filtros = {
        estado: req.query.estado,
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin,
      }

      const historial = await usoLaboratorioService.obtenerHistorialLaboratorio(req.params.laboratorioId, filtros)
      res.json({
        success: true,
        data: historial,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  async actualizar(req, res) {
    try {
      const uso = await usoLaboratorioService.actualizarUso(req.params.id, req.body)
      res.json({
        success: true,
        message: "Uso de laboratorio actualizado exitosamente",
        data: uso,
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
      await usoLaboratorioService.eliminarUso(req.params.id)
      res.json({
        success: true,
        message: "Uso de laboratorio eliminado exitosamente",
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async iniciar(req, res) {
    try {
      const uso = await usoLaboratorioService.iniciarUso(req.params.id)
      res.json({
        success: true,
        message: "Uso de laboratorio iniciado exitosamente",
        data: uso,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async finalizar(req, res) {
    try {
      const uso = await usoLaboratorioService.finalizarUso(req.params.id, req.body)
      res.json({
        success: true,
        message: "Uso de laboratorio finalizado exitosamente",
        data: uso,
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async generarReporte(req, res) {
    try {
      const filtros = {
        fecha_inicio: req.query.fecha_inicio,
        fecha_fin: req.query.fecha_fin,
        laboratorio_id: req.query.laboratorio_id,
        usuario_id: req.query.usuario_id,
      }

      const reporte = await usoLaboratorioService.generarReporte(filtros)
      res.json({
        success: true,
        data: reporte,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
}

module.exports = new UsoLaboratorioController()
