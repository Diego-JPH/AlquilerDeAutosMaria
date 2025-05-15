const db = require('../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM Usuario WHERE email = ?', [email]);
  return rows[0];
};

const insertUser = async (email, nombre, apellido) => {
  const [result] = await db.query(
    'INSERT INTO Usuario (email, nombre, apellido) VALUES (?, ?, ?)',
    [email, nombre, apellido]
  );
  return result.insertId;
};

const insertCliente = async (id_usuario, contraseña, fechaN) => {
  await db.query(
    'INSERT INTO Cliente (id_usuario, contraseña, fechaN) VALUES (?, ?, ?)',
    [id_usuario, contraseña, fechaN]
  );
};

module.exports = {
  findUserByEmail,
  insertUser,
  insertCliente
};
