//Rutas para crear usuarios
const express = require("express");
const router = express.Router();

//Importando Express Validator y autenticación
const { check } = require("express-validator");
const auth = require("../middleware/autenticacion");

//Controller autenticación
const authController = require("../controllers/authController");

//Inicia sesión con api/auth
router.post("/",
    /* [
        //Validaciones personalizadas (SOLO EMAIL Y PASSWORD)
        check("email", "Agrega un email válido").isEmail(),
        check("password", "El password debe ser mínimo de 6 caracteres").isLength({ min: 6 })
    ], */
    authController.autenticarUsuario);

//Usuario autenticado
router.get("/",
    auth,
    authController.infoAutenticado);

module.exports = router;
