import { Link } from "react-router-dom";
import "../styles/Header.css";

export default function HeaderPublic() {
    return (
        <header className="header public-header">
            <div className="role-badge welcome">BIENVENIDO</div>
            <nav className="header-links">
                <Link to="/">Inicio</Link>
                <Link to="/auth/login">Iniciar Sesión</Link>
                <Link to="/auth/companyRegister">Registro</Link>
            </nav>
        </header>
    );
}


