const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async(req, res) => {

       // revisamos si hay errores
       const errores = validationResult(req);
       if(!errores.isEmpty() ){
           return res.status(400).json({errores: errores.array() })
       }

       // Extraemos el email y el password de la request
       const { email, password } = req.body;

       try {
           // Revisamos que sea un usuario registrado
           let usuario = await Usuario.findOne({ email }); 
           if(!usuario){
               return res.status(400).json({msg: 'El usuario no existe'});
           }

           // Revisamos su password
           const passCorrecto = await bcryptjs.compare(password, usuario.password)
            if(!passCorrecto){
                return res.status(400).json({msg: 'Password Incorrecto'});
            }

        // Si todo es correcto
        // Creamos y firmamos el jsonwebtoken
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        // firmamos el jsonwebtoken
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 /* Expira en una hora  */
        }, (error, token) => {
            if(error) throw error;

            // Mensaje de confirmacion
            res.json({token: token});
        });

        } catch (error) {
           console.log(error);
       }
}

// Obtiene que usario esta autenticado

exports.usuarioAutenticado = async (req , res) =>{
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');/* Todos menos la password */
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}