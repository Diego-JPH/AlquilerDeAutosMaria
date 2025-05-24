const express = require('express');
const router = express.Router();
const sucursalesController = require('../controllers/sucursalesController');

router.get('/getSucursales', sucursalesController.getSucursales);
module.exports = router; //exporta el router para usarlo en otros archivos (app.js)