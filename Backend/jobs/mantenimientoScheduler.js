const cron = require("node-cron");
const db = require('../config/db');
const dayjs = require("dayjs");

cron.schedule("0 1 * * *", async () => {
    console.log("⏰ Verificando vehículos con mantenimiento finalizado...");

    const hoy = dayjs().format("YYYY-MM-DD");

    try {
        const [registros] = await db.query(`
            SELECT id_vehiculo
            FROM VehiculosEnMantenimiento
            WHERE DATE(fecha_fin) <= ?;
        `, [hoy]);

        if (registros.length === 0) {
            console.log("🔍 No hay vehículos que finalizaron mantenimiento hoy.");
            return;
        }

        for (const { id_vehiculo } of registros) {
            await db.query(`
                UPDATE Vehiculo
                SET estado = 'Disponible'
                WHERE id_vehiculo = ? AND estado = 'Mantenimiento';
            `, [id_vehiculo]);

            console.log(`✅ Vehículo ${id_vehiculo} actualizado a 'Disponible'.`);
        }

    } catch (error) {
        console.error("❌ Error al actualizar vehículos:", error);
    }
});