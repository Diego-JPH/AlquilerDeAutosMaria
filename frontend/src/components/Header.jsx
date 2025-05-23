import "../css/Header.css";

export default function Header() {
  return (
    <header className="header">
      <h1>Alquiler de Autos María</h1>
      <nav className="nav-links">
        <a href="/login">Iniciar sesión</a>
        <a href="/registerPage">Registrarse</a>
      </nav>
    </header>
  );
}