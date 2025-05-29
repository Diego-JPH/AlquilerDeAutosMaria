import VehicleCatalogUser from "../components/VehicleCatalogUser";

export default function PublicHome() {
  return (
    <div className="max-w-7xl mx-auto px-2 mt-10">
      <h1 className="text-5xl font-bold text-green-900 mb-6">
        Bienvenido a Alquiler de Autos María
      </h1>
      <p className="text-xl text-gray-700 mb-10">
        Inicia sesión o regístrate para reservar
      </p>
      <h2 className="text-3xl font-semibold text-green-800 mb-6">
        Explora nuestros vehículos disponibles
      </h2>
      <VehicleCatalogUser />
    </div>
  );
}
