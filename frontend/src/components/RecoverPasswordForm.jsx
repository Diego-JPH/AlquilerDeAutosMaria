import React, { useState } from 'react';
import axios from 'axios';

export default function RecuperarContraseniaForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Simulando envío al backend
      await axios.post('http://localhost:3000/api/user/recoverPassword', { email });
      setMensaje('Si el correo está registrado, te hemos enviado un email para restablecer la contraseña.');
      setError('');
      setEmail('');
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al enviar la solicitud';
      setError(msg);
      setMensaje('');
    }
  };

  return (
    <div className="bg-white text-gray-800 w-full max-w-xl mx-auto mt-16 p-10 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Recuperar Contraseña</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block font-semibold text-green-800 text-lg mb-1">
            Correo Electrónico <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-md text-base focus:ring-green-500 focus:outline-none"
          />
        </div>

        <p className="text-sm text-gray-500 italic">* Campos obligatorios</p>

        <button
          type="submit"
          disabled={!email}
          className={`${
            email ? 'bg-green-800 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
          } text-white font-bold py-3 px-6 rounded-md text-lg transition`}
        >
          Enviar correo
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {mensaje && <p className="text-green-700 text-center">{mensaje}</p>}
      </form>
    </div>
  );
}
