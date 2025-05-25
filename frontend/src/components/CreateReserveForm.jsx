import { useEffect, useState } from "react";
import axios from "axios";

export default function FormularioReserva() {
  const idUsuario = 1; // <- Hardcodeado
  const idVehiculo = 1; // <- Hardcodeado
  const [formData, setFormData] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    sucursal_retiro_id: "",
    sucursal_entrega_id: "",
    nombre: "",
    apellido: "",
    fechaN: "",
    licencia: ""
  });

  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    const getSucursales = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/sucursales/getSucursales"); 
        setSucursales(response.data);
      } catch (error) {
        console.error("Error al obtener las sucursales:", error);
      }
    };

    getSucursales();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      id_vehiculo: idVehiculo,
      id_usuario: idUsuario,
      fechaDesde: formData.fecha_inicio,
      fechaHasta: formData.fecha_fin,
      sucursal_retiro_id: parseInt(formData.sucursal_retiro_id),
      sucursal_entrega_id: parseInt(formData.sucursal_entrega_id),
      nombre: formData.nombre,
      apellido: formData.apellido,
      fechaN: formData.fechaN,
      licencia: formData.licencia,
    };
    
    try {
      const response = await axios.post("/api/reserve/create-reserve", data);
      alert("Reserva realizada con éxito");
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      alert("Error al realizar la reserva");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Reservar Vehículo</h2>

      <div className="mb-4">
        <label htmlFor="fecha_inicio" className="block text-gray-700 mb-2">Fecha de inicio *</label>
        <input
          type="date"
          name="fecha_inicio"
          value={formData.fecha_inicio}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="fecha_fin" className="block text-gray-700 mb-2">Fecha de fin *</label>
        <input
          type="date"
          name="fecha_fin"
          value={formData.fecha_fin}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="sucursal_retiro_id" className="block text-gray-700 mb-2">Sucursal de retiro *</label>
        <select
          name="sucursal_retiro_id"
          value={formData.sucursal_retiro_id}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Seleccione una sucursal</option>
          {sucursales.map((sucursal) => (
            <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
              {sucursal.sucursal}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="sucursal_entrega_id" className="block text-gray-700 mb-2">Sucursal de entrega *</label>
        <select
          name="sucursal_entrega_id"
          value={formData.sucursal_entrega_id}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Seleccione una sucursal</option>
          {sucursales.map((sucursal) => (
            <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
              {sucursal.sucursal}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Nombre del Conductor *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Apellido del Conductor *</label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Fecha de Nacimiento *</label>
        <input
          type="date"
          name="fechaN"
          value={formData.fechaN}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-1">Licencia de Conducir *</label>
        <input
          type="text"
          name="licencia"
          value={formData.licencia}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <p className="text-sm text-gray-500 italic mb-4">* Campos obligatorios</p>

      <button type="submit" className="w-full bg-green-800 text-white rounded py-2 hover:bg-green-700">
        Reservar
      </button>
    </form>
  );
}
