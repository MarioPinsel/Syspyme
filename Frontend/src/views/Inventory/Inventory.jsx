import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../config/axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import "../../styles/InventoryForm.css"

export default function Inventory() {
    const [search, setSearch] = useState("");

    const getProducts = async () => {
        const token = Cookies.get("token");

        const { data } = await api.get("/inventory/getProducts", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(data.message)
        return data;
    };

    const { data: items = [], isLoading, isError, error, } = useQuery({ queryKey: ["products"], queryFn: getProducts, });

    if (isLoading) return <p>Cargando productos...</p>;
    if (isError) {
        const msg = error.response?.data?.message;

        if (msg) {
            return <p>{msg}</p>;
        }

        return <p>Error: {error.message}</p>;
    }
    const filteredItems = items.filter((item) => {
        const codigo = item.product.codigo || "";
        const descripcion = item.product.descripcion.texto || "";

        return (
            codigo.toLowerCase().includes(search.toLowerCase()) ||
            descripcion.toLowerCase().includes(search.toLowerCase())
        );
    });

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
                <Link to="/inventory/actualizarproduct" className="btn-update">
                    Actualizar Inventario
                </Link>
                <Link to="/inventory/create-product" className="btn-create">
                    Crear
                </Link>
                <Link to="/inventory/deleteProduct" className="btn-delete">
                    Eliminar
                </Link>
                <Link to="/inventory/agregarProduct">
                    Agregar
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
                                <td>{item.product.descripcion.texto}</td>
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
        </div >
    );
}
