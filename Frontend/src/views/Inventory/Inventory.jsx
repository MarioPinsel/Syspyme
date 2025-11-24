import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../config/axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import "../../styles/Inventory/InventoryForm.css";

export default function Inventory() {
    const [search, setSearch] = useState("");
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);

    // ✅ Formateador de precio con puntos de miles
    const formatPrice = (value) => {
        return new Intl.NumberFormat("es-CO", {
            minimumFractionDigits: 0
        }).format(value);
    };

    const getProducts = async () => {
        const token = Cookies.get("token");
        const { data } = await api.get("/inventory/getProducts", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return data.message ? [] : data;
    };

    const { data: items = [], isLoading, isError, error } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    });

    useEffect(() => {
        setInventory(items);
        setFilteredInventory(items);
    }, [items]);

    // ✅ Búsqueda sin duplicar
    const handleSearch = (value) => {
        setSearch(value);

        if (!value.trim()) {
            setFilteredInventory(inventory);
            return;
        }

        const filtered = inventory.filter((item) => {
            const codigo = item.product?.codigo?.toLowerCase() ?? "";
            const descripcion = item.product?.descripcion?.texto?.toLowerCase() ?? "";
            return (
                codigo.includes(value.toLowerCase()) ||
                descripcion.includes(value.toLowerCase())
            );
        });

        setFilteredInventory(filtered);
    };

    return (
        <div className="inventory-container">
            <h2>Inventario</h2>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar por código o descripción..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <div className="button-group">
                <Link to="/inventory/actualizarproduct" className="btn-update">Actualizar Inventario</Link>
                <Link to="/inventory/create-product" className="btn-create">Crear</Link>
                <Link to="/inventory/deleteProduct" className="btn-delete">Eliminar</Link>
                <Link to="/inventory/agregarProduct">Agregar</Link>
            </div>

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
                            <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                                {error.response?.data?.message || `Error: ${error.message}`}
                            </td>
                        </tr>
                    ) : filteredInventory.length > 0 ? (
                        filteredInventory.map((item) => (
                            <tr key={`${item.product?.id}-${item.inventoryId ?? "none"}`}>
                                <td>{item.inventoryId ?? "-"}</td>
                                <td>{item.product?.id ?? "-"}</td>
                                <td>{item.product?.codigo ?? "-"}</td>
                                <td>{item.product?.tipo ?? "-"}</td>
                                <td>{item.product?.descripcion?.texto ?? "-"}</td>

                                {/* ✅ Aquí se aplica el formato de precio */}
                                <td>
                                    {item.product?.precioUnitario != null
                                        ? `$${formatPrice(item.product.precioUnitario)}`
                                        : "-"
                                    }
                                </td>

                                <td>{item.cantidad ?? 0}</td>

                                <td>
                                    {item.createdAt
                                        ? new Date(item.createdAt.replace("Z", "")).toLocaleString("es-CO", { hour12: true })
                                        : "-"
                                    }
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

