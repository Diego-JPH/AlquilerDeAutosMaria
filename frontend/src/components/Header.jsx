import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header({ isLoggedIn, onLogout }) {
  const [rol, setRol] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setRol(localStorage.getItem("rol"));
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
            <Link to="/reserve" className="hover:underline">Reservas</Link>
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
