const db = require('../config/db');

async function reembolsarATarjeta(idTarjeta, monto) {
    const sql = `
        UPDATE TarjetaCredito
        SET saldo = saldo + ?
        WHERE id_tarjeta = ?
    `;
    try {
        const [result] = await db.execute(sql, [monto, idTarjeta]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error al reembolsar a la tarjeta:', error);
        throw error;
    }
}

module.exports = {
    reembolsarATarjeta
};