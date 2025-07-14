import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateReserveFormEmployee() {
  const location = useLocation();
  const navigate  = useNavigate();

  /* ------------------------ parámetros por query ------------------------ */
  const queryParams     = new URLSearchParams(location.search);
  const idVehiculo      = queryParams.get("idVehiculo");
  const sucursalRetiro  = queryParams.get("idSucursal");
  const precioPorDia    = parseFloat(queryParams.get("precioPorDia"));
  const fechaDesdeQuery = queryParams.get("fechaDesde");
  const fechaHastaQuery = queryParams.get("fechaHasta");

  /* ------------------------------ estados ------------------------------ */
  const [formData, setFormData] = useState({
    correoCliente        : "",
    fecha_inicio         : fechaDesdeQuery || "",
    fecha_fin            : fechaHastaQuery || "",
    sucursal_entrega_id  : "",
    nombre               : "",
    apellido             : "",
    fechaN               : "",
    licencia             : "",
    /* extras */
    seguro               : false,
    peajes               : false,
  });

  const [sucursales, setSucursales]           = useState([]);
  const [clienteNoEncontrado, setClienteNoEncontrado] = useState(false);

  /* ------------------------- carga de sucursales ------------------------ */
  useEffect(() => {
    axios.get("http://localhost:3000/api/sucursales/getSucursales")
      .then(r => setSucursales(r.data))
      .catch(err => console.error("Error al obtener sucursales:", err));
  }, []);

  /* ------------------------------ helpers ------------------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const calcularEdad = (fecha) => {
    if (!fecha) return 0;
    const hoy = new Date();
    const nac = new Date(fecha);
    let edad  = hoy.getFullYear() - nac.getFullYear();
    const m   = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  };

  const edadConductor = calcularEdad(formData.fechaN);

  /** costo base sin extras */
  const costoDias = () => {
    const ini = new Date(formData.fecha_inicio);
    const fin = new Date(formData.fecha_fin);
    const diff = fin - ini;
    if (isNaN(ini) || isNaN(fin) || diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) * precioPorDia;
  };

  /** extras fijos */
  const EXTRA_SEGURO = 10_000;
  const EXTRA_PEAJES = 5_000;

  const costoExtras = () =>
    (formData.seguro ? EXTRA_SEGURO : 0) +
    (formData.peajes ? EXTRA_PEAJES : 0);

  const montoTotal = () => costoDias() + costoExtras();

  /* --------------------------- buscar cliente --------------------------- */
  const handleBuscarCliente = async () => {
    try {
      const r = await axios.get(
        "http://localhost:3000/api/user/getUserByEmail",
        { params: { email: formData.correoCliente } }
      );
      if (r.data?.id_usuario) {
        toast.success("Cliente encontrado");
        setClienteNoEncontrado(false);
      } else {
        toast.error("Cliente no encontrado");
        setClienteNoEncontrado(true);
      }
    } catch {
      toast.error("Error al buscar el cliente");
      setClienteNoEncontrado(true);
    }
  };

  /* ------------------------------ submit ------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Validaciones básicas */
    if (new Date(formData.fecha_inicio) >= new Date(formData.fecha_fin)) {
      toast.error("La fecha de inicio debe ser anterior a la fecha de fin.");
      return;
    }
    if (edadConductor < 18) {
      toast.error("El conductor debe ser mayor de edad.");
      return;
    }
    if (costoDias() === 0) {
      toast.error("Revisá las fechas seleccionadas.");
      return;
    }

    /* buscar usuario */
    let idUsuario;
    try {
      const r = await axios.get(
        "http://localhost:3000/api/user/getUserByEmail",
        { params: { email: formData.correoCliente } }
      );
      idUsuario = r.data?.id_usuario;
      if (!idUsuario) {
        toast.error("No se encontró un usuario con ese correo.");
        return;
      }
    } catch {
      toast.error("Error al buscar el cliente.");
      return;
    }

    /* DTO para PaymentPage */
    const reservaData = {
      id_vehiculo          : idVehiculo,
      id_usuario           : idUsuario,
      fechaDesde           : formData.fecha_inicio,
      fechaHasta           : formData.fecha_fin,
      sucursal_retiro_id   : parseInt(sucursalRetiro),
      sucursal_entrega_id  : parseInt(formData.sucursal_entrega_id),
      nombre               : formData.nombre,
      apellido             : formData.apellido,
      fechaN               : formData.fechaN,
      licencia             : formData.licencia,
      monto                : montoTotal(),
      /* indicamos qué extras eligió */
      incluyeSeguro        : formData.seguro,
      incluyePeajes        : formData.peajes,
      costoSeguro          : formData.seguro ? EXTRA_SEGURO : 0,
      costoPeajes          : formData.peajes ? EXTRA_PEAJES : 0,
    };

    /* Pasar al paso de pago */
    navigate("/payment", { state: { reservaData } });
  };

  /* ================================ UI ================================ */
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">Reservar para Cliente</h2>

        {/* ---------- Correo + Buscar ---------- */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Correo del Cliente *</label>
          <div className="flex gap-2">
            <input
              type="email"
              name="correoCliente"
              value={formData.correoCliente}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
            <button
              type="button"
              onClick={handleBuscarCliente}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-500"
            >
              Buscar
            </button>
          </div>
          {clienteNoEncontrado && (
            <div className="mt-2 text-red-600">
              Cliente no encontrado.{" "}
              <Link to="/registrar-cliente" className="text-blue-600 hover:underline">
                Registrar Cliente
              </Link>
            </div>
          )}
        </div>

        {/* ---------- Fechas ---------- */}
        <div className="mb-4">
          <label htmlFor="fecha_inicio" className="block mb-2">
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
          <label htmlFor="fecha_fin" className="block mb-2">
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

        {/* ---------- Sucursal entrega ---------- */}
        <div className="mb-4">
          <label htmlFor="sucursal_entrega_id" className="block mb-2">
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
            {sucursales.map((s) => (
              <option key={s.id_sucursal} value={s.id_sucursal}>
                {s.sucursal}
              </option>
            ))}
          </select>
        </div>

        {/* ---------- Datos conductor ---------- */}
        <div className="mb-4">
          <label className="block mb-1">Nombre del Conductor *</label>
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
          <label className="block mb-1">Apellido del Conductor *</label>
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
          <label className="block mb-1">Fecha de Nacimiento *</label>
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
          <label className="block mb-1">Licencia de Conducir *</label>
          <input
            type="text"
            name="licencia"
            value={formData.licencia}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* ---------- Extras opcionales ---------- */}
        <fieldset className="mb-6 border rounded p-4">
          <legend className="font-semibold text-gray-700">Extras opcionales</legend>

          <label className="flex items-center gap-2 my-2">
            <input
              type="checkbox"
              name="seguro"
              checked={formData.seguro}
              onChange={handleChange}
            />
            Incluir seguro (+${EXTRA_SEGURO})
          </label>

          <label className="flex items-center gap-2 my-2">
            <input
              type="checkbox"
              name="peajes"
              checked={formData.peajes}
              onChange={handleChange}
            />
            Incluir costos de peajes (+${EXTRA_PEAJES})
          </label>
        </fieldset>

        {/* ---------- Monto estimado ---------- */}
        {montoTotal() > 0 && (
          <div className="mb-4 text-right font-medium">
            <span className="text-gray-600">Monto estimado:&nbsp;</span>
            <span className="text-green-700">${montoTotal().toLocaleString()}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-800 text-white rounded py-2 hover:bg-green-700"
        >
          Reservar para Cliente
        </button>
      </form>

      <ToastContainer />
    </>
  );
}
