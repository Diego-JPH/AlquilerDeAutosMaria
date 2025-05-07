const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(express.json()); //significa que acepta solicitudes con cuerpo en formato JSON (como los que envía Postman)
app.get('/', (req, res) => { //ruta base para comprobar que el servidor esta corriendo
    res.send('Servidor corriendo'); //devuelve un mensaje de exito
});
app.use('/api/users', userRoutes); //cada vez que llegue una solicitud a la ruta /api/users se ejecutara el router de usuarios (delega)
app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});