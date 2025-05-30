import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VehicleCatalogToReserve() {
  const [vehiculos, setVehiculos] = useState([]);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const navigate = useNavigate();

  const getVehiculos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/vehicles/getVehicles");
      setVehiculos(response.data);
    } catch (error) {
      console.error("Error al obtener los vehículos:", error);
      toast.error("Error al obtener los vehículos");
    }
  };

  useEffect(() => {
    getVehiculos();
  }, []);

  const handleReservar = (idVehiculo, idSucursal, precioPorDia) => {
    navigate(`/create-reserve?idVehiculo=${idVehiculo}&idSucursal=${idSucursal}&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}&precioPorDia=${precioPorDia}`);
  };

  const handleFiltrar = async () => {
    if (!fechaDesde || !fechaHasta) {
      toast.error("Seleccioná ambas fechas");
      return;
    }

    if (new Date(fechaDesde) >= new Date(fechaHasta)) {
      toast.error("Formato de fechas incorrectas");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/vehicles/getVehiclesAvailableByDate", {
        params: { fechaDesde, fechaHasta },
      });

      if (response.data.length === 0) {
        toast.info("No se encontraron vehiculos disponibles para ese rango de fechas");
      }

      setVehiculos(response.data);
    } catch (error) {
      console.error("Error al filtrar vehículos:", error);
      toast.error("Error al filtrar vehículos");
    }
  };

  const handleLimpiarFiltro = () => {
    setFechaDesde("");
    setFechaHasta("");
    getVehiculos();
  };

  return (
    <div className="p-8">
      <ToastContainer />
      {/* Formulario de fechas */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Fecha desde:</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="border px-3 py-2 rounded-md shadow-sm"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Fecha hasta:</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="border px-3 py-2 rounded-md shadow-sm"
          />
        </div>

        <div className="flex gap-2 mt-2 md:mt-6">
          <button
            onClick={handleFiltrar}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500"
          >
            Filtrar por fechas
          </button>

          {(fechaDesde || fechaHasta) && (
            <button
              onClick={handleLimpiarFiltro}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
            >
              Limpiar filtro
            </button>
          )}
        </div>
      </div>

      {/* Catálogo de vehículos */}
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
              <h2 className="text-lg font-semibold mb-2">
                {vehiculo.marca} {vehiculo.modelo}
              </h2>
              <p className="text-gray-700">Año: {vehiculo.año}</p>
              <p className="text-gray-700">Estado: {vehiculo.estado}</p>
              <p className="text-gray-700 mb-4">Precio por día: ${vehiculo.precioPorDia}</p>

              <button
                onClick={() => handleReservar(vehiculo.id_vehiculo, vehiculo.id_sucursal, vehiculo.precioPorDia)}
                className="w-full bg-green-800 text-white py-2 rounded hover:bg-green-700"
              >
                Reservar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
