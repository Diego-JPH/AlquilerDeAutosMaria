//import PublicHome from "./PublicHome";
//import ClientHome from "./client/ClientHome";
//import AdminHome from "./admin/AdminHome";
import VehicleCatalogToReserve from "../components/VehicleCatalogToReserve";

export default function ClientHomePage() {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  <p> hola </p>
  return <VehicleCatalogToReserve />;
}
