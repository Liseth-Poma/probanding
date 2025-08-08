const express = require("express")
const passport = require("../../config/passport")
const usuarioController = require("../controllers/usuario.controller")
const { auth, requireRole, requireSessionInvalidation } = require("../middlewares/auth")

const router = express.Router()

// ==================== RUTAS PÚBLICAS ====================

// Autenticación local
router.post("/login", usuarioController.login)
router.post("/", usuarioController.crear)

// ==================== RUTAS OAUTH2 ====================

// Google OAuth
router.get("/auth/google", 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
)

router.get("/auth/google/callback",
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}?error=google_auth_failed`,
    session: false 
  }),
  usuarioController.oauthSuccess
)


// ==================== RUTAS SEMI-PROTEGIDAS ====================
// Verificar token (necesario para el contexto de auth del frontend)
router.get("/verify", auth, usuarioController.verify)

// ==================== RUTAS PROTEGIDAS ====================
// Aplicar middleware de autenticación a todas las rutas siguientes
router.use(auth)

// Logout
router.post("/logout", usuarioController.logout)

// Cambiar contraseña (invalida todas las sesiones)
router.put("/cambiar-password", requireSessionInvalidation, usuarioController.cambiarPassword)

// ==================== RUTAS ADMIN/DOCENTE ====================

// Obtener todos los usuarios (solo admin/docente)
router.get("/", requireRole(["admin", "docente"]), usuarioController.obtenerTodos)

// Obtener usuarios por rol
router.get("/rol/:rol", requireRole(["admin", "docente"]), usuarioController.obtenerPorRol)

// Obtener usuario por ID
router.get("/:id", usuarioController.obtenerPorId)

// Actualizar usuario
router.put("/:id", requireRole(["admin"]), usuarioController.actualizar)

// Eliminar usuario (solo admin)
router.delete("/:id", requireRole(["admin"]), usuarioController.eliminar)

module.exports = router