const db = require("../config/db");
const dayjs = require("dayjs");

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

async function marcarVehiculoEnMantenimiento(id_vehiculo) {
  const [result] = await db.execute(
    "UPDATE Vehiculo SET estado = 'Mantenimiento' WHERE id_vehiculo = ?",
    [id_vehiculo]
  );
  return result.affectedRows > 0;
}

async function registrarMantenimientoVehiculo(id_vehiculo, fechaInicio, diasMantenimiento) {
  const fechaFin = dayjs(fechaInicio).add(diasMantenimiento, "day").format("YYYY-MM-DD");

  const [result] = await db.execute(
    `INSERT INTO VehiculosEnMantenimiento (id_vehiculo, fecha_inicio, fecha_fin)
     VALUES (?, ?, ?)`,
    [id_vehiculo, fechaInicio, fechaFin]
  );
  return result.insertId;
}

module.exports = {
  getVehiclesAvailableBetweenDates,
  marcarVehiculoEnMantenimiento,
  registrarMantenimientoVehiculo
};
