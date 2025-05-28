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
  const link = token;
  console.log("🔐 Token generado:", token); // <-- Acá sí ves el hash simple

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

const sendVerificationEmail = async (to, codigo) => {
  await transporter.sendMail({
    from: `"Alquiler de Autos María" <alquileresdeautosmaria@gmail.com>`,
    to,
    subject: 'Verificación de inicio de sesión',
    html: `
      <p>Hola,</p>
      <p>Tu código de verificación para iniciar sesión es:</p>
      <h2>${codigo}</h2>
      <p>Este código es válido por unos minutos.</p>
    `,
  });
};

module.exports = { 
  sendRecoveryEmail,
  sendVerificationEmail 
};
