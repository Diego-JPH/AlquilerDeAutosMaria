const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/registrar-cliente', userController.registrarCliente);
router.post('/login', userController.iniciarSesion);

module.exports = router;