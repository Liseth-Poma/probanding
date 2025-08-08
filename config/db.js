const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || "laboratorios_db",
  username: process.env.DB_USER || "lab_user",
  password: process.env.DB_PASSWORD || "lab_password",
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos:", error);
  }
};

// Función para sincronizar modelos
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // Cambiar a true solo en desarrollo para recrear tablas
    console.log("✅ Modelos sincronizados correctamente.");
  } catch (error) {
    console.error("❌ Error al sincronizar modelos:", error);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
};
