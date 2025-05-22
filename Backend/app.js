const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const reserveRoutes = require('./routes/reserveRoutes'); //importa las rutas de reservas
<<<<<<< HEAD
require('dotenv').config();
=======
const vehicleRoutes = require('./routes/vehicleRoutes');
>>>>>>> 9775cd9f3e90f4afd96bea13af5a4d80fe6d8058

// Middleware to parse JSON
app.use(express.json());
app.use('/api/reserve', reserveRoutes); //ruta para las reservas
app.use('/api/user', userRoutes); //ruta para los usuarios
app.use('/api/vehicle', vehicleRoutes);

app.get('/', (req, res) => { //ruta base para comprobar que el servidor esta corriendo
    res.send('Servidor corriendo'); //devuelve un mensaje de exito
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});