import { useState } from 'react';

export default function DeleteVehicleForm() {
  const [patente, setPatente] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patente) {
      alert('Debe ingresar la patente');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/vehicles/${patente}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Error al eliminar el vehículo');
        return;
      }

      alert(data.message || 'Vehículo eliminado correctamente');
      setPatente('');
    } catch (err) {
      console.error(err);
      alert('Error al eliminar el vehículo');
    }
  };

  return (
    <div className="bg-green-900 text-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Eliminar Vehículo</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-1"></label>
          <input
            type="text"
            placeholder="Patente *"
            value={patente}
            onChange={(e) => setPatente(e.target.value)}
            className="p-2 rounded text-black w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600"
        >
          Eliminar Vehículo
        </button>
      </form>

      <p className="text-sm mt-4">* Campos obligatorios</p>
    </div>
  );
}
