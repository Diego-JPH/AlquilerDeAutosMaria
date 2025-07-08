import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InsertVehicleForm() {
  const [form, setForm] = useState({
    patente: '',
    marca: '',
    modelo: '',
    anio: '',
    precioPorDia: '',
    ultimoMantenimiento: '',
    categoria: '',
    sucursal: '',
    politicaDevolucion: '',
  });

  const [imagen, setImagen] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/sucursales/getSucursales');
        const data = await res.json();
        setSucursales(data);
      } catch (err) {
        console.error('Error al cargar sucursales', err);
        toast.error('Error al cargar sucursales');
      }
    };

    fetchSucursales();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmpty = Object.values(form).some(value => value.trim() === '');
    if (hasEmpty) {
      toast.warn('Todos los campos son obligatorios');
      return;
    }

    if (form.politicaDevolucion < 0 || form.politicaDevolucion > 100) {
      toast.warn('La política de devolución debe ser entre 0 y 100');
      return;
    }

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      const res = await fetch('http://localhost:3000/api/vehicles', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Error al agregar vehículo');
        return;
      }

      toast.success(data.message || 'Vehículo agregado correctamente');

      setForm({
        patente: '',
        marca: '',
        modelo: '',
        anio: '',
        precioPorDia: '',
        ultimoMantenimiento: '',
        categoria: '',
        sucursal: '',
        politicaDevolucion: '',
      });

      setImagen(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error(err);
      toast.error('Error al agregar vehículo');
    }
  };

  return (
    <div className="w-full max-w-4xl p-6 border rounded shadow bg-white mx-auto mt-10">
      <h2 className="text-xl mb-6 font-bold">Agregar Vehículo</h2>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="patente"
          placeholder="Patente *"
          className="p-2 border rounded w-full"
          value={form.patente}
          onChange={handleChange}
        />
        <input
          name="marca"
          placeholder="Marca *"
          className="p-2 border rounded w-full"
          value={form.marca}
          onChange={handleChange}
        />
        <input
          name="modelo"
          placeholder="Modelo *"
          className="p-2 border rounded w-full"
          value={form.modelo}
          onChange={handleChange}
        />
        <input
          name="anio"
          type="number"
          placeholder="Año *"
          className="p-2 border rounded w-full"
          value={form.anio}
          onChange={handleChange}
        />
        <input
          name="precioPorDia"
          type="number"
          placeholder="Precio por día *"
          className="p-2 border rounded w-full"
          value={form.precioPorDia}
          onChange={handleChange}
        />
        <div>
          <label className="text-sm block mb-1">Fecha de último mantenimiento *</label>
          <input
            name="ultimoMantenimiento"
            type="date"
            className="p-2 border rounded w-full"
            value={form.ultimoMantenimiento}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Categoría *</label>
          <select
            name="categoria"
            className="p-2 border rounded w-full"
            value={form.categoria}
            onChange={handleChange}
          >
            <option value="">Seleccionar categoría</option>
            <option value="Suv">Suv</option>
            <option value="Pick-up">Pick-up</option>
            <option value="Sedan">Sedan</option>
            <option value="Economico">Económico</option>
          </select>
        </div>

        <div>
          <label className="text-sm block mb-1">Sucursal *</label>
          <select
            name="sucursal"
            className="p-2 border rounded w-full"
            value={form.sucursal}
            onChange={handleChange}
          >
            <option value="">Seleccionar sucursal</option>
            {sucursales.map((s) => (
              <option key={s.id_sucursal} value={s.sucursal}>
                {s.sucursal}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm block mb-1">Política de devolución (%) *</label>
          <input
            name="politicaDevolucion"
            type="number"
            placeholder="Ej: 100, 50, 0"
            className="p-2 border rounded w-full"
            value={form.politicaDevolucion}
            onChange={handleChange}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm block mb-1">Imagen del vehículo (opcional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold px-4 py-2 rounded hover:bg-blue-700"
          >
            Agregar Vehículo
          </button>
        </div>
      </form>

      <p className="text-sm mt-4 text-gray-600">* Campos obligatorios</p>

      <ToastContainer />
    </div>
  );
}