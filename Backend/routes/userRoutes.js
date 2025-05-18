const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const registerController = require('../controllers/user/registerController');
const recoverController = require('../controllers/user/recoverPassword');

router.post('/registrar-cliente', userController.registrarCliente);
router.post('/login', userController.iniciarSesion);
router.post('/recover-password', recoverController.recoverPassword);

module.exports = router;



