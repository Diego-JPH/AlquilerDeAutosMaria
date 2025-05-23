const express = require('express');
const router = express.Router();
const { updateVehicle, insertVehicle, deleteVehicle } = require('../controllers/vehicleController');

router.put('/:patente', updateVehicle);
router.post('/', insertVehicle);
router.delete('/:patente', deleteVehicle);

module.exports = router;