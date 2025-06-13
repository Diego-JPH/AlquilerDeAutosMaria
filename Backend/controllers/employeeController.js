const { insertUser, findUserByEmail, insertEmployee } = require('../models/userModels');
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
    const id_usuario = await insertUser(email, nombre, apellido, contraseña, "empleado" );

    await insertEmployee(id_usuario, id_sucursal);
    await enviarEmailRegistro(email, nombre, contraseña);

    return res.status(201).json({ mensaje: 'El empleado fue registrado.' });
  } catch (error) {
    console.error('Error al registrar empleado:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

module.exports = {
  registrarEmpleado,
};