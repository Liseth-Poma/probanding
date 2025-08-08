const express = require("express")
const bitacoraController = require("../controllers/bitacora.controller")
const { auth } = require("../middlewares/auth")


const router = express.Router()

router.use(auth)

router.post("/", bitacoraController.crear)
router.get("/", bitacoraController.obtenerTodas)
router.get("/:id", bitacoraController.obtenerPorId)
router.put("/:id", bitacoraController.actualizar)
router.delete("/:id", bitacoraController.eliminar)

module.exports = router
