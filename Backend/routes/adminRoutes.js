const express = require('express');
const router = express.Router();
const { actualizarSucursalEmpleado, getClientesRegistrados } = require('../controllers/adminController');

router.put('/actualizar-sucursal-empleado', actualizarSucursalEmpleado);
router.get('/clientes-registrados', getClientesRegistrados);


module.exports = router;