const Asignatura = require("../models/asignatura.model")
const DocenteAsignatura = require("../models/docenteAsignatura.model")
const Usuario = require("../models/usuario.model")
const { Op } = require("sequelize")

class AsignaturaRepository {
  async crear(datosAsignatura) {
    try {
      return await Asignatura.create(datosAsignatura)
    } catch (error) {
      throw new Error(`Error al crear asignatura: ${error.message}`)
    }
  }

  async obtenerPorId(id) {
    try {
      return await Asignatura.findByPk(id, {
        include: [
          {
            model: DocenteAsignatura,
            as: "docente_asignaturas",
            include: [
              {
                model: Usuario,
                as: "docente",
                attributes: ["id", "nombre", "correo"],
              },
            ],
          },
        ],
      })
    } catch (error) {
      throw new Error(`Error al obtener asignatura: ${error.message}`)
    }
  }

  async obtenerTodas(filtros = {}) {
    try {
      const whereClause = {}

      if (filtros.busqueda) {
        whereClause[Op.or] = [
          { nombre: { [Op.iLike]: `%${filtros.busqueda}%` } },
          { codigo: { [Op.iLike]: `%${filtros.busqueda}%` } },
        ]
      }

      return await Asignatura.findAll({
        where: whereClause,
        include: [
          {
            model: DocenteAsignatura,
            as: "docente_asignaturas",
            include: [
              {
                model: Usuario,
                as: "docente",
                attributes: ["id", "nombre", "correo"],
              },
            ],
          },
        ],
        order: [["nombre", "ASC"]],
      })
    } catch (error) {
      throw new Error(`Error al obtener asignaturas: ${error.message}`)
    }
  }

  async actualizar(id, datosActualizacion) {
    try {
      const [filasAfectadas] = await Asignatura.update(datosActualizacion, {
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Asignatura no encontrada")
      }

      return await this.obtenerPorId(id)
    } catch (error) {
      throw new Error(`Error al actualizar asignatura: ${error.message}`)
    }
  }

  async eliminar(id) {
    try {
      const filasAfectadas = await Asignatura.destroy({
        where: { id },
      })

      if (filasAfectadas === 0) {
        throw new Error("Asignatura no encontrada")
      }

      return true
    } catch (error) {
      throw new Error(`Error al eliminar asignatura: ${error.message}`)
    }
  }

  async obtenerPorDocente(docenteId) {
    try {
      return await Asignatura.findAll({
        include: [
          {
            model: DocenteAsignatura,
            as: "docente_asignaturas",
            where: { docente_id: docenteId },
            include: [
              {
                model: Usuario,
                as: "docente",
                attributes: ["id", "nombre", "correo"],
              },
            ],
          },
        ],
        order: [["nombre", "ASC"]],
      })
    } catch (error) {
      throw new Error(`Error al obtener asignaturas del docente: ${error.message}`)
    }
  }
}

module.exports = new AsignaturaRepository()
