const userModel = require('../models/userModels');
const db = require('../config/db'); // 👈 ESTA LÍNEA FALTABA

const actualizarSucursalEmpleado = async (req, res) => {
  const { email, nombre_sucursal } = req.body;

  try {
    const usuario = await userModel.findUserByEmail(email);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const id_usuario = usuario.id_usuario;

    const esEmpleado = await userModel.esEmpleado(id_usuario);
    if (!esEmpleado) {
      return res.status(400).json({ mensaje: 'El usuario no es un empleado' });
    }

    const id_sucursal_nueva = await userModel.obtenerIdSucursalPorNombre(nombre_sucursal);
    if (!id_sucursal_nueva) {
      return res.status(404).json({ mensaje: 'Sucursal no encontrada' });
    }

    const id_sucursal_actual = await userModel.obtenerSucursalPorUsuario(id_usuario);
    if (id_sucursal_actual === id_sucursal_nueva) {
      return res.status(400).json({ mensaje: 'El empleado ya pertenece a esa sucursal' });
    }

    await userModel.actualizarSucursalEmpleado(id_usuario, id_sucursal_nueva);
    res.status(200).json({ mensaje: 'Sucursal del empleado actualizada correctamente' });

  } catch (error) {
    console.error('Error actualizando la sucursal del empleado:', error);
    res.status(500).json({ mensaje: 'Error actualizando la sucursal del empleado' });
  }
};

const getClientesRegistrados = async (req, res) => {
  const { desde, hasta } = req.query;

  try {
    if (desde && hasta && new Date(desde) > new Date(hasta)) {
      return res.status(400).json({ mensaje: "El rango de fechas seleccionado es invalido" });
    }

    const clientes = await userModel.obtenerClientesRegistrados(desde, hasta);

    if (clientes.length === 0) {
      return res.status(200).json({ mensaje: "No hay clientes registrados", clientes: [] });
    }

    res.status(200).json({ clientes });
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ mensaje: "Error al obtener clientes" });
  }
};

module.exports = {
  actualizarSucursalEmpleado,
  getClientesRegistrados
};