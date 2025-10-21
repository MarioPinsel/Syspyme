import "../styles/Header.css";
import { FaUser, FaRightToBracket } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      <header className="barranav">
        <div className="left">
          <div className="logo">
            <img src="/Logo S.png" alt="Logo S" />
          </div>
          <div className="sep" />
          <nav className="navegacion">
            <a href="#">INICIO</a>
            <a href="#">PLANES</a>
            <a href="#">ABOUT US</a>
          </nav>
        </div>

        <div className="iconos">
          <Link to="/auth/register" className="icono">
            <FaUser style={{ cursor: "pointer" }} />
          </Link>

          <FaRightToBracket />
        </div>
      </header>
    </>
  );
}
