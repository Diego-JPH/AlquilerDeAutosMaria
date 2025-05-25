const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const recoverPassword = require('../controllers/user/recoverPassword');
const resetPassword = require('../controllers/user/resetPassword');

router.post('/registrar-cliente', userController.registrarCliente);
router.post('/login', userController.iniciarSesion);
router.post('/recoverPassword', recoverPassword.recoverPassword);
router.put('/resetPassword', resetPassword.resetPassword);

module.exports = router;