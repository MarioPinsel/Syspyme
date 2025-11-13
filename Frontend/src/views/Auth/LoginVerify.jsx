import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "../../styles/Layouts/Verify.css";

export default function VerificationCode() {
  const [code, setCode] = useState(Array(6).fill(""));

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

    console.log("Código ingresado:", fullCode);
    console.log("Token obtenido:", token);

    if (!token) {
      console.error("No se encontró el token");
      return;
    }

    try {
      const { data } = await axios.post("/auth/loginVerify", { code: fullCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Respuesta del backend:", data);
    } catch (error) {
      console.error("Error en la verificación:", error);
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-box">
        <h2>Código de Verificación</h2>
        <p className="verification-instructions">
          Revisa en la bandeja de tu correo electrónico por el código de verificación.
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
              />
            ))}
          </div>

          <button type="submit">Verificar</button>
        </form>
      </div>
    </div>
  );
}
