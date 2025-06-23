const express = require('express');
const router = express.Router();
const { actualizarSucursalEmpleado } = require('../controllers/adminController');

router.put('/actualizar-sucursal-empleado', actualizarSucursalEmpleado);

module.exports = router;