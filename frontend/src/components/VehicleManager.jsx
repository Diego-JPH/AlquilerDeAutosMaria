import { useState } from 'react';

export default function VehicleManager() {
  // Estados para actualizar
  const [patenteUpdate, setPatenteUpdate] = useState('');
  const [precioPorDia, setPrecioPorDia] = useState('');
  const [ultimoMantenimiento, setUltimoMantenimiento] = useState('');
  const [estado, setEstado] = useState('');

  // Estado para eliminar
  const [patenteDelete, setPatenteDelete] = useState('');

  const handleUpdate = async () => {
  const trimmedPatente = patenteUpdate.trim();
  if (!trimmedPatente) {
    alert('Debés ingresar una patente para actualizar');
    return;
  }

  const body = {};
  if (precioPorDia) body.precioPorDia = parseFloat(precioPorDia);
  if (ultimoMantenimiento) body.ultimoMantenimiento = ultimoMantenimiento;
  if (estado) body.estado = estado;

  // Validar que se haya ingresado al menos un campo para actualizar
  if (Object.keys(body).length === 0) {
    alert('Debés ingresar al menos un campo para actualizar (precio, estado o fecha)');
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/vehicles/${trimmedPatente}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Error al actualizar el vehículo');
      return;
    }

    alert(data.message || 'Vehículo actualizado con éxito');
    // Opcional: limpiar campos
    setPrecioPorDia('');
    setUltimoMantenimiento('');
    setEstado('');
    setPatenteUpdate('');
  } catch (err) {
    console.error(err);
    alert('Error actualizando vehículo');
  }
};

  const handleDelete = async () => {
    const trimmedPatente = patenteDelete.trim();
    if (!trimmedPatente) {
      alert('Debés ingresar una patente para eliminar');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/vehicles/${trimmedPatente}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'No se pudo eliminar el vehículo');
        return;
      }

      alert(data.message || 'Vehículo eliminado con éxito');
      setPatenteDelete('');
    } catch (err) {
      console.error(err);
      alert('Error eliminando vehículo');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Sección Actualizar */}
      <div className="bg-gray-800 p-4 rounded text-white">
        <h2 className="text-xl font-bold mb-4">Actualizar Vehículo</h2>
        <input
          className="w-full p-2 mb-2 rounded text-black"
          placeholder="Patente"
          value={patenteUpdate}
          onChange={(e) => setPatenteUpdate(e.target.value)}
        />
        <input
          className="w-full p-2 mb-2 rounded text-black"
          placeholder="Precio por día"
          type="number"
          value={precioPorDia}
          onChange={(e) => setPrecioPorDia(e.target.value)}
        />
        <input
          className="w-full p-2 mb-2 rounded text-black"
          type="date"
          value={ultimoMantenimiento}
          onChange={(e) => setUltimoMantenimiento(e.target.value)}
        />
        <select
          className="w-full p-2 mb-2 rounded text-black"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="">Seleccionar estado</option>
          <option value="disponible">Disponible</option>
          <option value="ocupado">Ocupado</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
        <button
          className="bg-green-600 hover:bg-green-700 w-full p-2 rounded"
          onClick={handleUpdate}
        >
          Actualizar vehículo
        </button>
      </div>

      {/* Sección Eliminar */}
      <div className="bg-gray-800 p-4 rounded text-white">
        <h2 className="text-xl font-bold mb-4">Eliminar Vehículo</h2>
        <input
          className="w-full p-2 mb-2 rounded text-black"
          placeholder="Patente"
          value={patenteDelete}
          onChange={(e) => setPatenteDelete(e.target.value)}
        />
        <button
          className="bg-red-600 hover:bg-red-700 w-full p-2 rounded"
          onClick={handleDelete}
        >
          Eliminar vehículo
        </button>
      </div>
    </div>
  );
}