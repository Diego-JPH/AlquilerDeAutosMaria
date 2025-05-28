const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { updateVehicle, insertVehicle, deleteVehicle, getVehicles } = require('../controllers/vehicleController');

router.put('/:patente', updateVehicle);
router.post('/', upload.single('imagen'), insertVehicle);
router.delete('/:patente', deleteVehicle);
router.get('/getVehicles', getVehicles);

module.exports = router;