import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RecuperarContraseniaForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/api/user/recoverPassword', { email });
      toast.success('Te hemos enviado un email para restablecer la contraseña.');
      setEmail('');
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Correo no registrado';
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white text-gray-800 w-full max-w-xl mx-auto mt-16 p-10 rounded-2xl shadow-lg">
      <ToastContainer />
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
      </form>
    </div>
  );
}
