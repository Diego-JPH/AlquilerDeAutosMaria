const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const recoverPassword = require('../controllers/user/recoverPassword');
const resetPassword = require('../controllers/user/resetPassword');
const registrarEmpleado = require('../controllers/employeeController');

router.post('/registrar-cliente', userController.registrarCliente);
router.post('/login', userController.iniciarSesion);
router.post('/recoverPassword', recoverPassword.recoverPassword);
router.put('/resetPassword', resetPassword.resetPassword);
router.post('/verificar-codigo', userController.verificarCodigo);
router.get('/montoRecaudado', userController.obtenerMontoRecaudado);
router.post('/registrar-empleado', registrarEmpleado.registrarEmpleado);
router.get('/empleados', registrarEmpleado.listarEmpleados);
router.delete('/empleados/:id', registrarEmpleado.eliminarEmpleado);
router.post('/registrar-cliente-por-empleado', userController.registrarClientePorEmpleado);

module.exports = router;