import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "sonner";
import "../../styles/Layouts/Verify.css";
import api from "../../config/axios";

export default function VerificationCode() {
    const [code, setCode] = useState(Array(6).fill(""));
    const inputsRef = useRef([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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
            inputsRef.current[5].focus();
        }

        e.preventDefault();
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);

        const fullCode = code.join("");

        if (fullCode.length < 6) {
            toast.error("Debes ingresar el código completo de verificación");
            setLoading(false);
            return;
        }

        const token = Cookies.get("token");

        if (!token) {
            toast.error("No se encontró el token");
            setLoading(false);
            return;
        }

        try {
            const { data } = await api.post(
                "/auth/verify",
                { codigo: fullCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // ✅ El backend devuelve: { message: '...' }
            // ✅ Redirigir directamente a la página de confirmación DIAN
            navigate("/auth/company-verification-success", { 
                state: { message: data.message } 
            });

            toast.success("Código verificado correctamente");

        } catch (error) {
            console.error("❌ Error en la verificación:", error);

            if (error.response?.data?.errors) {
                toast.error(error.response.data.errors[0].msg);
            } else if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Código incorrecto");
            }
        } finally {
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