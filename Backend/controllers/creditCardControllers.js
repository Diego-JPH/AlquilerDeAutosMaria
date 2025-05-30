const creditCardModel = require('../models/creditCardModels');

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

module.exports = {
    listarTarjetas
};
