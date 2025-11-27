import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { isAxiosError } from "axios";
import api from "../../config/axios";
import { toast } from "sonner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "../Layouts/NewCompanyRegisterView.css";

export default function RegisterCompany() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    tipoEmpresa: "empresa",
    nombreComercial: "",
    nit: "",
    correoEmpresa: "",
    password: "",
    direccion: "",
    telefono: "",
    tipoRegimen: "",
    nombreRepresentante: "",
    correoRepresentante: "",
    telefonoRepresentante: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: initialValues, mode: "onChange" });

  const tipoEmpresa = watch("tipoEmpresa");

  const handleRegister = async (formData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const normalizedData = {
      tipoEmpresa: formData.tipoEmpresa,
      nombreComercial: formData.nombreComercial.trim().toLowerCase(),
      nit: formData.nit.trim(),
      correoEmpresa: formData.correoEmpresa.trim().toLowerCase(),
      password: formData.password.trim(),
      direccion: formData.direccion.trim(),
      telefono: formData.telefono.trim(),
      tipoRegimen: formData.tipoRegimen,
      representante: {
        nombre: formData.nombreRepresentante.trim(),
        correo: formData.correoRepresentante.trim().toLowerCase(),
        telefono: formData.telefonoRepresentante.trim(),
      },
    };

    try {
      const { data } = await api.post("/auth/registerEmpresa", normalizedData);

      const token = data.token;

      Cookies.set("token", token, {
        expires: 1 / 96,
        path: "/",
        secure: true,
        sameSite: "lax",
      });

      toast.success(data.message || "Empresa registrada con éxito");
      navigate("/auth/companyRegisterVerify");

    } catch (error) {
      if (isAxiosError(error) && error.response) {
        // express-validator
        if (error.response.data.errors) {
          toast.error(error.response.data.errors[0].msg);
          return;
        }

        // backend (controladores)
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
    <div className="register-company-container">
      <h1 className="register-title">Registro de Empresa</h1>

      <form onSubmit={handleSubmit(handleRegister)} className="register-form">
        
    
        <div className="form-section">
          <h2>Datos empresa</h2>

          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="empresa"
                {...register("tipoEmpresa")}
              />
              Empresa
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="persona-natural"
                {...register("tipoEmpresa")}
              />
              Persona Natural
            </label>
          </div>

          <div className="form-field">
            <label>Nombre comercial *</label>
            <input
              type="text"
              {...register("nombreComercial", {
                required: "El nombre comercial es obligatorio",
                maxLength: {
                  value: 50,
                  message: "El nombre no puede tener más de 50 caracteres",
                },
              })}
              placeholder="Ej: Mi Empresa SAS"
            />
            {errors.nombreComercial && (
              <p className="error-message">{errors.nombreComercial.message}</p>
            )}
          </div>

          <div className="form-field">
            <label>NIT *</label>
            <input
              type="text"
              {...register("nit", {
                required: "El NIT es obligatorio",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "El NIT debe tener exactamente 10 números",
                },
              })}
              placeholder="Ej: 1234567890"
            />
            {errors.nit && <p className="error-message">{errors.nit.message}</p>}
          </div>

          <div className="form-field">
            <label>Correo Empresa *</label>
            <input
              type="email"
              {...register("correoEmpresa", {
                required: "El correo electrónico es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "El correo no tiene un formato válido",
                },
              })}
              placeholder="empresa@ejemplo.com"
            />
            {errors.correoEmpresa && (
              <p className="error-message">{errors.correoEmpresa.message}</p>
            )}
          </div>

          <div className="form-field">
            <label>Contraseña *</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                    message:
                      "Mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo",
                  },
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
          </div>

          <div className="form-field">
            <label>Dirección</label>
            <input
              type="text"
              {...register("direccion")}
              placeholder="Calle 123 #45-67"
            />
          </div>

          <div className="form-field">
            <label>Teléfono</label>
            <input
              type="tel"
              {...register("telefono", {
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "El teléfono debe tener 10 dígitos",
                },
              })}
              placeholder="3001234567"
            />
            {errors.telefono && (
              <p className="error-message">{errors.telefono.message}</p>
            )}
          </div>
        </div>


        <div className="form-section">
          <h2>Datos tributario</h2>

          <div className="form-field">
            <label>Tipo régimen *</label>
            <select
              {...register("tipoRegimen", {
                required: "Debes seleccionar un régimen tributario",
              })}
            >
              <option value="">Selecciona un régimen</option>
              <option value="Responsable">Responsable de IVA</option>
              <option value="no responsable">No responsable</option>
            </select>
            {errors.tipoRegimen && (
              <p className="error-message">{errors.tipoRegimen.message}</p>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2>Representante</h2>

          <div className="form-row">
            <div className="form-field">
              <label>Nombre</label>
              <input
                type="text"
                {...register("nombreRepresentante")}
                placeholder="Juan Pérez"
              />
            </div>

            <div className="form-field">
              <label>Teléfono</label>
              <input
                type="tel"
                {...register("telefonoRepresentante", {
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "El teléfono debe tener 10 dígitos",
                  },
                })}
                placeholder="3001234567"
              />
              {errors.telefonoRepresentante && (
                <p className="error-message">{errors.telefonoRepresentante.message}</p>
              )}
            </div>
          </div>

          <div className="form-field">
            <label>Correo</label>
            <input
              type="email"
              {...register("correoRepresentante", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "El correo no tiene un formato válido",
                },
              })}
              placeholder="representante@ejemplo.com"
            />
            {errors.correoRepresentante && (
              <p className="error-message">{errors.correoRepresentante.message}</p>
            )}
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? <div className="spinner"></div> : "Registrar Empresa"}
        </button>
      </form>

      <p className="auth-redirect">
        ¿Tu empresa ya está registrada?{" "}
        <Link to="/auth/login" className="auth-link">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}