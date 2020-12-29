const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

//Importando los controllers
const proyectoController = require("../controllers/proyectoController");

//Middlewares
const autenticacion = require("../middleware/autenticacion");

//Crea proyectos en api/proyectos
router.post("/",
    autenticacion,
    [
        check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()
    ],
    proyectoController.crearProyecto);

//Obtener todos los proyectos
router.get("/",
    autenticacion,
    proyectoController.obtenerProyectos);

//Editar proyecto
router.put("/:id",
    autenticacion,
    [
        check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()
    ],
    proyectoController.actualizarProyecto);

//Eliminar proyecto
router.delete("/:id",
    autenticacion,
    proyectoController.eliminarProyecto);

module.exports = router;