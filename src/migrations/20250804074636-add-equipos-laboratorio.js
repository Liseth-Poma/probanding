"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("equipos_laboratorio", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      guia_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "guias_laboratorio",
          key: "id",
        },
      },
      asignatura_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "asignaturas",
          key: "id",
        },
      },
      laboratorio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "laboratorios",
          key: "id",
        },
      },
      docente_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
      },
      fecha_guia: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      marca: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      modelo: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      numero_serie: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      codigo_inventario: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true,
      },
      estado: {
        type: Sequelize.ENUM("disponible", "en_uso", "mantenimiento", "dañado", "fuera_servicio"),
        allowNull: false,
        defaultValue: "disponible",
      },
      laboratorio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "laboratorios",
          key: "id",
        },
      },
      fecha_adquisicion: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      valor_adquisicion: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("equipos_laboratorio");
  },
};