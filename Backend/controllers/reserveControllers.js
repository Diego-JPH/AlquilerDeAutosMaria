const dayjs = require('dayjs');
const driverModel = require('../models/driver');
const reserveModel = require('../models/reserve');
const creditCardModel = require('../models/creditCardModels');

const changeDriver = async (req, res) => {
    const { nombre, apellido, fechaNacimiento, licencia, idReserva } = req.body;

    // Validar mayoría de edad
    const edad = dayjs().diff(dayjs(fechaNacimiento), 'year');
    if (edad < 18) {
        return res.status(400).json({ error: 'El conductor debe ser mayor de edad.' });
    }

    try {
        // Verificar si la licencia ya está registrada (no se permite repetir)
        const licenciaExistente = await driverModel.buscarPorLicencia(licencia);
        if (licenciaExistente) {
            return res.status(400).json({ error: 'La licencia ya está asociada a otro conductor.' });
        }

        // Verificar si hay una reserva activa con esa licencia
        const tieneReserva = await reserveModel.licenciaConReservaActiva(licencia);
        if (tieneReserva) {
            return res.status(400).json({ error: 'La licencia ya está asociada a una reserva activa.' });
        }

        // Obtener ID del conductor anterior
        const viejoId = await reserveModel.obtenerIdConductorPorReserva(idReserva);
        if (!viejoId) {
            return res.status(404).json({ error: 'Reserva no encontrada.' });
        } //si esto sucede es porque la reserva nunca existio

        // Crear nuevo conductor
        const nuevoId = await reserveModel.crearConductor(nombre, apellido, fechaNacimiento, licencia);

        // Actualizar reserva con el nuevo conductor
        await reserveModel.actualizarConductor(idReserva, nuevoId);

        // Eliminar al conductor anterior
        await reserveModel.eliminarConductor(viejoId);

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
}

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
            return res.status(400).json({ error: 'Las fechas ingresadas son inválidas. Por favor revise los datos.' });
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

            const fechaNacimiento = dayjs(fechaN);
            const hoy = dayjs();
            const edad = hoy.diff(fechaNacimiento, 'year');

            if (edad < 18) {
                return res.status(400).json({ error: 'El conductor debe ser mayor de edad. Por favor revise los datos.' });
            }

            conductorId = await reserveModel.crearConductor(licencia, nombre, apellido, fechaN);
        }

        if (!licencia) {
            return res.status(400).json({ error: 'La licencia de conducir es inválida. Revise los datos.' });
        }

        const reservasActivas = await reserveModel.obtenerReservasActivasConductor(licencia, fechaDesde, fechaHasta);
        if (reservasActivas.length > 0) {
            return res.status(409).json({ error: 'El conductor ya está asignado a otra reserva activa. Revise las fechas.' });
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
        console.error('Error al crear la reserva:', error.message);
        console.error(error.stack); // esto muestra la traza
        return res.status(500).json({ error: 'Ocurrió un error al procesar la reserva.', error });
    }
};

module.exports = {
    changeDriver,
    cancelReserve,
    reserveVehicle
};