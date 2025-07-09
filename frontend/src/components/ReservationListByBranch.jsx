import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es";
import MarkDeliveryForm from "./MarkDeliveryForm";
import RegisterReturn from "./RegisterReturn";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es");

export default function ReservasPorSucursal() {
    const [reservas, setReservas] = useState([]);
    const [error, setError] = useState("");
    const [mostrarEntrega, setMostrarEntrega] = useState(null);
    const [mostrarDevolucion, setMostrarDevolucion] = useState(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(dayjs().format("YYYY-MM-DD"));
    const navigate = useNavigate();

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
            setReservas(response.data);
        } catch (err) {
            console.error("Error al obtener reservas:", err);
            setError(
                err.response?.data?.error || "Error al obtener reservas."
            );
        }
    };

    useEffect(() => {
        fetchReservas();
    }, [navigate]);

    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return "Fecha inválida";
        return dayjs.utc(fechaISO).format("DD/MM/YYYY");
    };

    const reservasFiltradas = reservas.filter((reserva) => {
        const fechaDesde = dayjs.utc(reserva.fechaDesde).format("YYYY-MM-DD");
        const fechaHasta = dayjs.utc(reserva.fechaHasta).format("YYYY-MM-DD");
        return fechaDesde === fechaSeleccionada || fechaHasta === fechaSeleccionada;
    });

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Reservas por Sucursal</h2>

            <div className="mb-4">
                <label className="block text-gray-700 mb-1">Filtrar por fecha:</label>
                <input
                    type="date"
                    value={fechaSeleccionada}
                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                    className="border rounded p-2"
                />
            </div>

            {reservasFiltradas.length === 0 ? (
                <p>No hay reservas registradas para esta fecha.</p>
            ) : (
                <ul className="space-y-4">
                    {reservasFiltradas.map((reserva) => {
                        const entregaDisabled =
                            reserva.estadoVehiculo === "Entregado" ||
                            reserva.estadoVehiculo === "Devuelto" ||
                            reserva.estado === "Finalizada";

                        const devolucionDisabled =
                            reserva.estadoVehiculo === "Devuelto" ||
                            reserva.estado === "Finalizada" ||
                            reserva.estadoVehiculo === "Esperando";

                        return (
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
                                <p><strong>Estado Vehículo:</strong> {reserva.estadoVehiculo}</p>
                                <p><strong>Monto:</strong> ${reserva.monto}</p>

                                <div className="mt-3 flex gap-3">
                                    <button
                                        onClick={() => setMostrarEntrega(reserva.id_reserva)}
                                        disabled={entregaDisabled}
                                        title={
                                            entregaDisabled
                                                ? "Ya fue entregado o devuelto"
                                                : "Marcar entrega"
                                        }
                                        className={`px-3 py-1 rounded text-white transition 
                                            ${entregaDisabled
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700"}`}
                                    >
                                        Marcar entrega
                                    </button>

                                    <button
                                        onClick={() => setMostrarDevolucion(reserva.id_reserva)}
                                        disabled={devolucionDisabled}
                                        title={
                                            devolucionDisabled
                                                ? "Ya fue devuelto o finalizado"
                                                : "Marcar devolución"
                                        }
                                        className={`px-3 py-1 rounded text-white transition 
                                            ${devolucionDisabled
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700"}`}
                                    >
                                        Marcar devolución
                                    </button>
                                </div>

                                {mostrarEntrega === reserva.id_reserva && (
                                    <div className="mt-4">
                                        <MarkDeliveryForm
                                            idReserva={reserva.id_reserva}
                                            onSuccess={fetchReservas}
                                        />
                                    </div>
                                )}

                                {mostrarDevolucion === reserva.id_reserva && (
                                    <div className="mt-4">
                                        <RegisterReturn
                                            idReserva={reserva.id_reserva}
                                            onSuccess={fetchReservas}
                                        />
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
