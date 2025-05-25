const express = require('express');
const router = express.Router();
const reserveController = require('../controllers/reserveControllers');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/cancel-reserve', reserveController.cancelReserve); //ruta para cancelar una reserva
router.put('/change-driver', verifyToken, reserveController.changeDriver); //ruta para cambiar el conductor de una reserva
router.post('/create-reserve', reserveController.reserveVehicle);
router.get("/my-reservations", verifyToken, reserveController.listReserveOfUser);
console.log('Cargando rutas de reservas...');

module.exports = router; //exporta el router para usarlo en otros archivos (app.js)