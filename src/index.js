const express = require("express")
const cors = require("cors")
const session = require("express-session")
const { sequelize } = require("../config/db")
const passport = require("../config/passport") // Importar configuración de passport
require("./models/associations")

// Importar rutas
const usuarioRoutes = require("./routes/usuario.routes")
const laboratorioRoutes = require("./routes/laboratorio.routes")
const asignaturaRoutes = require("./routes/asignatura.routes")
const equipoRoutes = require("./routes/equipo.routes")
const guiaLaboratorioRoutes = require("./routes/guiaLaboratorio.routes")
const bitacoraRoutes = require("./routes/bitacora.routes")
const inscripcionAsignaturaRoutes = require("./routes/inscripcionAsignatura.routes")
const equipoLaboratorioRoutes = require("./routes/equipoLaboratorio.routes")

const app = express()
const PORT = process.env.PORT || 3001

// ==================== MIDDLEWARES ====================
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuración de sesión para Passport (OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}))

// Inicializar Passport
app.use(passport.initialize())
app.use(passport.session())

// ==================== RUTAS ====================
app.use("/api/usuarios", usuarioRoutes)
app.use("/api/laboratorios", laboratorioRoutes)
app.use("/api/asignaturas", asignaturaRoutes)
app.use("/api/equipos", equipoRoutes)
app.use("/api/guias-laboratorio", guiaLaboratorioRoutes)
app.use("/api/bitacoras", bitacoraRoutes)
app.use("/api/inscripciones-asignaturas", inscripcionAsignaturaRoutes)
app.use("/api/equipos-laboratorio", equipoLaboratorioRoutes)

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API del Sistema de Control de Prácticas de Laboratorio",
    version: "2.0.0",
    features: ["OAuth2 Google", "Single Session Tokens", "Role-based Access"],
    endpoints: {
      usuarios: "/api/usuarios",
      auth: {
        login: "/api/usuarios/login",
        google: "/api/usuarios/auth/google",
        verify: "/api/usuarios/verify",
        logout: "/api/usuarios/logout"
      },
      laboratorios: "/api/laboratorios",
      asignaturas: "/api/asignaturas",
      equipos: "/api/equipos",
      guias: "/api/guias-laboratorio",
      bitacoras: "/api/bitacoras",
      inscripciones: "/api/inscripciones-asignaturas",
      equiposLaboratorio: "/api/equipos-laboratorio",
    },
  })
})

// ==================== MANEJO DE ERRORES ====================
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack)
  
  // Error de Passport OAuth
  if (err.name === 'AuthenticationError') {
    return res.status(401).json({
      success: false,
      message: "Error de autenticación OAuth"
    })
  }
  
  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: "Token inválido"
    })
  }
  
  // Error de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: "Error de validación",
      errors: err.errors.map(e => ({ field: e.path, message: e.message }))
    })
  }
  
  // Error genérico
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  })
})

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada"
  })
})

// ==================== INICIAR SERVIDOR ====================
const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log("✅ Conexión a la base de datos establecida correctamente")

    await sequelize.sync({ alter: true })
    console.log("✅ Modelos sincronizados con la base de datos")

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
      console.log(`🔐 OAuth2 Google configurado`)
      console.log(`🛡️ Sistema de tokens únicos activo`)
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
    })
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error)
    process.exit(1)
  }
}

startServer()