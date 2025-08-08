const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuarios', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: "usuarios_email_key"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "estudiante"
    },
    codigo_estudiante: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: "usuarios_codigo_estudiante_key"
    },
    programa_academico: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    departamento: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    documento_identidad: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: "usuarios_documento_identidad_key"
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'usuarios',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "usuarios_codigo_estudiante_key",
        unique: true,
        fields: [
          { name: "codigo_estudiante" },
        ]
      },
      {
        name: "usuarios_documento_identidad_key",
        unique: true,
        fields: [
          { name: "documento_identidad" },
        ]
      },
      {
        name: "usuarios_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "usuarios_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
