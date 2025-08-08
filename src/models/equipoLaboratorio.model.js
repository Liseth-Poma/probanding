const { DataTypes } = require("sequelize")
const { sequelize } = require("../../config/db")

const EquipoLaboratorio = sequelize.define(
  "EquipoLaboratorio",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    marca: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    modelo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    numero_serie: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    codigo_inventario: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    estado: {
      type: DataTypes.ENUM("disponible", "en_uso", "mantenimiento", "dañado", "fuera_servicio"),
      allowNull: false,
      defaultValue: "disponible",
    },
    laboratorio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "laboratorios",
        key: "id",
      },
    },
    fecha_adquisicion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    valor_adquisicion: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "equipos_laboratorio",
    timestamps: true,
    indexes: [
      {
        fields: ["laboratorio_id"],
      },
      {
        fields: ["estado"],
      },
      {
        unique: true,
        fields: ["numero_serie"],
        where: {
          numero_serie: {
            [require("sequelize").Op.ne]: null,
          },
        },
      },
      {
        unique: true,
        fields: ["codigo_inventario"],
        where: {
          codigo_inventario: {
            [require("sequelize").Op.ne]: null,
          },
        },
      },
    ],
  },
)

module.exports = EquipoLaboratorio
