import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../../styles/Layouts/Verify.css";
import api from "../../config/axios";

export default function VerificationCode() {
    const [code, setCode] = useState(Array(6).fill(""));
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            console.error("❌ No se encontró el token");
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            console.log("📦 Payload del token:", payload);

            if (payload.role === "admin" || payload.type === "admin") {
                setUserType("admin");
            } else if (payload.role === "employee" || payload.type === "employee") {
                setUserType("employee");
            }
        } catch (error) {
            console.error("Error al decodificar el token:", error);
        }
    }, []);

    const handleChange = (value, index) => {
        if (value.length > 1) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        const fullCode = code.join("");
        const token = Cookies.get("token");

        if (!token) {
            console.error("No se encontró el token");
            return;
        }

        if (!userType) {
            console.error("Tipo de usuario no definido");
            return;
        }

        try {
            const { data } = await api.post("/auth/verify",
                { codigo: fullCode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("✅ Verificación exitosa:", data);

            if (userType === "admin") {
                navigate("/dashboard/admin");
            } else {
                navigate("/dashboard/employee");
            }

        } catch (error) {
            console.error("❌ Error en la verificación:", error);
        }
    };

    return (
        <div className="verification-container">
            <div className="verification-box">
                <h2>Código de Verificación</h2>
                <p className="verification-instructions">
                    Revisa la bandeja de tu correo electrónico por el código de verificación.
                </p>

                {!userType ? (
                    <p className="loading-message">Cargando tipo de usuario...</p>
                ) : (
                    <form onSubmit={handleVerify}>
                        <label>Código de Verificación</label>

                        <div className="verification-code">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    className="code-input"
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                />
                            ))}
                        </div>

                        <button type="submit">Verificar</button>
                    </form>
                )}
            </div>
        </div>
    );
}
