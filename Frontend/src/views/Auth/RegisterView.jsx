import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../../config/axios";
import "../../styles/Layouts/Auth.css";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterView() {
  const navigate = useNavigate();

  const initialValues = {
    nombre: "",
    correo: "",
    handle: "",
    password: "",
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues,
  });

  const handleRegister = async (formData) => {
    try {
      const token = Cookies.get("token")

      const { data } = await api.post(
        "/auth/registerUser",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newToken = data?.token;


      if (newToken) {
        Cookies.set("token", newToken, {
          expires: 1 / 96,
          path: "/auth",
          secure: true,
          sameSite: "lax",
        });
      }

      toast.success(data.message);
      navigate("/auth/registerVerify");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Registrar Administrador</h2>

        <form onSubmit={handleSubmit(handleRegister)}>
          <label>Nombre del Administrador</label>
          <input
            type="text"
            {...register("nombre", {
              required: "El nombre del administrador es obligatorio",
            })}
            placeholder="Ej: Juan Pérez"
          />
          {errors.nombre && (
            <p className="error-message">{errors.nombre.message}</p>
          )}

          <label>Correo del Administrador</label>
          <input
            type="email"
            {...register("correo", {
              required: "El correo del administrador es obligatorio",
            })}
            placeholder="Ej: admin@empresa.com"
          />
          {errors.correo && (
            <p className="error-message">{errors.correo.message}</p>
          )}

          <label>Handle o Identificador</label>
          <input
            type="text"
            {...register("handle", {
              required: "El identificador es obligatorio",
            })}
            placeholder="Ej: admin123"
          />
          {errors.handle && (
            <p className="error-message">{errors.handle.message}</p>
          )}

          <label>Contraseña del Administrador</label>
          <input
            type="password"
            {...register("password", {
              required: "La contraseña del administrador es obligatoria",
            })}
            placeholder="********"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}

          <button type="submit">Registrar</button>
        </form>
      </div>
    </div>
  );
}
