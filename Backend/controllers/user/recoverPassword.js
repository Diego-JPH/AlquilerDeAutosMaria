const crypto = require('crypto');
const pool = require('../../config/db');
const sendRecoveryEmail = require('../../utils/mailer');

const recoverPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM Usuario WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hora

    await pool.query(
      'INSERT INTO tokens_recuperacion (email, token, expiracion) VALUES (?, ?, ?)',
      [email, token, expiry]
    );

    const recoveryLink = `http://localhost:3000/reset-password?token=${token}`;

    await sendRecoveryEmail.sendRecoveryEmail(email, recoveryLink);

    res.json({ message: 'Correo enviado para recuperar contraseña' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { recoverPassword };