import { useState } from "react";
import axios from "axios";

export default function getVehiclesReserved() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [vehiculos, setVehiculos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const handleVerVehiculos = async () => {
    if (!fechaInicio || !fechaFin) {
      setMensaje("Debe ingresar ambas fechas.");
      setVehiculos([]);
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/api/reserve/getVehiclesReserved", {
        params: { fechaInicio, fechaFin },
      });

      if (res.data.vehiculos?.length > 0) {
        setVehiculos(res.data.vehiculos);
        setMensaje("");
      } else {
        setVehiculos([]);
        setMensaje(res.data.mensaje || "No se encontraron vehículos alquilados durante ese periodo.");
      }
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al consultar los vehículos.");
      setVehiculos([]);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">
        Vehículos alquilados por período
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Inicio del período:
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fin del período:
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleVerVehiculos}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Ver vehículos alquilados
          </button>
        </div>
      </div>

      {mensaje && (
        <p className="text-center text-red-600 font-medium mb-4">{mensaje}</p>
      )}

      {vehiculos.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Patente</th>
                <th className="px-4 py-2 border">Estado</th>
                <th className="px-4 py-2 border">Precio por Día</th>
                <th className="px-4 py-2 border">Desde</th>
                <th className="px-4 py-2 border">Hasta</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((v, idx) => (
                <tr key={idx} className="text-center border-t">
                  <td className="px-4 py-2 border">{v.patente}</td>
                  <td className="px-4 py-2 border">{v.estado}</td>
                  <td className="px-4 py-2 border">${v.precioPorDia}</td>
                  <td className="px-4 py-2 border">{v.fechaDesde}</td>
                  <td className="px-4 py-2 border">{v.fechaHasta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
