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
        const licenciaExistente = await driverModel.buscarPorLicencia(licencia);
        if (licenciaExistente) {
            return res.status(400).json({ error: 'La licencia ya está asociada a otro conductor.' });
        }

        const tieneReserva = await reserveModel.licenciaConReservaActiva(licencia);
        if (tieneReserva) {
            return res.status(400).json({ error: 'La licencia ya está asociada a una reserva activa.' });
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

        if (reserva.estado === 'cancelada') {
            return res.status(400).json({ error: 'La reserva ya está cancelada.' });
        }

        const hoy = dayjs();
        const fechaDesde = dayjs(reserva.fechaDesde);

        if (tipoCancelacion === 'cliente' && fechaDesde.diff(hoy, 'day') < 1) {
            return res.status(400).json({ error: 'La cancelación debe hacerse con un día de anticipación.' });
        }

        await reserveModel.registrarCancelacion(idReserva, motivo, tipoCancelacion);
        await reserveModel.marcarReservaComoCancelada(idReserva);

        if (numero_tarjeta && monto) {
            await creditCardModel.reembolsarATarjeta(numero_tarjeta, monto);
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

module.exports = {
    changeDriver,
    cancelReserve,
    reserveVehicle
};