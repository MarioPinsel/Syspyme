import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = Cookies.get("token");
        const role = Cookies.get("role");

        if (token && role) {
            setUser({ token, role });
        }

        setLoading(false);
    }, []);

    const login = (token, role) => {
        Cookies.set("token", token);
        Cookies.set("role", role);
        setUser({ token, role });
    };

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("role");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

