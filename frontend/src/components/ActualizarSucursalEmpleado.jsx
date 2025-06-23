import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ActualizarSucursalEmpleado() {
  const [email, setEmail] = useState('');
  const [nombreSucursal, setNombreSucursal] = useState('');
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/sucursales/getSucursales');
        const data = await res.json();
        setSucursales(data);
      } catch (error) {
        console.error('Error al cargar sucursales:', error);
        toast.error('Error al cargar sucursales');
      }
    };

    fetchSucursales();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !nombreSucursal.trim()) {
      toast.warn('Todos los campos son obligatorios');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/admin/actualizar-sucursal-empleado', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, nombre_sucursal: nombreSucursal }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.mensaje || 'Error al actualizar la sucursal');
        return;
      }

      toast.success(data.mensaje || 'Sucursal actualizada correctamente');
      setEmail('');
      setNombreSucursal('');
    } catch (error) {
      console.error('Error en la solicitud:', error);
      toast.error('Error al actualizar la sucursal');
    }
  };

  return (
    <div className="bg-green-900 text-white p-6 rounded shadow max-w-md mx-auto mt-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-2xl font-bold mb-4 text-center">Actualizar Sucursal del Empleado</h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email del empleado *"
          className="p-2 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="p-2 rounded text-black"
          value={nombreSucursal}
          onChange={(e) => setNombreSucursal(e.target.value)}
        >
          <option value="">Seleccionar sucursal</option>
          {sucursales.map((s) => (
            <option key={s.id_sucursal} value={s.sucursal}>
              {s.sucursal}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded"
        >
          Actualizar Sucursal
        </button>
      </form>
    </div>
  );
}
