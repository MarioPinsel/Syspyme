import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";


export default function RequireAuth({ allowedRoles }) {
    const { user } = useAuth();

    console.log("✔ RequireAuth ejecutado | user =", user, "| allowed =", allowedRoles);

    if (!user) {
        console.log("⛔ No hay user → redirigiendo a login");
        return <Navigate to="/auth/login" />;
    }

    if (!allowedRoles.includes(user.role)) {
        console.log("⛔ Rol no permitido → redirigiendo a /");
        return <Navigate to="/" />;
    }

    console.log("✔ Acceso permitido");
    return <Outlet />;
}
