const db = require("../config/db");

const getVehiclesAvailableBetweenDates = async (fechaDesde, fechaHasta) => {
  const query = `
    SELECT v.*, m.modelo AS modelo, ma.marca AS marca
    FROM Vehiculo v
    JOIN Modelo m ON v.id_modelo = m.id_modelo
    JOIN Marca ma ON m.id_marca = ma.id_marca
    WHERE v.estado = 'disponible' AND v.id_vehiculo NOT IN (
      SELECT r.id_vehiculo
      FROM Reserva r
      WHERE
        r.estado != 'cancelada'
        AND r.fechaDesde <= ?
        AND r.fechaHasta >= ?
    )
  `;

  const [rows] = await db.query(query, [fechaHasta, fechaDesde]); // Orden importa

  return rows;
};


module.exports = {
  getVehiclesAvailableBetweenDates,
};
