const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const Usuario = require('../src/models/usuario.model') // Corregir ruta

// Configuración de Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback" 
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google Profile:', profile)
    
    // Buscar usuario existente por provider
    let usuario = await Usuario.findByProvider('google', profile.id)
    
    if (usuario) {
      console.log('Usuario OAuth existente encontrado:', usuario.correo)
      // Usuario existe, actualizar información si es necesario
      if (usuario.avatar !== profile.photos[0]?.value) {
        usuario.avatar = profile.photos[0]?.value
        await usuario.save()
      }
      return done(null, usuario)
    }
    
    // Buscar por email en caso de que el usuario ya exista con login local
    const usuarioExistente = await Usuario.findOne({
      where: { correo: profile.emails[0].value }
    })
    
    if (usuarioExistente) {
      console.log('Vinculando cuenta existente con Google:', usuarioExistente.correo)
      // Vincular cuenta existente con Google
      usuarioExistente.provider = 'google'
      usuarioExistente.providerId = profile.id
      usuarioExistente.avatar = profile.photos[0]?.value
      await usuarioExistente.save()
      return done(null, usuarioExistente)
    }
    
    // Crear nuevo usuario
    console.log('Creando nuevo usuario OAuth:', profile.emails[0].value)
    const nuevoUsuario = await Usuario.create({
      nombre: profile.displayName,
      correo: profile.emails[0].value,
      provider: 'google',
      providerId: profile.id,
      avatar: profile.photos[0]?.value,
      rol: 'estudiante', // Rol por defecto
      password: null // No tiene password local
    })
    
    return done(null, nuevoUsuario)
    
  } catch (error) {
    console.error('Error en Google OAuth Strategy:', error)
    return done(error, null)
  }
}))

// Serialización para sesiones (si las usas)
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Usuario.findByPk(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

module.exports = passport