const mongoose = require('mongoose');

const UsuariosSchema = mongoose.Schema({
    nombre: {
        type: String, 
        required: true, /* Obligatorio */
        trim: true /* Elimina los espacios en blanco */
    }, 
    email: {
        type: String, 
        required: true, /* Obligatorio */
        trim: true, /* Elimina los espacios en blanco */
        unique: true /* Para que no haya 2 correos iguales */
    }, 
    password: {
        type: String, 
        required: true, /* Obligatorio */
        trim: true
    }, 
    registro: {
        type: Date, 
        default: Date.now()
    }
});

module.exports = mongoose.model('Usuario', UsuariosSchema)