import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateVehicleForm() {
  const [patente, setPatente] = useState('');
  const [precioPorDia, setPrecioPorDia] = useState('');
  const [ultimoMantenimiento, setUltimoMantenimiento] = useState('');
  const [estado, setEstado] = useState('');
  const [politicaDevolucion, setPoliticaDevolucion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patente) {
      toast.warn('La patente es obligatoria');
      return;
    }

    const body = {};
    if (precioPorDia !== '') body.precioPorDia = precioPorDia;
    if (ultimoMantenimiento !== '') body.ultimoMantenimiento = ultimoMantenimiento;
    if (estado !== '') body.estado = estado;
    if (politicaDevolucion !== '') body.politicaDevolucion = politicaDevolucion;

    if (Object.keys(body).length === 0) {
      toast.warn('Debe ingresar al menos 1 dato a actualizar');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/vehicles/${patente}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Error al actualizar el vehículo');
        return;
      }

      toast.success(data.message || 'Vehículo actualizado correctamente');

      // limpiar formulario
      setPatente('');
      setPrecioPorDia('');
      setUltimoMantenimiento('');
      setEstado('');
      setPoliticaDevolucion('');
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar el vehículo');
    }
  };

  return (
    <div className="bg-green-900 text-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Actualizar Vehículo</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Patente *"
          value={patente}
          onChange={(e) => setPatente(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="number"
          placeholder="Nuevo Precio por Día"
          value={precioPorDia}
          onChange={(e) => setPrecioPorDia(e.target.value)}
          className="p-2 rounded text-black"
        />
        <div>
          <label className="block text-sm mb-1">Fecha de último mantenimiento</label>
          <input
            type="date"
            value={ultimoMantenimiento}
            onChange={(e) => setUltimoMantenimiento(e.target.value)}
            className="w-full p-2 rounded text-black"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full p-2 rounded text-black"
          >
            <option value="">Seleccionar estado</option>
            <option value="disponible">Disponible</option>
            <option value="ocupado">Ocupado</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Política de Devolución (%)</label>
          <input
            type="number"
            placeholder="Ej: 100, 50, 0"
            value={politicaDevolucion}
            onChange={(e) => setPoliticaDevolucion(e.target.value)}
            min="0"
            max="100"
            className="w-full p-2 rounded text-black"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white font-bold px-4 py-2 rounded hover:bg-green-600"
        >
          Actualizar Vehículo
        </button>
      </form>

      <p className="text-sm mt-4">* Campos obligatorios</p>
    </div>
  );
}
