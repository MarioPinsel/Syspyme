import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { isAxiosError } from "axios";
import api from "../../config/axios";
import { toast } from "sonner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "../../styles/Layouts/NewCompanyRegisterView.css";

export default function RegisterCompany() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [nitValidation, setNitValidation] = useState({
    min: 9,
    max: 11,
    message: "El NIT debe tener entre 9 y 11 números"
  });

  const initialValues = {
    tipoEmpresa: "empresa",
    nombre: "",               
    nit: "",
    correo: "",               
    password: "",
    direccion: "",
    telefono: "",
    regimen: "",              
    nombreAdmin: "",        
    correoAdmin: "",         
    telefonoAdmin: "",        
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: initialValues, mode: "onChange" });

  const tipoEmpresa = watch("tipoEmpresa");

  // Efecto para cambiar la validación del NIT según el tipo de empresa
  useEffect(() => {
    if (tipoEmpresa === "persona-natural") {
      setNitValidation({
        min: 9,
        max: 10,
        message: "El NIT para persona natural debe tener entre 9 y 10 números"
      });
    } else {
      setNitValidation({
        min: 10,
        max: 11,
        message: "El NIT para empresa debe tener entre 10 y 11 números"
      });
    }
  }, [tipoEmpresa]);

  const handleRegister = async (formData) => {
    if (isSubmitting) return;
    
    if (!acceptedTerms) {
      toast.error("Debes aceptar los términos y condiciones para continuar");
      return;
    }
    
    setIsSubmitting(true);

    const normalizedData = {
      tipoEmpresa: formData.tipoEmpresa,
      nombre: formData.nombre.trim(),
      nit: formData.nit.trim(),
      correo: formData.correo.trim().toLowerCase(),
      direccion: formData.direccion.trim(),
      telefono: formData.telefono.trim(),
      regimen: formData.regimen,

      nombreAdmin: formData.nombreAdmin.trim(),
      correoAdmin: formData.correoAdmin.trim().toLowerCase(),
      telefonoAdmin: formData.telefonoAdmin.trim(),
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
        if (error.response.data.errors) {
          toast.error(error.response.data.errors[0].msg);
          return;
        }
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
              <input type="radio" value="empresa" {...register("tipoEmpresa")} />
              Empresa
            </label>
            <label className="radio-label">
              <input type="radio" value="persona-natural" {...register("tipoEmpresa")} />
              Persona Natural
            </label>
          </div>

          <div className="form-field">
            <label>Nombre comercial *</label>
            <input
              type="text"
              {...register("nombre", {
                required: "El nombre comercial es obligatorio",
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
              })}
              placeholder="Ej: Mi Empresa SAS"
            />
            {errors.nombre && <p className="error-message">{errors.nombre.message}</p>}
          </div>

          <div className="form-field">
            <label>NIT *</label>
            <input
              type="text"
              {...register("nit", {
                required: "El NIT es obligatorio",
                pattern: {
                  value: new RegExp(`^[0-9]{${nitValidation.min},${nitValidation.max}}$`),
                  message: nitValidation.message,
                },
              })}
              placeholder={tipoEmpresa === "persona-natural" ? "9-10 dígitos" : "10-11 dígitos"}
            />
            {errors.nit && <p className="error-message">{errors.nit.message}</p>}
          </div>

          <div className="form-field">
            <label>Correo Empresa *</label>
            <input
              type="email"
              {...register("correo", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo inválido",
                },
              })}
              placeholder="empresa@ejemplo.com"
            />
            {errors.correo && <p className="error-message">{errors.correo.message}</p>}
          </div>

          <div className="form-field">
            <label>Contraseña *</label>
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
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          <div className="form-field">
            <label>Dirección *</label>
            <input 
              type="text" 
              {...register("direccion", {
                required: "La dirección es obligatoria",
                minLength: { value: 5, message: "La dirección debe tener al menos 5 caracteres" }
              })} 
              placeholder="Calle 123 #45-67" 
            />
            {errors.direccion && <p className="error-message">{errors.direccion.message}</p>}
          </div>

          <div className="form-field">
            <label>Teléfono *</label>
            <input
              type="tel"
              {...register("telefono", {
                required: "El teléfono es obligatorio",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "El teléfono debe tener 10 dígitos",
                },
              })}
              placeholder="3001234567"
            />
            {errors.telefono && <p className="error-message">{errors.telefono.message}</p>}
          </div>
        </div>

        <div className="form-section">
          <h2>Datos tributarios</h2>

          <div className="form-field">
            <label>Tipo régimen *</label>
            <select
              {...register("regimen", { required: "Debes seleccionar un régimen" })}
            >
              <option value="">Selecciona un régimen</option>
              <option value="Responsable">Responsable de IVA</option>
              <option value="No responsable">No responsable</option>
            </select>
            {errors.regimen && <p className="error-message">{errors.regimen.message}</p>}
          </div>
        </div>

        <div className="form-section">
          <h2>Representante *</h2>

          <div className="form-row">
            <div className="form-field">
              <label>Nombre *</label>
              <input 
                type="text" 
                {...register("nombreAdmin", {
                  required: "El nombre del representante es obligatorio"
                })} 
                placeholder="Juan Pérez" 
              />
              {errors.nombreAdmin && <p className="error-message">{errors.nombreAdmin.message}</p>}
            </div>

            <div className="form-field">
              <label>Teléfono *</label>
              <input
                type="tel"
                {...register("telefonoAdmin", {
                  required: "El teléfono del representante es obligatorio",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "El teléfono debe tener 10 dígitos",
                  },
                })}
                placeholder="3001234567"
              />
              {errors.telefonoAdmin && <p className="error-message">{errors.telefonoAdmin.message}</p>}
            </div>
          </div>

          <div className="form-field">
            <label>Correo *</label>
            <input
              type="email"
              {...register("correoAdmin", {
                required: "El correo del representante es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo inválido",
                },
              })}
              placeholder="representante@ejemplo.com"
            />
            {errors.correoAdmin && <p className="error-message">{errors.correoAdmin.message}</p>}
          </div>
        </div>

        {/* Botón para ver términos y condiciones */}
        <div className="terms-section">
          <button 
            type="button" 
            className="btn-terms-view"
            onClick={() => setShowTerms(true)}
          >
            📄 Ver Términos y Condiciones
          </button>

          <div className="terms-acceptance">
            <label className="terms-checkbox">
              <input 
                type="checkbox" 
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <span>He leído y acepto los términos y condiciones</span>
            </label>
          </div>
          
          {!acceptedTerms && (
            <p className="terms-warning">
              Debes aceptar los términos y condiciones para continuar
            </p>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-submit" 
          disabled={isSubmitting || !acceptedTerms}
        >
          {isSubmitting ? <div className="spinner"></div> : "Registrar Empresa"}
        </button>
      </form>

      <p className="auth-redirect">
        ¿Tu empresa ya está registrada?{" "}
        <Link to="/auth/login" className="auth-link">
          Inicia sesión aquí
        </Link>
      </p>

      {/* Modal de Términos y Condiciones */}
      {showTerms && (
        <div className="terms-modal-overlay">
          <div className="terms-modal">
            <div className="terms-modal-header">
              <h3>Términos y Condiciones - SysPyme</h3>
              <button 
                className="terms-modal-close"
                onClick={() => setShowTerms(false)}
              >
                ×
              </button>
            </div>
            
            <div className="terms-modal-content">
              <p>
                Al registrarse en <strong>SysPyme</strong>, usted acepta expresamente 
                los siguientes términos y condiciones:
              </p>

              <h4>📋 Aceptación de Términos</h4>
              <p>
                El uso de nuestros servicios implica la aceptación plena de estos términos 
                y condiciones, así como de nuestras políticas de privacidad.
              </p>

              <h4>🔐 Protección de Datos</h4>
              <p>
                Nos comprometemos a proteger sus datos según la <strong>Ley 1581 de 2012</strong> 
                y el <strong>Decreto 1377 de 2013</strong>. Sus datos serán utilizados 
                exclusivamente para los fines del servicio.
              </p>

              <h4>📊 Facturación Electrónica</h4>
              <p>
                Nuestro servicio cumple con la normativa de la DIAN, específicamente 
                la <strong>Resolución 020 de 2019</strong> y <strong>Resolución 042 de 2020</strong> 
                sobre facturación electrónica.
              </p>

              <h4>⚖️ Responsabilidades</h4>
              <p>
                Usted es responsable de:
              </p>
              <ul>
                <li>La veracidad de la información proporcionada</li>
                <li>Mantener la confidencialidad de sus credenciales</li>
                <li>El uso adecuado del sistema según la normativa colombiana</li>
                <li>La actualización de sus datos cuando sea necesario</li>
              </ul>

              <h4>📄 Propiedad de la Información</h4>
              <p>
                Usted conserva la propiedad completa de sus datos comerciales y contables. 
                SysPyme actúa como procesador de esta información.
              </p>

              <h4>🚫 Uso Prohibido</h4>
              <p>
                No está permitido utilizar el servicio para actividades ilegales, 
                fraudulentas o que violen la normativa colombiana.
              </p>

              <h4>🔍 Verificación DIAN</h4>
              <p>
                Toda empresa registrada será sometida a verificación ante la DIAN. 
                El proceso puede tomar de 24 a 72 horas hábiles.
              </p>

              <div className="legal-notice">
                <p>
                  <strong>Nota Legal:</strong> Este servicio se rige por las leyes de la 
                  República de Colombia. Cualquier disputa será resuelta en los tribunales 
                  competentes de Bogotá, D.C.
                </p>
              </div>
            </div>

            <div className="terms-modal-footer">
              <button 
                className="btn-terms-accept"
                onClick={() => {
                  setAcceptedTerms(true);
                  setShowTerms(false);
                }}
              >
                Aceptar Términos
              </button>
              <button 
                className="btn-terms-close"
                onClick={() => setShowTerms(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}