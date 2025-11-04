import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import api from "../config/axios";
import "../styles/LoginView.css";

export default function LoginView() {
  const initialValues = {
    companyName: "",
    companyPassword: "",
    username: "",
    userPassword: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const handleLogin = async (formData) => {
    try {
      const { data } = await api.post(`/auth/login`, formData);
      localStorage.setItem("AUTH_TOKEN", data);
      toast.success("Inicio de sesión exitoso");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Ocurrió un error al iniciar sesión");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit(handleLogin)}>
         
          <label>Nombre de la Empresa</label>
          <input
            type="text"
            {...register("companyName", {
              required: "El nombre de la empresa es obligatorio",
            })}
            placeholder="empresa de ejemplo S.A.S"
          />
          {errors.companyName && (
            <p className="error-message">{errors.companyName.message}</p>
          )}

    
          <label>Contraseña de la Empresa</label>
          <input
            type="password"
            {...register("companyPassword", {
              required: "La contraseña de la empresa es obligatoria",
            })}
            placeholder="********"
          />
          {errors.companyPassword && (
            <p className="error-message">{errors.companyPassword.message}</p>
          )}

    
          <label>Usuario</label>
          <input
            type="text"
            {...register("username", {
              required: "El nombre de usuario es obligatorio",
            })}
            placeholder="usuario123"
          />
          {errors.username && (
            <p className="error-message">{errors.username.message}</p>
          )}

    
          <label>Contraseña del Usuario</label>
          <input
            type="password"
            {...register("userPassword", {
              required: "La contraseña del usuario es obligatoria",
            })}
            placeholder="********"
          />
          {errors.userPassword && (
            <p className="error-message">{errors.userPassword.message}</p>
          )}

          <button type="submit">Continuar</button>
        </form>

        <p className="register-redirect">
          ¿No tienes una cuenta?{" "}
          <a href="/auth/register" className="register-link">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}
