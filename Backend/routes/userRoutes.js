const express = require('express');
const router = express.Router();
const registerController = require('../controllers/user/registerController');
const recoverController = require('../controllers/user/recoverPassword');

router.post('/register', registerController.registerUser); //ruta para registrar un usuario
//router.get('/', registerController.listUsers); //ruta para listar los usuarios
router.post('/recover-password', recoverController.recoverPassword);
module.exports = router; //exporta el router para usarlo en otros archivos (app.js)