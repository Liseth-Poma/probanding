// 'use strict';

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     // Usuarios
//     await queryInterface.bulkInsert('usuarios', [
//       { id: 1, nombre: 'Admin', correo: 'admin@demo.com', password: 'admin123', rol: 'admin', createdAt: new Date(), updatedAt: new Date() },
//       { id: 2, nombre: 'Docente Uno', correo: 'docente1@demo.com', password: 'docente1', rol: 'docente', createdAt: new Date(), updatedAt: new Date() },
//       { id: 3, nombre: 'Juan Yasig', correo: 'jcyasig2@espe.edu.ec', password: 'estudiante123', rol: 'estudiante', createdAt: new Date(), updatedAt: new Date() },
//       { id: 4, nombre: 'Docente Dos', correo: 'docente2@demo.com', password: 'docente2', rol: 'docente', createdAt: new Date(), updatedAt: new Date() },
//       { id: 5, nombre: 'Docente Tres', correo: 'docente3@demo.com', password: 'docente3', rol: 'docente', createdAt: new Date(), updatedAt: new Date() },
//       { id: 6, nombre: 'Docente Cuatro', correo: 'docente4@demo.com', password: 'docente4', rol: 'docente', createdAt: new Date(), updatedAt: new Date() },
//       { id: 7, nombre: 'Docente Cinco', correo: 'docente5@demo.com', password: 'docente5', rol: 'docente', createdAt: new Date(), updatedAt: new Date() },
//     ]);

//     // Asignaturas
//     await queryInterface.bulkInsert('asignaturas', [
//       { id: 1, nombre: 'Aplicaciones Distribuidas', codigo: '23128', createdAt: new Date(), updatedAt: new Date() },
//       { id: 2, nombre: 'Seguridad Informatica', codigo: '23122', createdAt: new Date(), updatedAt: new Date() },
//       { id: 3, nombre: 'Mineria de datos', codigo: '23047', createdAt: new Date(), updatedAt: new Date() },
//       { id: 4, nombre: 'Programacion Avanzada', codigo: '23119', createdAt: new Date(), updatedAt: new Date() },
//       { id: 5, nombre: 'Proyectos TI', codigo: '23123', createdAt: new Date(), updatedAt: new Date() },
//     ]);

//     // Laboratorios
//     await queryInterface.bulkInsert('laboratorios', [
//       { id: 1, nombre: 'Lab 01', descripcion: 'Laboratorio de Informaticas', responsable_id: 2, createdAt: new Date(), updatedAt: new Date() },
//       { id: 2, nombre: 'Lab 02', descripcion: 'Laboratorio de Informaticas', responsable_id: 1, createdAt: new Date(), updatedAt: new Date() },
//       { id: 3, nombre: 'Lab 03', descripcion: 'Laboratorio de Informaticas', responsable_id: 3, createdAt: new Date(), updatedAt: new Date() },
//       { id: 4, nombre: 'Lab 04', descripcion: 'Laboratorio de Informaticas', responsable_id: 4, createdAt: new Date(), updatedAt: new Date() },
//     ]);

//     // Guias Laboratorio
//     await queryInterface.bulkInsert('guias_laboratorio', [
//       { id: 1, titulo: 'Guía de Instalacion de Maquinar virtuales', laboratorio_id: 2, asignatura_id: 2, docente_id: 2, createdAt: new Date(), updatedAt: new Date() },
//       { id: 2, titulo: 'Guía de modelo de ia para mineria', laboratorio_id: 3, asignatura_id: 3, docente_id: 1, createdAt: new Date(), updatedAt: new Date() },
//     ]);

//     // DocenteAsignaturas
//     await queryInterface.bulkInsert('docente_asignaturas', [
//       { id: 1, docente_id: 1, asignatura_id: 1, createdAt: new Date(), updatedAt: new Date() },
//       { id: 2, docente_id: 2, asignatura_id: 2, createdAt: new Date(), updatedAt: new Date() },
//       { id: 3, docente_id: 3, asignatura_id: 3, createdAt: new Date(), updatedAt: new Date() },
//       { id: 4, docente_id: 4, asignatura_id: 4, createdAt: new Date(), updatedAt: new Date() },
//       { id: 5, docente_id: 5, asignatura_id: 5, createdAt: new Date(), updatedAt: new Date() },
//     ]);

//     // Horarios Laboratorio
//     await queryInterface.bulkInsert('horarios_laboratorio', [
//       { id: 1, laboratorio_id: 1, asignatura_id: 2, docente_id: 2, horario: 'Lunes 8-10', createdAt: new Date(), updatedAt: new Date() },
//       { id: 2, laboratorio_id: 2, asignatura_id: 1, docente_id: 1, horario: 'Martes 10-12', createdAt: new Date(), updatedAt: new Date() },
//     ]);
//   },

//   async down(queryInterface) {
//     await queryInterface.bulkDelete('horarios_laboratorio', null, {});
//     await queryInterface.bulkDelete('docente_asignaturas', null, {});
//     await queryInterface.bulkDelete('guias_laboratorio', null, {});
//     await queryInterface.bulkDelete('laboratorios', null, {});
//     await queryInterface.bulkDelete('asignaturas', null, {});
//     await queryInterface.bulkDelete('usuarios', null, {});
//   }
// };