import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EmployeeVehicleManager() {
  const [vehiculos, setVehiculos] = useState([]);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [estadosActualizados, setEstadosActualizados] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchVehiculos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/vehicles/employeeVehicles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehiculos(res.data);
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
      toast.error("Error al obtener vehículos");
    }
  };

  const filtrarPorFechas = async () => {
    if (!fechaDesde || !fechaHasta) {
      toast.error("Seleccioná ambas fechas");
      return;
    }

    if (new Date(fechaDesde) >= new Date(fechaHasta)) {
      toast.error("Formato de fechas incorrecto");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/api/vehicles/getAvailableInBranchByDate", {
        params: { fechaDesde, fechaHasta },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.length === 0) {
        toast.info("No hay vehículos disponibles en ese rango");
      }
      setVehiculos(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error al filtrar por fechas");
    }
  };

  const limpiarFiltro = () => {
    setFechaDesde("");
    setFechaHasta("");
    fetchVehiculos();
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Estado actualizado");
      fetchVehiculos();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar estado");
    }
  };

  const reservar = (vehiculo) => {
    navigate(`/employee/create-reserve?idVehiculo=${vehiculo.id_vehiculo}&idSucursal=${vehiculo.id_sucursal}&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}&precioPorDia=${vehiculo.precioPorDia}`);
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  return (
    <div className="p-8">
      <ToastContainer />
      {/* Filtro por fechas */}
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
          <button onClick={filtrarPorFechas} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500">Filtrar</button>
          {(fechaDesde || fechaHasta) && (
            <button onClick={limpiarFiltro} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500">Limpiar</button>
          )}
        </div>
      </div>

      {/* Catálogo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehiculos.map((v) => (
          <div key={v.id_vehiculo} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {v.imagen ? (
                <img src={`http://localhost:3000${v.imagen}`} alt={`Imagen de ${v.patente}`} className="object-cover h-full w-full" />
              ) : (
                <span className="text-gray-600">Imagen no disponible</span>
              )}
            </div>

            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{v.marca} {v.modelo}</h2>
              <p className="text-gray-700">Patente: {v.patente}</p>
              <p className="text-gray-700">Año: {v.año}</p>
              <p className="text-gray-700">Estado actual: {v.estado}</p>
              <p className="text-gray-700">Precio por día: ${v.precioPorDia}</p>
              <p className="text-gray-700">Último mantenimiento: {new Date(v.ultimo_mantenimiento).toLocaleDateString("es-AR")}</p>
              <p className="text-gray-700 mb-2">Política de devolución: {v.politica_devolucion}%</p>

              {/* Formulario estado */}
              <div className="mt-4 flex gap-2">
                <select
                  className="border p-2 rounded"
                  value={estadosActualizados[v.patente] || v.estado}
                  onChange={(e) => handleEstadoChange(v.patente, e.target.value)}
                >
                  <option value="disponible">disponible</option>
                  {/* <option value="ocupado">ocupado</option> *la profe dijo que lo sacaramos* */}
                  <option value="mantenimiento">mantenimiento</option>
                </select>
                <button onClick={() => actualizarEstado(v.patente)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Actualizar</button>
              </div>

              {/* Botón reservar */}
              <button
                onClick={() => reservar(v)}
                className="mt-4 w-full bg-green-800 text-white py-2 rounded hover:bg-green-700"
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
