import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../config/axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import "../../styles/Inventory/InventoryForm.css";

export default function Inventory() {
    const [search, setSearch] = useState("");

    const getProducts = async () => {
        const token = Cookies.get("token");

        const { data } = await api.get("/inventory/getProducts", {
            headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Manejo según nuevo backend
        if (data.status !== 200) {
            throw new Error(data.message);
        }

        return data.data; // ✅ Siempre devuelve el array
    };

    const { data: items = [], isLoading, isError, error } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
        retry: false, // ✅ Para que no reintente en 404
    });

    // ✅ Filtrado basado en nuevo formato
    const filteredItems = items.filter((item) => {
        const codigo = item.product?.codigo || "";
        const descripcion = item.product?.descripcion || "";
        return (
            codigo.toLowerCase().includes(search.toLowerCase()) ||
            descripcion.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <div className="inventory-container">
            <h2>Inventario</h2>

            {/* Buscador */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar por código o descripción..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Botones de navegación */}
            <div className="button-group">
                <Link to="/inventory/actualizarproduct" className="btn-update">Actualizar Inventario</Link>
                <Link to="/inventory/create-product" className="btn-create">Crear</Link>
                <Link to="/inventory/deleteProduct" className="btn-delete">Eliminar</Link>
                <Link to="/inventory/agregarProduct" className="btn-add">Agregar</Link>
            </div>

            {/* Tabla */}
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>ID Stock</th>
                        <th>ID</th>
                        <th>Código</th>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad</th>
                        <th>Fecha de Creación</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                                Cargando productos...
                            </td>
                        </tr>
                    ) : isError ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: "center", padding: "20px", color: "red" }}>
                                {error.message}
                            </td>
                        </tr>
                    ) : filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <tr key={item.inventoryId ?? item.product?.id}>
                                <td>{item.inventoryId ?? "-"}</td>
                                <td>{item.product?.id ?? "-"}</td>
                                <td>{item.product?.codigo ?? "-"}</td>
                                <td>{item.product?.tipo ?? "-"}</td>
                                <td>{item.product?.descripcion ?? "-"}</td>
                                <td>
                                    {item.product?.precioUnitario != null
                                        ? `$${item.product.precioUnitario}`
                                        : "-"}
                                </td>
                                <td>{item.cantidad ?? "-"}</td>
                                <td>
                                    {item.createdAt
                                        ? new Date(item.createdAt).toLocaleString()
                                        : "-"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                                No se encontraron resultados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
