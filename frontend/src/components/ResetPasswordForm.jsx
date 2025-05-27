import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token inválido o faltante.');
      console.log('Token desde URL:', token);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Token inválido.');
      return;
    }

    try {
      await axios.put('http://localhost:3000/api/user/resetPassword', {
        token,
        newPassword,
      });

      setMensaje('Contraseña actualizada correctamente.');
      setError('');
      setNewPassword('');

      setTimeout(() => {
        window.location.href = 'http://localhost:5173/login';
      }, 3000); // redirige al login en 3 segundos
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al actualizar contraseña';
      setError(msg);
      setMensaje('');
    }
  };

  return (
    <div className="bg-white text-gray-800 w-full max-w-xl mx-auto mt-16 p-10 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Restablecer Contraseña</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
          Enviar Contraseña
        </button>

        {mensaje && <p className="text-green-700 text-center">{mensaje}</p>}
      </form>
    </div>
  );
}
