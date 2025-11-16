import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import api from "../../config/axios";
import { toast } from "sonner";
import "../../styles/ActualizarProducto.css";

export default function AgregarProducto() {
    const { register, handleSubmit, setValue, } = useForm({
        defaultValues: { metodo: "", id: "", code: "", quantity: "" },
    });

    const [metodo, setMetodo] = useState("");

    useEffect(() => {
        setValue("metodo", metodo);
    }, [metodo, setValue]);

    const onSubmit = async (formData) => {
        const token = Cookies.get("token");

        if (!token) {
            toast.error("No se encontró token");
            return;
        }

        let body = { cantidad: Number(formData.cantidad) };

        if (formData.metodo === "id") {
            body.id = Number(formData.id);
        } else if (formData.metodo === "code") {
            body.code = formData.code;
        }

        try {
            await api.post("/inventory/addProduct", body, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Producto agregado correctamente");
        } catch (err) {
            console.error("Error:", err);
            const msg = err.response?.data?.message
            toast.error(msg);
        }
    };

    return (
        <div className="inventario-container">
            <h2 className="titulo">Agregar Producto</h2>

            <form className="inventario-form" onSubmit={handleSubmit(onSubmit)}>

                <div className="campo">
                    <label>Método</label>
                    <select
                        value={metodo}
                        onChange={(e) => setMetodo(e.target.value)}
                    >
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

                <button type="submit" className="btn-enviar" style={{ background: "#2ecc71" }}>
                    Agregar
                </button>
            </form>
        </div>
    );
}
