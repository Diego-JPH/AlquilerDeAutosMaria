const pool = require('../../config/db');
const bcrypt = require('bcrypt');

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  console.log('🔐 Token recibido:', token);
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tokens_recuperacion WHERE token = ?',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Token inválido' });
    }

    const tokenData = rows[0];
    const now = Date.now();

    if (now > tokenData.expiracion) {
      await pool.query('DELETE FROM tokens_recuperacion WHERE token = ?', [token]);
      return res.status(400).json({ message: 'Token expirado' });
    }

    // Obtener id_usuario desde email
    const [userRows] = await pool.query(
      'SELECT id_usuario FROM Usuario WHERE email = ?',
      [tokenData.email]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const id_usuario = userRows[0].id_usuario;
    //const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE Usuario SET contraseña = ? WHERE id_usuario = ?',
      [newPassword, id_usuario]
    );

    await pool.query('DELETE FROM tokens_recuperacion WHERE token = ?', [token]);

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { resetPassword };