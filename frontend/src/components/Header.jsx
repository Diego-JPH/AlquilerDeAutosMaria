import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const [logueado, setLogueado] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLogueado(!!token);
  }, [location.pathname]); // se ejecuta cada vez que cambia la URL

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogueado(false);
    navigate("/");
  };

  return (
    <header className="bg-green-900 text-white p-4 md:flex md:justify-between md:items-center">
      <Link to="/" className="text-xl md:text-2xl font-bold hover:underline cursor-pointer">
        Alquiler de Autos María
      </Link>
      <nav className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 md:mt-0">
        {!logueado && (
          <>
            <Link to="/login" className="hover:underline">Iniciar sesión</Link>
            <Link to="/registerPage" className="hover:underline">Registrarse</Link>
          </>
        )}
        {logueado && (
          <>
            <Link to="/reserve" className="hover:underline">Ir a Reservas</Link>
            <button onClick={handleLogout} className="hover:underline">Cerrar sesión</button>
          </>
        )}
      </nav>
    </header>
  );
}