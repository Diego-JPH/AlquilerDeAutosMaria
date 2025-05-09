const pool = require('../config/db');

async function createUser(nombre, email) {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, email) VALUES (?, ?)',
    [nombre, email]
  );
  return result.insertId;
}

module.exports = { createUser };