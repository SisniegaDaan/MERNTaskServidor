const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
//Importando los controllers
const tareaController = require("../controllers/tareaController");
//Middlewares
const autenticacion = require("../middleware/autenticacion");


router.post("/",
    autenticacion,
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("proyecto", "El proyecto es obligatorio").not().isEmpty(),
    ],
    tareaController.crearTarea);

//Obtener tareas por proyecto
router.get("/",
    autenticacion,
    tareaController.obtenerTareas);

//Editar tarea
router.put("/:id",
    autenticacion,
    tareaController.actualizarTareas);

//Eliminar tarea
router.delete("/:id", autenticacion, tareaController.eliminarTarea);

module.exports = router;