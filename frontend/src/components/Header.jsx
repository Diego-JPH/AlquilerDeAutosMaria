import { useNavigate, Link } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="bg-green-900 text-white p-4 md:flex md:justify-between md:items-center">
      <Link to="/" className="text-xl md:text-2xl font-bold hover:underline cursor-pointer">
        Alquiler de Autos María
      </Link>
      <nav className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 md:mt-0">
        {!token ? (
          <>
            <Link to="/login" className="hover:underline">Iniciar sesión</Link>
            <Link to="/registerPage" className="hover:underline">Registrarse</Link>
          </>
        ) : (
          <>
            <button onClick={() => {}} className="hover:underline">Reservas realizadas</button>
            <button onClick={handleLogout} className="hover:underline">Cerrar sesión</button>
          </>
        )}
      </nav>
    </header>
  );
}
