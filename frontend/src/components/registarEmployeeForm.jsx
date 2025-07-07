import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function RegisterEmployeeForm() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    id_sucursal: "",
  });

  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/sucursales/getSucursales');
        const data = await res.json();
        setSucursales(data);
      } catch (err) {
        console.error('Error al cargar sucursales', err);
        toast.error('Error al cargar sucursales');
      }
    };

    fetchSucursales();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/api/user/registrar-empleado", form);
      toast.success(res.data.mensaje || "Empleado registrado con éxito");
      setForm({ nombre: "", apellido: "", email: "", id_sucursal: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.mensaje || "Error al registrar empleado.");
    }
  };

  return (
    <div className="w-full max-w-md p-4 border rounded shadow bg-white">
      <h2 className="text-xl mb-4 font-bold">Registrar Empleado</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="block w-full mb-3 p-2 border rounded"
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          required
          className="block w-full mb-3 p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="block w-full mb-3 p-2 border rounded"
        />

        <select
          name="id_sucursal"
          value={form.id_sucursal}
          onChange={handleChange}
          required
          className="block w-full mb-3 p-2 border rounded"
        >
          <option value="">Seleccione una sucursal</option>
          {sucursales.map((s) => (
            <option key={s.id_sucursal} value={s.id_sucursal}>
              {s.sucursal}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Registrar
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}

export default RegisterEmployeeForm;
