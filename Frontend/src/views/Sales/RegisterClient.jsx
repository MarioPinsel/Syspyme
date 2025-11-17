import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../../config/axios";
import "../../styles/Sales/RegisterClient.css";
import { useNavigate } from "react-router-dom";

export default function RegisterClient() {
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      document: "",
      phone: "",
      email: "",
    },
  });

  const handleRegisterClient = async (formData) => {
    console.log(formData)
    try {
      const token = Cookies.get("token");

      const { data } = await api.post("/customers/createCustomer", formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      navigate("/sales")
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <div className="cliente-container">
      <h2 className="titulo">Registrar Cliente</h2>

      <form className="cliente-form" onSubmit={handleSubmit(handleRegisterClient)}>

        <div className="campo">
          <label htmlFor="name">Nombre Completo:</label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "El nombre es obligatorio" })}
            placeholder="Ej: Santiago Ramirez"
          />
          {errors.nombre && <p className="error-message">{errors.nombre.message}</p>}
        </div>

        <div className="campo">
          <label htmlFor="document">Cédula:</label>
          <input
            type="text"
            id="document"
            {...register("document", { required: "La cédula es obligatoria" })}
            placeholder="Ej: 1012345678"
          />
          {errors.cedula && <p className="error-message">{errors.cedula.message}</p>}
        </div>

        <div className="campo">
          <label htmlFor="email">Correo:</label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "El correo es obligatorio" })}
            placeholder="Ej: correo@ejemplo.com"
          />
          {errors.correo && <p className="error-message">{errors.correo.message}</p>}
        </div>

        <div className="campo">
          <label htmlFor="phone">Celular:</label>
          <input
            type="text"
            id="phone"
            {...register("phone", { required: "El celular es obligatorio" })}
            placeholder="Ej: 3001234567"
          />
          {errors.celular && <p className="error-message">{errors.celular.message}</p>}
        </div>

        <button type="submit" className="btn-enviar">Registrar</button>
      </form>
    </div>
  );
}
