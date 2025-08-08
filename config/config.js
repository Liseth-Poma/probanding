require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "lab_user",
    password: process.env.DB_PASSWORD || "lab_password",
    database: process.env.DB_NAME || "laboratorios_db",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5433,
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  },
};
