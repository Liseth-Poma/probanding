const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('inscripciones_asignaturas', {
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
      },
      unique: "inscripciones_asignaturas_estudiante_id_asignatura_id_perio_key"
    },
    asignatura_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'asignaturas',
        key: 'id'
      },
      unique: "inscripciones_asignaturas_estudiante_id_asignatura_id_perio_key"
    },
    periodo_academico: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "inscripciones_asignaturas_estudiante_id_asignatura_id_perio_key"
    },
    fecha_inscripcion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    activa: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'inscripciones_asignaturas',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "inscripciones_asignaturas_estudiante_id_asignatura_id_perio_key",
        unique: true,
        fields: [
          { name: "estudiante_id" },
          { name: "asignatura_id" },
          { name: "periodo_academico" },
        ]
      },
      {
        name: "inscripciones_asignaturas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
