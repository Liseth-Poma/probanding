const equipoService = require("../services/equipo.service")

class EquipoController {
  async crear(req, res) {
    try {
      const equipo = await equipoService.crearEquipo(req.body)
      res.status(201).json({
        success: true,
        message: "Equipo creado exitosamente",
        data: equipo,
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
        laboratorio_id: req.query.laboratorio_id,
        busqueda: req.query.busqueda,
      }

      const equipos = await equipoService.obtenerEquipos(filtros)
      res.json({
        success: true,
        data: equipos,
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
      const equipo = await equipoService.obtenerEquipo(req.params.id)
      res.json({
        success: true,
        data: equipo,
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
      const equipo = await equipoService.actualizarEquipo(req.params.id, req.body)
      res.json({
        success: true,
        message: "Equipo actualizado exitosamente",
        data: equipo,
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
      await equipoService.eliminarEquipo(req.params.id)
      res.json({
        success: true,
        message: "Equipo eliminado exitosamente",
      })
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async obtenerPorLaboratorio(req, res) {
    try {
      const { laboratorioId } = req.params
      const equipos = await equipoService.obtenerEquiposPorLaboratorio(laboratorioId)
      res.json({
        success: true,
        data: equipos,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
}

module.exports = new EquipoController()
