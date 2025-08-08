const equipoRepository = require("../repositories/equipo.repository")

class EquipoService {
  async crearEquipo(datosEquipo) {
    try {
      return await equipoRepository.crear(datosEquipo)
    } catch (error) {
      throw new Error(`Error en servicio de equipo: ${error.message}`)
    }
  }

  async obtenerEquipo(id) {
    try {
      const equipo = await equipoRepository.obtenerPorId(id)
      if (!equipo) {
        throw new Error("Equipo no encontrado")
      }
      return equipo
    } catch (error) {
      throw new Error(`Error en servicio de equipo: ${error.message}`)
    }
  }

  async obtenerEquipos(filtros = {}) {
    try {
      return await equipoRepository.obtenerTodos(filtros)
    } catch (error) {
      throw new Error(`Error en servicio de equipo: ${error.message}`)
    }
  }

  async actualizarEquipo(id, datosActualizacion) {
    try {
      return await equipoRepository.actualizar(id, datosActualizacion)
    } catch (error) {
      throw new Error(`Error en servicio de equipo: ${error.message}`)
    }
  }

  async eliminarEquipo(id) {
    try {
      return await equipoRepository.eliminar(id)
    } catch (error) {
      throw new Error(`Error en servicio de equipo: ${error.message}`)
    }
  }

  async obtenerEquiposPorLaboratorio(laboratorioId) {
    try {
      return await equipoRepository.obtenerPorLaboratorio(laboratorioId)
    } catch (error) {
      throw new Error(`Error en servicio de equipo: ${error.message}`)
    }
  }
}

module.exports = new EquipoService()
