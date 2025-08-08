const express = require("express");
const EquipoLaboratorioController = require("../controllers/equipoLaboratorio.controller");
const { auth: authenticateToken } = require("../middlewares/auth");

// const { requireJefeLaboratorio } = require("../middlewares/roles");

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas públicas (autenticado)
router.get("/", EquipoLaboratorioController.getAllEquipos);
router.get("/:id", EquipoLaboratorioController.getEquipoById);
router.get("/laboratorio/:laboratorioId", EquipoLaboratorioController.getEquiposByLaboratorio);
router.get("/estado/:estado", EquipoLaboratorioController.getEquiposByEstado);

// Rutas protegidas (jefe de laboratorio)
router.post("/", EquipoLaboratorioController.createEquipo);
router.put("/:id", EquipoLaboratorioController.updateEquipo);
router.delete("/:id", EquipoLaboratorioController.deleteEquipo);
router.patch("/:id/estado", EquipoLaboratorioController.cambiarEstadoEquipo);

module.exports = router;
