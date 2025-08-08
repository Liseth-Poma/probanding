const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bitacoras', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    departamento: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    carrera: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nombre_laboratorio: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    codigo_laboratorio: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nombre_solicitante: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    fecha_uso_laboratorio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    materia_asignatura: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nivel: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    numero_usuarios: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tema_practica_proyecto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    descargo_equipos: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "borrador"
    },
    guia_laboratorio_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'guias_laboratorio',
        key: 'id'
      }
    },
    periodo_academico: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
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
    tableName: 'bitacoras',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "bitacoras_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
