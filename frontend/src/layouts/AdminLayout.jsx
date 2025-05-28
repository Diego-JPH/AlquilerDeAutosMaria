import { Outlet } from "react-router-dom";

export default function AdminLayout({ onLogout }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-black">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Panel de Administración</h1>
        <button onClick={onLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
          Cerrar sesión
        </button>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}