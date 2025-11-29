import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../config/axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import "../../styles/Views/DianCompany.css";

export default function DIANCompanies() {
    const [search, setSearch] = useState("");
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [motivos, setMotivos] = useState({});
    const [mostrarMotivo, setMostrarMotivo] = useState({});

    const getCompanies = async () => {
        try {
            const token = Cookies.get("token");
            const { data } = await api.get("/dian/getCompanies", {
                headers: { Authorization: `Bearer ${token}` },
            });

            return {
                list: data.data || [],
                backendMessage: data.message || null,
            };
        } catch (error) {
            // Si es un 400 con mensaje de "no hay empresas", no es un error real
            if (error.response?.status === 400) {
                return {
                    list: [],
                    backendMessage: error.response.data?.message || "No hay empresas pendientes.",
                };
            }
            // Para otros errores, sí lanzamos el error
            throw error;
        }
    };

    const updateCompanyStatus = async (companyData) => {
        try {
            const token = Cookies.get("token");
            const { data } = await api.post("/dian/registerCompany", companyData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return data;

        } catch (error) {
            console.error("ERROR BACK:", error);
            console.error("ERROR RESPONSE:", error.response);

            // Extraer el mensaje de error del backend
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Ocurrió un error en el servidor.";

            // Manejar errores de validación (si existen)
            if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                error.response.data.errors.forEach((err) => {
                    toast.error(err.msg || err.message || err);
                });
            } else {
                // Mostrar el mensaje de error principal
                toast.error(errorMessage);
            }

            throw error;
        }
    };

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["dian-companies"],
        queryFn: getCompanies,
    });

    useEffect(() => {
        setCompanies(data?.list || []);
        setFilteredCompanies(data?.list || []);
    }, [data]);

    const handleAceptar = async (correo) => {
        try {
            // Actualización optimista: eliminar de la lista inmediatamente
            const updatedCompanies = companies.filter(c => c.correo !== correo);
            setCompanies(updatedCompanies);
            setFilteredCompanies(updatedCompanies.filter((c) =>
                !search.trim() ||
                (c.nombre || "").toLowerCase().includes(search.toLowerCase()) ||
                (c.nit || "").toLowerCase().includes(search.toLowerCase()) ||
                (c.correo || "").toLowerCase().includes(search.toLowerCase())
            ));

            const res = await updateCompanyStatus({
                correo,
                action: "aceptar",
                motivo: "",
            });

            toast.success(res.message || "Empresa aceptada.");

            // Refetch para asegurar sincronización con el servidor
            refetch();

        } catch (e) {
            // Si falla, revertir el cambio optimista
            toast.error("Error al aceptar la empresa. Recargando lista...");
            refetch();
        }
    };

    const handleRechazar = async (correo) => {
        const motivo = motivos[correo] || "";

        if (!motivo.trim()) {
            toast.error("Debes escribir un motivo");
            return;
        }

        try {
            // Actualización optimista: eliminar de la lista inmediatamente
            const updatedCompanies = companies.filter(c => c.correo !== correo);
            setCompanies(updatedCompanies);
            setFilteredCompanies(updatedCompanies.filter((c) =>
                !search.trim() ||
                (c.nombre || "").toLowerCase().includes(search.toLowerCase()) ||
                (c.nit || "").toLowerCase().includes(search.toLowerCase()) ||
                (c.correo || "").toLowerCase().includes(search.toLowerCase())
            ));

            const res = await updateCompanyStatus({
                correo,
                action: "rechazar",
                motivo,
            });

            toast.success(res.message || "Empresa rechazada.");

            // Limpiar los estados relacionados
            setMotivos(prev => {
                const newMotivos = { ...prev };
                delete newMotivos[correo];
                return newMotivos;
            });
            setMostrarMotivo(prev => {
                const newMostrar = { ...prev };
                delete newMostrar[correo];
                return newMostrar;
            });

            // Refetch para asegurar sincronización con el servidor
            refetch();

        } catch (e) {
            // Si falla, revertir el cambio optimista
            toast.error("Error al rechazar la empresa. Recargando lista...");
            refetch();
        }
    };

    const toggleMotivo = (correo) => {
        setMostrarMotivo(prev => ({
            ...prev,
            [correo]: !prev[correo],
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("es-CO", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="dian-companies-container">
            <h1>Revisión de Empresas - DIAN</h1>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar por nombre, NIT, correo o régimen..."
                    value={search}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearch(value);

                        if (!value.trim()) return setFilteredCompanies(companies);

                        setFilteredCompanies(
                            companies.filter((c) =>
                                (c.nombre || "").toLowerCase().includes(value.toLowerCase()) ||
                                (c.nit || "").toLowerCase().includes(value.toLowerCase()) ||
                                (c.correo || "").toLowerCase().includes(value.toLowerCase())
                            )
                        );
                    }}
                />
            </div>

            <table className="companies-table">
                <thead>
                    <tr>
                        <th>Nombre Comercial</th>
                        <th>NIT</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Régimen</th>
                        <th>Representante</th>
                        <th>Correo Rep</th>
                        <th>Teléfono Rep</th>
                        <th>Fecha</th>
                        <th>Motivo</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {isLoading ? (
                        <tr><td colSpan="12" style={{ textAlign: "center" }}>Cargando empresas...</td></tr>
                    ) : isError ? (
                        <tr><td colSpan="12" style={{ textAlign: "center" }}>Error: {error.message}</td></tr>
                    ) : filteredCompanies.length > 0 ? (
                        filteredCompanies.map((company) => (
                            <tr key={company.correo}>
                                <td>{company.nombre}</td>
                                <td>{company.nit}</td>
                                <td>{company.correo}</td>
                                <td>{company.telefono}</td>
                                <td>{company.direccion}</td>
                                <td>{company.regimen}</td>
                                <td>{company.nombre_admin}</td>
                                <td>{company.correo_admin}</td>
                                <td>{company.telefono_admin}</td>
                                <td>{formatDate(company.created_at)}</td>

                                <td>
                                    {mostrarMotivo[company.correo] ? (
                                        <input
                                            type="text"
                                            value={motivos[company.correo] || ""}
                                            onChange={(e) =>
                                                setMotivos((prev) => ({
                                                    ...prev,
                                                    [company.correo]: e.target.value,
                                                }))
                                            }
                                        />
                                    ) : (
                                        "-"
                                    )}
                                </td>

                                <td>
                                    <button onClick={() => handleAceptar(company.correo)} className="btn-accept">
                                        Aceptar
                                    </button>

                                    <button onClick={() => toggleMotivo(company.correo)} className="btn-reject">
                                        {mostrarMotivo[company.correo] ? "Cancelar" : "Rechazar"}
                                    </button>

                                    {mostrarMotivo[company.correo] && (
                                        <button
                                            className="btn-confirm-reject"
                                            disabled={!motivos[company.correo]?.trim()}
                                            onClick={() => handleRechazar(company.correo)}
                                        >
                                            Confirmar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="12" style={{ textAlign: "center" }}>
                                {data?.backendMessage || "No se encontraron empresas."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}