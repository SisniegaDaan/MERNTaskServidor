//Import de modelos
const Usuario = require("../models/Usuario");
//Librería de encriptación
const bcryptjs = require("bcryptjs");
//Validation Result
const { validationResult } = require("express-validator");
//JSON WEB TOKEN
const jwt = require("jsonwebtoken");
const { find, findById } = require("../models/Usuario");

exports.autenticarUsuario = async (req, res) => {

    //Revisar si hay errores por validation result
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    const {email, password} = req.body;

    try {

        //Revisar si el usuario esta registrado 
        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({msg: "El usuario no existe"});
        }

        //Revisar Password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({msg: "Password Incorrecto"});
        }

        //Si todo es correcto, creamos y firmamos el JWT
        //Creamos JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 36000
        }, (error, token) => {
            if (error) throw error;

            //Mensaje de confirmación
            res.json({ token: token });
        });
        
    } catch (error) {

        console.log(error);
    }
}

//Entrega usuario autenticado
exports.infoAutenticado = async (req, res) => {

    try {

        const usuario = await Usuario.findById(req.usuario.id).select("-password");
        res.json({usuario});
        
    } catch (error) {

        console.log(error);
        res.status(500).send("Hubo un error");
    }
}