import VehicleCatalogAdmin from '../../components/VehicleCatalogAdmin';

export default function AdminHome() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold text-green-900">Catalogo</h1>
      <VehicleCatalogAdmin />
    </div>
  );
}