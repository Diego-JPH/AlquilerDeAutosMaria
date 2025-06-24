const dayjs = require('dayjs');
const driverModel = require('../models/driver');
const reserveModel = require('../models/reserve');
const creditCardModel = require('../models/creditCardModels');
const db = require('../config/db');

const changeDriver = async (req, res) => {
    const { nombre, apellido, fechaNacimiento, licencia, idReserva } = req.body;

    const edad = dayjs().diff(dayjs(fechaNacimiento), 'year');
    if (edad < 18) {
        return res.status(400).json({ error: 'El conductor debe ser mayor de edad.' });
    }

    try {
        const reserva = await reserveModel.obtenerReservaPorId(idReserva);
        if (!reserva) {
            return res.status(404).json({ error: 'Reserva no encontrada.' });
        }

        const tieneReservaActiva = await reserveModel.licenciaConReservaActiva(licencia);
        if (tieneReservaActiva) {
            return res.status(400).json({ error: 'La licencia ya está asociada a una reserva activa.' });
        }

        let conductor = await reserveModel.buscarConductorPorLicencia(licencia);
        let nuevoIdConductor;

        if (!conductor) {
            // Si no existe, lo creo
            nuevoIdConductor = await reserveModel.crearConductor(licencia, nombre, apellido, fechaNacimiento);
        } else {
            // Si ya existe, uso su id
            nuevoIdConductor = conductor.id_conductor;
        }

        // Actualizar reserva con nuevo conductor
        await reserveModel.actualizarConductor(idReserva, nuevoIdConductor);

        return res.status(200).json({ mensaje: 'Conductor actualizado correctamente.' });

    } catch (error) {
        console.error('Error al cambiar conductor:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};


const cancelReserve = async (req, res) => {
    const { idReserva, motivo, tipoCancelacion, numero_tarjeta, monto } = req.body;

    try {
        const reserva = await reserveModel.obtenerReservaPorId(idReserva);
        if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada.' });

        if (reserva.estado === 'cancelada' || reserva.estado === 'finalizada') {
            return res.status(400).json({ error: 'La reserva ya se encuentra finalizada o cancelada.' });
        }

        const hoy = dayjs().startOf('day'); // Fecha de hoy sin hora
        const fechaDesde = dayjs(reserva.fechaDesde).startOf('day');
        const fechaHasta = dayjs(reserva.fechaHasta).startOf('day');

        // Verificamos si la reserva está en curso
        if (hoy.isAfter(fechaDesde) && hoy.isBefore(fechaHasta.add(1, 'day'))) {
            return res.status(400).json({
                error: 'La reserva se encuentra actualmente en curso y no puede ser cancelada.'
            });
        }

        // Cancelación con un día de anticipación para cliente
        if (tipoCancelacion === 'cliente' && fechaDesde.diff(hoy, 'day') < 1) {
            return res.status(400).json({ error: 'La cancelación debe hacerse con un día de anticipación.' });
        }

        await reserveModel.registrarCancelacion(idReserva, motivo, tipoCancelacion);
        await reserveModel.marcarReservaComoCancelada(idReserva);

        if (numero_tarjeta && monto) {
            const tarjeta = await creditCardModel.obtenerTarjetaPorNumero(numero_tarjeta);
            if (!tarjeta) {
                return res.status(400).json({ error: 'Número de tarjeta inválido para reembolso.' });
            }
            await creditCardModel.reembolsarATarjeta(tarjeta.id_tarjeta, monto);
        }

        return res.status(200).json({ mensaje: 'Reserva cancelada correctamente.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al cancelar reserva.' });
    }
};
const reserveVehicle = async (req, res) => {
    const {
        id_vehiculo,
        fechaDesde,
        fechaHasta,
        sucursal_retiro_id,
        sucursal_entrega_id,
        nombre,
        apellido,
        fechaN,
        licencia,
        id_usuario,
        monto,
    } = req.body;

    try {
        const reservaId = await reserveModel.crearReserva({
            fechaDesde,
            fechaHasta,
            id_usuario,
            id_conductor: (await driverModel.buscarId(licencia))?.id_conductor,
            id_sucursal_retiro: sucursal_retiro_id,
            id_sucursal_entrega: sucursal_entrega_id,
            id_vehiculo,
            estado: 'activa',
            monto,
        });

        return res.status(201).json({ message: 'Reserva realizada con éxito.', reservaId });

    } catch (error) {
        console.error('Error al crear la reserva:', error);
        return res.status(500).json({ error: 'Ocurrió un error al procesar la reserva.' });
    }
};

const reserveVerification = async (req, res) => {
    const {
        id_vehiculo,
        fechaDesde,
        fechaHasta,
        sucursal_retiro_id,
        sucursal_entrega_id,
        nombre,
        apellido,
        fechaN,
        licencia,
        id_usuario,
        monto,
    } = req.body;

    try {
        const fechaRetiro = new Date(fechaDesde);
        const fechaEntrega = new Date(fechaHasta);

        if (fechaRetiro >= fechaEntrega) {
            return res.status(400).json({ error: 'La fecha de inicio debe ser anterior a la fecha de fin.' });
        }

        const reservasExistentes = await reserveModel.verificarDisponibilidadVehiculo(id_vehiculo, fechaDesde, fechaHasta);
        if (reservasExistentes.length > 0) {
            return res.status(409).json({ error: 'El auto no está disponible en el período ingresado.' });
        }

        const vehiculoEnSucursal = await reserveModel.obtenerVehiculoEnSucursal(id_vehiculo, sucursal_retiro_id);
        if (!vehiculoEnSucursal) {
            return res.status(400).json({ error: 'El auto no está disponible para la sucursal seleccionada.' });
        }

        let conductor = await reserveModel.buscarConductorPorLicencia(licencia);
        let conductorId;

        if (conductor) {
            conductorId = conductor.id_conductor;
        } else {
            if (!fechaN || !dayjs(fechaN, 'YYYY-MM-DD', true).isValid()) {
                return res.status(400).json({ error: 'La fecha de nacimiento es inválida.' });
            }

            const edad = dayjs().diff(dayjs(fechaN), 'year');
            if (edad < 18) {
                return res.status(400).json({ error: 'El conductor debe ser mayor de edad (18 años o más).' });
            }

            conductorId = await reserveModel.crearConductor(licencia, nombre, apellido, fechaN);
        }

        const reservasActivas = await reserveModel.obtenerReservasActivasConductor(licencia, fechaDesde, fechaHasta);
        if (reservasActivas.length > 0) {
            return res.status(409).json({ error: 'El conductor ya tiene otra reserva activa en ese período.' });
        }
        return res.status(201).json({ message: 'Reserva realizada con éxito.' });

    } catch (error) {
        console.error('Error al crear la reserva:', error);
        return res.status(500).json({ error: 'Ocurrió un error al procesar la reserva.' });
    }
};

const listReserveOfUser = async (req, res) => {
    const idUsuario = req.usuario.id;
    try {
        await reserveModel.marcarReservasFinalizadas();
        const reservas = await reserveModel.getReservationsPerUser(idUsuario);
        res.status(200).json(reservas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener las reservas del usuario" });
    }
};

const getAllReservations = async (req, res) => {
    try {
        const [rows] = await db.query(`
        SELECT 
            r.id_reserva,
            r.fechaDesde,
            r.fechaHasta,
            r.estado,
            r.monto,
            u.nombre AS nombre_usuario,
            u.apellido AS apellido_usuario,
            v.patente,
            m.modelo,
            ma.marca
        FROM Reserva r
        LEFT JOIN Usuario u ON r.id_usuario = u.id_usuario
        LEFT JOIN Vehiculo v ON r.id_vehiculo = v.id_vehiculo
        LEFT JOIN Modelo m ON v.id_modelo = m.id_modelo
        LEFT JOIN Marca ma ON m.id_marca = ma.id_marca
        ORDER BY r.fechaDesde DESC
    `);

        //console.log("🔎 Reservas encontradas:", rows);
        res.json(rows);
    } catch (error) {
        console.error("❌ Error al obtener las reservas:", error);
        res.status(500).json({ error: "Error al obtener las reservas" });
    }
};

const getReservasPorSucursal = async (req, res) => {
    try {
        const { rol, sucursal } = req.usuario;

        if (rol !== 'empleado' && rol !== 'admin') {
            return res.status(403).json({ error: "Acceso denegado" });
        }

        if (!sucursal || !sucursal.id_sucursal) {
            return res.status(400).json({ error: "No se encontró información de sucursal en el token" });
        }

        const id_sucursal = sucursal.id_sucursal;
        const reservas = await reserveModel.getReservasBySucursal(id_sucursal);
        return res.json(reservas);
    } catch (error) {
        console.error("Error al obtener reservas:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

async function marcarEntrega(req, res) {
    const { idReserva } = req.body;
    const idSucursal = req.sucursal?.id_sucursal;

    if (!idReserva) {
        return res.status(400).json({ error: "ID de reserva es obligatorio." });
    }

    try {
        const reserva = await reserveModel.obtenerReservaPorId(idReserva);

        if (!reserva) {
            return res.status(404).json({ error: "Reserva no encontrada." });
        }

        if (reserva.id_sucursal !== idSucursal) {
            return res
                .status(403)
                .json({ error: "No tienes acceso a esta reserva." });
        }

        const actualizado = await reserveModel.actualizarEstadoVehiculo(idReserva, "Entregado");

        if (!actualizado) {
            return res.status(500).json({ error: "No se pudo actualizar el estado." });
        }

        res.json({ mensaje: "Vehículo marcado como entregado." });
    } catch (error) {
        console.error("Error al marcar entrega:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
}

async function getVehiclesReserved(req, res) {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Validación de fechas
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ mensaje: 'Debe proporcionar ambas fechas.' });
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio) || isNaN(fin)) {
      return res.status(400).json({ mensaje: 'Formato de fecha inválido.' });
    }

    if (inicio > fin) {
      return res.status(400).json({ mensaje: 'Fecha inválida. La fecha inicial no puede ser mayor a la final.' });
    }

    const vehiculos = await reserveModel.obtenerVehiculosAlquiladosEntreFechas(fechaInicio, fechaFin);

    if (vehiculos.length === 0) {
      return res.json({ mensaje: 'No se encontraron vehículos alquilados en ese período.', vehiculos: [] });
    }

    return res.json({ vehiculos });
  } catch (error) {
    console.error('Error al obtener vehículos alquilados:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
}

module.exports = {
    changeDriver,
    cancelReserve,
    reserveVehicle,
    listReserveOfUser,
    getAllReservations,
    reserveVerification,
    getReservasPorSucursal,
    marcarEntrega,
    getVehiclesReserved,
};