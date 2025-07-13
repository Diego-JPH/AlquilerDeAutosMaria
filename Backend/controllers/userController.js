const userModel = require('../models/userModels');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const generarCodigo = () => Math.floor(1000 + Math.random() * 9000);
const SECRET_KEY = process.env.JWT_SECRET;
const { sendVerificationEmail } = require('../utils/mailer');
const { enviarEmailRegistroEmpleado } = require('../utils/mailer');
const { calcularMontoEntreFechas } = require('../models/userModels');
const { generarPasswordAleatoria } = require('../utils/randomPassword');
const db = require('../config/db');

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

  let sucursal = null;
  if (usuario.rol === 'admin' || usuario.rol === 'empleado') {
    const id_sucursal = await userModel.obtenerSucursalPorUsuario(usuario.id_usuario);
    sucursal = { id_sucursal };  // ahora sucursal es un objeto con la forma que esperás
  }
  // Si el rol es administrador, enviamos un código de verificación
  if (usuario.rol === 'admin') {
    const codigo = generarCodigo();
    const expiracion = Date.now() + 10 * 60 * 1000; // 10 minutos

    try {
      await userModel.guardarCodigoVerificacion(email, codigo, expiracion);
      await sendVerificationEmail(email, codigo);

      return res.status(200).json({
        mensaje: "Código enviado por correo. Ingrese el código para continuar.",
        requiereCodigo: true
      });
    } catch (error) {
      console.error("Error enviando email:", error);
      return res.status(500).json({ mensaje: "No se pudo enviar el código de verificación por correo." });
    }
  }

  // Generar token
  const token = jwt.sign(
    {
      id: usuario.id_usuario,
      rol: usuario.rol,
      nombre: usuario.nombre,
      sucursal
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  return res.status(200).json({
    token,
    usuario: {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      rol: usuario.rol,
      email: usuario.email,
      sucursal
    }
  });
};

const verificarCodigo = async (req, res) => {
  const { email, codigoIngresado } = req.body;

  try {
    const registro = await userModel.obtenerCodigoVerificacion(email);

    if (!registro) {
      return res.status(404).json({ mensaje: 'No se encontró un código para este email.' });
    }

    const { codigo, expiracion } = registro;

    const ahora = Date.now();
    if (ahora > expiracion) {
      return res.status(400).json({ mensaje: 'El código ha expirado. Intenta iniciar sesión nuevamente.' });
    }

    if (parseInt(codigoIngresado) !== parseInt(codigo)) {
      return res.status(401).json({ mensaje: 'El código ingresado es incorrecto.' });
    }

    // Si todo está bien, generamos el token y lo devolvemos
    const usuario = await userModel.findUserByEmail(email);
    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol, nombre: usuario.nombre },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      mensaje: 'Verificación exitosa.',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error('Error verificando código:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

async function obtenerMontoRecaudado(req, res) {
  const { fechaInicio, fechaFin } = req.query;

  // Validaciones iniciales
  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({ error: 'Se deben ingresar ambas fechas' });
  }

  // Parseo seguro con dayjs
  const inicio = dayjs(fechaInicio, 'YYYY-MM-DD');
  const fin = dayjs(fechaFin, 'YYYY-MM-DD');

  // Validaciones de formato y rango
  if (!inicio.isValid() || !fin.isValid() || inicio.isAfter(fin)) {
    return res.status(400).json({ error: 'Fecha inválida' });
  }

  try {
    const montoTotal = await calcularMontoEntreFechas(fechaInicio, fechaFin);
    res.json({ montoTotal });
  } catch (error) {
    console.error('Error al calcular el monto recaudado:', error);
    res.status(500).json({ error: 'Error al calcular el monto recaudado' });
  }
}

const registrarClientePorEmpleado = async (req, res) => {
  const { email, nombre, apellido, fechaN } = req.body;

  const existente = await userModel.findUserByEmail(email);
  if (existente) {
    return res.status(400).json({ mensaje: 'El email ingresado pertenece a un usuario registrado' });
  }

  const edad = dayjs().diff(dayjs(fechaN), 'year');
  if (edad < 18) {
    return res.status(400).json({ mensaje: 'El cliente debe ser mayor de edad' });
  }

  const contraseña = generarPasswordAleatoria();

  const id_usuario = await userModel.insertUser(email, nombre, apellido, contraseña, 'cliente');
  await userModel.insertCliente(id_usuario, fechaN);

  await enviarEmailRegistroEmpleado(email, nombre, contraseña);

  return res.status(201).json({ mensaje: 'Cliente registrado correctamente y contraseña enviada por mail' });
};

const listarClientes = async (req, res) => {
  try {
    const [clientes] = await db.query(
      `SELECT id_usuario, nombre, apellido, email FROM Usuario WHERE rol = 'cliente'`
    );
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "El correo es obligatorio." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "El formato del correo es inválido." });
  }

  try {
    const result = await db.query(
      `SELECT id_usuario, nombre, apellido, email FROM Usuario 
       WHERE email = ? AND rol = 'cliente'`,
      [email]
    );

    if (result[0].length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado o no tiene el rol adecuado." });
    }

    res.status(200).json(result[0][0]);
  } catch (error) {
    console.error("Error al buscar usuario por email:", error);
    res.status(500).json({ error: "Error del servidor al buscar el usuario." });
  }
};


module.exports = {
  registrarCliente,
  iniciarSesion,
  verificarCodigo,
  obtenerMontoRecaudado,
  registrarClientePorEmpleado,
  listarClientes,
  getUserByEmail
};
