const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('asignaciones_practicas', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    estudiante_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    guia_laboratorio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'guias_laboratorio',
        key: 'id'
      }
    },
    equipo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'equipos',
        key: 'id'
      }
    },
    fecha_asignacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    fecha_practica: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "asignado"
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    calificacion: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    retroalimentacion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'asignaciones_practicas',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "asignaciones_practicas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
