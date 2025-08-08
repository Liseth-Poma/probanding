const EquipoLaboratorioService = require("../services/equipoLaboratorio.service")
const { EquipoLaboratorio } = require("../models/equipoLaboratorio.model")

class EquipoLaboratorioController {
  async getAllEquipos(req, res) {
    try {
      const equipos = await EquipoLaboratorioService.getAllEquipos()
      res.json({
        success: true,
        data: equipos,
      })
    } catch (error) {
      console.error("Error en getAllEquipos:", error)
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  async getEquipoById(req, res) {
    try {
      const { id } = req.params
      const equipo = await EquipoLaboratorioService.getEquipoById(id)
      res.json({
        success: true,
        data: equipo,
      })
    } catch (error) {
      console.error("Error en getEquipoById:", error)
      const statusCode = error.message.includes("no encontrado") ? 404 : 500
      res.status(statusCode).json({
        success: false,
        message: error.message,
      })
    }
  }

  async getEquiposByLaboratorio(req, res) {
    try {
      const { laboratorioId } = req.params
      const equipos = await EquipoLaboratorioService.getEquiposByLaboratorio(laboratorioId)
      res.json({
        success: true,
        data: equipos,
      })
    } catch (error) {
      console.error("Error en getEquiposByLaboratorio:", error)
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  async getEquiposByEstado(req, res) {
    try {
      const { estado } = req.params
      const equipos = await EquipoLaboratorioService.getEquiposByEstado(estado)
      res.json({
        success: true,
        data: equipos,
      })
    } catch (error) {
      console.error("Error en getEquiposByEstado:", error)
      res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  async createEquipo(req, res) {
    try {
      const equipo = await EquipoLaboratorioService.createEquipo(req.body)
      res.status(201).json({
        success: true,
        message: "Equipo creado exitosamente",
        data: equipo,
      })
    } catch (error) {
      console.error("Error en createEquipo:", error)
      const statusCode = error.message.includes("ya existe") ? 400 : 500
      res.status(statusCode).json({
        success: false,
        message: error.message,
      })
    }
  }

  async updateEquipo(req, res) {
    try {
      const { id } = req.params
      const equipo = await EquipoLaboratorioService.updateEquipo(id, req.body)
      res.json({
        success: true,
        message: "Equipo actualizado exitosamente",
        data: equipo,
      })
    } catch (error) {
      console.error("Error en updateEquipo:", error)
      const statusCode = error.message.includes("no encontrado") ? 404 : error.message.includes("ya existe") ? 400 : 500
      res.status(statusCode).json({
        success: false,
        message: error.message,
      })
    }
  }

  async deleteEquipo(req, res) {
    try {
      const { id } = req.params
      const result = await EquipoLaboratorioService.deleteEquipo(id)
      res.json({
        success: true,
        message: result.message,
      })
    } catch (error) {
      console.error("Error en deleteEquipo:", error)
      const statusCode = error.message.includes("no encontrado") ? 404 : 500
      res.status(statusCode).json({
        success: false,
        message: error.message,
      })
    }
  }

  async cambiarEstadoEquipo(req, res) {
    try {
      const { id } = req.params
      const { estado } = req.body
      const equipo = await EquipoLaboratorioService.cambiarEstadoEquipo(id, estado)
      res.json({
        success: true,
        message: "Estado del equipo actualizado exitosamente",
        data: equipo,
      })
    } catch (error) {
      console.error("Error en cambiarEstadoEquipo:", error)
      const statusCode = error.message.includes("no encontrado") ? 404 : error.message.includes("no válido") ? 400 : 500
      res.status(statusCode).json({
        success: false,
        message: error.message,
      })
    }
  }

  
}
exports.create = async (req, res) => {
  try {
    const equipoLab = await EquipoLaboratorio.create(req.body)
    res.status(201).json({ success: true, data: equipoLab })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
module.exports = new EquipoLaboratorioController()
