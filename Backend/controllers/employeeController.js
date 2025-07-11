const {
  insertUser,
  findUserByEmail,
  insertEmployee,
  getEmpleados,
  deleteEmpleado
} = require('../models/userModels');

const { generarPasswordAleatoria } = require('../utils/randomPassword');
const { enviarEmailRegistro } = require('../utils/mailer');

async function registrarEmpleado(req, res) {
  const { nombre, apellido, email, id_sucursal } = req.body;

  try {
    const usuarioExistente = await findUserByEmail(email);

    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ingresado ya se encuentra registrado' });
    }

    const contraseña = generarPasswordAleatoria();
    const id_usuario = await insertUser(email, nombre, apellido, contraseña, "empleado");

    await insertEmployee(id_usuario, id_sucursal);
    await enviarEmailRegistro(email, nombre, contraseña);

    return res.status(201).json({ mensaje: 'Empleado registrado con exito.' });
  } catch (error) {
    console.error('Error al registrar empleado:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

async function listarEmpleados(req, res) {
  const idSucursal = req.query.id_sucursal;

  try {
    const empleados = await getEmpleados(idSucursal);

    if (empleados.length === 0) {
      return res.status(200).json({ mensaje: 'No se tiene empleados registrados', empleados: [] });
    }

    return res.status(200).json({ empleados });
  } catch (error) {
    console.error('Error al listar empleados:', error);
    return res.status(500).json({ mensaje: 'Error al obtener empleados' });
  }
}

async function eliminarEmpleado(req, res) {
  const id_usuario = req.params.id;

  try {
    const result = await deleteEmpleado(id_usuario);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    return res.status(200).json({ mensaje: 'Empleado eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    return res.status(500).json({ mensaje: 'Error al eliminar empleado' });
  }
}

module.exports = {
  registrarEmpleado,
  listarEmpleados,
  eliminarEmpleado
};