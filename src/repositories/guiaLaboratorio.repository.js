const GuiaLaboratorio = require("../models/guiaLaboratorio.model")
const Laboratorio = require("../models/laboratorio.model")
const Asignatura = require("../models/asignatura.model")
const Usuario = require("../models/usuario.model")
const { Op } = require("sequelize")

class GuiaLaboratorioRepository {
  async crear(datosGuia) {
    try {
      return await GuiaLaboratorio.create(datosGuia)
    } catch (error) {
      throw new Error(`Error al crear guía: ${error.message}`)
    }
  }

  async obtenerPorId(id) {
    try {
      return await GuiaLaboratorio.findByPk(id, {
        include: [
          {
            model: Laboratorio,
            as: "laboratorio",
            attributes: ["id", "nombre", "descripcion"],
          },
          {
            model: Asignatura,
            as: "asignatura",
            attributes: ["id", "nombre", "codigo"],
          },
          {
            model: Usuario,
            as: "docente",
            attributes: ["id", "nombre", "correo"],
          },
        ],
      })
    } catch (error) {
      throw new Error(`Error al obtener guía: ${error.message}`)
    }
  }

  async obtenerTodas(filtros = {}) {
    try {
      const whereClause = {}

      if (filtros.laboratorio_id) {
        whereClause.laboratorio_id = filtros.laboratorio_id
      }

      if (filtros.asignatura_id) {
        whereClause.asignatura_id = filtros.asignatura_id
      }

      if (filtros.docente_id) {
        whereClause.docente_id = filtros.docente_id
      }

      if (filtros.busqueda) {
        whereClause.titulo = { [Op.iLike]: `%${filtros.busqueda}%` }
      }

      return await GuiaLaboratorio.findAll({
        where: whereClause,
        include: [
          {
            model: Laboratorio,
            as: "laboratorio",
            attributes: ["id", "nombre", "descripcion"],
          },
          {
            model: Asignatura,
            as: "asignatura",
            attributes: ["id", "nombre", "codigo"],
          },
          {
            model: Usuario,
            as: "docente",
            attributes: ["id", "nombre", "correo"],
          },
        ],
        order: [["titulo", "ASC"]],
      })
    } catch (error) {
      throw new Error(`Error al obtener guías: ${error.message}`)
    }
  }

  async actualizar(id, datosActualizacion) {
    try {
      const [filasAfectadas] = await GuiaLaboratorio.update(datosActualizacion, {
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Guía no encontrada")
      }

      return await this.obtenerPorId(id)
    } catch (error) {
      throw new Error(`Error al actualizar guía: ${error.message}`)
    }
  }

  async eliminar(id) {
    try {
      const filasAfectadas = await GuiaLaboratorio.destroy({
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Guía no encontrada")
      }

      return true
    } catch (error) {
      throw new Error(`Error al eliminar guía: ${error.message}`)
    }
  }
}

module.exports = new GuiaLaboratorioRepository()
