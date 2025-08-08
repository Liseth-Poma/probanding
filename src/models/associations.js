const Usuario = require("./usuario.model")
const Asignatura = require("./asignatura.model")
const Laboratorio = require("./laboratorio.model")
const Equipo = require("./equipo.model")
const GuiaLaboratorio = require("./guiaLaboratorio.model")
const HorarioLaboratorio = require("./horarioLaboratorio.model")
const UsoLaboratorio = require("./usoLaboratorio.model")
const Bitacora = require("./bitacora.model")
const DocenteAsignatura = require("./docenteAsignatura.model")
const InscripcionAsignatura = require("./inscripcionAsignatura.model")
const AsignacionPractica = require("./asignacionPractica.model")

// === ASOCIACIONES USUARIO ===
Usuario.hasMany(Laboratorio, { foreignKey: "responsable_id", as: "laboratorios_responsable" })
Usuario.hasMany(GuiaLaboratorio, { foreignKey: "docente_id", as: "guias_docente" })
Usuario.hasMany(HorarioLaboratorio, { foreignKey: "docente_id", as: "horarios_docente" })
Usuario.hasMany(UsoLaboratorio, { foreignKey: "usuario_id", as: "usos_laboratorio" })
Usuario.hasMany(Bitacora, { foreignKey: "usuario_id", as: "bitacoras" })
Usuario.hasMany(DocenteAsignatura, { foreignKey: "docente_id", as: "docente_asignaturas" })
Usuario.hasMany(InscripcionAsignatura, { foreignKey: "estudiante_id", as: "inscripciones" })
Usuario.hasMany(AsignacionPractica, { foreignKey: "estudiante_id", as: "asignaciones_practicas" })

// === ASOCIACIONES LABORATORIO ===
Laboratorio.belongsTo(Usuario, { foreignKey: "responsable_id", as: "responsable" })
Laboratorio.hasMany(Equipo, { foreignKey: "laboratorio_id", as: "equipos" })
Laboratorio.hasMany(GuiaLaboratorio, { foreignKey: "laboratorio_id", as: "guias" })
Laboratorio.hasMany(HorarioLaboratorio, { foreignKey: "laboratorio_id", as: "horarios" })
Laboratorio.hasMany(UsoLaboratorio, { foreignKey: "laboratorio_id", as: "usos" })
Laboratorio.hasMany(Bitacora, { foreignKey: "laboratorio_id", as: "bitacoras" })

// === ASOCIACIONES ASIGNATURA ===
Asignatura.hasMany(GuiaLaboratorio, { foreignKey: "asignatura_id", as: "guias" })
Asignatura.hasMany(HorarioLaboratorio, { foreignKey: "asignatura_id", as: "horarios" })
Asignatura.hasMany(DocenteAsignatura, { foreignKey: "asignatura_id", as: "docente_asignaturas" })
Asignatura.hasMany(InscripcionAsignatura, { foreignKey: "asignatura_id", as: "inscripciones" })

// === ASOCIACIONES EQUIPO ===
Equipo.belongsTo(Laboratorio, { foreignKey: "laboratorio_id", as: "laboratorio" })
Equipo.hasMany(AsignacionPractica, { foreignKey: "equipo_id", as: "asignaciones" })

// === ASOCIACIONES GUIA LABORATORIO ===
GuiaLaboratorio.belongsTo(Laboratorio, { foreignKey: "laboratorio_id", as: "laboratorio" })
GuiaLaboratorio.belongsTo(Asignatura, { foreignKey: "asignatura_id", as: "asignatura" })
GuiaLaboratorio.belongsTo(Usuario, { foreignKey: "docente_id", as: "docente" })
GuiaLaboratorio.hasMany(Bitacora, { foreignKey: "guia_laboratorio_id", as: "bitacoras" })
GuiaLaboratorio.hasMany(AsignacionPractica, { foreignKey: "guia_laboratorio_id", as: "asignaciones" })

// === ASOCIACIONES HORARIO LABORATORIO ===
HorarioLaboratorio.belongsTo(Laboratorio, { foreignKey: "laboratorio_id", as: "laboratorio" })
HorarioLaboratorio.belongsTo(Asignatura, { foreignKey: "asignatura_id", as: "asignatura" })
HorarioLaboratorio.belongsTo(Usuario, { foreignKey: "docente_id", as: "docente" })

// === ASOCIACIONES USO LABORATORIO ===
UsoLaboratorio.belongsTo(Laboratorio, { foreignKey: "laboratorio_id", as: "laboratorio" })
UsoLaboratorio.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" })

// === ASOCIACIONES BITACORA ===
Bitacora.belongsTo(GuiaLaboratorio, { foreignKey: "guia_laboratorio_id", as: "guia" })
Bitacora.belongsTo(Laboratorio, { foreignKey: "laboratorio_id", as: "laboratorio" })
Bitacora.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" })

// === ASOCIACIONES DOCENTE ASIGNATURA ===
DocenteAsignatura.belongsTo(Usuario, { foreignKey: "docente_id", as: "docente" })
DocenteAsignatura.belongsTo(Asignatura, { foreignKey: "asignatura_id", as: "asignatura" })

// === ASOCIACIONES INSCRIPCION ASIGNATURA ===
InscripcionAsignatura.belongsTo(Usuario, { foreignKey: "estudiante_id", as: "estudiante" })
InscripcionAsignatura.belongsTo(Asignatura, { foreignKey: "asignatura_id", as: "asignatura" })

// === ASOCIACIONES ASIGNACION PRACTICA ===
AsignacionPractica.belongsTo(Usuario, { foreignKey: "estudiante_id", as: "estudiante" })
AsignacionPractica.belongsTo(Equipo, { foreignKey: "equipo_id", as: "equipo" })
AsignacionPractica.belongsTo(GuiaLaboratorio, { foreignKey: "guia_laboratorio_id", as: "guia" })

module.exports = {
  Usuario,
  Asignatura,
  Laboratorio,
  Equipo,
  GuiaLaboratorio,
  HorarioLaboratorio,
  UsoLaboratorio,
  Bitacora,
  DocenteAsignatura,
  InscripcionAsignatura,
  AsignacionPractica,
}
