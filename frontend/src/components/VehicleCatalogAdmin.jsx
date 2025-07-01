import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function VehicleCatalogAdmin() {
  const [vehiculos, setVehiculos] = useState([]);
  const [patenteFiltro, setPatenteFiltro] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [vehiculoEditando, setVehiculoEditando] = useState(null);
  const [formData, setFormData] = useState({
    precioPorDia: "",
    ultimoMantenimiento: "",
    estado: "",
    politicaDevolucion: "",
  });

  const navigate = useNavigate();

  const getVehiculosAdmin = async () => {
    try {
      const url = patenteFiltro
        ? `http://localhost:3000/api/vehicles/getVehiclesAdmin?patente=${patenteFiltro}`
        : `http://localhost:3000/api/vehicles/getVehiclesAdmin`;

      const response = await axios.get(url);
      setVehiculos(response.data);
      setMensaje("");
    } catch (error) {
      if (error.response?.status === 404) {
        setVehiculos([]);
        setMensaje(error.response.data.mensaje);
      } else {
        console.error("Error al obtener los vehículos:", error);
        setMensaje("Error al obtener los vehículos");
      }
    }
  };

  useEffect(() => {
    getVehiculosAdmin();
  }, []);

  const handleFiltrar = () => {
    getVehiculosAdmin();
  };

  const irAMetricas = () => {
    navigate("/adminMetrics");
  };

  const handleEliminar = async (patente) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/vehicles/${patente}`
      );
      toast.success(response.data.message);
      getVehiculosAdmin();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Error al intentar eliminar el vehículo"
      );
    }
  };

  const handleEditar = (vehiculo) => {
    setVehiculoEditando(vehiculo);
    setFormData({
      precioPorDia: "",
      ultimoMantenimiento: "",
      estado: "",
      politicaDevolucion: "",
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmarEdicion = async () => {
    const body = {};
    for (const key in formData) {
      if (formData[key] !== "") {
        body[key] = formData[key];
      }
    }

    if (Object.keys(body).length === 0) {
      toast.warn("Debe completar al menos un campo");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/vehicles/${vehiculoEditando.patente}`,
        body
      );
      toast.success("Vehículo actualizado correctamente");
      setVehiculoEditando(null);
      getVehiculosAdmin();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Error al intentar actualizar el vehículo"
      );
    }
  };

  return (
    <div className="p-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Botón Métricas */}
      <div className="mb-6">
        <button
          onClick={irAMetricas}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Métricas de la empresa
        </button>
      </div>

      {/* Filtro */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Filtrar por patente:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={patenteFiltro}
            onChange={(e) => setPatenteFiltro(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Ej: ABC123"
          />
          <button
            onClick={handleFiltrar}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Filtrar
          </button>
        </div>
      </div>

      {mensaje && (
        <div className="text-red-600 font-semibold mb-4">{mensaje}</div>
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
              <p className="text-gray-700 mb-2">Estado: {vehiculo.estado}</p>
              {vehiculo.estado === "inactivo" && (
                <p className="text-red-600 font-semibold mb-2">
                  🚫 Vehículo inactivo
                </p>
              )}
              <p className="text-gray-700 mb-2">
                Precio por día: ${vehiculo.precioPorDia}
              </p>
              <p className="text-gray-700 mb-2">
                Último mantenimiento:{" "}
                {new Date(vehiculo.ultimo_mantenimiento).toLocaleDateString(
                  "es-ES"
                )}
              </p>
              <p className="text-gray-700 mb-2">
                Política de devolución: {vehiculo.politica_devolucion}%
              </p>

              {/* Botones */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEditar(vehiculo)}
                  className="bg-green-500 text-white font-bold px-4 py-2 rounded hover:bg-green-600"                >
                  Actualizar
                </button>
                <button
                  onClick={() => handleEliminar(vehiculo.patente)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {vehiculoEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">
              Editar vehículo: {vehiculoEditando.patente}
            </h2>

            <input
              type="number"
              name="precioPorDia"
              placeholder="Precio por día"
              value={formData.precioPorDia}
              onChange={handleInputChange}
              className="mb-2 w-full border px-3 py-2 rounded"
            />
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Último mantenimiento
            </label>
            <input
              type="date"
              name="ultimoMantenimiento"
              value={formData.ultimoMantenimiento}
              onChange={handleInputChange}
              className="mb-2 w-full border px-3 py-2 rounded"
            />
            <select
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              className="mb-2 w-full border px-3 py-2 rounded"
            >
              <option value="">Seleccionar estado</option>
              <option value="disponible">Disponible</option>
              <option value="ocupado">Ocupado</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
            <input
              type="number"
              name="politicaDevolucion"
              placeholder="Política de devolución (%)"
              value={formData.politicaDevolucion}
              onChange={handleInputChange}
              className="mb-4 w-full border px-3 py-2 rounded"
            />
            <p className="text-gray-600 text-sm mb-4">
              * Completá al menos un campo para poder confirmar la edición.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setVehiculoEditando(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarEdicion}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Confirmar edición
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
