import React, { useState } from "react";
import axios from "axios";

export default function MarkDeliveryForm({ idReserva, onSuccess }) {
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [alternativas, setAlternativas] = useState([]);

    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");
        setError("");
        setAlternativas([]);

        try {
            const res = await axios.post(
                "http://localhost:3000/api/reserve/marcar-entrega",
                { idReserva },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.alternativas?.length > 0) {
                setAlternativas(res.data.alternativas);
                setMensaje(res.data.mensaje);
            } else {
                setMensaje(res.data.mensaje);
                if (onSuccess) onSuccess(); // ✅ Actualizar reservas
            }
        } catch (err) {
            setError(err.response?.data?.error || "Error al marcar entrega.");
        }
    };

    const handleCambiarVehiculo = async (idNuevoVehiculo) => {
        try {
            const res = await axios.post(
                "http://localhost:3000/api/reserve/marcar-entrega",
                { idReserva, idNuevoVehiculo },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMensaje(res.data.mensaje);
            setAlternativas([]);
            if (onSuccess) onSuccess(); // ✅ Actualizar reservas
        } catch (err) {
            setError(err.response?.data?.error || "Error al cambiar el vehículo.");
        }
    };

    return (
        <div className="bg-white border rounded p-4 shadow mt-6">
            <h2 className="text-xl font-semibold mb-2 text-green-800">
                Marcar Entrega de Reserva
            </h2>

            <form onSubmit={handleSubmit} className="mb-4">
                <p className="mb-2"><strong>ID de Reserva:</strong> {idReserva}</p>
                <button
                    type="submit"
                    className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                >
                    Marcar entrega
                </button>
            </form>

            {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {alternativas.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">
                        Vehículos alternativos disponibles:
                    </h3>
                    <ul className="space-y-4">
                        {alternativas.map((vehiculo) => (
                            <li
                                key={vehiculo.id_vehiculo}
                                className="border p-4 rounded shadow"
                            >
                                <p>
                                    <strong>{vehiculo.marca} {vehiculo.modelo}</strong> - ${vehiculo.precioPorDia}
                                </p>
                                <p>Patente: {vehiculo.patente}</p>
                                <button
                                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                    onClick={() => handleCambiarVehiculo(vehiculo.id_vehiculo)}
                                >
                                    Usar este vehículo
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
