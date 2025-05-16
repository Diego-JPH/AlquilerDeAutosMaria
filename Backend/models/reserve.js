const db = require('../config/db');

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

// funciones para cancelar reservas
async function obtenerReservaPorId(idReserva) {
    const [rows] = await db.query('SELECT * FROM Reserva WHERE id_reserva = ?', [idReserva]);
    return rows[0] || null;
}

async function cancelarReserva(idReserva) {
    await db.query('DELETE FROM Reserva WHERE id_reserva = ?', [idReserva]);
}

async function registrarReembolso(idReserva, idTarjeta, monto, motivo) {
    await db.query(
        'INSERT INTO Reembolso (id_reserva, id_tarjeta, monto, motivo, fecha) VALUES (?, ?, ?, ?, NOW())',
        [idReserva, idTarjeta, monto, motivo]
    );
}

async function obtenerFechaDesdePorId(idReserva) {
    const [rows] = await db.query('SELECT fechaDesde FROM Reserva WHERE id_reserva = ?', [idReserva]);
    return rows[0]?.fechaDesde || null;
}

async function eliminarConductorSiNoTieneReservas(idConductor) {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM Reserva WHERE id_conductor = ?', [idConductor]);
    if (rows[0].total === 0) {
        await db.query('DELETE FROM Conductor WHERE id_conductor = ?', [idConductor]);
    }
}

async function marcarReservaComoCancelada(idReserva) {
    const sql = `UPDATE Reserva SET estado = 'cancelada' WHERE id_reserva = ?`;
    try {
        const [result] = await db.execute(sql, [idReserva]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al marcar reserva como cancelada:', error);
        throw error;
    }
}

async function registrarCancelacion(idReserva, motivo, tipo_cancelacion) {
    const sql = `
        INSERT INTO Cancelacion (id_reserva, motivo, fecha_cancelacion, tipo_cancelacion)
        VALUES (?, ?, NOW(), ?)
    `;
    try {
        const [result] = await db.execute(sql, [idReserva, motivo, tipo_cancelacion]);
        return result.insertId;
    } catch (error) {
        console.error('Error al registrar cancelación:', error);
        throw error;
    }
}

module.exports = {
    eliminarConductor,
    crearConductor,
    obtenerIdConductorPorReserva,
    actualizarConductor,
    conductorTieneReservaActiva,
    licenciaConReservaActiva,
    obtenerReservaPorId,
    cancelarReserva,
    registrarReembolso,
    obtenerFechaDesdePorId,
    eliminarConductorSiNoTieneReservas,
    marcarReservaComoCancelada,
    registrarCancelacion
};