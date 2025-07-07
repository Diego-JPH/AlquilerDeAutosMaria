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
            {rol === 'cliente' && (
              <Link to="/reserve" className="hover:underline">Reservas</Link>
            )}

            {rol === 'admin' && (
              <>
                <Link to="/adminReserve" className="hover:underline">Lista de reservas</Link>
                <Link to="/manageVehicles" className="hover:underline">Administrar vehículos</Link>
                <Link to="/registerEmployee" className="hover:underline">Administrar empleados</Link>
                <Link to="/admin/clientes-registrados" className="hover:underline">Clientes registrados</Link>
              </>
            )}

            {rol === 'empleado' && (
              <>
                <Link to="/employeeReserve" className="hover:underline">Administrar reservas</Link>
                <Link to="/registrar-cliente" className="hover:underline">Registrar Cliente</Link>
              </>
            )}

            <button onClick={onLogout} className="hover:underline">Cerrar sesión</button>
          </>
        )}
      </nav>
    </header>
  );
}
