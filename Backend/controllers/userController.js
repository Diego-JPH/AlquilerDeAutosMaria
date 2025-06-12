const userModel = require('../models/userModels');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const generarCodigo = () => Math.floor(1000 + Math.random() * 9000);
const SECRET_KEY = process.env.JWT_SECRET;
const { sendVerificationEmail } = require('../utils/mailer');
const { calcularMontoEntreFechas } = require('../models/userModels');


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
    { id: usuario.id_usuario, rol: usuario.rol, nombre: usuario.nombre },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.status(200).json({
    token,
    usuario: {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      rol: usuario.rol,
      email: usuario.email
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

module.exports = {
  registrarCliente,
  iniciarSesion,
  verificarCodigo,
  obtenerMontoRecaudado
};
