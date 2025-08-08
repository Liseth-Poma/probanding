const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const AsignacionEstudiante = sequelize.define(
  "AsignacionEstudiante",
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
    grupo: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    fecha_asignacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    activa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "asignaciones_estudiante",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["estudiante_id", "asignatura_id"],
      },
      {
        fields: ["asignatura_id"],
      },
    ],
  },
)

module.exports = AsignacionEstudiante
