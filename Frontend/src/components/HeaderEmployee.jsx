import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/Header.css";

export default function HeaderEmployee() {
    const { logout } = useAuth();

    return (
        <header className="header employee-header">
            <div className="role-badge">EMPLEADO</div>
            <nav className="header-links">
                <Link to="/employee">Dashboard</Link>
                <button onClick={logout}>Cerrar Sesión</button>
            </nav>

        </header>
    );
}