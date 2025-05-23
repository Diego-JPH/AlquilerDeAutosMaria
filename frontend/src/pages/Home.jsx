import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../css/Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <main className="home-main">
        <h2>Catalogo de autos</h2>
        <ul>
            <li>
                <h3>Toyota Corolla</h3>
                <p>Precio: $100</p>
            </li>
            <li>
                <h3>Toyota Etios</h3>
                <p>Precio: $200</p>
            </li>
            <li>
                <h3>Fiat Cronos</h3>
                <p>Precio: $300</p>
            </li>   
        </ul>
        <Link to="/registerPage">
          <button className="register-button">Ir a Registro</button>
        </Link>
      </main>
    </div>
  );
}
