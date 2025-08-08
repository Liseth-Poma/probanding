const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")
const bcrypt = require("bcryptjs")

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Cambiar a nullable para usuarios OAuth
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["estudiante", "docente", "admin"]],
      },
    },
    // Nuevos campos para OAuth2
    provider: {
      type: DataTypes.STRING,
      allowNull: true, // 'local', 'google', 'microsoft'
      defaultValue: 'local'
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: true, // ID del usuario en el proveedor OAuth
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true, // URL del avatar del usuario
    },
    // Campo para token único activo
    activeToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Firma del token para validación adicional
    tokenSignature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Timestamp del último login
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Dispositivo/IP del último login (opcional para seguridad)
    lastLoginInfo: {
      type: DataTypes.JSONB,
      allowNull: true,
    }
  },
  {
    tableName: "usuarios",
    timestamps: true,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          usuario.password = await bcrypt.hash(usuario.password, 10)
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password') && usuario.password) {
          usuario.password = await bcrypt.hash(usuario.password, 10)
        }
      }
    }
  },
)

// Método para validar password
Usuario.prototype.validarPassword = async function(password) {
  if (!this.password) return false // Usuario OAuth sin password local
  return await bcrypt.compare(password, this.password)
}

// Método para invalidar token activo
Usuario.prototype.invalidarToken = async function() {
  this.activeToken = null
  this.tokenSignature = null
  await this.save()
}

// Método para establecer nuevo token único
Usuario.prototype.establecerTokenUnico = async function(token, signature) {
  this.activeToken = token
  this.tokenSignature = signature
  this.lastLoginAt = new Date()
  await this.save()
}

// Método estático para encontrar usuario por provider
Usuario.findByProvider = async function(provider, providerId) {
  return await this.findOne({
    where: {
      provider: provider,
      providerId: providerId
    }
  })
}

module.exports = Usuario