import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', contraseña: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/api/user/login', formData);

      if (res.data.requiereCodigo) {
        localStorage.setItem('emailPendienteVerificacion', formData.email);
        navigate('/verificarCodigo');
      } else {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('rol', res.data.rol);
        navigate('/');
        window.location.reload();
      }
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al iniciar sesión';
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white text-gray-800 w-full max-w-xl mx-auto mt-16 p-10 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Alquiler de autos María</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        <div>
          <label className="block font-semibold text-green-800 text-lg mb-1">
            Correo Electrónico <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-md text-base focus:ring-green-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-semibold text-green-800 text-lg mb-1">
            Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-md text-base focus:ring-green-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-green-800 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md text-lg transition"
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={() => navigate('/recoverPassword')}
          className="bg-green-800 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md text-lg transition"
        >
          Recuperar contraseña
        </button>
      </form>

      {/* Contenedor de notificaciones toast */}
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
