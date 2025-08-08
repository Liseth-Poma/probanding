const EquipoLaboratorioRepository = require("../repositories/equipoLaboratorio.repository")

class EquipoLaboratorioService {
  async getAllEquipos() {
    try {
      return await EquipoLaboratorioRepository.findAll()
    } catch (error) {
      throw new Error(`Error al obtener equipos: ${error.message}`)
    }
  }

  async getEquipoById(id) {
    try {
      const equipo = await EquipoLaboratorioRepository.findById(id)
      if (!equipo) {
        throw new Error("Equipo no encontrado")
      }
      return equipo
    } catch (error) {
      throw new Error(`Error al obtener equipo: ${error.message}`)
    }
  }

  async getEquiposByLaboratorio(laboratorioId) {
    try {
      return await EquipoLaboratorioRepository.findByLaboratorio(laboratorioId)
    } catch (error) {
      throw new Error(`Error al obtener equipos por laboratorio: ${error.message}`)
    }
  }

  async getEquiposByEstado(estado) {
    try {
      return await EquipoLaboratorioRepository.findByEstado(estado)
    } catch (error) {
      throw new Error(`Error al obtener equipos por estado: ${error.message}`)
    }
  }

  async createEquipo(equipoData) {
    try {
      // Verificar códigos únicos si se proporcionan
      if (equipoData.codigo_inventario) {
        const existingByCodigo = await EquipoLaboratorioRepository.findByCodigoInventario(equipoData.codigo_inventario)
        if (existingByCodigo) {
          throw new Error("Ya existe un equipo con este código de inventario")
        }
      }

      if (equipoData.numero_serie) {
        const existingBySerie = await EquipoLaboratorioRepository.findByNumeroSerie(equipoData.numero_serie)
        if (existingBySerie) {
          throw new Error("Ya existe un equipo con este número de serie")
        }
      }

      return await EquipoLaboratorioRepository.create(equipoData)
    } catch (error) {
      throw new Error(`Error al crear equipo: ${error.message}`)
    }
  }

  async updateEquipo(id, equipoData) {
    try {
      const equipo = await EquipoLaboratorioRepository.findById(id)
      if (!equipo) {
        throw new Error("Equipo no encontrado")
      }

      // Verificar códigos únicos si se están cambiando
      if (equipoData.codigo_inventario && equipoData.codigo_inventario !== equipo.codigo_inventario) {
        const existingByCodigo = await EquipoLaboratorioRepository.findByCodigoInventario(equipoData.codigo_inventario)
        if (existingByCodigo) {
          throw new Error("Ya existe un equipo con este código de inventario")
        }
      }

      if (equipoData.numero_serie && equipoData.numero_serie !== equipo.numero_serie) {
        const existingBySerie = await EquipoLaboratorioRepository.findByNumeroSerie(equipoData.numero_serie)
        if (existingBySerie) {
          throw new Error("Ya existe un equipo con este número de serie")
        }
      }

      const updated = await EquipoLaboratorioRepository.update(id, equipoData)
      if (!updated) {
        throw new Error("No se pudo actualizar el equipo")
      }

      return await EquipoLaboratorioRepository.findById(id)
    } catch (error) {
      throw new Error(`Error al actualizar equipo: ${error.message}`)
    }
  }

  async deleteEquipo(id) {
    try {
      const equipo = await EquipoLaboratorioRepository.findById(id)
      if (!equipo) {
        throw new Error("Equipo no encontrado")
      }

      await EquipoLaboratorioRepository.delete(id)
      return { message: "Equipo eliminado correctamente" }
    } catch (error) {
      throw new Error(`Error al eliminar equipo: ${error.message}`)
    }
  }

  async cambiarEstadoEquipo(id, nuevoEstado) {
    try {
      const estadosValidos = ["disponible", "en_uso", "mantenimiento", "dañado", "fuera_servicio"]
      if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error("Estado no válido")
      }

      const updated = await EquipoLaboratorioRepository.update(id, { estado: nuevoEstado })
      if (!updated) {
        throw new Error("No se pudo cambiar el estado del equipo")
      }

      return await EquipoLaboratorioRepository.findById(id)
    } catch (error) {
      throw new Error(`Error al cambiar estado del equipo: ${error.message}`)
    }
  }
}

module.exports = new EquipoLaboratorioService()
