const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('asignaturas', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: "asignaturas_codigo_key"
    },
    departamento: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    carrera: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    semestre: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    creditos: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activa: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'asignaturas',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "asignaturas_codigo_key",
        unique: true,
        fields: [
          { name: "codigo" },
        ]
      },
      {
        name: "asignaturas_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
