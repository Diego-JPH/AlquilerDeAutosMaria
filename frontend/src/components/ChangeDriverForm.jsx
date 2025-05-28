import { useState } from "react";
import axios from "axios";

export default function ChangeDriverForm({ idReserva }) {
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        licencia: "",
    });
    const [mensaje, setMensaje] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");

        try {
            await axios.put("http://localhost:3000/api/reserve/change-driver", {
                ...form,
                idReserva,
            });
            setMensaje("✅ Conductor actualizado con éxito");
        } catch (err) {
            setMensaje("❌ Error al actualizar conductor");
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <input
                type="text"
                name="nombre"
                placeholder="Nombre *"
                value={form.nombre}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />
            <input
                type="text"
                name="apellido"
                placeholder="Apellido *"
                value={form.apellido}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />
            <div>
                <label className="block text-sm text-gray-600 mb-1" htmlFor="fechaNacimiento">
                    Fecha de Nacimiento *
                </label>
                <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={form.fechaNacimiento}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
            </div>
            <input
                type="text"
                name="licencia"
                placeholder="Licencia *"
                value={form.licencia}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />
            <button
                type="submit"
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Confirmar Cambio
            </button>

            {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
        </form>
    );
}