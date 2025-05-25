import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
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
        <Link to="/registerPage">
          <button className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md">
            Ir a Registro
          </button>
        </Link>
      </main>
    </div>
  );
}
