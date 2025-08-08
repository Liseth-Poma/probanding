const Usuario = require("../models/usuario.model")
const TokenManager = require("../../utils/tokenManager")
const bcrypt = require("bcryptjs")

const usuarioController = {
  
  // Login local (email/password)
  login: async (req, res) => {
    try {
      const { correo, password } = req.body

      if (!correo || !password) {
        return res.status(400).json({
          success: false,
          message: "Email y contraseña son requeridos"
        })
      }

      // Buscar usuario
      const usuario = await Usuario.findOne({ where: { correo } })
      
      if (!usuario) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas"
        })
      }

      // Validar contraseña
      const passwordValido = await usuario.validarPassword(password)
      
      if (!passwordValido) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas"
        })
      }

      // Extraer información del dispositivo
      const deviceInfo = TokenManager.extractDeviceInfo(req)

      // Generar token único (invalida el anterior automáticamente)
      const token = await TokenManager.setUniqueToken(usuario, deviceInfo)

      // Respuesta exitosa
      res.json({
        success: true,
        message: "Login exitoso",
        data: {
          token,
          usuario: {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol,
            provider: usuario.provider,
            avatar: usuario.avatar
          }
        }
      })

    } catch (error) {
      console.error("Error en login:", error)
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      })
    }
  },

  // Verificar token (para el contexto de auth del frontend)
  verify: async (req, res) => {
    try {
      // El middleware auth ya validó todo, solo devolver datos del usuario
      res.json({
        success: true,
        data: {
          usuario: {
            id: req.user.id,
            nombre: req.user.nombre,
            correo: req.user.correo,
            rol: req.user.rol,
            provider: req.user.provider,
            avatar: req.user.avatar
          }
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al verificar token"
      })
    }
  },

  // Logout - Invalidar token actual
  logout: async (req, res) => {
    try {
      await req.user.invalidarToken()
      
      res.json({
        success: true,
        message: "Logout exitoso"
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al cerrar sesión"
      })
    }
  },

  // Callback exitoso de OAuth (para redirección)
  oauthSuccess: async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?error=oauth_failed`)
      }

      // Extraer información del dispositivo
      const deviceInfo = TokenManager.extractDeviceInfo(req)

      // Generar token único
      const token = await TokenManager.setUniqueToken(req.user, deviceInfo)

      // Redireccionar al frontend con el token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
      res.redirect(`${frontendUrl}/oauth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: req.user.id,
        nombre: req.user.nombre,
        correo: req.user.correo,
        rol: req.user.rol,
        provider: req.user.provider,
        avatar: req.user.avatar
      }))}`)
      
    } catch (error) {
      console.error("Error en OAuth callback:", error)
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
      res.redirect(`${frontendUrl}?error=oauth_error`)
    }
  },

  // Crear usuario
  crear: async (req, res) => {
    try {
      const { nombre, correo, password, rol } = req.body

      const usuarioExistente = await Usuario.findOne({ where: { correo } })
      
      if (usuarioExistente) {
        return res.status(400).json({
          success: false,
          message: "El email ya está registrado"
        })
      }

      const nuevoUsuario = await Usuario.create({
        nombre,
        correo,
        password,
        rol,
        provider: 'local'
      })

      // No devolver el password en la respuesta
      const { password: _, ...usuarioSinPassword } = nuevoUsuario.toJSON()

      res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        data: usuarioSinPassword
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al crear usuario"
      })
    }
  },

  // Cambiar contraseña (invalida todas las sesiones)
  cambiarPassword: async (req, res) => {
    try {
      const { passwordActual, passwordNueva } = req.body
      const usuario = req.user

      // Validar contraseña actual solo si el usuario tiene password local
      if (usuario.provider === 'local' && usuario.password) {
        const passwordValido = await usuario.validarPassword(passwordActual)
        if (!passwordValido) {
          return res.status(400).json({
            success: false,
            message: "Contraseña actual incorrecta"
          })
        }
      }

      // Actualizar contraseña
      usuario.password = passwordNueva
      usuario.provider = 'local' // Cambiar a local si era OAuth
      await usuario.save()

      // Invalidar todas las sesiones (forzar re-login)
      await usuario.invalidarToken()

      res.json({
        success: true,
        message: "Contraseña actualizada. Por favor, inicia sesión nuevamente."
      })

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al cambiar contraseña"
      })
    }
  },

  // Obtener todos los usuarios
  obtenerTodos: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ['password', 'activeToken', 'tokenSignature'] }
      })
      
      res.json({
        success: true,
        data: usuarios
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener usuarios"
      })
    }
  },

  // Obtener usuario por ID
  obtenerPorId: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id, {
        attributes: { exclude: ['password', 'activeToken', 'tokenSignature'] }
      })
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        })
      }

      res.json({
        success: true,
        data: usuario
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener usuario"
      })
    }
  },

  // Obtener usuarios por rol
  obtenerPorRol: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        where: { rol: req.params.rol },
        attributes: { exclude: ['password', 'activeToken', 'tokenSignature'] }
      })
      
      res.json({
        success: true,
        data: usuarios
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener usuarios por rol"
      })
    }
  },

  // Actualizar usuario
  actualizar: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id)
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        })
      }

      // No permitir actualizar campos sensibles directamente
      const { password, activeToken, tokenSignature, ...datosActualizar } = req.body

      await usuario.update(datosActualizar)

      const { password: _, activeToken: __, tokenSignature: ___, ...usuarioActualizado } = usuario.toJSON()

      res.json({
        success: true,
        message: "Usuario actualizado exitosamente",
        data: usuarioActualizado
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar usuario"
      })
    }
  },

  // Eliminar usuario
  eliminar: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id)
      
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        })
      }

      // Invalidar token antes de eliminar
      await usuario.invalidarToken()
      await usuario.destroy()

      res.json({
        success: true,
        message: "Usuario eliminado exitosamente"
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar usuario"
      })
    }
  }
}
// Callback exitoso de OAuth (para redirección)
oauthSuccess: async (req, res) => {
  try {
    console.log('=== OAuth Success Callback ===')
    console.log('req.user:', req.user)
    
    if (!req.user) {
      console.error('No user found in OAuth callback')
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?error=oauth_failed`)
    }

    // Extraer información del dispositivo
    const deviceInfo = TokenManager.extractDeviceInfo(req)
    console.log('Device info:', deviceInfo)

    // Generar token único
    const token = await TokenManager.setUniqueToken(req.user, deviceInfo)
    console.log('Generated token for user:', req.user.correo)

    // Preparar datos del usuario para el frontend
    const userData = {
      id: req.user.id,
      nombre: req.user.nombre,
      correo: req.user.correo,
      rol: req.user.rol,
      provider: req.user.provider,
      avatar: req.user.avatar
    }
    
    console.log('User data to send:', userData)

    // Redireccionar al frontend con el token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    const redirectUrl = `${frontendUrl}/oauth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`
    
    console.log('Redirecting to:', redirectUrl)
    res.redirect(redirectUrl)
    
  } catch (error) {
    console.error("Error en OAuth callback:", error)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    res.redirect(`${frontendUrl}?error=oauth_error`)
  }
}
module.exports = usuarioController