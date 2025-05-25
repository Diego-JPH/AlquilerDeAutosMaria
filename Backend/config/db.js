const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'maria',
  password: process.env.DB_PASSWORD || 'maria123',
  database: process.env.DB_NAME || 'alquileres',
});
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Conectado a la base de datos MySQL");
    conn.release();
  } catch (err) {
    console.error("❌ Error de conexión a MySQL:", err.message);
  }
})();

module.exports = pool;
