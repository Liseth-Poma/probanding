const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('laboratorios', {
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
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "laboratorios_codigo_key"
    },
    ubicacion: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    capacidad_maxima: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo_laboratorio: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    equipos_disponibles: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    horario_disponible: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    responsable_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'laboratorios',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "laboratorios_codigo_key",
        unique: true,
        fields: [
          { name: "codigo" },
        ]
      },
      {
        name: "laboratorios_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
