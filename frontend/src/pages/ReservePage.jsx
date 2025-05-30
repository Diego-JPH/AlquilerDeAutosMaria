import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEffect, useState } from "react";
import axios from "axios";

// Activamos los plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Función para formatear en horario de Argentina
const formatearFecha = (fecha) => {
    // Si viene con "Z", le quitamos para evitar el corrimiento de zona
    const fechaSinZona = fecha.endsWith('Z') ? fecha.slice(0, -1) : fecha;
    return dayjs(fechaSinZona).format('DD/MM/YYYY');
};

export default function ReservePage() {
    const [reservas, setReservas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState(null);
    const [conductor, setConductor] = useState({
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        licencia: "",
    });
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelForm, setCancelForm] = useState({ motivo: "", numero_tarjeta: "" });
    const [tarjetas, setTarjetas] = useState([]);

    const extraerMensajeError = (err, fallback = "Ocurrió un error") => {
        return err?.response?.data?.error || err?.response?.data?.message || fallback;
    };

    const abrirCancelModal = async (reserva) => {
        const token = localStorage.getItem("token");
        setSelectedReserva(reserva);
        setCancelForm({ motivo: "", numero_tarjeta: "" });

        try {
            const res = await fetch('http://localhost:3000/api/tarjetas/tarjetas-de-prueba', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}`);
            }

            const data = await res.json();

            if (data.length === 0) {
                setMensaje("❌ No se encontraron tarjetas de crédito.");
                setTimeout(() => setMensaje(""), 4000);
                return; // No continuar ni abrir modal
            }

            setTarjetas(data);
            setShowCancelModal(true);

        } catch (err) {
            console.error("Error al obtener tarjetas:", err);
            setMensaje("❌ " + extraerMensajeError(err, "Error al obtener tarjetas"));
            setTimeout(() => setMensaje(""), 4000);
        }
    };

    const manejarCancelacion = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token || !selectedReserva) return;

        const monto = selectedReserva.monto;
        const porcentaje = selectedReserva.politica_devolucion;
        const montoDevolucion = Math.round(monto * (porcentaje / 100));

        try {
            await axios.post(
                "http://localhost:3000/api/reserve/cancel-reserve",
                {
                    idReserva: selectedReserva.id,
                    motivo: cancelForm.motivo,
                    tipoCancelacion: "cliente",
                    numero_tarjeta: cancelForm.numero_tarjeta,
                    monto: montoDevolucion,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMensaje("✅ Reserva cancelada con reembolso");
            setShowCancelModal(false);
            setSelectedReserva(null);
            setReservas((prev) => prev.filter((r) => r.id !== selectedReserva.id));
        } catch (err) {
            console.error("Error al cancelar reserva:", err);
            setMensaje("❌ " + extraerMensajeError(err, "Error al cancelar reserva"));
        }

        setTimeout(() => setMensaje(""), 4000);
    };

    const manejarCambioCancelacion = (e) => {
        const { name, value } = e.target;
        setCancelForm((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("No se encontró el token. Por favor iniciá sesión.");
            return;
        }

        axios
            .get("http://localhost:3000/api/reserve/my-reservations", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setReservas(res.data);
            })
            .catch((err) => {
                console.error("Error al obtener reservas:", err);
                setError(extraerMensajeError(err, "Ocurrió un error al obtener tus reservas."));
            });
    }, []);

    const abrirModal = (reserva) => {
        setSelectedReserva(reserva);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setConductor({
            nombre: "",
            apellido: "",
            fechaNacimiento: "",
            licencia: "",
        });
        setSelectedReserva(null);
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setConductor((prev) => ({ ...prev, [name]: value }));
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!selectedReserva || !token) return;

        try {
            await axios.put(
                "http://localhost:3000/api/reserve/change-driver",
                {
                    idReserva: selectedReserva.id,
                    ...conductor,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMensaje("✅ Conductor cambiado con éxito");
            cerrarModal();
        } catch (err) {
            console.error("Error al cambiar conductor:", err);
            setMensaje("❌ " + extraerMensajeError(err, "Error al cambiar conductor."));
        }

        setTimeout(() => setMensaje(""), 4000);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Tus reservas</h2>

            {mensaje && (
                <div
                    className={`fixed top-4 right-4 px-4 py-2 rounded shadow z-50 transition-opacity duration-500
                        ${mensaje.startsWith("✅")
                            ? "bg-green-100 border border-green-400 text-green-700"
                            : "bg-red-100 border border-red-400 text-red-700"}`}
                >
                    {mensaje}
                </div>
            )}

            {error ? (
                <p className="text-red-600">{error}</p>
            ) : reservas.length === 0 ? (
                <p>No tenés reservas todavía.</p>
            ) : (
                <ul className="space-y-4">
                    {reservas.map((reserva) => {
                        const fechaDesde = dayjs(reserva.fechaDesde).startOf('day');
                        const fechaHasta = dayjs(reserva.fechaHasta).startOf('day');
                        const hoy = dayjs().startOf('day');

                        let cambiarDisabled = false;
                        let cancelarDisabled = false;
                        let cambiarTooltip = "";
                        let cancelarTooltip = "";

                        if (reserva.estado === "cancelada" || hoy.isAfter(fechaHasta)) {
                            cambiarDisabled = true;
                            cancelarDisabled = true;
                            cambiarTooltip = "No se puede cambiar el conductor porque la reserva ya finalizó o fue cancelada";
                            cancelarTooltip = "No se puede cancelar la reserva porque ya finalizó o fue cancelada";
                        } else if (hoy.isAfter(fechaDesde) && hoy.isBefore(fechaHasta.add(1, "day"))) {
                            cambiarDisabled = true;
                            cancelarDisabled = true;
                            cambiarTooltip = "No se puede cambiar el conductor de una reserva en curso";
                            cancelarTooltip = "No se puede cancelar una reserva en curso";
                        }
                        return (
                            <li key={reserva.id} className="border border-gray-300 rounded-lg p-4">
                                <p>
                                    <strong>Auto:</strong> {reserva.marca} {reserva.modelo}
                                </p>
                                <p>
                                    <strong>Fecha:</strong> {formatearFecha(reserva.fechaDesde)} → {formatearFecha(reserva.fechaHasta)}
                                </p>
                                <p>
                                    <strong>Conductor:</strong>{" "}
                                    {reserva.nombre_conductor
                                        ? `${reserva.nombre_conductor} ${reserva.apellido_conductor}`
                                        : "No asignado"}
                                </p>
                                <p>
                                    <strong>Sucursal de entrega:</strong> {reserva.sucursal_entrega || "No asignada"}
                                </p>
                                <p>
                                    <strong>Estado:</strong> {reserva.estado}
                                </p>
                                <button
                                    disabled={cambiarDisabled}
                                    title={cambiarTooltip}
                                    className={`mt-2 px-4 py-2 rounded text-white ${cambiarDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"}`}
                                    onClick={() => !cambiarDisabled && abrirModal(reserva)}
                                >
                                    Cambiar conductor
                                </button>
                                <button
                                    disabled={cancelarDisabled}
                                    title={cancelarTooltip}
                                    className={`mt-2 ml-2 px-4 py-2 rounded text-white ${cancelarDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-500"}`}
                                    onClick={() => !cancelarDisabled && abrirCancelModal(reserva)}
                                >
                                    Cancelar reserva
                                </button>

                                {cambiarDisabled && cancelarDisabled && (
                                    <p className="text-red-600 mt-2 text-sm">
                                        No se puede modificar esta reserva porque ya está en curso, fue cancelada o ha finalizado.
                                    </p>
                                )}
                            </li>
                        );
                    })}

                </ul>
            )}

            {/* Modal para cambiar conductor */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 relative">
                        <h3 className="text-xl font-bold mb-4">Cambiar Conductor</h3>
                        <form onSubmit={manejarSubmit} className="space-y-4">
                            <input type="text" name="nombre" placeholder="Nombre *" value={conductor.nombre} onChange={manejarCambio} required className="w-full border p-2 rounded" />
                            <input type="text" name="apellido" placeholder="Apellido *" value={conductor.apellido} onChange={manejarCambio} required className="w-full border p-2 rounded" />
                            <input type="date" name="fechaNacimiento" placeholder="Fecha de Nacimiento *" value={conductor.fechaNacimiento} onChange={manejarCambio} required className="w-full border p-2 rounded" />
                            <input type="text" name="licencia" placeholder="Licencia *" value={conductor.licencia} onChange={manejarCambio} required className="w-full border p-2 rounded" />
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={cerrarModal} className="px-4 py-2 border rounded">Cancelar</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal para cancelar reserva */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 relative">
                        <h3 className="text-xl font-bold mb-4">Cancelar reserva</h3>
                        <form onSubmit={manejarCancelacion} className="space-y-4">
                            <textarea name="motivo" value={cancelForm.motivo} onChange={manejarCambioCancelacion} required placeholder="Motivo de cancelación *" className="w-full border p-2 rounded" />
                            <select name="numero_tarjeta" value={cancelForm.numero_tarjeta} onChange={manejarCambioCancelacion} required className="w-full border p-2 rounded">
                                <option value="">Seleccionar tarjeta *</option>
                                {tarjetas.map((t) => (
                                    <option key={t.id_tarjeta} value={t.numero_tarjeta}>
                                        {t.numero_tarjeta}
                                    </option>
                                ))}
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowCancelModal(false)} className="px-4 py-2 border rounded">Cancelar</button>
                                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Confirmar cancelación</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
