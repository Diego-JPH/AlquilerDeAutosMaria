const express = require('express');
const router = express.Router();
const { updateVehicle } = require('../controllers/vehicle/vehicleController');

router.put('/vehicles/:patente', updateVehicle);

module.exports = router;