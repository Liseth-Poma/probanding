const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const TokenManager = {
  extractDeviceInfo(req) {
    return {
      userAgent: req.headers['user-agent'] || 'unknown',
      ip: req.ip || 'unknown',
    }
  },

  async setUniqueToken(usuario, deviceInfo) {
    console.log('Generating token for user:', usuario.correo)
    const payload = { id: usuario.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
    const signature = crypto.createHmac('sha256', process.env.JWT_SECRET)
      .update(token)
      .digest('hex')
    
    console.log('Generated token:', token)
    console.log('Generated signature:', signature)
    
    await usuario.establecerTokenUnico(token, signature)
    return token
  },

  async verifyUniqueToken(token, usuario) {
    console.log('Verifying token for user:', usuario.correo)
    console.log('Received token:', token)
    console.log('Stored activeToken:', usuario.activeToken)
    
    if (token !== usuario.activeToken) {
      throw new Error('Token no es el activo para este usuario')
    }

    const signature = crypto.createHmac('sha256', process.env.JWT_SECRET)
      .update(token)
      .digest('hex')
    console.log('Calculated signature:', signature)
    console.log('Stored tokenSignature:', usuario.tokenSignature)
    
    if (signature !== usuario.tokenSignature) {
      throw new Error('Firma del token inválida')
    }

    jwt.verify(token, process.env.JWT_SECRET)
  }
}

module.exports = TokenManager