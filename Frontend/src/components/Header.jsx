import "../styles/Layouts/Header.css";
import { FaUser, FaRightToBracket } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    navigate("/");
    console.log("🔒 Sesión cerrada");
  };

  return (
    <>
      <header className="barranav">
        <div className="left">
          <div className="logo">
            <img src="/Logo S.png" alt="Logo S" />
          </div>

          <div className="sep" />

          <nav className="navegacion">
            <a href="/">INICIO</a>
          </nav>
        </div>

        <div className="iconos">
          <Link to="/auth/companyRegister" className="icono">
            <FaUser style={{ cursor: "pointer" }} />
          </Link>

          <FaRightToBracket
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
            title="Cerrar sesión"
          />
        </div>
      </header>
    </>
  );
}
