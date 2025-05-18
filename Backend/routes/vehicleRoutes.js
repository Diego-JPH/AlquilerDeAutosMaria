const express = require('express');
const router = express.Router();
const { updateVehicle } = require('../controllers/vehicle/vehicleController');
const vehicleController = require('../controllers/vehicleController');

router.put('/vehicles/:patente', updateVehicle);
router.post('/insertVehicle', vehicleController.insertVehicle);

module.exports = router;

