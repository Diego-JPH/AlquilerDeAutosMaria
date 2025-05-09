import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a la base de datos:', err);
  } else {
    console.log('✅ Conexión exitosa a la base de datos MySQL');
  }
});
