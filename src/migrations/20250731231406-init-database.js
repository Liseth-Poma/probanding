"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // === 1. Usuarios ===
    await queryInterface.createTable("usuarios", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      correo: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false }, // Nueva columna para la contraseña
      rol: { type: Sequelize.STRING, allowNull: false }, // estudiante, docente, admin
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // === 2. Asignaturas ===
    await queryInterface.createTable("asignaturas", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      codigo: { type: Sequelize.STRING, allowNull: false },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // === 3. Laboratorios ===
    await queryInterface.createTable("laboratorios", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      descripcion: { type: Sequelize.TEXT },
      responsable_id: {
        type: Sequelize.INTEGER,
        references: { model: "usuarios", key: "id" },
        onDelete: "SET NULL",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // === 4. Equipos ===
    await queryInterface.createTable("equipos", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      laboratorio_id: {
        type: Sequelize.INTEGER,
        references: { model: "laboratorios", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // === 5. Guias Laboratorio ===
    await queryInterface.createTable("guias_laboratorio", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      titulo: { type: Sequelize.STRING, allowNull: false },
      laboratorio_id: {
        type: Sequelize.INTEGER,
        references: { model: "laboratorios", key: "id" },
        onDelete: "CASCADE",
      },
      asignatura_id: {
        type: Sequelize.INTEGER,
        references: { model: "asignaturas", key: "id" },
        onDelete: "CASCADE",
      },
      docente_id: {
        type: Sequelize.INTEGER,
        references: { model: "usuarios", key: "id" },
        onDelete: "SET NULL",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // === 6. Horarios Laboratorio ===
    await queryInterface.createTable("horarios_laboratorio", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      laboratorio_id: {
        type: Sequelize.INTEGER,
        references: { model: "laboratorios", key: "id" },
        onDelete: "CASCADE",
      },
      asignatura_id: {
        type: Sequelize.INTEGER,
        references: { model: "asignaturas", key: "id" },
        onDelete: "CASCADE",
      },
      docente_id: {
        type: Sequelize.INTEGER,
        references: { model: "usuarios", key: "id" },
        onDelete: "SET NULL",
      },
      horario: { type: Sequelize.STRING },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // === 7. Usos Laboratorio ===
    await queryInterface.createTable("usos_laboratorio", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      laboratorio_id: {
        type: Sequelize.INTEGER,
        references: { model: "laboratorios", key: "id" },
        onDelete: "CASCADE",
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: { model: "usuarios", key: "id" },
        onDelete: "CASCADE",
      },
      fecha_uso: { type: Sequelize.DATE, allowNull: false },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // === 8. Bitácoras ===
    await queryInterface.createTable("bitacoras", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      guia_laboratorio_id: {
        type: Sequelize.INTEGER,
        references: { model: "guias_laboratorio", key: "id" },
        onDelete: "CASCADE",
      },
      laboratorio_id: {
        type: Sequelize.INTEGER,
        references: { model: "laboratorios", key: "id" },
        onDelete: "CASCADE",
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: { model: "usuarios", key: "id" },
        onDelete: "CASCADE",
      },
      contenido: { type: Sequelize.TEXT },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // === 9. Docente Asignaturas ===
    await queryInterface.createTable("docente_asignaturas", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      docente_id: {
        type: Sequelize.INTEGER,
        references: { model: "usuarios", key: "id" },
        onDelete: "CASCADE",
      },
      asignatura_id: {
        type: Sequelize.INTEGER,
        references: { model: "asignaturas", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // === 10. Inscripciones Asignaturas ===
    await queryInterface.createTable("inscripciones_asignaturas", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      estudiante_id: {
        type: Sequelize.INTEGER,
        references: { model: "usuarios", key: "id" },
        onDelete: "CASCADE",
      },
      asignatura_id: {
        type: Sequelize.INTEGER,
        references: { model: "asignaturas", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // === 11. Asignaciones Prácticas ===
    await queryInterface.createTable("asignaciones_practicas", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      estudiante_id: {
        type: Sequelize.INTEGER,
        references: { model: "usuarios", key: "id" },
        onDelete: "CASCADE",
      },
      equipo_id: {
        type: Sequelize.INTEGER,
        references: { model: "equipos", key: "id" },
        onDelete: "CASCADE",
      },
      guia_laboratorio_id: {
        type: Sequelize.INTEGER,
        references: { model: "guias_laboratorio", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

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

  async down(queryInterface) {
    await queryInterface.dropTable("asignaciones_practicas");
    await queryInterface.dropTable("inscripciones_asignaturas");
    await queryInterface.dropTable("docente_asignaturas");
    await queryInterface.dropTable("bitacoras");
    await queryInterface.dropTable("usos_laboratorio");
    await queryInterface.dropTable("horarios_laboratorio");
    await queryInterface.dropTable("guias_laboratorio");
    await queryInterface.dropTable("equipos");
    await queryInterface.dropTable("laboratorios");
    await queryInterface.dropTable("asignaturas");
    await queryInterface.dropTable("usuarios");
    await queryInterface.dropTable("equipos_laboratorio");
  },
};
