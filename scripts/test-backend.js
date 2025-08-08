const fetch = require("node-fetch");

async function testBackend() {
  try {
    console.log("🔍 Verificando conexión al backend...");

    const response = await fetch("http://localhost:3001");
    const data = await response.json();

    if (data.success) {
      console.log("✅ Backend funcionando correctamente");
      console.log("📊 Respuesta:", data);
      return true;
    } else {
      console.log("❌ Backend no responde correctamente");
      return false;
    }
  } catch (error) {
    console.log("❌ Error conectando al backend:", error.message);
    console.log("💡 Asegúrate de ejecutar: npm run backend:dev");
    return false;
  }
}

testBackend();
