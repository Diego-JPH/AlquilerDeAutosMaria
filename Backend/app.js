const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const reserveRoutes = require('./routes/reserveRoutes');
const sucursalesRoutes = require('./routes/sucursales');
const vehicleRoutes = require('./routes/vehicleRoutes');
const creditCardRoutes = require('./routes/creditCardRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Configuración básica
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

// Rutas de la API
app.use('/api/reserve', reserveRoutes);
app.use('/api/user', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/sucursales', sucursalesRoutes);
app.use('/api/tarjetas', creditCardRoutes);
app.use('/api/admin', adminRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor corriendo');
});

// 📦 Servir archivos estáticos del frontend (React build)
const frontendPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendPath));

// Para cualquier ruta que no sea API, devolver index.html
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile('index.html', { root: frontendPath });
});

// 🚀 Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
