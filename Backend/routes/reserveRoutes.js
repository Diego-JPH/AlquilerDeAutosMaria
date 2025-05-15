const express = require('express');
const router = express.Router();
const reserveController = require('../controllers/reserveControllers');

router.get('/test', (req, res) => {
    res.send('Ruta de prueba OK');
    console.log('Ruta de prueba OK');
});
router.put('/change-driver', reserveController.changeDriver); //ruta para cambiar el conductor de una reserva
console.log('Cargando rutas de reservas...');
module.exports = router; //exporta el router para usarlo en otros archivos (app.js)