import { useState } from "react";
import Cookies from "js-cookie";
import api from "../../config/axios";
import { toast } from "sonner";
import "../../styles/Inventory/BuscarFactura.css";


export default function BuscarFactura() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!search.trim()) {
            toast.error("Debes ingresar un ID de factura");
            return;
        }

        const token = Cookies.get("token");

        if (!token) {
            toast.error("No se encontró token");
            return;
        }

        setLoading(true);

        try {
            const response = await api.get(
                `sales/getSale/${search}`,
                {
                    responseType: "text",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const html = response.data;

            const newWindow = window.open("", "_blank");

            if (!newWindow) {
                toast.error("El navegador bloqueó la ventana emergente");
                return;
            }

            newWindow.document.open();
            newWindow.document.write(html);
            newWindow.document.close();

            toast.success("Factura encontrada ✅");

        } catch (error) {
            const backendMessage =
                error.response?.data?.message ||
                "No se encontró ninguna factura con ese ID";

            toast.error(backendMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="buscarFactura-container">
            <div className="buscarFactura-box">
                <h2>Buscar Factura</h2>

                <div className="buscarFactura-form">
                    <input
                        type="text"
                        placeholder="Buscar factura por ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
    onClick={handleSearch}
    className="btn-buscar"
    disabled={loading}
>
    {loading ? <span className="loader"></span> : "Buscar"}
</button>
                </div>
            </div>
        </div>
    );
}
