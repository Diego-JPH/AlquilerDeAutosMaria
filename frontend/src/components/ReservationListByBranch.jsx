import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es");

export default function ReservasPorSucursal() {
    const [reservas, setReservas] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservas = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("No se encontró el token de autenticación.");
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:3000/api/reserve/get-reserve-by-sucursal",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("Reservas recibidas:", response.data); // <-- DEBUG
                setReservas(response.data);
            } catch (err) {
                console.error("Error al obtener reservas:", err);
                setError(
                    err.response?.data?.error || "Error al obtener reservas."
                );
            }
        };

        fetchReservas();
    }, [navigate]);

    // Nueva función para formatear fechas evitando el desfase de un día
    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return "Fecha inválida";
        // Quitar "Z" final para evitar conversión UTC automática y luego parsear en zona local de Argentina
        const fechaSinZ = fechaISO.endsWith("Z") ? fechaISO.slice(0, -1) : fechaISO;
        // Convertimos usando timezone de Argentina ("America/Argentina/Buenos_Aires")
        return dayjs.tz(fechaSinZ, "America/Argentina/Buenos_Aires").format("DD/MM/YYYY");
    };

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Reservas por Sucursal</h2>

            {reservas.length === 0 ? (
                <p>No hay reservas registradas para esta sucursal.</p>
            ) : (
                <ul className="space-y-4">
                    {reservas.map((reserva) => (
                        <li
                            key={reserva.id_reserva}
                            className="border rounded p-4 shadow-sm bg-white"
                        >
                            <p><strong>ID Reserva:</strong> {reserva.id_reserva}</p>
                            <p><strong>Cliente:</strong> {reserva.nombre} {reserva.apellido}</p>
                            <p><strong>Vehículo:</strong> {reserva.marca} {reserva.modelo}</p>
                            <p>
                                <strong>Fecha:</strong>{" "}
                                {formatearFecha(reserva.fechaDesde)} a{" "}
                                {formatearFecha(reserva.fechaHasta)}
                            </p>
                            <p><strong>Estado:</strong> {reserva.estado}</p>
                            <p><strong>Monto:</strong> ${reserva.monto}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
