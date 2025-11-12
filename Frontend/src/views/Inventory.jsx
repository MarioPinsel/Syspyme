import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import api from "../config/axios.js";
import "../styles/InventoryForm.css";

const getProducts = async () => {
    try {
        const { data } = await api.get('/inventory/getProducts');
        console.log(data)
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error.response.data.error)
        }
    }
};

export default function Inventory() {
    const [search, setSearch] = useState("");

    const { data: items = [], isLoading, isError, error } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    });

    // if (isLoading) return <p>Cargando productos...</p>;
    // if (isError) return <p>Error: {error.message}</p>;

    const filteredItems = items.filter(
        (item) =>
            item.product.codigo?.toLowerCase().includes(search.toLowerCase()) ||
            item.product.descripcion?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="inventory-container">
            <h2>Inventario</h2>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar por código o descripción..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={() => console.log("Buscando:", search)}>Buscar</button>
            </div>

            <div className="button-group">
                <Link to="/actualizar-inventario" className="btn-update">
                    Actualizar Inventario
                </Link>
                <Link to="/crear-producto" className="btn-create">
                    Crear
                </Link>
                <Link to="/eliminar-producto" className="btn-delete">
                    Eliminar
                </Link>
            </div>

            <table className="inventory-table">
                <thead>
                    <tr>
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
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <tr key={item.inventoryId}>
                                <td>{item.product.id}</td>
                                <td>{item.product.codigo}</td>
                                <td>{item.product.tipo}</td>
                                <td>{item.product.descripcion}</td>
                                <td>${item.product.precioUnitario}</td>
                                <td>{item.cantidad}</td>
                                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="no-data">
                                No se encontraron resultados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
