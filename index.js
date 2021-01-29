const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');


// Creamos el servidor
const app = express();

// conectamos a la base de datos
conectarDB();

// habilitar cors 
app.use(cors());

// Habilitar express.json para leer datos
app.use( express.json({ extended: true }) );

// Puerto de la app 
const port = process.env.PORT || 4000; 

// Importamos rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

// Arrancamos la app
app.listen(port,'0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});
