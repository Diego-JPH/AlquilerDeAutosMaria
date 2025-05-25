import { useEffect, useState } from "react";
import axios from "axios";

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
                if (err.response?.status === 401 || err.response?.status === 403) {
                    setError("Sesión inválida o expirada. Volvé a iniciar sesión.");
                } else {
                    setError("Ocurrió un error al obtener tus reservas.");
                }
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

    const manejarSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!selectedReserva || !token) return;

        axios
            .put(
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
            )
            .then(() => {
                setMensaje("✅ Conductor cambiado con éxito");
                cerrarModal();
                // Actualizar reservas si es necesario
                setTimeout(() => setMensaje(""), 3000);
            })
            .catch((err) => {
                console.error("Error al cambiar conductor:", err.response?.data || err.message);
                const msg = err.response?.data?.error || "❌ Error al cambiar conductor.";
                setMensaje(msg);
                setTimeout(() => setMensaje(""), 4000);
            });
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
                    {reservas.map((reserva) => (
                        <li
                            key={reserva.id}
                            className="border border-gray-300 rounded-lg p-4"
                        >
                            <p>
                                <strong>Auto:</strong> {reserva.marca} {reserva.modelo}
                            </p>
                            <p>
                                <strong>Fecha:</strong>{" "}
                                {new Date(reserva.fechaDesde).toLocaleDateString()} →{" "}
                                {new Date(reserva.fechaHasta).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Conductor:</strong>{" "}
                                {reserva.nombre_conductor
                                    ? `${reserva.nombre_conductor} ${reserva.apellido_conductor}`
                                    : "No asignado"}
                            </p>
                            <p>
                                <strong>Sucursal de entrega:</strong>{" "}
                                {reserva.sucursal_entrega || "No asignada"}
                            </p>
                            <p>
                                <strong>Estado:</strong> {reserva.estado}
                            </p>
                            <button
                                className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => abrirModal(reserva)}
                            >
                                Cambiar conductor
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 relative">
                        <h3 className="text-xl font-bold mb-4">Cambiar Conductor</h3>
                        <form onSubmit={manejarSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                value={conductor.nombre}
                                onChange={manejarCambio}
                                required
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="apellido"
                                placeholder="Apellido"
                                value={conductor.apellido}
                                onChange={manejarCambio}
                                required
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="date"
                                name="fechaNacimiento"
                                placeholder="Fecha de Nacimiento"
                                value={conductor.fechaNacimiento}
                                onChange={manejarCambio}
                                required
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="licencia"
                                placeholder="Licencia"
                                value={conductor.licencia}
                                onChange={manejarCambio}
                                required
                                className="w-full border p-2 rounded"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
