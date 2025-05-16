const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const reserveRoutes = require('./routes/reserveRoutes'); //importa las rutas de reservas
// Middleware to parse JSON
app.use(express.json());

app.use('/api/reserve', reserveRoutes); //ruta para las reservas
app.use('/api/user', userRoutes); //ruta para los usuarios
app.get('/', (req, res) => { //ruta base para comprobar que el servidor esta corriendo
    res.send('Servidor corriendo'); //devuelve un mensaje de exito
});
app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});