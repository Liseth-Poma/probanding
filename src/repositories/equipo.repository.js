const Equipo = require("../models/equipo.model")
const Laboratorio = require("../models/laboratorio.model")
const { Op } = require("sequelize")

class EquipoRepository {
  async crear(datosEquipo) {
    try {
      return await Equipo.create(datosEquipo)
    } catch (error) {
      throw new Error(`Error al crear equipo: ${error.message}`)
    }
  }

  async obtenerPorId(id) {
    try {
      return await Equipo.findByPk(id, {
        include: [
          {
            model: Laboratorio,
            as: "laboratorio",
            attributes: ["id", "nombre", "descripcion"],
          },
        ],
      })
    } catch (error) {
      throw new Error(`Error al obtener equipo: ${error.message}`)
    }
  }

  async obtenerTodos(filtros = {}) {
    try {
      const whereClause = {}

      if (filtros.laboratorio_id) {
        whereClause.laboratorio_id = filtros.laboratorio_id
      }

      if (filtros.busqueda) {
        whereClause.nombre = { [Op.iLike]: `%${filtros.busqueda}%` }
      }

      return await Equipo.findAll({
        where: whereClause,
        include: [
          {
            model: Laboratorio,
            as: "laboratorio",
            attributes: ["id", "nombre", "descripcion"],
          },
        ],
        order: [["nombre", "ASC"]],
      })
    } catch (error) {
      throw new Error(`Error al obtener equipos: ${error.message}`)
    }
  }

  async actualizar(id, datosActualizacion) {
    try {
      const [filasAfectadas] = await Equipo.update(datosActualizacion, {
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Equipo no encontrado")
      }

      return await this.obtenerPorId(id)
    } catch (error) {
      throw new Error(`Error al actualizar equipo: ${error.message}`)
    }
  }

  async eliminar(id) {
    try {
      const filasAfectadas = await Equipo.destroy({
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Equipo no encontrado")
      }

      return true
    } catch (error) {
      throw new Error(`Error al eliminar equipo: ${error.message}`)
    }
  }

  async obtenerPorLaboratorio(laboratorioId) {
    try {
      return await Equipo.findAll({
        where: { laboratorio_id: laboratorioId },
        order: [["nombre", "ASC"]],
      })
    } catch (error) {
      throw new Error(`Error al obtener equipos del laboratorio: ${error.message}`)
    }
  }
}

module.exports = new EquipoRepository()
