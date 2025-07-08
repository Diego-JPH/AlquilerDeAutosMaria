import React, { useState } from "react";
import axios from "axios";

export default function RegisterReturn({ idReserva }) {
    const [formData, setFormData] = useState({
        fechaDevolucion: "",
        descripcion: "",
        diasMantenimiento: "",
    });

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Token no encontrado. Inicia sesión.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/api/reserve/devolver-vehiculo",
                { ...formData, idReserva },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMensaje(response.data.mensaje);
            setFormData({
                fechaDevolucion: "",
                descripcion: "",
                diasMantenimiento: "",
            });
        } catch (err) {
            setError(err.response?.data?.error || "Error al registrar la devolución.");
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow-md mt-8 w-full">
            <h2 className="text-xl font-semibold text-green-900 mb-4">Registrar devolución de vehículo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p><strong>ID Reserva:</strong> {idReserva}</p>
                <div>
                    <label className="block text-gray-700">Fecha de devolución:</label>
                    <input
                        type="date"
                        name="fechaDevolucion"
                        value={formData.fechaDevolucion}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Descripción del estado del vehículo:</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Días de mantenimiento:</label>
                    <input
                        type="number"
                        name="diasMantenimiento"
                        value={formData.diasMantenimiento}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                        min="0"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
                >
                    Registrar devolución
                </button>
            </form>

            {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    );
}
