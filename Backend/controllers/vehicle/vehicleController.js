const pool = require('../../config/db');

const updateVehicle = async (req, res) => {
  const { patente } = req.params;
  const { precioPorDia } = req.body;

  if (precioPorDia === undefined) {
    return res.status(400).json({ error: 'Falta precioPorDia en body' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE Vehiculo SET precioPorDia = ? WHERE patente = ?',
      [precioPorDia, patente]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    res.json({
      message: 'Precio actualizado correctamente',
      patente,
      nuevoPrecio: precioPorDia,
    });
  } catch (error) {
    console.error('Error actualizando vehículo:', error);
    res.status(500).json({ error: error.message }); // para ver el mensaje real en la respuesta
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

module.exports = { updateVehicle };