const Bitacora = require("../models/bitacora.model")
const GuiaLaboratorio = require("../models/guiaLaboratorio.model")
const Laboratorio = require("../models/laboratorio.model")
const Usuario = require("../models/usuario.model")
const { Op } = require("sequelize")

class BitacoraRepository {
  async crear(datosBitacora) {
    try {
      return await Bitacora.create(datosBitacora)
    } catch (error) {
      throw new Error(`Error al crear bitácora: ${error.message}`)
    }
  }

  async obtenerPorId(id) {
    try {
      return await Bitacora.findByPk(id, {
        include: [
          {
            model: GuiaLaboratorio,
            as: "guia",
            attributes: ["id", "titulo"],
          },
          {
            model: Laboratorio,
            as: "laboratorio",
            attributes: ["id", "nombre", "descripcion"],
          },
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id", "nombre", "correo"],
          },
        ],
      })
    } catch (error) {
      throw new Error(`Error al obtener bitácora: ${error.message}`)
    }
  }

  async obtenerTodas(filtros = {}) {
    try {
      const whereClause = {}

      if (filtros.usuario_id) {
        whereClause.usuario_id = filtros.usuario_id
      }

      if (filtros.laboratorio_id) {
        whereClause.laboratorio_id = filtros.laboratorio_id
      }

      if (filtros.guia_laboratorio_id) {
        whereClause.guia_laboratorio_id = filtros.guia_laboratorio_id
      }

      return await Bitacora.findAll({
        where: whereClause,
        include: [
          {
            model: GuiaLaboratorio,
            as: "guia",
            attributes: ["id", "titulo"],
          },
          {
            model: Laboratorio,
            as: "laboratorio",
            attributes: ["id", "nombre", "descripcion"],
          },
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id", "nombre", "correo"],
          },
        ],
        order: [["createdAt", "DESC"]],
      })
    } catch (error) {
      throw new Error(`Error al obtener bitácoras: ${error.message}`)
    }
  }

  async actualizar(id, datosActualizacion) {
    try {
      const [filasAfectadas] = await Bitacora.update(datosActualizacion, {
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Bitácora no encontrada")
      }

      return await this.obtenerPorId(id)
    } catch (error) {
      throw new Error(`Error al actualizar bitácora: ${error.message}`)
    }
  }

  async eliminar(id) {
    try {
      const filasAfectadas = await Bitacora.destroy({
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Bitácora no encontrada")
      }

      return true
    } catch (error) {
      throw new Error(`Error al eliminar bitácora: ${error.message}`)
    }
  }
}

module.exports = new BitacoraRepository()
