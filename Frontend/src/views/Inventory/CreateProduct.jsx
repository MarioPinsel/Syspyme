import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Cookies from "js-cookie";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import "../../styles/CreateProduct.css"

export default function CreateProductView() {
  const navigate = useNavigate();

  const initialValues = {
    type: "",
    description: "",
    unitPrice: "",
    quantity: "",
    code: ""
  };

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues, });
  const handleCreate = async (formData) => {
    console.log("FORM DATA ENVIADO:", formData);

    try {
      const token = Cookies.get("token");

      const { data } = await api.post("/inventory/createProduct",
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
      navigate("/inventory/");

    } catch (error) {
      const backendError =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Ocurrió un error inesperado";

      toast.error(backendError);
    }
  };


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
            {...register("code", { required: "El código es obligatorio" })}
            type="text"
            placeholder="EJ: P-0001"
          />
          {errors.code && <p className="error">{errors.code.message}</p>}
        </div>

        <div className="form-row">
          <label htmlFor="type">Tipo de producto</label>
          <input
            id="type"
            {...register("type", { required: "El nombre es obligatorio" })}
            type="text"
            placeholder="Nombre del producto"
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
              })}
              type="number"
              min="0"
              step="1"
              placeholder="0"
            />
            {errors.quantity && <p className="error">{errors.quantity.message}</p>}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            {...register("description.texto", { required: "La descripción es obligatoria" })}
            placeholder="Descripción corta del producto"
            rows={3}
          />
          {errors.description?.texto && (
            <p className="error">{errors.description.texto.message}</p>
          )}

          {errors.description && <p className="error">{errors.description.message}</p>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Guardar producto
          </button>
        </div>
      </form>
    </main>
  );
}
