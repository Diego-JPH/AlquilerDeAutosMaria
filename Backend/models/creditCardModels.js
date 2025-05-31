const db = require('../config/db');

const obtenerTarjetas = async () => {
    const [tarjetas] = await db.query('SELECT id_tarjeta, numero_tarjeta, titular, saldo FROM TarjetaCredito');
    return tarjetas || null;
};

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

const obtenerTarjetaPorNumero = async (numero_tarjeta) => {
    const [rows] = await db.query(
        'SELECT * FROM TarjetaCredito WHERE numero_tarjeta = ?',
        [numero_tarjeta]
    );
    return rows[0];  // tarjeta o undefined
};

const obtenerTarjetaPorDatos = async (numero, vencimiento, cvv, titular) => {
  const [result] = await db.query(
    `SELECT * FROM TarjetaCredito 
     WHERE numero_tarjeta = ? AND fecha_vencimiento = ? AND cvv = ? AND titular = ?`,
    [numero, vencimiento, cvv, titular]
  );
  return result[0] || null;
};

const cobrarATarjeta = async (idTarjeta, monto) => {
  await db.query(
    `UPDATE TarjetaCredito SET saldo = saldo - ? WHERE id_tarjeta = ?`,
    [monto, idTarjeta]
  );
};

module.exports = {
    reembolsarATarjeta,
    obtenerTarjetas,
    obtenerTarjetaPorNumero,
    obtenerTarjetaPorDatos,
    cobrarATarjeta,
    obtenerTarjetaPorNumero: async (numero) => {
        const [result] = await db.query(`SELECT * FROM TarjetaCredito WHERE numero_tarjeta = ?`, [numero]);
        return result[0] || null;
    },
    reembolsarATarjeta: async (idTarjeta, monto) => {
        await db.query(`UPDATE TarjetaCredito SET saldo = saldo + ? WHERE id_tarjeta = ?`, [monto, idTarjeta]);
    }
};