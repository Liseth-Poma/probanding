const bitacoraRepository = require("../repositories/bitacora.repository")
const usuarioService = require("./usuario.service")
const laboratorioService = require("./laboratorio.service")

class BitacoraService {
  async crearBitacora(datosBitacora) {
    try {
      return await bitacoraRepository.crear(datosBitacora)
    } catch (error) {
      throw new Error(`Error en servicio de bitácora: ${error.message}`)
    }
  }

  async obtenerBitacora(id) {
    try {
      const bitacora = await bitacoraRepository.obtenerPorId(id)
      if (!bitacora) {
        throw new Error("Bitácora no encontrada")
      }
      return bitacora
    } catch (error) {
      throw new Error(`Error en servicio de bitácora: ${error.message}`)
    }
  }

  async obtenerBitacoras(filtros = {}) {
    try {
      return await bitacoraRepository.obtenerTodas(filtros)
    } catch (error) {
      throw new Error(`Error en servicio de bitácora: ${error.message}`)
    }
  }

  async actualizarBitacora(id, datosActualizacion) {
    try {
      return await bitacoraRepository.actualizar(id, datosActualizacion)
    } catch (error) {
      throw new Error(`Error en servicio de bitácora: ${error.message}`)
    }
  }

  async eliminarBitacora(id) {
    try {
      return await bitacoraRepository.eliminar(id)
    } catch (error) {
      throw new Error(`Error en servicio de bitácora: ${error.message}`)
    }
  }

  async iniciarSesion(id, usuarioId) {
    try {
      const bitacora = await this.obtenerBitacora(id)

      if (bitacora.estado !== "borrador") {
        throw new Error("Solo se pueden iniciar sesiones de bitácoras en borrador")
      }

      if (bitacora.bloqueada) {
        throw new Error("No se puede iniciar sesión de una bitácora bloqueada")
      }

      return await bitacoraRepository.actualizar(id, {
        estado: "en_sesion",
        ultima_modificacion_por: usuarioId,
      })
    } catch (error) {
      throw new Error(`Error al iniciar sesión: ${error.message}`)
    }
  }

  async completarSesion(id, usuarioId, observaciones = "") {
    try {
      const bitacora = await this.obtenerBitacora(id)

      if (bitacora.estado !== "en_sesion") {
        throw new Error("Solo se pueden completar sesiones en curso")
      }

      return await bitacoraRepository.actualizar(id, {
        estado: "completada",
        observaciones_generales: observaciones,
        ultima_modificacion_por: usuarioId,
      })
    } catch (error) {
      throw new Error(`Error al completar sesión: ${error.message}`)
    }
  }

  async firmarBitacora(id, usuarioId) {
    try {
      const bitacora = await this.obtenerBitacora(id)

      if (bitacora.estado !== "completada") {
        throw new Error("Solo se pueden firmar bitácoras completadas")
      }

      if (bitacora.bloqueada) {
        throw new Error("No se puede firmar una bitácora bloqueada")
      }

      // Verificar que es el profesor responsable
      if (bitacora.creada_por !== usuarioId) {
        const usuario = await usuarioService.obtenerUsuario(usuarioId)
        if (usuario.rol !== "jefe_laboratorio") {
          throw new Error("Solo el profesor responsable o jefe de laboratorio puede firmar")
        }
      }

      return await bitacoraRepository.actualizar(id, {
        firma_profesor: true,
        fecha_firma_profesor: new Date(),
        estado: "firmada",
        ultima_modificacion_por: usuarioId,
      })
    } catch (error) {
      throw new Error(`Error al firmar bitácora: ${error.message}`)
    }
  }

  async bloquearBitacora(id, usuarioId, motivo) {
    try {
      // Solo jefes de laboratorio pueden bloquear
      const usuario = await usuarioService.obtenerUsuario(usuarioId)
      if (usuario.rol !== "jefe_laboratorio") {
        throw new Error("Solo el jefe de laboratorio puede bloquear bitácoras")
      }

      if (!motivo) {
        throw new Error("El motivo de bloqueo es requerido")
      }

      const bitacora = await this.obtenerBitacora(id)

      if (bitacora.bloqueada) {
        throw new Error("La bitácora ya está bloqueada")
      }

      return await bitacoraRepository.actualizar(id, {
        bloqueada: true,
        motivo_bloqueo: motivo,
        fecha_bloqueo: new Date(),
        bloqueada_por: usuarioId,
        estado: "bloqueada",
        ultima_modificacion_por: usuarioId,
      })
    } catch (error) {
      throw new Error(`Error al bloquear bitácora: ${error.message}`)
    }
  }

  async desbloquearBitacora(id, usuarioId) {
    try {
      // Solo jefes de laboratorio pueden desbloquear
      const usuario = await usuarioService.obtenerUsuario(usuarioId)
      if (usuario.rol !== "jefe_laboratorio") {
        throw new Error("Solo el jefe de laboratorio puede desbloquear bitácoras")
      }

      const bitacora = await this.obtenerBitacora(id)

      if (!bitacora.bloqueada) {
        throw new Error("La bitácora no está bloqueada")
      }

      // Determinar el estado anterior
      let estadoAnterior = "borrador"
      if (bitacora.firma_profesor) {
        estadoAnterior = "firmada"
      } else if (bitacora.observaciones_generales) {
        estadoAnterior = "completada"
      }

      return await bitacoraRepository.actualizar(id, {
        bloqueada: false,
        motivo_bloqueo: null,
        fecha_bloqueo: null,
        bloqueada_por: null,
        estado: estadoAnterior,
        ultima_modificacion_por: usuarioId,
      })
    } catch (error) {
      throw new Error(`Error al desbloquear bitácora: ${error.message}`)
    }
  }

  async actualizarMesaTrabajo(id, numeroMesa, datosMesa, usuarioId) {
    try {
      const bitacora = await this.obtenerBitacora(id)

      if (bitacora.bloqueada) {
        throw new Error("No se puede editar una bitácora bloqueada")
      }

      if (bitacora.estado === "firmada") {
        throw new Error("No se puede editar una bitácora firmada")
      }

      // Validar datos de la mesa
      this.validarDatosMesa(datosMesa)

      // Actualizar la mesa específica
      const mesasActualizadas = [...bitacora.mesas_trabajo]
      const indiceMesa = mesasActualizadas.findIndex((mesa) => mesa.numero_mesa === numeroMesa)

      if (indiceMesa === -1) {
        throw new Error("Mesa de trabajo no encontrada")
      }

      mesasActualizadas[indiceMesa] = {
        ...mesasActualizadas[indiceMesa],
        ...datosMesa,
        numero_mesa: numeroMesa, // Asegurar que no se cambie el número
      }

      return await bitacoraRepository.actualizar(id, {
        mesas_trabajo: mesasActualizadas,
        ultima_modificacion_por: usuarioId,
      })
    } catch (error) {
      throw new Error(`Error al actualizar mesa de trabajo: ${error.message}`)
    }
  }

  async obtenerBitacorasPorProfesor(profesorId, filtros = {}) {
    try {
      return await bitacoraRepository.obtenerPorCreador(profesorId, filtros)
    } catch (error) {
      throw new Error(`Error al obtener bitácoras del profesor: ${error.message}`)
    }
  }

  async generarReporte(filtros = {}) {
    try {
      const bitacoras = await this.obtenerBitacoras(filtros)
      const estadisticas = await bitacoraRepository.obtenerEstadisticas(filtros)

      return {
        bitacoras,
        estadisticas,
        resumen: {
          total_bitacoras: bitacoras.length,
          borradores: bitacoras.filter((b) => b.estado === "borrador").length,
          en_sesion: bitacoras.filter((b) => b.estado === "en_sesion").length,
          completadas: bitacoras.filter((b) => b.estado === "completada").length,
          firmadas: bitacoras.filter((b) => b.estado === "firmada").length,
          bloqueadas: bitacoras.filter((b) => b.bloqueada).length,
          promedio_alumnos: bitacoras.reduce((sum, b) => sum + b.numero_alumnos, 0) / bitacoras.length || 0,
        },
      }
    } catch (error) {
      throw new Error(`Error al generar reporte: ${error.message}`)
    }
  }

  // Métodos de validación y utilidad
  validarDatosMesa(mesa) {
    if (!mesa.numero_mesa) {
      throw new Error("El número de mesa es requerido")
    }

    if (!mesa.alumno_responsable || mesa.alumno_responsable.trim().length === 0) {
      throw new Error("El alumno responsable es requerido")
    }

    if (!Array.isArray(mesa.equipos_entregados)) {
      throw new Error("Los equipos entregados deben ser un array")
    }
  }
}

module.exports = new BitacoraService()
