import { useState } from "react";
import ChangeDriverForm from "./ChangeDriverForm";

export default function ReservaItem({ reserva }) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    return (
        <div className="border rounded p-4 shadow mb-4 bg-white">
            <h3 className="text-lg font-semibold">
                Reserva #{reserva.id} - Auto: {reserva.auto}
            </h3>
            <p>Conductor actual: {reserva.conductor}</p>
            <button
                className="mt-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
            >
                {mostrarFormulario ? "Cancelar" : "Cambiar Conductor"}
            </button>

            {mostrarFormulario && (
                <div className="mt-4">
                    <ChangeDriverForm idReserva={reserva.id} />
                </div>
            )}
        </div>
    );
}