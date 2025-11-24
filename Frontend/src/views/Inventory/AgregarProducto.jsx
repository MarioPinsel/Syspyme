import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import api from "../../config/axios";
import { toast } from "sonner";
import "../../styles/Inventory/ActualizarProducto.css";
import { useState } from "react";

export default function AgregarProducto() {
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: { metodo: "", id: "", code: "", quantity: "" },
    });

    const [metodo, setMetodo] = useState("");
     const [loading, setLoading] = useState(false);
    useEffect(() => {
        setValue("metodo", metodo);
    }, [metodo, setValue]);

    const onSubmit = async (formData) => {
        const token = Cookies.get("token");

        if (!token) {
            toast.error("No se encontró token");
            return;
        }

        const body = {
            code: formData.metodo === "id" ? String(formData.id) : formData.code,
            quantity: Number(formData.cantidad),
        };

        try {
            console.log("JSON FINAL:", body);

            await api.post("/inventory/addProduct", body, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Producto agregado correctamente");
     } catch (err) {
    console.error("Error:", err);

    const backendError =
        err.response?.data?.error ||
        err.response?.data?.message;

    toast.error(backendError || "Error agregando producto");
}


    };

    return (
        <div className="inventario-container">
            <h2 className="titulo">Agregar Producto</h2>

            <form className="inventario-form" onSubmit={handleSubmit(onSubmit)}>

                <div className="campo">
                    <label>Método</label>
                    <select value={metodo} onChange={(e) => setMetodo(e.target.value)}>
                        <option value="">Seleccione</option>
                        <option value="id">Por ID</option>
                        <option value="code">Por Código</option>
                    </select>
                </div>

                {metodo === "id" && (
                    <div className="campo">
                        <label>ID</label>
                        <input type="number" {...register("id")} />
                    </div>
                )}

                {metodo === "code" && (
                    <div className="campo">
                        <label>Código</label>
                        <input type="text" {...register("code")} />
                    </div>
                )}

                <div className="campo">
                    <label>Cantidad</label>
                    <input type="number" {...register("cantidad")} />
                </div>

                <button type="submit" className="btn-enviar" disabled={loading}>
                    {loading ? <span className="loader"></span> : "Agregar"}
                </button>
            </form>
        </div>
    );
}
