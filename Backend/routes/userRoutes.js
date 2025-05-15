const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/registrar-cliente', userController.registrarCliente);

module.exports = router;