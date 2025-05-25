const db = require('../config/db');

const getSucursales = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Sucursal');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener las sucursales:', error);
    res.status(500).json({ error: 'Error al obtener las sucursales' });
  }
};

module.exports = {
  getSucursales
};
