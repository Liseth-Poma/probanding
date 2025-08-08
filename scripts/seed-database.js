const fetch = require("node-fetch");

const API_BASE_URL = "http://localhost:3001";

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error.message);
    return { success: false, message: error.message };
  }
}

async function seedDatabase() {
  try {
    console.log("🌱 Iniciando seed de la base de datos...");

    // Verificar conexión
    const health = await apiRequest("/health");
    if (!health.success) {
      throw new Error("Backend no está disponible");
    }
    console.log("✅ Backend conectado");

    // Crear usuarios de prueba
    const usuarios = [
      {
        nombre: "Dr. Juan Pérez",
        email: "docente@universidad.edu",
        password: "123456",
        rol: "docente",
        programa_academico: "Ingeniería Química",
      },
      {
        nombre: "María García",
        email: "estudiante@universidad.edu",
        password: "123456",
        rol: "estudiante",
        codigo_estudiante: "2021001",
        programa_academico: "Ingeniería de Sistemas",
      },
      {
        nombre: "Dr. Ana Martínez",
        email: "jefe@universidad.edu",
        password: "123456",
        rol: "jefe_laboratorio",
        programa_academico: "Administración de Laboratorios",
      },
    ];

    const usuariosCreados = [];
    for (const usuario of usuarios) {
      const response = await apiRequest("/api/usuarios", {
        method: "POST",
        body: JSON.stringify(usuario),
      });

      if (response.success) {
        console.log(`✅ Usuario creado: ${usuario.email}`);
        usuariosCreados.push(response.data);
      } else {
        console.log(`⚠️  Usuario ya existe o error: ${usuario.email}`);
      }
    }

    // Crear laboratorios de prueba
    const laboratorios = [
      {
        nombre: "Laboratorio de Química Orgánica",
        codigo: "LAB-QUI-01",
        ubicacion: "Edificio A, Piso 2, Aula 201",
        capacidad_maxima: 25,
        tipo_laboratorio: "quimica",
        equipos_disponibles: [
          "Microscopio",
          "Balanza analítica",
          "pH metro",
          "Campana extractora",
        ],
      },
      {
        nombre: "Laboratorio de Física Experimental",
        codigo: "LAB-FIS-01",
        ubicacion: "Edificio B, Piso 1, Aula 105",
        capacidad_maxima: 30,
        tipo_laboratorio: "fisica",
        equipos_disponibles: [
          "Osciloscopio",
          "Multímetro",
          "Fuente de poder",
          "Generador de señales",
        ],
      },
      {
        nombre: "Laboratorio de Computación",
        codigo: "LAB-COMP-01",
        ubicacion: "Edificio C, Piso 3, Aula 301",
        capacidad_maxima: 40,
        tipo_laboratorio: "computacion",
        equipos_disponibles: [
          "Computadores",
          "Proyector",
          "Switch de red",
          "Servidor",
        ],
      },
    ];

    const laboratoriosCreados = [];
    for (const laboratorio of laboratorios) {
      const response = await apiRequest("/api/laboratorios", {
        method: "POST",
        body: JSON.stringify(laboratorio),
      });

      if (response.success) {
        console.log(`✅ Laboratorio creado: ${laboratorio.codigo}`);
        laboratoriosCreados.push(response.data);
      } else {
        console.log(`⚠️  Laboratorio ya existe o error: ${laboratorio.codigo}`);
      }
    }

    // Crear bitácoras de ejemplo
    if (usuariosCreados.length > 0 && laboratoriosCreados.length > 0) {
      const bitacoras = [
        {
          usuario_id: usuariosCreados[0].id, // Dr. Juan Pérez
          laboratorio_id: laboratoriosCreados[0].id, // Lab Química
          departamento: "Ingeniería",
          carrera: "Ingeniería Química",
          fecha_uso_laboratorio: new Date("2024-01-20T08:00:00Z"),
          materia_asignatura: "Química Orgánica I",
          nivel: "Pregrado - Semestre 5",
          numero_usuarios: 20,
          tema_practica_proyecto:
            "Síntesis de Aspirina - Reacción de Acetilación",
          descargo_equipos: [
            { cantidad: 20, detalle: "Tubos de ensayo de 15ml" },
            { cantidad: 2, detalle: "Balanza analítica digital" },
            { cantidad: 1, detalle: "Plancha de calentamiento" },
            { cantidad: 500, detalle: "ml de Ácido acético glacial" },
            { cantidad: 100, detalle: "g de Ácido salicílico" },
          ],
          observaciones:
            "Práctica realizada sin inconvenientes. Todos los estudiantes lograron sintetizar el compuesto.",
          estado: "aprobada",
        },
        {
          usuario_id: usuariosCreados[1].id, // María García
          laboratorio_id: laboratoriosCreados[1].id, // Lab Física
          departamento: "Ingeniería",
          carrera: "Ingeniería de Sistemas",
          fecha_uso_laboratorio: new Date("2024-01-25T14:00:00Z"),
          materia_asignatura: "Física II",
          nivel: "Pregrado - Semestre 3",
          numero_usuarios: 15,
          tema_practica_proyecto: "Ley de Ohm y Circuitos Resistivos",
          descargo_equipos: [
            { cantidad: 5, detalle: "Multímetros digitales" },
            { cantidad: 5, detalle: "Fuentes de voltaje variable" },
            { cantidad: 20, detalle: "Resistencias de diferentes valores" },
            { cantidad: 10, detalle: "Cables de conexión" },
          ],
          observaciones: "",
          estado: "borrador",
        },
      ];

      for (const bitacora of bitacoras) {
        const response = await apiRequest("/api/bitacoras", {
          method: "POST",
          body: JSON.stringify(bitacora),
        });

        if (response.success) {
          console.log(`✅ Bitácora creada: ${bitacora.tema_practica_proyecto}`);
        } else {
          console.log(`⚠️  Error creando bitácora: ${response.message}`);
        }
      }
    }

    console.log("🎉 Seed completado exitosamente!");
    console.log("📋 Datos creados:");
    console.log(`   - ${usuariosCreados.length} usuarios`);
    console.log(`   - ${laboratoriosCreados.length} laboratorios`);
    console.log("   - 2 bitácoras de ejemplo");
    console.log("");
    console.log("🔑 Credenciales de prueba:");
    console.log("   Docente: docente@universidad.edu / 123456");
    console.log("   Estudiante: estudiante@universidad.edu / 123456");
    console.log("   Jefe Lab: jefe@universidad.edu / 123456");
  } catch (error) {
    console.error("❌ Error en seed:", error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
