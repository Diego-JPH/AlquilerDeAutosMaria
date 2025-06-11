const db = require('../config/db');

async function buscarPorLicencia(licencia) {
    const [rows] = await db.query('SELECT * FROM Conductor WHERE licencia = ?', [licencia]);
    return rows[0]; // null si no existe
}

async function buscarId(licencia) {
    const [rows] = await db.query('SELECT id_conductor FROM Conductor WHERE licencia = ?', [licencia]);
    return rows[0]; // null si no existe
}

module.exports = {
    buscarPorLicencia,
    buscarId
};