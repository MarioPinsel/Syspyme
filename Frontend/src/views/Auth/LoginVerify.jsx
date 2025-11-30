import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "sonner";
import "../../styles/Layouts/Verify.css";
import api from "../../config/axios.js";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/useAuth"; // ✅ AGREGAR ESTE IMPORT

export default function VerificationCode() {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ AGREGAR ESTO

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
      toast.error("Debes ingresar el código de verificación completo");
      setIsSubmitting(false);
      return;
    }

    if (!token) {
      console.error("No se encontró el token");
      setIsSubmitting(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/verify-login", { codigo: fullCode }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Login exitoso
      const newToken = data.token;
      const decoded = jwtDecode(newToken);
      const userRole = decoded.isAdmin ? "admin" : "employee"; // ✅ DEFINIR userRole

      // ✅ ACTUALIZAR AUTHCONTEXT EN LUGAR DE HACER RELOAD
      login(newToken, userRole);

      if (decoded.isAdmin) {
        navigate("/dashboard/");
        // ❌ QUITAR window.location.reload();
      } else {
        navigate("/employee");
        // ❌ QUITAR window.location.reload();
      }

    } catch (error) {

      // ✅ NUEVO: Certificado PENDIENTE (403)
      if (error.response?.status === 403) {
        setPendingMessage(error.response.data.error);
        return;
      }

      // Admin sin certificado (428)
      if (error.response?.status === 428) {
        const newToken = error.response.data?.token;

        if (newToken) {
          Cookies.set("token", newToken, { expires: 1, path: "/", secure: true, sameSite: "lax" });
          
          const decoded = jwtDecode(newToken);
          const userRole = decoded.isAdmin ? "admin" : "employee";
          
          // ✅ ACTUALIZAR AUTHCONTEXT TAMBIÉN AQUÍ
          login(newToken, userRole);
        }

        toast.error(error.response.data.error);

        if (decoded.isAdmin) {
          navigate("/auth/digital-certificate");
        }

        return;
      }

      // Errores normales
      if (error.response?.data?.errors) {
        toast.error(error.response.data.errors[0].msg);
        return;
      }

      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
        return;
      }

      toast.error("Error en la verificación");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Vista cuando el certificado está PENDIENTE
  if (pendingMessage) {
    return (
      <div className="verification-container">
        <div className="verification-box" style={{ maxWidth: "600px", padding: "2.5rem" }}>
          <div style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 1.5rem",
            borderRadius: "50%",
            background: "#FF9800",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>

          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem" }}>
            Certificado en Revisión
          </h2>

          <div style={{
            background: "#fff3cd",
            padding: "1.5rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            border: "1px solid #ffc107"
          }}>
            <p style={{
              textAlign: "left",
              lineHeight: "1.8",
              fontSize: "1rem",
              color: "#856404",
              margin: 0,
              whiteSpace: "pre-wrap"
            }}>
              {pendingMessage}
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
          Revisa la bandeja de tu correo electrónico por el código de verificación.
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