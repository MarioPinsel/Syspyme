import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import api from "../config/axios";
import "../styles/LoginVerification.css";
import { useRef } from "react";

export default function VerificationView() {
  const { handleSubmit } = useForm();
  const inputsRef = useRef([]);

  const handleVerification = async () => {

    const codigo = inputsRef.current.map((input) => input.value).join("");

    if (codigo.length !== 6 || !/^[0-9]{6}$/.test(codigo)) {
      toast.error("El código debe tener 6 dígitos numéricos");
      return;
    }

    try {
      const { data } = await api.post("http://localhost:4000/auth/verify", { codigo });
      toast.success(data.message || "Código verificado correctamente");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Ocurrió un error al verificar el código");
      }
    }
  };

  const handleInput = (e, index) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, ""); 
    if (e.target.value && index < 5) {
      inputsRef.current[index + 1].focus(); 
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus(); 
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-box">
        <h2>Código de Verificación</h2>
        <p className="verification-instructions">
          Revisa en la bandeja de tu correo electrónico por el código de verificación.
        </p>

        <form onSubmit={handleSubmit(handleVerification)}>
          <label>Código de Verificación</label>

          <div className="verification-code">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputsRef.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="code-input"
              />
            ))}
          </div>

          <button type="submit">Verificar</button>
        </form>

        <p className="register-redirect">
          ¿No recibiste el código?{" "}
          <a href="#" className="register-link">
            Reenviar código
          </a>
        </p>
      </div>
    </div>
  );
}

