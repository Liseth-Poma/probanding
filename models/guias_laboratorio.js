const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('guias_laboratorio', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    objetivos: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fundamento_teorico: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    materiales_requeridos: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    procedimiento: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    resultados_esperados: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    criterios_evaluacion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bibliografia: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "borrador"
    },
    duracion_estimada: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nivel_dificultad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    asignatura_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'asignaturas',
        key: 'id'
      }
    },
    docente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    },
    archivo_adjunto: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'guias_laboratorio',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "guias_laboratorio_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
