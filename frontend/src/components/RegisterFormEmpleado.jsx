import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterClientePorEmpleadoForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fechaN: '',
    email: ''
  });

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('El formato del correo electrónico no es válido');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/user/registrar-cliente-por-empleado', formData);
      setFormData({
        nombre: '',
        apellido: '',
        fechaN: '',
        email: ''
      });
      setError(false);
      toast.success('Cliente registrado correctamente. La contraseña fue enviada por email.');
    } catch (err) {
      console.error('Error al registrar cliente:', err);
      const mensaje = err.response?.data?.mensaje || 'Error al registrar cliente';
      setError(true);
      toast.error(mensaje);
    }
  };

  return (
    <div className="bg-white text-gray-800 w-full max-w-2xl mx-auto mt-8 p-10 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-green-800">Registrar Cliente</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {['nombre', 'apellido', 'fechaN', 'email'].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block font-semibold text-green-800 capitalize">
              {field === 'fechaN' ? 'Fecha de Nacimiento' : field}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type={field === 'fechaN' ? 'date' : 'text'}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition"
        >
          Registrar
        </button>
        {error && <p className="text-red-500 text-center">{errorMsg}</p>}
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
