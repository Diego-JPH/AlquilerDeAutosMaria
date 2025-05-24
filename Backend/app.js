const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const reserveRoutes = require('./routes/reserveRoutes'); //importa las rutas de reservas
const sucursalesRoutes = require('./routes/sucursales');
require('dotenv').config();
const vehicleRoutes = require('./routes/vehicleRoutes');

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/reserve', reserveRoutes);
app.use('/api/user', userRoutes); 
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/sucursales', sucursalesRoutes);
app.get('/', (req, res) => {
    res.send('Servidor corriendo');
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});