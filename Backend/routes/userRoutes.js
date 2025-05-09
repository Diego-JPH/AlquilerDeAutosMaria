const express = require('express');
const router = express.Router();
const userController = require('../controllers/user/userController');

//router.post('/register', registerController.registerUser); //ruta para registrar un usuario
router.get('/list', userController.listUsers); //ruta para listar los usuarios

module.exports = router; //exporta el router para usarlo en otros archivos (app.js)