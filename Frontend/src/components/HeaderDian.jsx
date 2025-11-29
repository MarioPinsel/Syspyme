import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/Header.css";

export default function HeaderDian() {
    const { logout } = useAuth();

    return (
        <header className="header dian-header">
            <div className="role-badge">DAIN</div>
            <nav className="header-links">
                <Link to="/dian">Dashboard</Link>
                <button onClick={logout}>Cerrar Sesión</button>
            </nav>

        </header>
    );
}