import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function PaymentPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const reservaId = params.get("reservaId");
  const monto = parseFloat(params.get("monto") || 0);

  const [formData, setFormData] = useState({
    titular: "",
    numero: "",
    vencimiento: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/api/tarjetas/pago", {
        ...formData,
        idReserva: reservaId,
        monto,
      });

      toast.success("Pago realizado con éxito.");
      setTimeout(() => {
        navigate("/reserve"); // o redireccioná a una pantalla de confirmación
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.error || "Error al procesar el pago";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Pago de la Reserva</h2>
      <p className="mb-4 text-gray-600">Total a pagar: <strong>${monto.toFixed(2)}</strong></p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>Titular</label>
          <input name="titular" value={formData.titular} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="mb-4">
          <label>Número de Tarjeta</label>
          <input name="numero" value={formData.numero} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="mb-4">
          <label>Fecha de Vencimiento (MM/AA)</label>
          <input name="vencimiento" value={formData.vencimiento} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div className="mb-4">
          <label>CVV</label>
          <input name="cvv" value={formData.cvv} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        </div>
        <button type="submit" className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-600">
          Pagar
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}