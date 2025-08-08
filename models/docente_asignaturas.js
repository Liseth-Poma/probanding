const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('docente_asignaturas', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    docente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      unique: "docente_asignaturas_docente_id_asignatura_id_periodo_academ_key"
    },
    asignatura_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'asignaturas',
        key: 'id'
      },
      unique: "docente_asignaturas_docente_id_asignatura_id_periodo_academ_key"
    },
    periodo_academico: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "docente_asignaturas_docente_id_asignatura_id_periodo_academ_key"
    },
    es_coordinador: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'docente_asignaturas',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "docente_asignaturas_docente_id_asignatura_id_periodo_academ_key",
        unique: true,
        fields: [
          { name: "docente_id" },
          { name: "asignatura_id" },
          { name: "periodo_academico" },
        ]
      },
      {
        name: "docente_asignaturas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
