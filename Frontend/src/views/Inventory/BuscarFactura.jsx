import { useState } from "react";
import axios from "axios";
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

        setLoading(true);

        try {
            const response = await axios.get(`/api/facturas/${search}/archivo`, {
                responseType: "blob"
            });

            const file = new Blob([response.data], { type: response.headers["content-type"] });
            const url = window.URL.createObjectURL(file);
            window.open(url, "_blank");

            toast.success("Factura encontrada");
        } catch (error) {
            toast.error("No se encontró ninguna factura con ese ID");
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

                    <button onClick={handleSearch} disabled={loading}>
                        {loading ? "Buscando..." : "Buscar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
