import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../../config/axios";
import "../../styles/LoginView.css";
export default function LoginView() {
  const initialValues = {
    empresa: "",
    empresaPassword: "",
    usuario: "",
    password: "",
  };

  const { register, handleSubmit, formState: { errors }, } = useForm({ defaultValues: initialValues, });

  const handleLogin = async (formData) => {
    try {
      const { data } = await api.post('/auth/login', formData);
      const token = data.token;

      const expiration = new Date(new Date().getTime() + 15 * 60 * 1000);

      Cookies.set("token", token, {
        expires: expiration,
        path: "/auth",
        secure: true,
        sameSite: "lax"
      });

      toast.success(data.message);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error)
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit(handleLogin)}>

          <label>Nombre de la Empresa</label>
          <input
            type="text"
            {...register("empresa", {
              required: "El nombre de la empresa es obligatorio",
            })}
            placeholder="empresa de ejemplo S.A.S"
          />
          {errors.empresa && (
            <p className="error-message">{errors.empresa.message}</p>
          )}


          <label>Contraseña de la Empresa</label>
          <input
            type="password"
            {...register("empresaPassword", {
              required: "La contraseña de la empresa es obligatoria",
            })}
            placeholder="********"
          />
          {errors.empresaPassword && (
            <p className="error-message">{errors.empresaPassword.message}</p>
          )}


          <label>Usuario o Email</label>
          <input
            type="text"
            {...register("usuario", {
              required: "El nombre de usuario ó el Email es obligatorio",
            })}
            placeholder="usuario123"
          />
          {errors.usuario && (
            <p className="error-message">{errors.usuario.message}</p>
          )}


          <label>Contraseña del Usuario</label>
          <input
            type="password"
            {...register("password", {
              required: "La contraseña del usuario es obligatoria",
            })}
            placeholder="********"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}

          <button type="submit">Continuar</button>
        </form>

        <p className="register-redirect">
          ¿No has registrado tu empresa?{" "}
          <a href="/auth/register" className="register-link">
            Regístrala aquí
          </a>
        </p>
      </div>
    </div>
  );
}