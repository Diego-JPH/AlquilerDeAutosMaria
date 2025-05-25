import { useState } from 'react';

export default function UpdateVehicleForm() {
  const [patente, setPatente] = useState('');
  const [precioPorDia, setPrecioPorDia] = useState('');
  const [ultimoMantenimiento, setUltimoMantenimiento] = useState('');
  const [estado, setEstado] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patente || !precioPorDia || !ultimoMantenimiento || !estado) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/vehicles/${patente}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          precioPorDia,
          ultimoMantenimiento,
          estado,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Error al actualizar el vehículo');
        return;
      }

      alert(data.message || 'Vehículo actualizado correctamente');

      // limpiar formulario
      setPatente('');
      setPrecioPorDia('');
      setUltimoMantenimiento('');
      setEstado('');

    } catch (err) {
      console.error(err);
      alert('Error al actualizar el vehículo');
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
          placeholder="Nuevo Precio por Día *"
          value={precioPorDia}
          onChange={(e) => setPrecioPorDia(e.target.value)}
          className="p-2 rounded text-black"
        />
        <div>
          <label className="block text-sm mb-1">Fecha de último mantenimiento *</label>
          <input
            type="date"
            value={ultimoMantenimiento}
            onChange={(e) => setUltimoMantenimiento(e.target.value)}
            className="w-full p-2 rounded text-black"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Estado *</label>
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
        <button
          type="submit"
          className="bg-white text-green-900 font-bold px-4 py-2 rounded hover:bg-gray-200"
        >
          Actualizar Vehículo
        </button>
      </form>

      <p className="text-sm mt-4">* Campos obligatorios</p>
    </div>
  );
}
