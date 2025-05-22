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

async function crearConductor(licencia, nombre, apellido, fechaNacimiento) {
    console.log('Creando conductor:', licencia, nombre, apellido, fechaNacimiento);
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
        console.error('Error al registrar cancelaciÃ³n:', error);
        throw error;
    }
}

const verificarDisponibilidadVehiculo = async (idVehiculo, fechaDesde, fechaHasta) => {
    const [result] = await db.execute(
        'SELECT * FROM Reserva WHERE id_vehiculo = ? AND NOT (fechaHasta < ? OR fechaDesde > ?)',
        [idVehiculo, fechaDesde, fechaHasta]
    );
    return result;
};

const obtenerVehiculoEnSucursal = async (idVehiculo, idSucursal) => {
    const [result] = await db.execute(
        'SELECT * FROM Vehiculo WHERE id_vehiculo = ? AND id_sucursal = ?',
        [idVehiculo, idSucursal]
    );
    return result[0] || null;
};

const buscarConductorPorLicencia = async (licencia) => {
    const [result] = await db.execute(
        'SELECT * FROM Conductor WHERE licencia = ?',
        [licencia]
    );
    return result[0] || null;
};

const obtenerReservasActivasConductor = async (licencia, fechaDesde, fechaHasta) => {
    const [result] = await db.execute(
        `SELECT r.* 
    FROM Reserva r 
    JOIN Conductor c ON r.id_conductor = c.id_conductor 
    WHERE c.licencia = ? 
    AND NOT (r.fechaHasta < ? OR r.fechaDesde > ?)`,
        [licencia, fechaDesde, fechaHasta]
    );
    return result;
};

const crearReserva = async ({
    fechaDesde,
    fechaHasta,
    id_usuario,
    id_conductor,
    id_sucursal_retiro,
    id_sucursal_entrega,
    id_vehiculo,
    estado
}) => {
    const [result] = await db.execute(
        `INSERT INTO Reserva 
        (fechaDesde, fechaHasta, id_usuario, id_conductor, id_sucursal_retiro, id_sucursal_entrega, id_vehiculo, estado) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [fechaDesde, fechaHasta, id_usuario, id_conductor, id_sucursal_retiro, id_sucursal_entrega, id_vehiculo, estado]
    );
    return result.insertId;
};

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
    registrarCancelacion,
    verificarDisponibilidadVehiculo,
    obtenerVehiculoEnSucursal,
    buscarConductorPorLicencia,
    obtenerReservasActivasConductor,
    crearReserva
};