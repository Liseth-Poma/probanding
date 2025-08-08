const guiaLaboratorioRepository = require("../repositories/guiaLaboratorio.repository")

class GuiaLaboratorioService {
  async crearGuia(datosGuia) {
    try {
      return await guiaLaboratorioRepository.crear(datosGuia)
    } catch (error) {
      throw new Error(`Error en servicio de guía: ${error.message}`)
    }
  }

  async obtenerGuia(id) {
    try {
      const guia = await guiaLaboratorioRepository.obtenerPorId(id)
      if (!guia) {
        throw new Error("Guía no encontrada")
      }
      return guia
    } catch (error) {
      throw new Error(`Error en servicio de guía: ${error.message}`)
    }
  }

  async obtenerGuias(filtros = {}) {
    try {
      return await guiaLaboratorioRepository.obtenerTodas(filtros)
    } catch (error) {
      throw new Error(`Error en servicio de guía: ${error.message}`)
    }
  }

  async actualizarGuia(id, datosActualizacion) {
    try {
      return await guiaLaboratorioRepository.actualizar(id, datosActualizacion)
    } catch (error) {
      throw new Error(`Error en servicio de guía: ${error.message}`)
    }
  }

  async eliminarGuia(id) {
    try {
      return await guiaLaboratorioRepository.eliminar(id)
    } catch (error) {
      throw new Error(`Error en servicio de guía: ${error.message}`)
    }
  }
}

module.exports = new GuiaLaboratorioService()
