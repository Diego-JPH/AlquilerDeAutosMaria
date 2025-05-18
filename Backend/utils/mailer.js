require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Brevo usa STARTTLS
  auth: {
    user:process.env.SMTP_USER,
    pass:process.env.SMTP_PASS,
  },
});

const sendRecoveryEmail = async (to, token) => {
  const link = `http://localhost:3000/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Alquiler de Autos María" <alquileresdeautosmaria@gmail.com>`,
    to,
    subject: 'Recuperar contraseña',
    html: `
      <p>Hola,</p>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${link}">${link}</a>
      <p>Este enlace expirará en 1 hora.</p>
    `,
  });
};

module.exports = { sendRecoveryEmail };
