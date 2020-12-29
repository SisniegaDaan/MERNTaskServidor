//Import de modelos
const Usuario = require("../models/Usuario");
//Librería de encriptación
const bcryptjs = require("bcryptjs");
//Validation Result
const { validationResult } = require("express-validator");
//JSON WEB TOKEN
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {

    //Revisar si hay errores por validation result
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    const { email, password } = req.body;

    try {

        //Validar 
        let usuario = await Usuario.findOne({ email });
        if (usuario) return res.status(400).json({ msg: "El usuario ya existe" });

        //Crear nuevo usuario 
        usuario = new Usuario(req.body);
        //Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);
        //Guardar usuario 
        await usuario.save();
        //Crear JWT
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
        res.status(400).send("Hubo un error");
    }
}   
