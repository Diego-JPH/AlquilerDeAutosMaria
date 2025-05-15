const dayjs = require('dayjs');
const driverModel = require('../models/driver');
const reserveModel = require('../models/reserve');

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

module.exports = {
    changeDriver
};