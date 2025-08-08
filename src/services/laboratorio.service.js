const laboratorioRepository = require("../repositories/laboratorio.repository")

class LaboratorioService {
  async crearLaboratorio(datosLaboratorio) {
    try {
      return await laboratorioRepository.crear(datosLaboratorio)
    } catch (error) {
      throw new Error(`Error en servicio de laboratorio: ${error.message}`)
    }
  }

  async obtenerLaboratorio(id) {
    try {
      const laboratorio = await laboratorioRepository.obtenerPorId(id)
      if (!laboratorio) {
        throw new Error("Laboratorio no encontrado")
      }
      return laboratorio
    } catch (error) {
      throw new Error(`Error en servicio de laboratorio: ${error.message}`)
    }
  }

  async obtenerLaboratorios(filtros = {}) {
    try {
      return await laboratorioRepository.obtenerTodos(filtros)
    } catch (error) {
      throw new Error(`Error en servicio de laboratorio: ${error.message}`)
    }
  }

  async actualizarLaboratorio(id, datosActualizacion) {
    try {
      return await laboratorioRepository.actualizar(id, datosActualizacion)
    } catch (error) {
      throw new Error(`Error en servicio de laboratorio: ${error.message}`)
    }
  }

  async eliminarLaboratorio(id) {
    try {
      return await laboratorioRepository.eliminar(id)
    } catch (error) {
      throw new Error(`Error en servicio de laboratorio: ${error.message}`)
    }
  }
}

module.exports = new LaboratorioService()
