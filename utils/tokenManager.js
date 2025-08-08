const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')

class TokenManager {
  
  // Generar token único con firma adicional
  static generateUniqueToken(usuario, deviceInfo = {}) {
    const jti = uuidv4() // JWT ID único
    const timestamp = Date.now()
    
    const payload = {
      id: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
      provider: usuario.provider || 'local',
      jti: jti,
      iat: Math.floor(timestamp / 1000),
      exp: Math.floor((timestamp + (24 * 60 * 60 * 1000)) / 1000) // 24 horas
    }
    
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key')
    
    // Crear firma adicional para validación
    const signature = this.createTokenSignature(usuario.id, jti, timestamp)
    
    return { token, signature, jti, timestamp }
  }
  
  // Crear firma adicional del token
  static createTokenSignature(userId, jti, timestamp) {
    const data = `${userId}:${jti}:${timestamp}:${process.env.JWT_SECRET || 'secret_key'}`
    return crypto.createHash('sha256').update(data).digest('hex')
  }
  
  // Verificar token y firma
  static async verifyUniqueToken(token, usuario) {
    try {
      // Verificar JWT básico
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key')
      
      // Verificar que el token coincida con el activo del usuario
      if (usuario.activeToken !== token) {
        throw new Error('Token no es el activo para este usuario')
      }
      
      // Verificar firma adicional
      const expectedSignature = this.createTokenSignature(
        usuario.id,
        decoded.jti,
        decoded.iat * 1000
      )
      
      if (usuario.tokenSignature !== expectedSignature) {
        throw new Error('Firma del token inválida')
      }
      
      return decoded
    } catch (error) {
      throw error
    }
  }
  
  // Invalidar todos los tokens de un usuario
  static async invalidateAllTokens(usuario) {
    await usuario.invalidarToken()
  }
  
  // Establecer nuevo token único (invalida el anterior automáticamente)
  static async setUniqueToken(usuario, deviceInfo = {}) {
    const { token, signature } = this.generateUniqueToken(usuario, deviceInfo)
    
    // Guardar info del dispositivo/IP si se proporciona
    if (Object.keys(deviceInfo).length > 0) {
      usuario.lastLoginInfo = deviceInfo
    }
    
    await usuario.establecerTokenUnico(token, signature)
    
    return token
  }
  
  // Extraer información del dispositivo de la request
  static extractDeviceInfo(req) {
    return {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    }
  }
}

module.exports = TokenManager