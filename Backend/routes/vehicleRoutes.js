const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { updateVehicle, insertVehicle, deleteVehicle } = require('../controllers/vehicleController');

router.put('/:patente', updateVehicle);
router.post('/', upload.single('imagen'), insertVehicle);
router.delete('/:patente', deleteVehicle);

module.exports = router;