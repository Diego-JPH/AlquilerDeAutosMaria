import { useState } from "react";
import axios from "axios";

export default function RecaudacionPeriodoAdmin() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [montoTotal, setMontoTotal] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const calcularMonto = async () => {
    if (!fechaInicio || !fechaFin) {
      setMensaje("Debe ingresar ambas fechas.");
      setMontoTotal(null);
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      setMensaje("Fecha invalida. La fecha inicial no puede ser mayor a la final.");
      setMontoTotal(null);
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/user/montoRecaudado", {
        params: { fechaInicio, fechaFin },
      });

      setMontoTotal(response.data.montoTotal);
      setMensaje("");
    } catch (error) {
      setMontoTotal(null);
      setMensaje(
        error.response?.data?.error || "Error al calcular el monto recaudado."
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-green-800">
        Monto recaudado por período
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Inicio del período:
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Fin del período:
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={calcularMonto}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Calcular monto recaudado
          </button>
        </div>
      </div>

      {mensaje && <p className="text-red-600 font-semibold">{mensaje}</p>}

      {montoTotal !== null && (
        <p className="text-green-700 font-semibold text-lg mt-2">
          💰 Monto recaudado: ${montoTotal}
        </p>
      )}
    </div>
  );
}
