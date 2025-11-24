import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import api from "../../config/axios";
import "../../styles/Inventory/ActualizarProducto.css";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function EliminarProducto() {
    const navigate = useNavigate()

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: { metodo: "", id: "", codigo: "" },
    });

    const [metodo, setMetodo] = useState("");

    useEffect(() => {
        setValue("metodo", metodo);
    }, [metodo, setValue]);

    const onSubmit = async (formData) => {
        const token = Cookies.get("token");

        if (!token) {
            toast.error("No hay token");
            return;
        }

        try {
            if (formData.metodo === "id") {
                const body = { id: Number(formData.id) };

                await api.delete("/inventory/deleteProducts", {
                    headers: { Authorization: `Bearer ${token}` },
                    data: body,
                });

                toast.success("Producto eliminado por ID");
            }

            if (formData.metodo === "codigo") {
                const body = { codigo: formData.codigo };

                await api.delete("/inventory/deleteProducts", {
                    headers: { Authorization: `Bearer ${token}` },
                    data: body,
                });

                toast.success("Producto eliminado por código");
                navigate("/inventory")
            }

        } catch (err) {
    console.error("❌ Error delete:", err);

    const backendError =
        err.response?.data?.error ||
        err.response?.data?.message;

    toast.error(backendError || "Error eliminando el producto");
}

    };

    return (
        <div className="inventario-container">
            <h2 className="titulo">Eliminar Producto</h2>

            <form className="inventario-form" onSubmit={handleSubmit(onSubmit)}>

                <div className="campo">
                    <label>Método de eliminación</label>
                    <select
                        value={metodo}
                        onChange={(e) => setMetodo(e.target.value)}
                    >
                        <option value="">Seleccione</option>
                        <option value="id">Por ID</option>
                        <option value="codigo">Por Código</option>
                    </select>
                </div>

                {metodo === "id" && (
                    <div className="campo">
                        <label>ID del Inventario</label>
                        <input type="number" {...register("id")} />
                    </div>
                )}

                {metodo === "codigo" && (
                    <div className="campo">
                        <label>Código del Producto</label>
                        <input type="text" {...register("codigo")} />
                    </div>
                )}

                <button type="submit" className="btn-enviar" style={{ background: "#e74c3c" }}>
                    Eliminar
                </button>
            </form>
        </div>
    );
}
