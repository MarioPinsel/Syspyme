import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";


export default function RequireAuth({ allowedRoles }) {
    const { user, loading } = useAuth();

    if (loading) return <div>Cargando...</div>;

    if (!user) return <Navigate to="/auth/login" />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;

    return <Outlet />;
}
