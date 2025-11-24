import { Link } from "react-router-dom";
import Header from "./HeaderSelector.jsx";
import Footer from "../layouts/Footer.jsx";
import "../styles/Views/NotFound.css";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="notfound-container">
        <div className="notfound-box">
          <h1>404</h1>
          <h2>Página no encontrada</h2>
          <p>Lo sentimos, la página que estás buscando no existe en Syspyme.</p>
          <Link to="/" className="notfound-btn">
            Volver al inicio
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
