import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "sonner";
import "../../styles/Layouts/Verify.css";
import api from "../../config/axios";
import { jwtDecode } from "jwt-decode";

export default function VerificationCode() {
    const [code, setCode] = useState(Array(6).fill(""));
    const inputsRef = useRef([]);
    const navigate = useNavigate();

    const handleChange = (value, index) => {
        if (value.length > 1) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").trim();

        if (paste.length === 6 && /^[0-9]+$/.test(paste)) {
            const newCode = paste.split("");
            setCode(newCode);

            // Enfocar el último input
            inputsRef.current[5].focus();
        }

        e.preventDefault();
    };

    const handleVerify = async (e) => {
        e.preventDefault();

        const fullCode = code.join("");


        if (fullCode.length < 6) {
            toast.error("Debes ingresar el código completo de verificación");
            return;
        }

        const token = Cookies.get("token");

        if (!token) {
            toast.error("No se encontró el token");
            return;
        }

        try {
            const { data } = await api.post(
                "/auth/verify",
                { codigo: fullCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newToken = data?.token;

            if (newToken) {
                Cookies.set("token", newToken, {
                    expires: 1,
                    path: "/",
                    secure: true,
                    sameSite: "lax",
                });

                const decoded = jwtDecode(newToken);

                Cookies.set("role", decoded.isAdmin ? "admin" : "employee", {
                    expires: 1,
                    path: "/",
                    secure: true,
                    sameSite: "lax",
                });
            }

            toast.success(data.message);
            navigate("/dashboard/");
            window.location.reload();
       } catch (error) {
    console.error("❌ Error en la verificación:", error);

    if (error.response?.data?.errors) {
        return toast.error(error.response.data.errors[0].msg);
    }

    if (error.response?.data?.error) {
        return toast.error(error.response.data.error);
    }

    // fallback genérico
    return toast.error("Código incorrecto");
}finally {
            setLoading(false);
        }
    };

    return (
        <div className="verification-container">
            <div className="verification-box">
                <h2>Código de Verificación</h2>
                <p className="verification-instructions">
                    Revisa la bandeja de tu correo electrónico por el código de verificación.
                </p>

                <form onSubmit={handleVerify}>
                    <label>Código de Verificación</label>

                    <div
                        className="verification-code"
                        onPaste={handlePaste}
                    >
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="code-input"
                                value={digit}
                                ref={(el) => (inputsRef.current[index] = el)}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>

                       <button type="submit" disabled={loading} className={loading ? "loading" : ""}>
                        {loading ? (
                            <>
                                <span className="spinner"></span> Verificando...
                            </>
                        ) : (
                            "Verificar"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
