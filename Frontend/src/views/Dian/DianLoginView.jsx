import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../../config/axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Layouts/Auth.css";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginDIAN() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    usuario: "",
    password: "",
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues,
  });

  const handleLogin = async (formData) => {
    setLoading(true);

    const normalizedData = {
      usuario: formData.usuario.trim().toLowerCase(),
      password: formData.password.trim(),
    };

    try {
      const { data } = await api.post('/dian/login', normalizedData);
      const token = data.token;

      const expiration = new Date(new Date().getTime() + 15 * 60 * 1000);

      Cookies.set("token", token, {
        expires: expiration,
        path: "/",
        secure: true,
        sameSite: "lax"
      });

      toast.success(data.message);
      navigate("/dian");
      window.location.reload();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        if (error.response.data.errors) {
          toast.error(error.response.data.errors[0].msg);
          return;
        }
        if (error.response.data.error) {
          toast.error(error.response.data.error);
          return;
        }
      }
      toast.error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Iniciar Sesión - DIAN</h2>

        <form onSubmit={handleSubmit(handleLogin)}>

          <label>Usuario</label>
          <input
            type="text"
            {...register("usuario", {
              required: "El usuario es obligatorio",
            })}
            placeholder="usuario123"
          />
          {errors.usuario && (
            <p className="error-message">{errors.usuario.message}</p>
          )}

          <label>Contraseña</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
              placeholder="********"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}

          <button type="submit" disabled={loading} className={loading ? "loading" : ""}>
            {loading ? (
              <>
                <span className="spinner"></span> Cargando...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}