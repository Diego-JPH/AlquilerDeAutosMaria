import PublicHome from "./PublicHome";
import ClientHome from "./client/ClientHome";
import AdminHome from "./admin/AdminHome";

export default function Home() {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) return <PublicHome />;
  if (rol === "admin") return <AdminHome />;
  return <ClientHome />;
}
