import { useEffect, useState } from "react";
import axios from "axios";

export default function ReservationList() {
  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("todas");

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/reserve/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReservas(response.data);
      } catch (error) {
        console.error("Error al cargar las reservas:", error);
      }
    };

    fetchReservas();
  }, []);

  const reservasFiltradas = reservas.filter((r) =>
    filtroEstado === "todas" ? true : r.estado === filtroEstado
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Reservas registradas</h2>

      {/* Filtro por estado */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filtrar por estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="todas">Todas</option>
          <option value="activa">Activa</option>
          <option value="cancelada">Cancelada</option>
          <option value="finalizada">Finalizada</option>
        </select>
      </div>

      {reservasFiltradas.length === 0 ? (
        <p className="text-gray-600">No hay reservas para mostrar.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="py-2 px-4 border">#</th>
                <th className="py-2 px-4 border">Usuario</th>
                <th className="py-2 px-4 border">Vehículo</th>
                <th className="py-2 px-4 border">Desde</th>
                <th className="py-2 px-4 border">Hasta</th>
                <th className="py-2 px-4 border">Estado</th>
                <th className="py-2 px-4 border">Monto</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map((r) => (
                <tr key={r.id_reserva} className="text-center">
                  <td className="py-2 px-4 border">{r.id_reserva}</td>
                  <td className="py-2 px-4 border">{r.nombre_usuario} {r.apellido_usuario}</td>
                  <td className="py-2 px-4 border">{r.marca} {r.modelo} ({r.patente})</td>
                  <td className="py-2 px-4 border">{new Date(r.fechaDesde).toLocaleDateString('es-ES')}</td>
                  <td className="py-2 px-4 border">{new Date(r.fechaHasta).toLocaleDateString('es-ES')}</td>
                  <td className="py-2 px-4 border capitalize">{r.estado}</td>
                  <td className="py-2 px-4 border">${parseFloat(r.monto).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}