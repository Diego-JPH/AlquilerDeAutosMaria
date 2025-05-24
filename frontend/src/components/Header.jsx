export default function Header() {
  return (
    <header className="bg-green-900 text-white p-4 md:flex md:justify-between md:items-center">
      <h1 className="text-xl md:text-2xl font-bold">Alquiler de Autos María</h1>
      <nav className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 md:mt-0">
        <a href="/login" className="hover:underline">Iniciar sesión</a>
        <a href="/registerPage" className="hover:underline">Registrarse</a>
      </nav>
    </header>
  );
}
