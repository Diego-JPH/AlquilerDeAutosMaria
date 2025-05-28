import VehicleCatalogToReserve from "../../components/VehicleCatalogToReserve";

export default function ClientHome() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold text-green-900">Nuestro catalogo</h1>
      <VehicleCatalogToReserve />
    </div>
  );
}