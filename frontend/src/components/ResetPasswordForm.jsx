import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('Token inválido o faltante.');
      console.log('Token desde URL:', token);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Token inválido.');
      return;
    }

    try {
      await axios.put('http://localhost:3000/api/user/resetPassword', {
        token,
        newPassword,
      });

      toast.success('Contraseña actualizada correctamente.');
      setNewPassword('');

      setTimeout(() => {
        window.location.href = 'http://localhost:5173/login';
      }, 3000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar contraseña';
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white text-gray-800 w-full max-w-xl mx-auto mt-16 p-10 rounded-2xl shadow-lg">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Restablecer Contraseña</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block font-semibold text-green-800 text-lg mb-1">
            Nueva Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-md text-base focus:ring-green-500 focus:outline-none"
          />
        </div>

        <p className="text-sm text-gray-500 italic">* Campos obligatorios</p>

        <button
          type="submit"
          disabled={!newPassword}
          className={`${
            newPassword ? 'bg-green-800 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
          } text-white font-bold py-3 px-6 rounded-md text-lg transition`}
        >
          Guardar Contraseña
        </button>
      </form>
    </div>
  );
}
