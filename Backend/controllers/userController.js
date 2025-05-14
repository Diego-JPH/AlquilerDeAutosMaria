const userModel = require('../models/userModels');
const dayjs = require('dayjs');

const registrarCliente = async (req, res) => {
  const { nombre, apellido, fechaN, email, contraseña } = req.body;

  // Verificar si el email ya está registrado
  const existente = await userModel.findUserByEmail(email);
  if (existente) {
    return res.status(400).json({ mensaje: 'El email ingresado pertenece a un usuario registrado' });
  }

  // Verificar edad
  const edad = dayjs().diff(dayjs(fechaN), 'year');
  if (edad < 18) {
    return res.status(400).json({ mensaje: 'No se admiten registros de clientes menores de edad' });
  }

  // Insertar usuario y cliente
  const id_usuario = await userModel.insertUser(email, nombre, apellido);
  await userModel.insertCliente(id_usuario, contraseña, fechaN);

  return res.status(201).json({ mensaje: 'El usuario fue registrado.' });
};

module.exports = {
  registrarCliente
};
