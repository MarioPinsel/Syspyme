import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../../config/axios";
import "../../styles/Sales/RegisterClient.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export default function RegisterClient() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      document: "",
      phone: "",
      email: "",
    },
  });

  const handleRegisterClient = async (formData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const token = Cookies.get("token")
      const { role } = jwtDecode(token);

      const { data } = await api.post("/customers/createCustomer", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(data.message);
          if (role === "admin") {
      navigate("/dashboard");
    } else if (role === "employee") {
      navigate("/employee");
    }
   } catch (error) {
  let backendMessage = "Error registrando cliente";

  if (isAxiosError(error) && error.response) {
    const data = error.response.data;

    if (typeof data === "string") {
      backendMessage = data;
    } else if (data?.message) {
      backendMessage = data.message;
    } else if (data?.error) {
      backendMessage = data.error;
    }
  }

  toast.error(backendMessage);
}finally {
      setIsSubmitting(false);
  };
}
  return (
    <div className="cliente-container">
      <h2 className="titulo">Registrar Cliente</h2>

      <form className="cliente-form" onSubmit={handleSubmit(handleRegisterClient)}>

      
        <div className="campo">
          <label htmlFor="name">Nombre Completo:</label>
          <input
            type="text"
            id="name"
            {...register("name", {
              required: "El nombre es obligatorio",
              minLength: { value: 3, message: "Debe tener al menos 3 caracteres" },
            })}
            placeholder="Ej: Santiago Ramirez"
          />
          {errors.name && (
            <p className="error-message">{errors.name.message}</p>
          )}
        </div>

        <div className="campo">
          <label htmlFor="document">Cédula:</label>
          <input
            type="text"
            id="document"
            {...register("document", {
              required: "La cédula es obligatoria",
              pattern: {
                value: /^[0-9]+$/,
                message: "Solo se permiten números",
              },
            })}
            placeholder="Ej: 1012345678"
          />
          {errors.document && (
            <p className="error-message">{errors.document.message}</p>
          )}
        </div>


        <div className="campo">
          <label htmlFor="email">Correo:</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Formato de correo inválido",
              },
            })}
            placeholder="Ej: correo@ejemplo.com"
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

     
        <div className="campo">
          <label htmlFor="phone">Celular:</label>
          <input
            type="text"
            id="phone"
            {...register("phone", {
              required: "El celular es obligatorio",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Debe tener 10 dígitos",
              },
            })}
            placeholder="Ej: 3001234567"
          />
          {errors.phone && (
            <p className="error-message">{errors.phone.message}</p>
          )}
        </div>

        <button type="submit" className="btn-enviar" disabled={isSubmitting}>
          {isSubmitting ? <div className="spinner"></div> : "Registrar"}
        </button>
      </form>
    </div>
  );
}
