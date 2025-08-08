const bitacoraService = require("../services/bitacora.service")

class BitacoraController {
  async crear(req, res) {
    try {
      const bitacora = await bitacoraService.crearBitacora(req.body)
      res.status(201).json({
        success: true,
        message: "Bitácora creada exitosamente",
        data: bitacora,
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
        usuario_id: req.query.usuario_id,
        laboratorio_id: req.query.laboratorio_id,
        guia_laboratorio_id: req.query.guia_laboratorio_id,
      }

      const bitacoras = await bitacoraService.obtenerBitacoras(filtros)
      res.json({
        success: true,
        data: bitacoras,
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
      const bitacora = await bitacoraService.obtenerBitacora(req.params.id)
      res.json({
        success: true,
        data: bitacora,
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
      const bitacora = await bitacoraService.actualizarBitacora(req.params.id, req.body)
      res.json({
        success: true,
        message: "Bitácora actualizada exitosamente",
        data: bitacora,
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
      await bitacoraService.eliminarBitacora(req.params.id)
      res.json({
        success: true,
        message: "Bitácora eliminada exitosamente",
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }
}

module.exports = new BitacoraController()
