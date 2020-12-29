//Importando modelo tarea y proyecto
const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {

    //Revsisar errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    try {

        //Extraer el proyecto y comprobar su existencia para asignarle la tarea
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            res.status(404).json({ msg: "Proyecto no encontrdo" });
        }

        //Revisar si el proyecto pertece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: "Usuario no autorizado" });
        }

        //Creación de tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });

    } catch (error) {

        console.log(error);
        res.status(500).send("Hubo un error");
    }

}

//Obtener tareas por proyecto id
exports.obtenerTareas = async (req, res) => {

    try {

        //Se enviara un json con el proyecto de las tareas
        const { proyecto } = req.query;
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: "Proyecto no encontrado" });
        }

        //Verificar si existe la autencitación
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: "Usuario no autorizado" });
        }

        //Traer tareas por proyecto
        const tareas = await Tarea.find({ proyecto });
        res.json({ tareas });

    } catch (error) {

        console.log(error);
        res.status(500).send("Hubo un error");
    }
}

exports.actualizarTareas = async (req, res) => {

    try {

        const { proyecto, nombre, estado } = req.body;
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            return res.status(404).json({ msg: "No se encontró la tarea" });
        }

        const existeProyecto = await Proyecto.findById(proyecto);

        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: "Usuaio no autorizado" });
        }

        //Crear un objeto con la nueva actualización
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //Guardar tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        res.json({ tarea });

    } catch (error) {

        console.log(error);
        res.status(500).send("Hubo un error");
    }
}

exports.eliminarTarea = async (req, res) => {

    try {

        const { proyecto } = req.query;

        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: "No se encontró la tarea" });
        }

        const existeProyecto = await Proyecto.findById(proyecto);
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: "Usuaio no autorizado" });
        }

        //Eliminar tarea
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Tarea eliminada" });

    } catch (error) {

        console.log(error);
        res.status(500).send("Hubo un error");
    }
}
