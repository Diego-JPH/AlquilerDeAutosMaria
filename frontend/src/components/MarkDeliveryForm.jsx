import { useState } from "react";
import axios from "axios";

export default function MarkDeliveryForm() {
    const [idReserva, setIdReserva] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");
        setError("");

        const token = localStorage.getItem("token");

        if (!idReserva) {
            setError("Debes ingresar un ID de reserva.");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:3000/api/reserve/marcar-entrega",
                { idReserva },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMensaje(res.data.mensaje);
            setIdReserva("");
        } catch (err) {
            setError(err.response?.data?.error || "Error al marcar entrega.");
        }
    };

    return (
        <div className="bg-white border rounded p-4 shadow mt-6">
            <h2 className="text-xl font-semibold mb-2 text-green-800">Marcar Entrega de Reserva</h2>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">ID de Reserva:</label>
                <input
                    type="number"
                    value={idReserva}
                    onChange={(e) => setIdReserva(e.target.value)}
                    className="border px-2 py-1 rounded w-full mb-4"
                />
                <button
                    type="submit"
                    className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Marcar entrega
                </button>
            </form>
            {mensaje && <p className="text-green-600 mt-2">{mensaje}</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
    );
}