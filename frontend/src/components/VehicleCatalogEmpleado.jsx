import { useEffect, useState } from "react";
import axios from "axios";

export default function VehicleCatalogEmpleado() {
  const [vehiculos, setVehiculos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [estadosActualizados, setEstadosActualizados] = useState({});

  // Cargar vehículos al montar el componente
  useEffect(() => {
    fetchVehiculos();
  }, []);

  const fetchVehiculos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/vehicles/employeeVehicles",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setVehiculos(response.data);
      setMensaje("");
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
      setVehiculos([]);
      setMensaje(
        error.response?.data?.mensaje || "Error al obtener los vehículos"
      );
    }
  };

  const handleEstadoChange = (patente, nuevoEstado) => {
    setEstadosActualizados((prev) => ({
      ...prev,
      [patente]: nuevoEstado,
    }));
  };

  const actualizarEstado = async (patente) => {
    const nuevoEstado = estadosActualizados[patente];
    if (!nuevoEstado) return;

    try {
      await axios.put(
        `http://localhost:3000/api/vehicles/estado/${patente}`,
        { estado: nuevoEstado },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMensaje("Estado actualizado correctamente.");
      fetchVehiculos(); // recargar lista
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      setMensaje(
        error.response?.data?.error ||
        "Error al actualizar el estado del vehículo."
      );
    }
  };

  return (
    <div className="p-8">
      {mensaje && (
        <div className="text-red-600 font-semibold mb-4">{mensaje}</div>
      )}

      {vehiculos.length === 0 && !mensaje && (
        <div className="text-gray-600 font-medium">
          No hay vehículos en tu sucursal.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehiculos.map((vehiculo) => (
          <div
            key={vehiculo.id_vehiculo}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {vehiculo.imagen ? (
                <img
                  src={`http://localhost:3000${vehiculo.imagen}`}
                  alt={`Imagen de ${vehiculo.patente}`}
                  className="object-cover h-full w-full"
                />
              ) : (
                <span className="text-gray-600">Imagen no disponible</span>
              )}
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">
                {vehiculo.marca} {vehiculo.modelo}
              </h2>
              <p className="text-gray-700 mb-2">Patente: {vehiculo.patente}</p>
              <p className="text-gray-700 mb-2">Año: {vehiculo.año}</p>
              <p className="text-gray-700 mb-2">
                Estado actual: {vehiculo.estado}
              </p>
              <p className="text-gray-700 mb-2">
                Precio por día: ${vehiculo.precioPorDia}
              </p>
              <p className="text-gray-700 mb-2">
                Último mantenimiento:{" "}
                {new Date(
                  vehiculo.ultimo_mantenimiento
                ).toLocaleDateString("es-ES")}
              </p>
              <p className="text-gray-700 mb-2">
                Política de devolución: {vehiculo.politica_devolucion}%
              </p>

              {/* Cambiar estado */}
              <div className="mt-4">
                <select
                  className="border p-2 rounded mr-2"
                  value={estadosActualizados[vehiculo.patente] || vehiculo.estado}
                  onChange={(e) =>
                    handleEstadoChange(vehiculo.patente, e.target.value)
                  }
                >
                  <option value="disponible">disponible</option>
                  <option value="ocupado">ocupado</option>
                  <option value="mantenimiento">mantenimiento</option>
                </select>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => actualizarEstado(vehiculo.patente)}
                >
                  Actualizar Estado
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
