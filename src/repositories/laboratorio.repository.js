const Laboratorio = require("../models/laboratorio.model")
const Usuario = require("../models/usuario.model")
const Equipo = require("../models/equipo.model")
const { Op } = require("sequelize")

class LaboratorioRepository {
  async crear(datosLaboratorio) {
    try {
      return await Laboratorio.create(datosLaboratorio)
    } catch (error) {
      throw new Error(`Error al crear laboratorio: ${error.message}`)
    }
  }

  async obtenerPorId(id) {
    try {
      return await Laboratorio.findByPk(id, {
        include: [
          {
            model: Usuario,
            as: "responsable",
            attributes: ["id", "nombre", "correo"],
          },
          {
            model: Equipo,
            as: "equipos",
          },
        ],
      })
    } catch (error) {
      throw new Error(`Error al obtener laboratorio: ${error.message}`)
    }
  }

  async obtenerTodos(filtros = {}) {
    try {
      const whereClause = {}

      if (filtros.busqueda) {
        whereClause[Op.or] = [
          { nombre: { [Op.iLike]: `%${filtros.busqueda}%` } },
          { descripcion: { [Op.iLike]: `%${filtros.busqueda}%` } },
        ]
      }

      return await Laboratorio.findAll({
        where: whereClause,
        include: [
          {
            model: Usuario,
            as: "responsable",
            attributes: ["id", "nombre", "correo"],
          },
        ],
        order: [["nombre", "ASC"]],
      })
    } catch (error) {
      throw new Error(`Error al obtener laboratorios: ${error.message}`)
    }
  }

  async actualizar(id, datosActualizacion) {
    try {
      const [filasAfectadas] = await Laboratorio.update(datosActualizacion, {
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Laboratorio no encontrado")
      }

      return await this.obtenerPorId(id)
    } catch (error) {
      throw new Error(`Error al actualizar laboratorio: ${error.message}`)
    }
  }

  async eliminar(id) {
    try {
      const filasAfectadas = await Laboratorio.destroy({
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Laboratorio no encontrado")
      }

      return true
    } catch (error) {
      throw new Error(`Error al eliminar laboratorio: ${error.message}`)
    }
  }
}

module.exports = new LaboratorioRepository()
