import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import api from "../config/axios";
import "../styles/LoginView.css";
import { FaChampagneGlasses } from "react-icons/fa6";

export default function LoginView() {
  const initialValues = {
    empresa: "",
    empresaPassword: "",
    usuario: "",
    password: "",
  };

  const { register, handleSubmit, formState: { errors }, } = useForm({ defaultValues: initialValues, });

  const handleLogin = async (formData) => {
    console.log('Axios baseURL =', api.defaults.baseURL);
    console.log('Posting to', `${api.defaults.baseURL}/auth/login`, 'payload=', formData);
    try {
      const { data } = await api.post('http://localhost:4000/auth/login', formData);
      toast.success("Inicio de sesión exitoso");
    } catch (error) {
      console.error('login error', error?.response ?? error);
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


          <label>Usuario</label>
          <input
            type="text"
            {...register("usuario", {
              required: "El nombre de usuario es obligatorio",
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
          ¿No tienes una cuenta?{" "}
          <a href="/auth/register" className="register-link">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}