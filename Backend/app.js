const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes');

// Middleware to parse JSON
app.use(express.json());
app.use(userRoutes); //ruta para el registro de usuarios
app.get('/', (req, res) => { //ruta base para comprobar que el servidor esta corriendo
    res.send('Servidor corriendo'); //devuelve un mensaje de exito
});
app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});