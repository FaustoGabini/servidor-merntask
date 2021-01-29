const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.crearUsuario = async (req, res) => {
    
    // revisamos si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty() ){
        return res.status(400).json({errores: errores.array() })
    }

    // extreemos mail y password
    const { email, password} = req.body;

    try {

        // Revisamos que el usuario registadro sea unico
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({msg: 'El usuario ya existe'});
        }
         
        // crea el nuevo usuario
        usuario = new Usuario(req.body);


        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        // Guardar usuario
        await usuario.save();

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
        res.status(400).send('Hubo un error');
    }

}