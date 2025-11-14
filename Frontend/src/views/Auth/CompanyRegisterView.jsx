import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../../config/axios.js"
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Auth.css";

export default function CompanyRegisterView() {
  const navigate = useNavigate();

  const initialValues = {
    nombre: "",
    nit: "",
    correo: "",
    password: "",
  };

  const { register, handleSubmit, formState: { errors }, } = useForm({ defaultValues: initialValues });

  const handleRegister = async (formData) => {
    try {
      const { data } = await api.post("/auth/registerEmpresa", formData);
      const token = data.token;

      Cookies.set("token", token, {
        expires: 1 / 96,
        path: "/auth",
        secure: true,
        sameSite: "lax",
      });

      toast.success(data.message);
      navigate("/auth/companyRegisterVerify");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Error al registrar la empresa");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Registro de Empresa</h2>

        <form onSubmit={handleSubmit(handleRegister)}>
          <label>Nombre de la Empresa</label>
          <input
            type="text"
            {...register("nombre", {
              required: "El nombre de la empresa es obligatorio",
            })}
            placeholder="Ejemplo S.A.S"
          />
          {errors.nombre && (
            <p className="error-message">{errors.nombre.message}</p>
          )}

          <label>NIT</label>
          <input
            type="text"
            {...register("nit", {
              required: "El NIT es obligatorio",
            })}
            placeholder="123456789-0"
          />
          {errors.nit && (
            <p className="error-message">{errors.nit.message}</p>
          )}

          <label>Correo Electrónico</label>
          <input
            type="email"
            {...register("correo", {
              required: "El correo electrónico es obligatorio",
            })}
            placeholder="empresa@ejemplo.com"
          />
          {errors.correo && (
            <p className="error-message">{errors.correo.message}</p>
          )}

          <label>Contraseña</label>
          <input
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
            })}
            placeholder="********"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}

          <button type="submit">Registrar Empresa</button>
        </form>

        <p className="auth-redirect">
          ¿Tu empresa ya está registrada?{" "}
          <Link to="/auth/login" className="auth-link">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
