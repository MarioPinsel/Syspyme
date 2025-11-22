import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../../config/axios";
import "../../styles/Layouts/Auth.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RegisterView() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    nombre: "",
    correo: "",
    handle: "",
    password: "",
  };

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const handleRegister = async (formData) => {
    if (isLoading) return; // evitar doble submit
    setIsLoading(true);

    try {
      const token = Cookies.get("token");

      const { data } = await api.post("/auth/registerUser", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      window.location.reload();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Error registrando el usuario");
      }
    } finally {
      setIsLoading(false);
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
              minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
              maxLength: { value: 50, message: "Máximo 50 caracteres" },
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
              maxLength: { value: 50, message: "Máximo 50 caracteres" },
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
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 20, message: "Máximo 20 caracteres" },
            })}
            placeholder="Ej: admin123"
          />
          {errors.handle && (
            <p className="error-message">{errors.handle.message}</p>
          )}

   
          <label>Contraseña del Administrador</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "La contraseña es obligatoria",
                pattern: {
                  value: passwordRegex,
                  message:
                    "Debe tener 8+ caracteres, una mayúscula, una minúscula, un número y un símbolo",
                },
              })}
              placeholder="********"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}

          
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
