const asignaturaRepository = require("../repositories/asignatura.repository")

class AsignaturaService {
  async crearAsignatura(datosAsignatura) {
    try {
      return await asignaturaRepository.crear(datosAsignatura)
    } catch (error) {
      throw new Error(`Error en servicio de asignatura: ${error.message}`)
    }
  }

  async obtenerAsignatura(id) {
    try {
      const asignatura = await asignaturaRepository.obtenerPorId(id)
      if (!asignatura) {
        throw new Error("Asignatura no encontrada")
      }
      return asignatura
    } catch (error) {
      throw new Error(`Error en servicio de asignatura: ${error.message}`)
    }
  }

  async obtenerAsignaturas(filtros = {}) {
    try {
      return await asignaturaRepository.obtenerTodas(filtros)
    } catch (error) {
      throw new Error(`Error en servicio de asignatura: ${error.message}`)
    }
  }

  async actualizarAsignatura(id, datosActualizacion) {
    try {
      return await asignaturaRepository.actualizar(id, datosActualizacion)
    } catch (error) {
      throw new Error(`Error en servicio de asignatura: ${error.message}`)
    }
  }

  async eliminarAsignatura(id) {
    try {
      return await asignaturaRepository.eliminar(id)
    } catch (error) {
      throw new Error(`Error en servicio de asignatura: ${error.message}`)
    }
  }

  async obtenerAsignaturasPorDocente(docenteId) {
    try {
      return await asignaturaRepository.obtenerPorDocente(docenteId)
    } catch (error) {
      throw new Error(`Error en servicio de asignatura: ${error.message}`)
    }
  }
}

module.exports = new AsignaturaService()
