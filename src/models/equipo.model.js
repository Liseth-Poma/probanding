const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const Equipo = sequelize.define(
  "Equipo",
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
    laboratorio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "laboratorios",
        key: "id",
      },
    },
  },
  {
    tableName: "equipos",
    timestamps: true,
  },
)

module.exports = Equipo
