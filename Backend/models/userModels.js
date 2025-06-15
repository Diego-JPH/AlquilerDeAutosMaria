const db = require('../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM Usuario WHERE email = ?', [email]);
  return rows[0];
};

// Ahora incluye contraseña y rol
const insertUser = async (email, nombre, apellido, contraseña, rol) => {
  const [result] = await db.query(
    'INSERT INTO Usuario (email, nombre, apellido, contraseña, rol) VALUES (?, ?, ?, ?, ?)',
    [email, nombre, apellido, contraseña, rol]
  );
  return result.insertId;
};

// Ya no se guarda la contraseña en Cliente
const insertCliente = async (id_usuario, fechaN) => {
  await db.query(
    'INSERT INTO Cliente (id_usuario, fechaN) VALUES (?, ?)',
    [id_usuario, fechaN]
  );
};

const findClienteById = async (id_usuario) => {
  const [rows] = await db.query('SELECT * FROM Cliente WHERE id_usuario = ?', [id_usuario]);
  return rows[0];
};

async function guardarCodigoVerificacion(email, codigo, expiracion) {
  await db.query(`
    INSERT INTO codigos_verificacion (email, codigo, expiracion)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE codigo = VALUES(codigo), expiracion = VALUES(expiracion)
  `, [email, codigo, expiracion]);
}

async function obtenerCodigoVerificacion(email) {
  const [rows] = await db.query(
    'SELECT codigo, expiracion FROM codigos_verificacion WHERE email = ?',
    [email]
  );
  return rows[0];
}

async function calcularMontoEntreFechas(fechaInicio, fechaFin) {
  const [result] = await db.execute(
    `SELECT SUM(monto) AS montoTotal
     FROM Reserva
     WHERE fechaDesde <= ? AND fechaHasta >= ?
       AND estado <> 'cancelada'`,
    [fechaFin, fechaInicio] // ¡ojo con el orden aquí!
  );

  return result[0].montoTotal || 0;
}

async function insertEmployee(id_usuario, id_sucursal) {
  await db.query(
    'INSERT INTO Empleado (id_usuario, id_sucursal) VALUES (?, ?)',
    [id_usuario, id_sucursal]
  );
}

async function obtenerSucursalPorUsuario(id_usuario) {
  const [rows] = await db.query(
    'SELECT id_sucursal FROM Empleado WHERE id_usuario = ?',
    [id_usuario]
  );
  return rows[0]?.id_sucursal || null;
}

module.exports = {
  findUserByEmail,
  insertUser,
  insertCliente,
  findClienteById,
  guardarCodigoVerificacion,
  obtenerCodigoVerificacion,
  calcularMontoEntreFechas,
  insertEmployee,
  obtenerSucursalPorUsuario
};
