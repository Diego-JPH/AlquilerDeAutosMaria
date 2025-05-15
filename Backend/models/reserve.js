// Verifica si ya hay una reserva activa con esa licencia
async function licenciaConReservaActiva(licencia) {
    const [rows] = await db.query(
        `SELECT r.*
        FROM Reserva r
        JOIN Conductor c ON r.id_conductor = c.id_conductor
        WHERE c.licencia = ?
        AND r.fechaDesde <= NOW()
        AND r.fechaHasta >= NOW()`,
        [licencia]
    );
    return rows.length > 0;
}

async function eliminarConductor(idConductor) {
    await db.query('DELETE FROM Conductor WHERE id_conductor = ?', [idConductor]);
}

async function crearConductor(nombre, apellido, fechaNacimiento, licencia) {
    const [result] = await db.query(
        'INSERT INTO Conductor (licencia, nombre, apellido, fechaN) VALUES (?, ?, ?, ?)',
        [licencia, nombre, apellido, fechaNacimiento]
    );
    return result.insertId;
}

async function obtenerIdConductorPorReserva(idReserva) {
    const [rows] = await db.query(
        'SELECT id_conductor FROM Reserva WHERE id_reserva = ?',
        [idReserva]
    );
    return rows[0]?.id_conductor || null;
}

async function conductorTieneReservaActiva(idConductor) {
    const [rows] = await db.query(
        `SELECT * FROM Reserva 
        WHERE id_conductor = ? 
        AND fechaDesde <= NOW() 
        AND fechaHasta >= NOW()`,
        [idConductor]
    );
    return rows.length > 0;
}

async function actualizarConductor(idReserva, idConductor) {
    await db.query(
        'UPDATE Reserva SET id_conductor = ? WHERE id_reserva = ?',
        [idConductor, idReserva]
    );
}

module.exports = {
    eliminarConductor,
    crearConductor,
    obtenerIdConductorPorReserva,
    actualizarConductor,
    conductorTieneReservaActiva,
    licenciaConReservaActiva
};