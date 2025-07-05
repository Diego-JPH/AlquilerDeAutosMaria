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

async function getEmpleados(id_sucursal) {
  let query = `
    SELECT u.id_usuario, u.nombre, u.apellido, u.email, s.sucursal
    FROM Empleado e
    JOIN Usuario u ON e.id_usuario = u.id_usuario
    JOIN Sucursal s ON e.id_sucursal = s.id_sucursal
    WHERE e.activo = 1
  `;
  const params = [];

  if (id_sucursal) {
    query += ' AND e.id_sucursal = ?';
    params.push(id_sucursal);
  }

  const [rows] = await db.query(query, params);
  return rows;
}

async function deleteEmpleado(id_usuario) {
  const [result] = await db.query(
    'UPDATE Empleado SET activo = 0 WHERE id_usuario = ?',
    [id_usuario]
  );
  return result;
}
const esEmpleado = async (id_usuario) => {
  const [rows] = await db.query(
    'SELECT * FROM Empleado WHERE id_usuario = ?',
    [id_usuario]
  );
  return rows.length > 0;
};

const obtenerIdSucursalPorNombre = async (nombre) => {
  const [rows] = await db.query(
    'SELECT id_sucursal FROM Sucursal WHERE sucursal = ?',
    [nombre]
  );
  return rows[0]?.id_sucursal || null;
};

const actualizarSucursalEmpleado = async (id_usuario, id_sucursal) => {
  await db.query(
    'UPDATE Empleado SET id_sucursal = ? WHERE id_usuario = ?',
    [id_sucursal, id_usuario]
  );
};

const getSucursalDelEmpleado = async (idUsuario) => {
  const [rows] = await db.query(
    'SELECT id_sucursal FROM Empleado WHERE id_usuario = ? AND activo = 1',
    [idUsuario]
  );
  return rows[0]; // puede ser undefined
};

async function obtenerClientesRegistrados(desde, hasta) {
  let query = `
    SELECT u.nombre, u.apellido, u.email, c.fecha_creacion
    FROM Cliente c
    JOIN Usuario u ON u.id_usuario = c.id_usuario
  `;
  const params = [];

  if (desde && hasta) {
    query += ` WHERE c.fecha_creacion BETWEEN ? AND ?`;
    params.push(desde, hasta);
  }

  const [rows] = await db.query(query, params);
  return rows;
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
  obtenerSucursalPorUsuario,
  getEmpleados,
  deleteEmpleado,
  esEmpleado,
  obtenerIdSucursalPorNombre,
  actualizarSucursalEmpleado,
  getSucursalDelEmpleado,
  obtenerClientesRegistrados,
};
