const express = require('express');
const app = express();

// Rutas
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

// Middlewares
app.use(express.json());

// Uso de rutas
app.use(userRoutes);
app.use('/api', vehicleRoutes);

// Ruta base
app.get('/', (req, res) => {
    res.send('Servidor corriendo');
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});