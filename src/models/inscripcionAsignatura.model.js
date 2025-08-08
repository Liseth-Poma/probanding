const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const InscripcionAsignatura = sequelize.define(
  "InscripcionAsignatura",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    estudiante_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    asignatura_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "asignaturas",
        key: "id",
      },
    },
  },
  {
    tableName: "inscripciones_asignaturas",
    timestamps: true,
  },
)

module.exports = InscripcionAsignatura
