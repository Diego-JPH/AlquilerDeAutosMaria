import VehicleCatalogAdmin from "../components/VehicleCatalogAdmin";

export default function Home() {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  return <VehicleCatalogAdmin />;
}