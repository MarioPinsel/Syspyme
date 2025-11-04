import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import api from "../config/axios";
import "../styles/LoginView.css";

export default function VerificationView() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { codigo: "" },
  });

  const handleVerification = async (formData) => {
    try {
    
      const { data } = await api.post('http://localhost:4000/auth/verify', formData);
      toast.success(data.message || "Código verificado correctamente");
      
  
      
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Ocurrió un error al verificar el código");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Codigo de Verificación</h2>

        <form onSubmit={handleSubmit(handleVerification)}>
          <label>Código de Verificación</label>
          <input
            type="text"
            maxLength="6"
            {...register("codigo", {
              required: "El código es obligatorio",
              pattern: {
                value: /^[0-9]{6}$/,
                message: "El código debe tener 6 dígitos numéricos",
              },
            })}
            placeholder="123456"
          />
          {errors.codigo && (
            <p className="error-message">{errors.codigo.message}</p>
          )}

          <button type="submit">Verificar</button>
        </form>

        <p className="register-redirect">
          ¿No recibiste el código?{" "}
          <a href=" " className="register-link">
            Reenviar código
          </a>
        </p>
      </div>
    </div>
  );
}
