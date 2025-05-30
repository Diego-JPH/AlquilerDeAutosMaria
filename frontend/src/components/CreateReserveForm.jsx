// CreateReserveForm.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function CreateReserveForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const idVehiculo = queryParams.get("idVehiculo");
  const sucursalRetiro = queryParams.get("idSucursal");
  const precioPorDia = parseFloat(queryParams.get("precioPorDia"));
  const fechaDesde = queryParams.get("fechaDesde");
  const fechaHasta = queryParams.get("fechaHasta");

  const token = localStorage.getItem("token");
  let idUsuario = null;
  if (token) {
    try {
      const datos = jwtDecode(token);
      idUsuario = datos.id;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  }

  const [formData, setFormData] = useState({
    fecha_inicio: fechaDesde || "",
    fecha_fin: fechaHasta || "",
    sucursal_entrega_id: "",
    nombre: "",
    apellido: "",
    fechaN: "",
    licencia: "",
  });

  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    const getSucursales = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/sucursales/getSucursales");
        setSucursales(response.data);
      } catch (error) {
        console.error("Error al obtener las sucursales:", error);
      }
    };

    getSucursales();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const calcularMonto = (desde, hasta, precioPorDia) => {
    const inicio = new Date(desde);
    const fin = new Date(hasta);
    const diferenciaMs = fin - inicio;

    if (isNaN(inicio) || isNaN(fin) || diferenciaMs <= 0) return 0;

    const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
    return dias * precioPorDia;
  };
  const edadConductor = calcularEdad(formData.fechaN);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Debe iniciar sesión para realizar una reserva.");
      return;
    }

    if (new Date(formData.fecha_inicio) >= new Date(formData.fecha_fin)) {
      alert("La fecha de inicio debe ser anterior a la fecha de fin.");
      return;
    }

    if (edadConductor < 18) {
      alert("El conductor debe ser mayor de edad (18 años o más).");
      return;
    }

    const monto = calcularMonto(formData.fecha_inicio, formData.fecha_fin, precioPorDia);

    if (!monto || isNaN(monto) || monto <= 0) {
      alert("El monto calculado es inválido.");
      return;
    }

    const data = {
      id_vehiculo: idVehiculo,
      id_usuario: idUsuario,
      fechaDesde: formData.fecha_inicio,
      fechaHasta: formData.fecha_fin,
      sucursal_retiro_id: parseInt(sucursalRetiro),
      sucursal_entrega_id: parseInt(formData.sucursal_entrega_id),
      nombre: formData.nombre,
      apellido: formData.apellido,
      fechaN: formData.fechaN,
      licencia: formData.licencia,
      monto: monto,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/reserve/create-reserve",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Reserva realizada con éxito");
      navigate("/reserve");
    } catch (error) {
      console.error("Error al realizar la reserva:", error.response);
      const mensaje = error.response?.data?.error || "Error al realizar la reserva";
      alert(mensaje);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4">Reservar Vehículo</h2>

      <div className="mb-4">
        <label htmlFor="fecha_inicio" className="block text-gray-700 mb-2">
          Fecha de inicio *
        </label>
        <input
          type="date"
          name="fecha_inicio"
          value={formData.fecha_inicio}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="fecha_fin" className="block text-gray-700 mb-2">
          Fecha de fin *
        </label>
        <input
          type="date"
          name="fecha_fin"
          value={formData.fecha_fin}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="sucursal_entrega_id" className="block text-gray-700 mb-2">
          Sucursal de entrega *
        </label>
        <select
          name="sucursal_entrega_id"
          value={formData.sucursal_entrega_id}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Seleccione una sucursal</option>
          {sucursales.map((sucursal) => (
            <option key={sucursal.id_sucursal} value={sucursal.id_sucursal}>
              {sucursal.sucursal}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Nombre del Conductor *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Apellido del Conductor *</label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Fecha de Nacimiento *</label>
        <input
          type="date"
          name="fechaN"
          value={formData.fechaN}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-1">Licencia de Conducir *</label>
        <input
          type="text"
          name="licencia"
          value={formData.licencia}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <p className="text-sm text-gray-500 italic mb-4">* Campos obligatorios</p>

      <button
        type="submit"
        className="w-full bg-green-800 text-white rounded py-2 hover:bg-green-700"
      >
        Reservar
      </button>
    </form>
  );
}
