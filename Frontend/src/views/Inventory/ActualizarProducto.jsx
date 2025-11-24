
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import api from "../../config/axios";
import "../../styles/Inventory/ActualizarProducto.css";
import { toast } from "sonner";

export default function ActualizarProducto() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { id: "", campo: "", valor: "" },
  });

  const [campoSeleccionado, setCampoSeleccionado] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue("campo", campoSeleccionado);
    setValue("valor", "");
  }, [campoSeleccionado, setValue]);

  const placeholderMap = {
    precio: "Ingresa el nuevo precio (sin separadores)",
    cantidad: "Ingresa la nueva cantidad",
    codigo: "Ingresa el nuevo código",
    descripcion: "Ingresa la nueva descripción",
    tipoProducto: "Ingresa el nuevo tipo de producto",
  };

  const onSubmit = async (formData) => {
    if (loading) return; // evitar doble submit
    setLoading(true);

    const values = { ...formData, campo: campoSeleccionado };
    console.log("FORM DATA:", values);

    const body = { id: Number(values.id) };

    switch (values.campo) {
      case "precio":
        body.unitPrice = Number(values.valor);
        break;
      case "cantidad":
        body.quantity = Number(values.valor);
        break;
      case "codigo":
        body.code = values.valor;
        break;
      case "descripcion":
        body.description = { texto: values.valor };
        break;
      case "tipoProducto":
        body.type = values.valor;
        break;
      default:
        break;
    }

    console.log("JSON ENVIADO:", body);

    try {
      const token = Cookies.get("token");

      await api.patch("/inventory/updateProduct", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Producto actualizado correctamente");
    }catch (err) {
  console.error("Error update:", err);

  const backendError =
    err.response?.data?.message ||
    err.response?.data?.error;

  toast.error(backendError || "Error actualizando producto");
} finally {
   setLoading(false);
}
}
  return (
    <div className="inventario-container">
      <h2 className="titulo">Actualizar Producto</h2>

      <form className="inventario-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="campo">
          <label>ID del Inventario</label>
          <input
            type="number"
            {...register("id", { required: "El ID es obligatorio" })}
          />
          {errors.id && <span className="error">{errors.id.message}</span>}
        </div>

        <div className="campo">
          <label>Campo a actualizar</label>
          <select
            value={campoSeleccionado}
            onChange={(e) => setCampoSeleccionado(e.target.value)}
          >
            <option value="">Seleccione</option>
            <option value="precio">Precio por unidad</option>
            <option value="cantidad">Cantidad</option>
            <option value="codigo">Código</option>
            <option value="descripcion">Descripción</option>
            <option value="tipoProducto">Tipo de producto</option>
          </select>
        </div>

        {campoSeleccionado && (
          <div className="campo">
            <label>Nuevo valor</label>
            <input
              key={campoSeleccionado}
              type={["precio", "cantidad"].includes(campoSeleccionado) ? "number" : "text"}
              placeholder={placeholderMap[campoSeleccionado]}
              {...register("valor", { required: "Este campo es obligatorio" })}
            />
            {errors.valor && (
              <span className="error">{errors.valor.message}</span>
            )}
          </div>
        )}

        <button type="submit" className="btn-enviar" disabled={loading}>
          {loading ? <span className="loader"></span> : "Actualizar"}
        </button>
      </form>
    </div>
  );
}

