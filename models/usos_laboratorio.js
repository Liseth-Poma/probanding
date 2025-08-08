const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usos_laboratorio', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    proposito: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    asignatura: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    numero_estudiantes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    equipos_utilizados: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "programado"
    },
    calificacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    comentarios_finales: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'usos_laboratorio',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "usos_laboratorio_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
