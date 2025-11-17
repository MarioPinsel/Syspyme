import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/Header.css";

export default function HeaderUser() {
    const { logout } = useAuth();

    return (
        <header className="header">
            <div className="role-badge">ADMIN</div>
            <nav className="header-links">
                <Link to="/">Inicio</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/inventario">Inventario</Link>
            </nav>
            <button onClick={logout}>Cerrar Sesión</button>
        </header>
    );
}