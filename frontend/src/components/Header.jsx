import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Header({ isLoggedIn, onLogout }) {
  const [rol, setRol] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificamos que estamos en entorno navegador
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setRol(decoded.rol);
        } catch (error) {
          console.error("Error al decodificar el token en Header:", error);
          setRol(null);
        }
      } else {
        setRol(null);
      }
    }
  }, [location.pathname]);

  return (
    <header className="bg-green-900 text-white p-4 md:flex md:justify-between md:items-center">
      <Link to="/" className="text-xl md:text-2xl font-bold hover:underline">
        Alquiler de Autos María
      </Link>
      <nav className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 md:mt-0">
        {!isLoggedIn && (
          <>
            <Link to="/login" className="hover:underline">Iniciar sesión</Link>
            <Link to="/registerPage" className="hover:underline">Registrarse</Link>
          </>
        )}

        {isLoggedIn && (
          <>
            {/* Mostrar botón "Reservas" solo si el rol es cliente */}
            {rol === 'cliente' && (
              <Link to="/reserve" className="hover:underline">Reservas</Link>
            )}

            {/* Mostrar botón "Administrar vehículos" solo si el rol es admin */}
            {rol === 'admin' && (
              <Link to="/manageVehicles" className="hover:underline">Administrar vehículos</Link>
            )}

            <button onClick={onLogout} className="hover:underline">Cerrar sesión</button>
          </>
        )}
      </nav>
    </header>
  );
}
