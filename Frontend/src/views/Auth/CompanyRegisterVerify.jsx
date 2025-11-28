import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "sonner";
import "../../styles/Layouts/Verify.css";
import api from "../../config/axios";

export default function VerificationCode() {
    const [code, setCode] = useState(Array(6).fill(""));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const handleChange = (value, index) => {
        if (value.length > 1) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(paste)) {
            const digits = paste.split("");
            setCode(digits);

            digits.forEach((digit, i) => {
                inputRefs.current[i].value = digit;
            });

            inputRefs.current[5].focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const fullCode = code.join("");
        const token = Cookies.get("token");

        if (fullCode.length !== 6) {
            toast.error("Debes ingresar el código completo");
            setIsSubmitting(false);
            return;
        }

        if (!token) {
            console.error("No se encontró el token");
            setIsSubmitting(false);
            return;
        }

        try {
            const { data } = await api.post(
                "/auth/verify",
                { codigo: fullCode },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const newToken = data?.token;

            if (newToken) {
                Cookies.set("token", newToken, {
                    expires: 1 / 96,
                    path: "/auth",
                    secure: true,
                    sameSite: "lax",
                });
            }

            // ✔ Recibir mensaje del backend
            if (data.message) {
                setSuccessMessage(data.message);
            }

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
            setIsSubmitting(false);
        }
    };

    if (successMessage) {
        return (
            <div className="verification-container">
                <div className="verification-box" style={{ maxWidth: "600px", padding: "2.5rem" }}>
                    <div style={{
                        width: "64px",
                        height: "64px",
                        margin: "0 auto 1.5rem",
                        borderRadius: "50%",
                        background: "#4CAF50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>

                    <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem" }}>
                        ✓ Verificación exitosa
                    </h2>

                    <div style={{
                        background: "#f8f9fa",
                        padding: "1.5rem",
                        borderRadius: "8px",
                        marginBottom: "2rem",
                        border: "1px solid #e9ecef"
                    }}>
                        <p style={{
                            textAlign: "left",
                            lineHeight: "1.8",
                            fontSize: "1rem",
                            color: "#495057",
                            margin: 0,
                            whiteSpace: "pre-wrap"
                        }}>
                            {successMessage}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        style={{ width: "100%", padding: "0.875rem" }}
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="verification-container">
            <div className="verification-box">
                <h2>Código de Verificación</h2>
                <p className="verification-instructions">
                    Revisa tu correo electrónico por el código.
                </p>

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
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                ref={(el) => (inputRefs.current[index] = el)}
                            />
                        ))}
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <div className="spinner"></div> : "Verificar"}
                    </button>
                </form>
            </div>
        </div>
    );
}
