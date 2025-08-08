var DataTypes = require("sequelize").DataTypes;
var _asignaciones_practicas = require("./asignaciones_practicas");
var _asignaturas = require("./asignaturas");
var _bitacoras = require("./bitacoras");
var _docente_asignaturas = require("./docente_asignaturas");
var _equipos = require("./equipos");
var _guias_laboratorio = require("./guias_laboratorio");
var _horarios_laboratorio = require("./horarios_laboratorio");
var _inscripciones_asignaturas = require("./inscripciones_asignaturas");
var _laboratorios = require("./laboratorios");
var _usos_laboratorio = require("./usos_laboratorio");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
  var asignaciones_practicas = _asignaciones_practicas(sequelize, DataTypes);
  var asignaturas = _asignaturas(sequelize, DataTypes);
  var bitacoras = _bitacoras(sequelize, DataTypes);
  var docente_asignaturas = _docente_asignaturas(sequelize, DataTypes);
  var equipos = _equipos(sequelize, DataTypes);
  var guias_laboratorio = _guias_laboratorio(sequelize, DataTypes);
  var horarios_laboratorio = _horarios_laboratorio(sequelize, DataTypes);
  var inscripciones_asignaturas = _inscripciones_asignaturas(sequelize, DataTypes);
  var laboratorios = _laboratorios(sequelize, DataTypes);
  var usos_laboratorio = _usos_laboratorio(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);

  docente_asignaturas.belongsTo(asignaturas, { as: "asignatura", foreignKey: "asignatura_id"});
  asignaturas.hasMany(docente_asignaturas, { as: "docente_asignaturas", foreignKey: "asignatura_id"});
  guias_laboratorio.belongsTo(asignaturas, { as: "asignatura", foreignKey: "asignatura_id"});
  asignaturas.hasMany(guias_laboratorio, { as: "guias_laboratorios", foreignKey: "asignatura_id"});
  horarios_laboratorio.belongsTo(asignaturas, { as: "asignatura", foreignKey: "asignatura_id"});
  asignaturas.hasMany(horarios_laboratorio, { as: "horarios_laboratorios", foreignKey: "asignatura_id"});
  inscripciones_asignaturas.belongsTo(asignaturas, { as: "asignatura", foreignKey: "asignatura_id"});
  asignaturas.hasMany(inscripciones_asignaturas, { as: "inscripciones_asignaturas", foreignKey: "asignatura_id"});
  asignaciones_practicas.belongsTo(equipos, { as: "equipo", foreignKey: "equipo_id"});
  equipos.hasMany(asignaciones_practicas, { as: "asignaciones_practicas", foreignKey: "equipo_id"});
  asignaciones_practicas.belongsTo(guias_laboratorio, { as: "guia_laboratorio", foreignKey: "guia_laboratorio_id"});
  guias_laboratorio.hasMany(asignaciones_practicas, { as: "asignaciones_practicas", foreignKey: "guia_laboratorio_id"});
  bitacoras.belongsTo(guias_laboratorio, { as: "guia_laboratorio", foreignKey: "guia_laboratorio_id"});
  guias_laboratorio.hasMany(bitacoras, { as: "bitacoras", foreignKey: "guia_laboratorio_id"});
  bitacoras.belongsTo(laboratorios, { as: "laboratorio", foreignKey: "laboratorio_id"});
  laboratorios.hasMany(bitacoras, { as: "bitacoras", foreignKey: "laboratorio_id"});
  equipos.belongsTo(laboratorios, { as: "laboratorio", foreignKey: "laboratorio_id"});
  laboratorios.hasMany(equipos, { as: "equipos", foreignKey: "laboratorio_id"});
  guias_laboratorio.belongsTo(laboratorios, { as: "laboratorio", foreignKey: "laboratorio_id"});
  laboratorios.hasMany(guias_laboratorio, { as: "guias_laboratorios", foreignKey: "laboratorio_id"});
  horarios_laboratorio.belongsTo(laboratorios, { as: "laboratorio", foreignKey: "laboratorio_id"});
  laboratorios.hasMany(horarios_laboratorio, { as: "horarios_laboratorios", foreignKey: "laboratorio_id"});
  usos_laboratorio.belongsTo(laboratorios, { as: "laboratorio", foreignKey: "laboratorio_id"});
  laboratorios.hasMany(usos_laboratorio, { as: "usos_laboratorios", foreignKey: "laboratorio_id"});
  asignaciones_practicas.belongsTo(usuarios, { as: "estudiante", foreignKey: "estudiante_id"});
  usuarios.hasMany(asignaciones_practicas, { as: "asignaciones_practicas", foreignKey: "estudiante_id"});
  bitacoras.belongsTo(usuarios, { as: "usuario", foreignKey: "usuario_id"});
  usuarios.hasMany(bitacoras, { as: "bitacoras", foreignKey: "usuario_id"});
  docente_asignaturas.belongsTo(usuarios, { as: "docente", foreignKey: "docente_id"});
  usuarios.hasMany(docente_asignaturas, { as: "docente_asignaturas", foreignKey: "docente_id"});
  guias_laboratorio.belongsTo(usuarios, { as: "docente", foreignKey: "docente_id"});
  usuarios.hasMany(guias_laboratorio, { as: "guias_laboratorios", foreignKey: "docente_id"});
  horarios_laboratorio.belongsTo(usuarios, { as: "docente", foreignKey: "docente_id"});
  usuarios.hasMany(horarios_laboratorio, { as: "horarios_laboratorios", foreignKey: "docente_id"});
  inscripciones_asignaturas.belongsTo(usuarios, { as: "estudiante", foreignKey: "estudiante_id"});
  usuarios.hasMany(inscripciones_asignaturas, { as: "inscripciones_asignaturas", foreignKey: "estudiante_id"});
  laboratorios.belongsTo(usuarios, { as: "responsable", foreignKey: "responsable_id"});
  usuarios.hasMany(laboratorios, { as: "laboratorios", foreignKey: "responsable_id"});
  usos_laboratorio.belongsTo(usuarios, { as: "usuario", foreignKey: "usuario_id"});
  usuarios.hasMany(usos_laboratorio, { as: "usos_laboratorios", foreignKey: "usuario_id"});

  return {
    asignaciones_practicas,
    asignaturas,
    bitacoras,
    docente_asignaturas,
    equipos,
    guias_laboratorio,
    horarios_laboratorio,
    inscripciones_asignaturas,
    laboratorios,
    usos_laboratorio,
    usuarios,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
