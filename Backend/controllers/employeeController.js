const { insertUser, findUserByEmail, insertEmployee } = require('../models/userModels');
const { generarPasswordAleatoria } = require('../utils/randomPassword');
const { enviarEmailRegistro } = require('../utils/mailer');
const db = require('../config/db');

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

async function listarEmpleados(req, res) {
  const idSucursal = req.query.id_sucursal;

  try {
    let query = `
      SELECT u.id_usuario, u.nombre, u.apellido, u.email, s.sucursal
      FROM Empleado e
      JOIN Usuario u ON e.id_usuario = u.id_usuario
      JOIN Sucursal s ON e.id_sucursal = s.id_sucursal
    `;
    const params = [];

    if (idSucursal) {
      query += ' WHERE e.id_sucursal = ?';
      params.push(idSucursal);
    }

    console.log("Sucursal recibida:", idSucursal);
    console.log("Consulta final:", query);
    console.log("Parámetros:", params);

    const [rows] = await db.query(query, params); // <--- posible origen del error

    if (rows.length === 0) {
      return res.status(200).json({ mensaje: 'No se tiene empleados registrados', empleados: [] });
    }

    return res.status(200).json({ empleados: rows });
  } catch (error) {
    console.error('Error al listar empleados:', error); // Esto te dará más detalles en consola
    return res.status(500).json({ mensaje: 'Error al obtener empleados' });
  }
}

module.exports = {
  registrarEmpleado,
  listarEmpleados
};