import VehicleCatalogToReserve from "../../components/VehicleCatalogToReserve";

export default function ClientHome() {
  return (
    <div className="max-w-7xl mx-auto px-2 mt-10">
      <h1 className="text-4xl font-bold text-green-900 mb-6">
        Nuestro catálogo
      </h1>
      <VehicleCatalogToReserve />
    </div>
  );
}
