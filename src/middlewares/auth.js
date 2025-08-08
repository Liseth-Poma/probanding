const Usuario = require("../models/usuario.model")
const TokenManager = require("../../utils/tokenManager")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido",
      })
    }

    // Verificar JWT básico primero
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key")
    const usuario = await Usuario.findByPk(decoded.id)

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    // Verificar token único con TokenManager
    try {
      await TokenManager.verifyUniqueToken(token, usuario)
    } catch (tokenError) {
      // Token no válido o no es el activo, invalidar y rechazar
      await usuario.invalidarToken()
      return res.status(401).json({
        success: false,
        message: "Sesión inválida o expirada. Inicia sesión nuevamente.",
        code: "TOKEN_INVALID"
      })
    }

    req.user = usuario
    req.token = token
    next()
  } catch (error) {
    // Error en verificación JWT o cualquier otro error
    return res.status(401).json({
      success: false,
      message: "Token inválido",
      code: "TOKEN_ERROR"
    })
  }
}

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Acceso no autorizado"
      })
    }

    const userRole = req.user.rol
    const allowedRoles = Array.isArray(roles) ? roles : [roles]

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere rol: ${allowedRoles.join(" o ")}`
      })
    }

    next()
  }
}

// Middleware específicos para roles comunes
const requireJefeLaboratorio = requireRole("jefe_laboratorio")
const requireDocente = requireRole(["docente", "admin", "jefe_laboratorio"])
const requireAdmin = requireRole("admin")

// Middleware para endpoints que requieren invalidar la sesión actual
const requireSessionInvalidation = async (req, res, next) => {
  // Útil para cambio de contraseña, etc.
  req.invalidateCurrentSession = async () => {
    if (req.user) {
      await req.user.invalidarToken()
    }
  }
  next()
}

module.exports = {
  auth,
  requireRole,
  requireJefeLaboratorio,
  requireDocente,
  requireAdmin,
  requireSessionInvalidation
}
