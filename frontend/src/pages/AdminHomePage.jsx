import VehicleCatalogAdmin from "../components/VehicleCatalogAdmin";

export default function AdminHomePage() {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  return <VehicleCatalogAdmin />;
}