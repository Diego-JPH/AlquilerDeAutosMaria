const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { updateVehicle, insertVehicle, deleteVehicle, getVehicles, getVehiclesAdmin, getAvailableVehiclesByDate, getVehiclesByEmployeeBranch, actualizarEstado } = require('../controllers/vehicleController');
const authMiddleware = require('../middlewares/authMiddleware');

router.put('/:patente', updateVehicle);
router.post('/', upload.single('imagen'), insertVehicle);
router.delete('/:patente', deleteVehicle);
router.get('/getVehicles', getVehicles);
router.get('/getVehiclesAdmin', getVehiclesAdmin);
router.get('/getVehiclesAvailableByDate', getAvailableVehiclesByDate);
router.get('/employeeVehicles', authMiddleware, getVehiclesByEmployeeBranch);
router.put('/estado/:patente', authMiddleware, actualizarEstado);

module.exports = router;