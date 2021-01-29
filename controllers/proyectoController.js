const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) =>{

    // Revisamos si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty() ){
        return res.status(400).json({errores: errores.array() })
    }

    try {

        // Creamos un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        // Guardamos el creador via jwb
        proyecto.creador = req.usuario.id;

        // Guardamos el proyectp
        proyecto.save();
        res.json(proyecto);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

// Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({creado: -1});
        res.json({proyectos});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Acutaliza un proyecto 
exports.actualizarProyecto = async(req, res)=>{
     // Revisamos si hay errores
     const errores = validationResult(req);
     if(!errores.isEmpty() ){
         return res.status(400).json({errores: errores.array() })
     }

     // Extraer la informacion del proyecto
     const { nombre } = req.body;
     const nuevoProyecto = {};
     if(nombre){
         nuevoProyecto.nombre = nombre;
     }

     try {
        
        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);
        // Revisar si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg:"Proyecto no encontrado"})
        }
        // Verificamos el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});

        }
        // Actualizar
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoProyecto}, {new: true});

        res.json({proyecto})

     } catch (error) {
         console.log(error);
         res.status(500).send('Error en el servidor');
     }
}

// Elimina un proyecto por su id
exports.eliminarProyecto = async (req, res) => {
    try {
        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);
        // Revisar si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg:"Proyecto no encontrado"})
        }
        // Verificamos el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});

        }

        // Eliminar el proyecto
        await Proyecto.findOneAndRemove({_id : req.params.id});
        res.json({msg: 'Proyecto eliminado'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}