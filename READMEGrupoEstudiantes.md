# 🧪 Proyecto Gestión de Laboratorios - Backend

Este proyecto implementa una API REST para la gestión de prácticas de laboratorio, utilizando **Node.js**, **Sequelize**, **PostgreSQL**, **JWT** para autenticación, y contenedores Docker para el entorno de desarrollo.

---

## ✅ Cómo ejecutar el proyecto (paso a paso)

```bash
# 1. Clonar el repositorio
git clone https://github.com/Stefanny26/Proyecto_GestionLab.git
cd Proyecto_GestionLab

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env con el siguiente contenido:
# (ajusta los valores según tu configuración)
echo "PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
JWT_SECRET="

# 4. Levantar PostgreSQL y pgAdmin con Docker
npm run db:setup

# 5. Crear la base de datos
npx sequelize db:create

# 6. Ejecutar migraciones
npx sequelize db:migrate

# 7. Ejecutar seeders (opcional)
npx sequelize db:seed:all

# 8. Ejecutar el servidor backend
npm run backend:dev
```

---

## 🔄 Comandos útiles

```bash
# Deshacer todas las migraciones
npx sequelize db:migrate:undo:all

# Ejecutar migraciones nuevamente
npx sequelize db:migrate

# Cargar datos con seeders
npx sequelize db:seed:all
```

---

## 🌐 Accesos rápidos

- API Base URL: `http://localhost:3001`
- Healthcheck: `http://localhost:3001/health`
- Usuarios: `/api/usuarios`
- Laboratorios: `/api/laboratorios`
- Usos: `/api/usos`
- Bitácoras: `/api/bitacoras`

---

## 🐳 pgAdmin (Docker)

- URL: [http://localhost:5050](http://localhost:5050)
- Email: `admin@admin.com`
- Password: `admin`

**Conexión a PostgreSQL desde pgAdmin**  
- Host: `lab_postgres`  
- Usuario: `postgres`  
- Contraseña: `1234`

---

## 🛠️ Tecnologías utilizadas

- Node.js + Express
- Sequelize ORM
- PostgreSQL
- JWT (autenticación)
- Docker + Docker Compose
