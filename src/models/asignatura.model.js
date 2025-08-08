const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const Asignatura = sequelize.define(
  "Asignatura",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "asignaturas",
    timestamps: true,
  },
)

module.exports = Asignatura
