//Importando Express
const express = require("express");

//Configuracion de DB
const conectarDB = require("./config/db");
const cors = require("cors");

//Crear el servidor
const app = express();

//Conectar a la base de datos
conectarDB();

//Habilitar Cors
app.use(cors());

//Habilitar express.json para leer lo que el usuario pide
app.use(express.json({extended: true}));

//Creacion del puerto de app
const port = process.env.PORT || 4000;

//Importar rutas (https://localhost:4000/api/usuarios)
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas", require("./routes/tareas"));

//Arrancar el servidor
app.listen(port, () => { 
    console.log(`El servidor está funcionando en el puerto ${port}`)
});