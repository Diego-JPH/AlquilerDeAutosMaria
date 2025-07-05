import { useEffect, useState } from "react";
import axios from "axios";

export default function ClientRegisterList() {
  const [clientes, setClientes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const fetchClientes = async () => {
    try {
      let url = "http://localhost:3000/api/admin/clientes-registrados";
      if (desde && hasta) {
        url += `?desde=${desde}&hasta=${hasta}`;
      }

      const res = await axios.get(url);
      setClientes(res.data.clientes || []);
      setMensaje(res.data.mensaje || "");
    } catch (err) {
      const msg = err.response?.data?.mensaje || "Error al obtener clientes";
      setMensaje(msg);
      setClientes([]);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleFiltrar = () => {
    fetchClientes();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Clientes Registrados</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleFiltrar}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Filtrar
        </button>
      </div>

      {mensaje && <p className="text-red-600 mb-4">{mensaje}</p>}

      <ul className="space-y-2">
        {clientes.map((c, index) => (
          <li key={index} className="p-3 border rounded shadow">
            <strong>{c.nombre} {c.apellido}</strong> - {c.email} <br />
            Registrado el: {new Date(c.fecha_creacion).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}