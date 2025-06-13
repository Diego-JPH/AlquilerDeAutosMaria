const crypto = require('crypto');

function generarPasswordAleatoria(longitud = 8) {
  return crypto.randomBytes(longitud).toString('hex').slice(0, longitud);
}

module.exports = { generarPasswordAleatoria };