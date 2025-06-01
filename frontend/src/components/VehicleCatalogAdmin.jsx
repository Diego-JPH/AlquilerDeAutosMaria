import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VehicleCatalogToReserve() {
  const [vehiculos, setVehiculos] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState(""); // "" muestra todos
  const navigate = useNavigate();

  useEffect(() => {
    const getVehiculosAdmin = async () => {
      try {
        const url = estadoFiltro
          ? `http://localhost:3000/api/vehicles/getVehiclesAdmin?estado=${estadoFiltro}`
          : `http://localhost:3000/api/vehicles/getVehiclesAdmin`;

        const response = await axios.get(url);
        setVehiculos(response.data);
      } catch (error) {
        console.error("Error al obtener los vehículos:", error);
      }
    };

    getVehiculosAdmin();
  }, [estadoFiltro]); // Se vuelve a ejecutar si cambia el filtro

  const handleReservar = (idVehiculo, idSucursal) => {
    navigate(`/create-reserve?idVehiculo=${idVehiculo}&idSucursal=${idSucursal}`);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Filtrar por estado:
        </label>
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Todos</option>
          <option value="disponible">Disponible</option>
          <option value="ocupado">Ocupado</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehiculos.map((vehiculo) => (
          <div key={vehiculo.id_vehiculo} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
              <h2 className="text-lg font-semibold mb-2">{vehiculo.marca} {vehiculo.modelo}</h2>
              <p className="text-gray-700 mb-2">Patente: {vehiculo.patente}</p>
              <p className="text-gray-700 mb-2">Año: {vehiculo.año}</p>
              <p className="text-gray-700 mb-2">Estado: {vehiculo.estado}</p>
              {vehiculo.estado === "inactivo" && (
                <p className="text-red-600 font-semibold mb-2">🚫 Vehículo inactivo</p>
              )}
              <p className="text-gray-700 mb-2">Precio por día: ${vehiculo.precioPorDia}</p>
              <p className="text-gray-700 mb-2">
                Último mantenimiento: {new Date(vehiculo.ultimo_mantenimiento).toLocaleDateString('es-ES')}
              </p>
              <p className="text-gray-700 mb-2">Política de devolución: ${vehiculo.politica_devolucion}%</p>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
