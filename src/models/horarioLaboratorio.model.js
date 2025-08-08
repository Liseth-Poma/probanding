const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const HorarioLaboratorio = sequelize.define(
  "HorarioLaboratorio",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    laboratorio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "laboratorios",
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
    docente_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "usuarios",
        key: "id",
      },
    },
    horario: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "horarios_laboratorio",
    timestamps: true,
  },
)

module.exports = HorarioLaboratorio
