const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const reserveRoutes = require('./routes/reserveRoutes'); //importa las rutas de reservas

app.use(express.json());
<<<<<<< HEAD

app.use('/api/reserve', reserveRoutes); //ruta para las reservas

app.get('/', (req, res) => { //ruta base para comprobar que el servidor esta corriendo
    res.send('Servidor corriendo'); //devuelve un mensaje de exito
});
app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});
=======
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
>>>>>>> 06d1af7d5bf8410f5a9f9d427ae8d4e3508ea315
