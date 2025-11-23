import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../../config/axios.js";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Layouts/Auth.css";
import { useState } from "react";

export default function CompanyRegisterView() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    nombre: "",
    nit: "",
    correo: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues, mode: "onChange" });

  const handleRegister = async (formData) => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  try {
    const { data } = await api.post("/auth/registerEmpresa", formData);

    const token = data.token;

    Cookies.set("token", token, {
      expires: 1 / 96,
      path: "/",
      secure: true,
      sameSite: "lax",
    });

    toast.success(data.message);
    navigate("/auth/companyRegisterVerify");

  } catch (error) {

    if (isAxiosError(error) && error.response) {

      // 🟣 express-validator
      if (error.response.data.errors) {
        toast.error(error.response.data.errors[0].msg);
        return;
      }

      // 🟢 backend (controladores)
      if (error.response.data.error) {
        toast.error(error.response.data.error);
        return;
      }
    }

    toast.error("Error al registrar la empresa");

  } finally {
    setIsSubmitting(false);
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
              maxLength: {
                value: 50,
                message: "El nombre no puede tener más de 50 caracteres",
              },
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
              pattern: {
                value: /^[0-9]{10}$/,
                message: "El NIT debe tener exactamente 10 números",
              },
            })}
            placeholder="1234567890"
          />
          {errors.nit && (
            <p className="error-message">{errors.nit.message}</p>
          )}

   
          <label>Correo Electrónico</label>
          <input
            type="email"
            {...register("correo", {
              required: "El correo electrónico es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "El correo no tiene un formato válido",
              },
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
              pattern: {
                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                message:
                  "La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo",
              },
            })}
            placeholder="********"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}

     
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar Empresa"}
          </button>
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
