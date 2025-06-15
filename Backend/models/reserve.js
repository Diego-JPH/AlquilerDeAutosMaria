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

const obtenerEstadoReserva = async (idReserva) => {
    const [result] = await db.execute(
        'SELECT estado FROM Reserva WHERE id_reserva = ?',
        [idReserva]
    );
    if (result.length === 0) return null;
    return result[0].estado;
};

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

const marcarReservaComoCancelada = async (idReserva) => {
    await db.execute(
        'UPDATE Reserva SET estado = ? WHERE id_reserva = ?',
        ['cancelada', idReserva]
    );
};

async function registrarCancelacion(idReserva, motivo, tipo_cancelacion) {
    const sql = `
        INSERT INTO Cancelacion (id_reserva, motivo, fecha_cancelacion, tipo_cancelacion)
        VALUES (?, ?, NOW(), ?)
    `;
    try {
        const [result] = await db.execute(sql, [idReserva, motivo, tipo_cancelacion]);
        return result.insertId;
    } catch (error) {
        console.error('Error al registrar cancelacion:', error);
        throw error;
    }
}

const verificarDisponibilidadVehiculo = async (idVehiculo, fechaDesde, fechaHasta) => {
    const [result] = await db.execute(
        'SELECT * FROM Reserva WHERE id_vehiculo = ? AND NOT (fechaHasta < ? OR fechaDesde > ?) AND estado = "activa"',
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
    return result || null;
};

const crearReserva = async ({
    fechaDesde,
    fechaHasta,
    id_usuario,
    id_conductor,
    id_sucursal_retiro,
    id_sucursal_entrega,
    id_vehiculo,
    estado,
    monto
}) => {
    const [result] = await db.execute(
        `INSERT INTO Reserva 
        (fechaDesde, fechaHasta, id_usuario, id_conductor, id_sucursal_retiro, id_sucursal_entrega, id_vehiculo, estado, monto) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [fechaDesde, fechaHasta, id_usuario, id_conductor, id_sucursal_retiro, id_sucursal_entrega, id_vehiculo, estado, monto]
    );
    return result.insertId;
};

const getReservationsPerUser = async (idUsuario) => {
    const [rows] = await db.execute(
        `SELECT
            r.id_reserva AS id,
            r.fechaDesde,
            r.fechaHasta,
            r.estado,
            r.monto,
            v.politica_devolucion,
            c.nombre AS nombre_conductor,
            c.apellido AS apellido_conductor,
            s_entrega.sucursal AS sucursal_entrega,
            ma.marca,
            mo.modelo
        FROM Reserva r
        LEFT JOIN Conductor c ON r.id_conductor = c.id_conductor
        JOIN Sucursal s_entrega ON r.id_sucursal_entrega = s_entrega.id_sucursal
        JOIN Vehiculo v ON r.id_vehiculo = v.id_vehiculo
        JOIN Modelo mo ON v.id_modelo = mo.id_modelo
        JOIN Marca ma ON mo.id_marca = ma.id_marca
        WHERE r.id_usuario = ?
        ORDER BY r.fechaDesde DESC;
        `,
        [idUsuario]
    );
    return rows;
};

async function marcarReservasFinalizadas() {
    const query = `UPDATE Reserva SET estado = 'finalizada' WHERE estado = 'activa' AND fechaHasta < NOW()`;
    await db.query(query);
}
const getReservasBySucursal = async (idSucursal) => {
    const [rows] = await db.query(
        `
        SELECT 
            r.id_reserva,
            r.fechaDesde,
            r.fechaHasta,
            r.estado,
            r.monto,
            u.nombre,
            u.apellido,
            m.marca,
            mo.modelo
        FROM Reserva r
        JOIN Usuario u ON r.id_usuario = u.id_usuario
        JOIN Vehiculo v ON r.id_vehiculo = v.id_vehiculo
        JOIN Modelo mo ON v.id_modelo = mo.id_modelo
        JOIN Marca m ON mo.id_marca = m.id_marca
        WHERE r.id_sucursal_retiro = ?
        `,
        [idSucursal]
    );
    return rows;
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
    crearReserva,
    obtenerEstadoReserva,
    getReservationsPerUser,
    marcarReservasFinalizadas,
    getReservasBySucursal
};
