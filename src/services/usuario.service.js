const usuarioRepository = require("../repositories/usuario.repository")
const bcrypt = require("bcrypt")

class UsuarioService {
  async crearUsuario(datosUsuario) {
    try {
      // Validar que el correo no exista
      const usuarioExistente = await usuarioRepository.obtenerPorCorreo(datosUsuario.correo)
      if (usuarioExistente) {
        throw new Error("El correo ya está registrado")
      }

      // Encriptar contraseña si se proporciona
      if (datosUsuario.password) {
        const saltRounds = 10
        datosUsuario.password = await bcrypt.hash(datosUsuario.password, saltRounds)
      }

      return await usuarioRepository.crear(datosUsuario)
    } catch (error) {
      throw new Error(`Error en servicio de usuario: ${error.message}`)
    }
  }

  async obtenerUsuario(id) {
    try {
      const usuario = await usuarioRepository.obtenerPorId(id)
      if (!usuario) {
        throw new Error("Usuario no encontrado")
      }
      return usuario
    } catch (error) {
      throw new Error(`Error en servicio de usuario: ${error.message}`)
    }
  }

  async obtenerUsuarios(filtros = {}) {
    try {
      return await usuarioRepository.obtenerTodos(filtros)
    } catch (error) {
      throw new Error(`Error en servicio de usuario: ${error.message}`)
    }
  }

  async actualizarUsuario(id, datosActualizacion) {
    try {
      // Si se actualiza la contraseña, encriptarla
      if (datosActualizacion.password) {
        const saltRounds = 10
        datosActualizacion.password = await bcrypt.hash(datosActualizacion.password, saltRounds)
      }

      return await usuarioRepository.actualizar(id, datosActualizacion)
    } catch (error) {
      throw new Error(`Error en servicio de usuario: ${error.message}`)
    }
  }

  async eliminarUsuario(id) {
    try {
      return await usuarioRepository.eliminar(id)
    } catch (error) {
      throw new Error(`Error en servicio de usuario: ${error.message}`)
    }
  }

  async autenticarUsuario(correo, password) {
    try {
      const usuario = await usuarioRepository.obtenerPorCorreo(correo)
      if (!usuario) {
        throw new Error("Credenciales inválidas")
      }

      if (password && usuario.password) {
        const passwordValida = await bcrypt.compare(password, usuario.password)
        if (!passwordValida) {
          throw new Error("Credenciales inválidas")
        }
      }

      return usuario
    } catch (error) {
      throw new Error(`Error en autenticación: ${error.message}`)
    }
  }

  async obtenerUsuariosPorRol(rol) {
    try {
      return await usuarioRepository.obtenerPorRol(rol)
    } catch (error) {
      throw new Error(`Error en servicio de usuario: ${error.message}`)
    }
  }
}

module.exports = new UsuarioService()
