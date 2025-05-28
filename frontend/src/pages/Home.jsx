import PublicHome from "./PublicHome";
import ClientHome from "./client/ClientHome";
import AdminHome from "./admin/AdminHome";
import { jwtDecode } from "jwt-decode";

export default function Home() {
  if (typeof window === "undefined") {
    return <PublicHome />;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No hay token: usuario público");
    return <PublicHome />;
  }

  let datos;
  try {
    datos = jwtDecode(token);
    console.log("Token decodificado:", datos);
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return <PublicHome />;
  }

  if (datos?.rol === "admin") {
    return <AdminHome />;
  }

  if (datos?.rol === "cliente") {
    return <ClientHome />;
  }

  return <PublicHome />;
}
