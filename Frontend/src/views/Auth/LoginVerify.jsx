
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "sonner";
import "../../styles/Layouts/Verify.css";
import api from "../../config/axios.js";
import { jwtDecode } from "jwt-decode";

export default function VerificationCode() {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const fullCode = code.join("");
    const token = Cookies.get("token");

    if (fullCode.length !== 6) {
      toast.error("Debes ingresar el código de verificación completo");
      return;
    }

    if (!token) {
      console.error("No se encontró el token");
      return;
    }

    try {
      const { data } = await api.post(
        "/auth/verify-login",
        { codigo: fullCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newToken = data?.token;

      if (newToken) {
        Cookies.set("token", newToken, {
          expires: 1,
          path: "/",
          secure: true,
          sameSite: "lax",
        });
      }

      const decoded = jwtDecode(newToken);

      Cookies.set("role", decoded.isAdmin ? "admin" : "employee");

      if (decoded.isAdmin) {
        navigate("/dashboard/");
        window.location.reload();
      } else {
        navigate("/employee");
        window.location.reload();
      }
    } catch (error) {

  console.error("❌ Error en la verificación:", error);

  if (error.response?.data?.errors) {
    toast.error(error.response.data.errors[0].msg);
    return;
  }

  if (error.response?.data?.error) {
    toast.error(error.response.data.error);
    return;
  }

  toast.error("Error en la verificación");
}  finally {
            setIsSubmitting(false);
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
