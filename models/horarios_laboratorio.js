const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('horarios_laboratorio', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    laboratorio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'laboratorios',
        key: 'id'
      }
    },
    dia_semana: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false
    },
    asignatura_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'asignaturas',
        key: 'id'
      }
    },
    docente_id: {
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
    tableName: 'horarios_laboratorio',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "horarios_laboratorio_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
