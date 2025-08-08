const UsoLaboratorio = require("../models/usoLaboratorio.model")
const Usuario = require("../models/usuario.model")
const Laboratorio = require("../models/laboratorio.model")
const { Op } = require("sequelize")

class UsoLaboratorioRepository {
  async crear(datosUso) {
    try {
      return await UsoLaboratorio.create(datosUso)
    } catch (error) {
      throw new Error(`Error al crear uso de laboratorio: ${error.message}`)
    }
  }

  async obtenerPorId(id) {
    try {
      return await UsoLaboratorio.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: { exclude: ["password"] },
          },
          {
            model: Laboratorio,
            as: "laboratorio",
          },
        ],
      })
    } catch (error) {
      throw new Error(`Error al obtener uso de laboratorio: ${error.message}`)
    }
  }

  async obtenerTodos(filtros = {}) {
    try {
      const whereClause = {}

      if (filtros.usuario_id) {
        whereClause.usuario_id = filtros.usuario_id
      }

      if (filtros.laboratorio_id) {
        whereClause.laboratorio_id = filtros.laboratorio_id
      }

      if (filtros.estado) {
        whereClause.estado = filtros.estado
      }

      if (filtros.fecha_inicio && filtros.fecha_fin) {
        whereClause.fecha_inicio = {
          [Op.between]: [filtros.fecha_inicio, filtros.fecha_fin],
        }
      }

      return await UsoLaboratorio.findAll({
        where: whereClause,
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: { exclude: ["password"] },
          },
          {
            model: Laboratorio,
            as: "laboratorio",
          },
        ],
        order: [["fecha_inicio", "DESC"]],
      })
    } catch (error) {
      throw new Error(`Error al obtener usos de laboratorio: ${error.message}`)
    }
  }

  async obtenerPorLaboratorio(laboratorioId, filtros = {}) {
    try {
      const whereClause = { laboratorio_id: laboratorioId }

      if (filtros.estado) {
        whereClause.estado = filtros.estado
      }

      if (filtros.fecha_inicio && filtros.fecha_fin) {
        whereClause.fecha_inicio = {
          [Op.between]: [filtros.fecha_inicio, filtros.fecha_fin],
        }
      }

      return await UsoLaboratorio.findAll({
        where: whereClause,
        include: [
          {
            model: Usuario,
            as: "usuario",
            attributes: { exclude: ["password"] },
          },
          {
            model: Laboratorio,
            as: "laboratorio",
          },
        ],
        order: [["fecha_inicio", "DESC"]],
      })
    } catch (error) {
      throw new Error(`Error al obtener historial de laboratorio: ${error.message}`)
    }
  }

  async actualizar(id, datosActualizacion) {
    try {
      const [filasAfectadas] = await UsoLaboratorio.update(datosActualizacion, {
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Uso de laboratorio no encontrado")
      }

      return await this.obtenerPorId(id)
    } catch (error) {
      throw new Error(`Error al actualizar uso de laboratorio: ${error.message}`)
    }
  }

  async eliminar(id) {
    try {
      const filasAfectadas = await UsoLaboratorio.destroy({
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Uso de laboratorio no encontrado")
      }

      return true
    } catch (error) {
      throw new Error(`Error al eliminar uso de laboratorio: ${error.message}`)
    }
  }

  async obtenerEstadisticas(filtros = {}) {
    try {
      const whereClause = {}

      if (filtros.fecha_inicio && filtros.fecha_fin) {
        whereClause.fecha_inicio = {
          [Op.between]: [filtros.fecha_inicio, filtros.fecha_fin],
        }
      }

      const estadisticas = await UsoLaboratorio.findAll({
        where: whereClause,
        attributes: [
          "estado",
          [UsoLaboratorio.sequelize.fn("COUNT", UsoLaboratorio.sequelize.col("id")), "cantidad"],
          [
            UsoLaboratorio.sequelize.fn("AVG", UsoLaboratorio.sequelize.col("numero_estudiantes")),
            "promedio_estudiantes",
          ],
        ],
        group: ["estado"],
        raw: true,
      })

      return estadisticas
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`)
    }
  }
}

module.exports = new UsoLaboratorioRepository()
