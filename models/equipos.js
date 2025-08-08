const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('equipos', {
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
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "equipos_codigo_key"
    },
    marca: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    modelo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    numero_serie: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    especificaciones_tecnicas: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "disponible"
    },
    fecha_adquisicion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    valor_compra: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    ubicacion_fisica: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    laboratorio_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'laboratorios',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'equipos',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "equipos_codigo_key",
        unique: true,
        fields: [
          { name: "codigo" },
        ]
      },
      {
        name: "equipos_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
