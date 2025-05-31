const express = require('express');
const router = express.Router();
const creditCardController = require('../controllers/creditCardControllers');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/tarjetas-de-prueba', verifyToken, creditCardController.listarTarjetas);
router.post("/pago", creditCardController.makePayment);

module.exports = router;
