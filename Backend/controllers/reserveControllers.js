const dayjs = require('dayjs');
const driverModel = require('../models/driver');
const reserveModel = require('../models/reserve');
const creditCardModel = require('../models/creditCardModels');

const changeDriver = async (req, res) => {
    const { nombre, apellido, fechaNacimiento, licencia, idReserva } = req.body;

    const edad = dayjs().diff(dayjs(fechaNacimiento), 'year');
    if (edad < 18) {
        return res.status(400).json({ error: 'El conductor debe ser mayor de edad.' });
    }

    try {
        const reserva = await reserveModel.obtenerReservaPorId(idReserva);
        if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada.' });

        if ((reserva.estado === 'cancelada') || (reserva.estado === 'finalizada')) {
            return res.status(400).json({ error: 'La reserva ya se encuentra finalizada o cancelada.' });
        }

        const hoy = dayjs();
        const fechaDesde = dayjs(reserva.fechaDesde);
        const fechaHasta = dayjs(reserva.fechaHasta);

        if (hoy.isAfter(fechaDesde) && hoy.isBefore(fechaHasta.add(1, 'day'))) {
            return res.status(400).json({
                error: 'La reserva se encuentra actualmente en curso, por lo que no se puede cambiar el conductor.'
            });
        }

        const licenciaExistente = await driverModel.buscarPorLicencia(licencia);
        if (licenciaExistente) {
            return res.status(400).json({ error: 'La licencia ya está asociada a otro conductor.' });
        }

        const viejoId = await reserveModel.obtenerIdConductorPorReserva(idReserva);
        if (!viejoId) {
            return res.status(404).json({ error: 'Reserva no encontrada.' });
        }

        const nuevoId = await reserveModel.crearConductor(licencia, nombre, apellido, fechaNacimiento);

        await reserveModel.actualizarConductor(idReserva, nuevoId);

        await reserveModel.eliminarConductorSiNoTieneReservas(viejoId);

        return res.status(200).json({ mensaje: 'Conductor actualizado correctamente.' });

    } catch (error) {
        console.error(error);
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
    } = req.body;

    try {
        const fechaRetiro = new Date(fechaDesde);
        const fechaEntrega = new Date(fechaHasta);

        if (fechaRetiro >= fechaEntrega) {
            return res.status(400).json({ error: 'Las fechas ingresadas son inválidas.' });
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
                return res.status(400).json({ error: 'El conductor debe ser mayor de edad.' });
            }

            conductorId = await reserveModel.crearConductor(licencia, nombre, apellido, fechaN);
        }

        const reservasActivas = await reserveModel.obtenerReservasActivasConductor(licencia, fechaDesde, fechaHasta);
        if (reservasActivas.length > 0) {
            return res.status(409).json({ error: 'El conductor ya tiene otra reserva activa en ese período.' });
        }

        const reservaId = await reserveModel.crearReserva({
            fechaDesde,
            fechaHasta,
            id_usuario,
            id_conductor: conductorId,
            id_sucursal_retiro: sucursal_retiro_id,
            id_sucursal_entrega: sucursal_entrega_id,
            id_vehiculo,
            estado: 'activa',
        });

        return res.status(201).json({ message: 'Reserva realizada con éxito.', reservaId });

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

module.exports = {
    changeDriver,
    cancelReserve,
    reserveVehicle,
    listReserveOfUser
};