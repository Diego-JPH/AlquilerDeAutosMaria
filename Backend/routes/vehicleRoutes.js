const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.post('/insertVehicle', vehicleController.insertVehicle);

module.exports = router; //exporta el router para usarlo en otros archivos (app.js)