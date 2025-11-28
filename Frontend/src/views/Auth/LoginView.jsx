import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../../config/axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Layouts/Auth.css";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showEmpresaPassword, setShowEmpresaPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    empresa: "",
    empresaPassword: "",
    usuario: "",
    password: "",
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues,
  });

  const handleLogin = async (formData) => {
    setLoading(true);

    const normalizedData = {
      empresa: formData.empresa.trim().toLowerCase(),
      empresaPassword: formData.empresaPassword.trim(), 
      usuario: formData.usuario.trim().toLowerCase(),
      password: formData.password.trim(),
    };
    try {
      const { data } = await api.post('/auth/login', normalizedData);
      const token = data.token;

      const expiration = new Date(new Date().getTime() + 15 * 60 * 1000);

      Cookies.set("token", token, {
        expires: expiration,
        path: "/auth",
        secure: true,
        sameSite: "lax"
      });

      toast.success(data.message);
      navigate("/auth/loginVerify");
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleSubmit(handleLogin)}>

          <label>Nombre de la Empresa</label>
          <input
            type="text"
            {...register("empresa", {
              required: "El nombre de la empresa es obligatorio",
            })}
            placeholder="Empresa de ejemplo S.A.S"
          />
          {errors.empresa && (
            <p className="error-message">{errors.empresa.message}</p>
          )}

          <label>Contraseña de la Empresa</label>

       
          <div className="password-field">
            <input
              type={showEmpresaPassword ? "text" : "password"}
              {...register("empresaPassword", {
                required: "La contraseña de la empresa es obligatoria",
              })}
              placeholder="********"
            />

        
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowEmpresaPassword(!showEmpresaPassword)}
            >
              {showEmpresaPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

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

          
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"} 
              {...register("password", {
                required: "La contraseña del usuario es obligatoria",
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
              "Continuar"
            )}
          </button>

        </form>

        <p className="auth-redirect">
          ¿No has registrado tu empresa?{" "}
          <Link to="/auth/companyRegister" className="auth-link">
            Regístrala acá
          </Link>
        </p>
      </div>
    </div>
  );
}
