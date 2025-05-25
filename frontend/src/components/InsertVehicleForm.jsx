import { useState, useEffect } from 'react';

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
  });

  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/sucursales/getSucursales');
        const data = await res.json();
        setSucursales(data);
      } catch (err) {
        console.error('Error al cargar sucursales', err);
      }
    };

    fetchSucursales();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmpty = Object.values(form).some(value => value.trim() === '');
    if (hasEmpty) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Error al agregar vehículo');
        return;
      }

      alert(data.message || 'Vehículo agregado correctamente');

      setForm({
        patente: '',
        marca: '',
        modelo: '',
        anio: '',
        precioPorDia: '',
        ultimoMantenimiento: '',
        categoria: '',
        sucursal: '',
      });
    } catch (err) {
      console.error(err);
      alert('Error al agregar vehículo');
    }
  };

  return (
    <div className="bg-green-900 text-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Agregar Vehículo</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <input name="patente" placeholder="Patente *" className="p-2 rounded text-black" value={form.patente} onChange={handleChange} />
        <input name="marca" placeholder="Marca *" className="p-2 rounded text-black" value={form.marca} onChange={handleChange} />
        <input name="modelo" placeholder="Modelo *" className="p-2 rounded text-black" value={form.modelo} onChange={handleChange} />
        <input name="anio" type="number" placeholder="Año *" className="p-2 rounded text-black" value={form.anio} onChange={handleChange} />
        <input name="precioPorDia" type="number" placeholder="Precio por día *" className="p-2 rounded text-black" value={form.precioPorDia} onChange={handleChange} />
        <div>
          <label className="block text-sm mb-1">Fecha de último mantenimiento *</label>
          <input
            name="ultimoMantenimiento"
            type="date"
            className="p-2 rounded text-black w-full"
            value={form.ultimoMantenimiento}
            onChange={handleChange}
          />
        </div>
        <input name="categoria" placeholder="Categoría *" className="p-2 rounded text-black" value={form.categoria} onChange={handleChange} />
        
        <div>
          <label className="block text-sm mb-1">Sucursal *</label>
          <select
            name="sucursal"
            className="p-2 rounded text-black w-full"
            value={form.sucursal}
            onChange={handleChange}
          >
            <option value="">Seleccionar sucursal</option>
            {sucursales.map((sucursal) => (
              <option key={sucursal.id_sucursal} value={sucursal.sucursal}>
                {sucursal.sucursal}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="bg-white text-green-900 font-bold px-4 py-2 rounded hover:bg-gray-200 w-full">
            Agregar Vehículo
          </button>
        </div>
      </form>

      <p className="text-sm mt-4">* Campos obligatorios</p>
    </div>
  );
}
