const express = require('express');
const router = express.Router();
const reserveController = require('../controllers/reserveControllers');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/cancel-reserve', verifyToken, reserveController.cancelReserve); //ruta para cancelar una reserva
router.put('/change-driver', verifyToken, reserveController.changeDriver); //ruta para cambiar el conductor de una reserva
router.post('/create-reserve', verifyToken, reserveController.reserveVehicle);
router.get("/my-reservations", verifyToken, reserveController.listReserveOfUser);
router.get('/all', reserveController.getAllReservations);
router.post('/reserveVerification', reserveController.reserveVerification);
router.get('/get-reserve-by-sucursal', verifyToken, reserveController.getReservasPorSucursal);
router.post("/marcar-entrega", verifyToken, reserveController.marcarEntrega);
router.post('/devolver-vehiculo', verifyToken, reserveController.registrarDevolucion);
router.get('/getVehiclesReserved', reserveController.getVehiclesReserved);
router.post('/create-reserve-by-employee', reserveController.reserveVehicle);
console.log('Cargando rutas de reservas...');

module.exports = router; //exporta el router para usarlo en otros archivos (app.js)