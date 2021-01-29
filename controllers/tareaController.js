const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');
// Crea una nueva tarea
exports.crearTarea =  async (req, res) => {
     
    // Revisamos si hay errores
     const errores = validationResult(req);
     if(!errores.isEmpty() ){
         return res.status(400).json({errores: errores.array() })
     }

     // extraemos el proyecto y comprobamos si existe
     
     try {
        const {proyecto} = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);

         if(!existeProyecto){
             return res.status(404).json({msg: 'Proyecto no encontrado'})
         }

         // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});

        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

     } catch (error) {
         console.log(error);
         res.status(500).send('Hubo un error');
     }


}

// Obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    // Extraemos el proyecto
    try {
        const {proyecto} = req.query;
        const existeProyecto = await Proyecto.findById(proyecto);

         if(!existeProyecto){
             return res.status(404).json({msg: 'Proyecto no encontrado'})
         }

         // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});

        }

        // Obtenemos las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
        res.json({ tareas });

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
    }
}

// Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        // Extraemos el proyecto y verificamos si existe
        const {proyecto, nombre, estado} = req.body;
       
        // Si la tarea existe o no 
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({msg: 'No existe esa tarea'});
        }


         // Revisar si el proyecto actual pertenece al usuario autenticado
         const existeProyecto = await Proyecto.findById(proyecto);
         if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});

        }

        // Creamos un objeto con la nueva informacion
        const nuevaTarea = {};

       
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        

        // Guardamos la tarea
        tarea = await Tarea.findOneAndUpdate({_id : req.params.id}, nuevaTarea, {new : true})

        res.json({tarea})


        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarTarea = async (req, res) => {

    try {
        // Extraemos el proyecto y verificamos si existe
        const {proyecto} = req.query;
        
        // Si la tarea existe o no 
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({msg: 'No existe esa tarea'});
        }


         // Revisar si el proyecto actual pertenece al usuario autenticado
         const existeProyecto = await Proyecto.findById(proyecto);
         if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});

        }

        // Eliminar 
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea Eliminada'})


        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}