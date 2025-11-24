import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Cookies from "js-cookie";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import "../../styles/Inventory/CreateProduct.css"
import { useState } from "react";
import { isAxiosError } from "axios";

export default function CreateProductView() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const initialValues = {
    type: "",
    description: "",
    unitPrice: "",
    quantity: "",
    code: ""
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues,
  });

const handleCreate = async (formData) => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  const finalData = {
    ...formData,
    description: {
      texto: formData.description?.texto || ""
    }
  };

  try {
    const token = Cookies.get("token");

    const { data } = await api.post(
      "/inventory/createProduct",
      finalData,
      {
        headers: { Authorization: `Bearer ${token}` }
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

    toast.success(data.message || "Operación exitosa");
    navigate("/inventory/");

 } catch (error) {

  if (isAxiosError(error) && error.response) {
    const res = error.response.data;

   
    if (res.errors) {
      toast.error(res.errors[0].msg);
    }

  
    else if (res.message) {
      toast.error(res.message);
    }

    else if (res.error) {
      toast.error(res.error);
    }

    else {
      toast.error("Error inesperado");
    }
  } else {
    toast.error("Error inesperado");
  }

} finally {
  setIsSubmitting(false);  
}
}

  return (
    <main className="page">
      <header className="page-header">
        <h1>Crear producto</h1>
        <p className="subtitle">Rellena los datos del producto.</p>
      </header>

      <form className="product-form" noValidate onSubmit={handleSubmit(handleCreate)}>

        <div className="form-row">
          <label htmlFor="code">Código</label>
          <input
            id="code"
            {...register("code", {
              required: "El código es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: "El código debe ser alfanumérico",
              },
            })}
            type="text"
            placeholder="Ej: ABC123"
          />
          {errors.code && <p className="error">{errors.code.message}</p>}
        </div>

        <div className="form-row">
          <label htmlFor="type">Tipo de producto</label>
          <input
            id="type"
            {...register("type", { required: "El tipo es obligatorio" })}
            type="text"
            placeholder="Ej: Herramienta"
          />
          {errors.type && <p className="error">{errors.type.message}</p>}
        </div>

        <div className="form-grid">
          <div className="form-column">
            <label htmlFor="unitPrice">Precio por unidad (COP)</label>
            <div className="input-prefix">
              <span className="prefix">$</span>

              <input
                id="unitPrice"
                {...register("unitPrice", {
                  required: "El precio es obligatorio",
                  valueAsNumber: true,
                  min: { value: 51, message: "Debe ser mayor a 50" },
                })}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            {errors.unitPrice && <p className="error">{errors.unitPrice.message}</p>}
          </div>

          <div className="form-column">
            <label htmlFor="quantity">Cantidad en inventario</label>
            <input
              id="quantity"
              {...register("quantity", {
                required: "La cantidad es obligatoria",
                valueAsNumber: true,
                min: { value: 1, message: "Debe ser mayor a 0" }
              })}
              type="number"
              placeholder="0"
            />
            {errors.quantity && <p className="error">{errors.quantity.message}</p>}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            {...register("description.texto", {
              required: "La descripción es obligatoria"
            })}
            placeholder="Descripción corta del producto"
            rows={3}
          />
          {errors.description?.texto && (
            <p className="error">{errors.description.texto.message}</p>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary">
            Cancelar
          </button>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar producto"}
          </button>
        </div>
      </form>
    </main>
  );
}
