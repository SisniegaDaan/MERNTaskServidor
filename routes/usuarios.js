//Rutas para crear usuarios
const express = require("express");
const router = express.Router();
//Importando controller de usuario
const usuarioController = require("../controllers/usuarioController");
//Importando Express Validator
const { check } = require("express-validator");

//Crea un usuario con api/usuarios
router.post("/",
    [
        //Validaciones personalizadas
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("email", "Agrega un email válido").isEmail(),
        check("password", "El password debe ser mínimo de 6 caracteres").isLength({min: 6})
    ],
    usuarioController.crearUsuario);

module.exports = router;
