const creditCardModel = require('../models/creditCardModels');
const reserveModel = require("../models/reserve");

const listarTarjetas = async (req, res) => {
    try {
        const tarjetas = await creditCardModel.obtenerTarjetas();
        if (tarjetas.length === 0) {
            return res.status(404).json({ error: 'No se encontraron tarjetas de crédito.' });
        }
        res.status(200).json(tarjetas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener tarjetas de crédito.' });
    }
};

const makePayment = async (req, res) => {
  const { titular, numero, vencimiento, cvv, monto } = req.body;

  try {
    // 1. Validar existencia de la tarjeta
    const tarjeta = await creditCardModel.obtenerTarjetaPorDatos(numero, vencimiento, cvv, titular);
    if (!tarjeta) {
      return res.status(400).json({ error: "Los datos ingresados son incorrectos" });
    }

    // 2. Validar saldo
    if (tarjeta.saldo < monto) {
      return res.status(400).json({ error: "Saldo insuficiente" });
    }

    // 3. Cobrar tarjeta
    await creditCardModel.cobrarATarjeta(tarjeta.id_tarjeta, monto);

    // 4. Marcar reserva como "pagada" si querés agregar ese estado, o loguear en log_pagos
    console.log(`💳 Se cobró $${monto} correctamente a la tarjeta ${tarjeta.numero_tarjeta}`);

    res.status(200).json({ message: "Pago realizado con éxito." });

  } catch (error) {
    console.error("Error al procesar el pago:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


module.exports = {
    listarTarjetas,
    makePayment
};
