const userModel = require('../models/userModels');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET;

const registrarCliente = async (req, res) => {
  const { email, nombre, apellido, contraseña, fechaN } = req.body;

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
  const id_usuario = await userModel.insertUser(email, nombre, apellido, contraseña, 'cliente');
  await userModel.insertCliente(id_usuario, fechaN);

  return res.status(201).json({ mensaje: 'El usuario fue registrado.' });
};

const iniciarSesion = async (req, res) => {
  const { email, contraseña } = req.body;

  const usuario = await userModel.findUserByEmail(email);
  if (!usuario) {
    return res.status(404).json({ mensaje: "Usuario no registrado en el sistema" });
  }

  if (usuario.contraseña !== contraseña) {
    return res.status(401).json({ mensaje: "El email o la contraseña son incorrectos" });
  }

  // Generar token
  const token = jwt.sign(
    { id: usuario.id_usuario, rol: usuario.rol, nombre: usuario.nombre },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.status(200).json({
    mensaje: "Inicio de sesión exitoso",
    token
  });
};

module.exports = {
  registrarCliente,
  iniciarSesion
};
