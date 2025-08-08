#!/bin/bash
echo "🚀 Iniciando desarrollo completo..."

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor inicia Docker Desktop."
    exit 1
fi

# Levantar base de datos
echo "📊 Levantando base de datos..."
docker-compose up -d

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a que la base de datos esté lista..."
sleep 10

# Iniciar backend en puerto 3001
echo "🔧 Iniciando backend en puerto 3001..."
PORT=3001 node src/index.js &
BACKEND_PID=$!

# Esperar un poco para que el backend inicie
sleep 5

# Iniciar frontend en puerto 3000
echo "🎨 Iniciando frontend en puerto 3000..."
npm run dev &
FRONTEND_PID=$!

echo "✅ Servicios iniciados:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend:  http://localhost:3001"
echo "   - pgAdmin:  http://localhost:8080"

# Función para limpiar procesos al salir
cleanup() {
    echo "🧹 Limpiando procesos..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Mantener el script corriendo
wait
