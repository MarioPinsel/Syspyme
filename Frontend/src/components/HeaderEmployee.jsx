import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styles/Header.css";

export default function HeaderEmployee() {
    const { logout } = useAuth();

    return (
        <header className="header employee-header">
            <nav className="header-links">
                <Link to="/sales/register-client">Registro de clientes</Link>
                <Link to="/sales">Realizar Venta</Link>
            </nav>
            <button onClick={logout}>Cerrar Sesión</button>
        </header>
    );
}