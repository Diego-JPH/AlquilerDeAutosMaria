import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function VerifyCodeForm() {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const email = localStorage.getItem('emailPendienteVerificacion');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const email = localStorage.getItem('emailPendienteVerificacion');
    const codigoLimpio = codigo.toString().trim();

    console.log('Enviando:', { email, codigoIngresado: parseInt(codigoLimpio, 10) });

    try {
      const res = await axios.post('http://localhost:3000/api/user/verificar-codigo', {
        email,
        codigoIngresado: parseInt(codigoLimpio, 10)
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('rol', res.data.rol);
      navigate('/admin');
      window.location.reload();
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al verificar código';
      setError(msg);
    }
  };


  return (
    <div className="bg-white text-gray-800 w-full max-w-xl mx-auto mt-16 p-10 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Verificar Código</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block font-semibold text-green-800 text-lg mb-1">
            Código enviado por email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-md text-base focus:ring-green-500 focus:outline-none"
          />
        </div>

        <p className="text-sm text-gray-500 italic">* Campos obligatorios</p>

        <button
          type="submit"
          disabled={!codigo}
          className={`${codigo ? 'bg-green-800 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
            } text-white font-bold py-3 px-6 rounded-md text-lg transition`}
        >
          Verificar código
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {mensaje && <p className="text-green-700 text-center">{mensaje}</p>}
      </form>
    </div>
  );
}
