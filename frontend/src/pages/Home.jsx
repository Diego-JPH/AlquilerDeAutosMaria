import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold mb-6">Bienvenido a alquileres de autos Maria</h1>
        <h2 className="text-2xl font-bold mb-4">Catálogo de autos</h2>
        <ul className="space-y-4 mb-6">
          {[
            { modelo: "Toyota Corolla", precio: "$100" },
            { modelo: "Toyota Etios", precio: "$200" },
            { modelo: "Fiat Cronos", precio: "$300" },
          ].map((auto, idx) => (
            <li key={idx}>
              <h3 className="text-lg font-semibold">{auto.modelo}</h3>
              <p>Precio: {auto.precio}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}