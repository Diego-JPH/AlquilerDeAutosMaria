import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function EmployeeList() {
  const [empleados, setEmpleados] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [filtroSucursal, setFiltroSucursal] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarSucursales = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/sucursales/getSucursales');
      setSucursales(res.data);
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
    }
  };

  const cargarEmpleados = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/user/empleados', {
        params: filtroSucursal ? { id_sucursal: filtroSucursal } : {},
      });

      if (res.data.empleados.length === 0) {
        setMensaje(res.data.mensaje);
      } else {
        setMensaje('');
      }

      setEmpleados(res.data.empleados);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
      setMensaje('No hay empleados.');
    }
  };

const eliminarEmpleado = (id) => {
  toast.info(
    ({ closeToast }) => (
      <div>
        <p>¿Estás seguro de que deseas eliminar este empleado?</p>
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={async () => {
              try {
                const res = await axios.delete(`http://localhost:3000/api/user/empleados/${id}`);
                toast.success(res.data.mensaje || "Empleado eliminado");
                cargarEmpleados(); // refrescar lista
                closeToast(); // cerrar el toast de confirmación
              } catch (err) {
                console.error(err);
                toast.error("Error al eliminar empleado");
              }
            }}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Sí, eliminar
          </button>

          <button
            onClick={closeToast}
            className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false, // importante: no cerrar automáticamente
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    }
  );
};


  useEffect(() => {
    cargarSucursales();
    cargarEmpleados();
  }, []);

  useEffect(() => {
    cargarEmpleados();
  }, [filtroSucursal]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Listado de Empleados</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Filtrar por sucursal:</label>
        <select
          value={filtroSucursal}
          onChange={(e) => setFiltroSucursal(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Todas las sucursales</option>
          {sucursales.map((s) => (
            <option key={s.id_sucursal} value={s.id_sucursal}>
              {s.sucursal}
            </option>
          ))}
        </select>
      </div>

      {mensaje && <p className="text-red-500">{mensaje}</p>}

      <ul className="space-y-2">
        {empleados.map((emp) => (
          <li key={emp.id_usuario} className="border p-3 rounded shadow-sm flex justify-between items-center">
          <div>
            {emp.nombre} {emp.apellido} ({emp.email}) - {emp.sucursal}
          </div>
          <button
            onClick={() => eliminarEmpleado(emp.id_usuario)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeeList;