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
        const token = Cookies.get("token");
        const { data } = await api.get("/dian/getCompanies", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data.data || [];
    };

    // MANEJO DE ERRORES DEL BACKEND AQUÍ
    const updateCompanyStatus = async (companyData) => {
        try {
            const token = Cookies.get("token");
            const { data } = await api.post("/dian/registerCompany", companyData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return data;
        } catch (error) {
            console.error("ERROR BACK:", error);

            // Si hubo error de validación (400)
            if (error.response?.status === 400) {
                const backend = error.response.data;

                // Error de express-validator → errors: []
                if (backend.errors) {
                    backend.errors.forEach((err) => toast.error(err.msg));
                }
                // Mensaje normal desde el servicio
                if (backend.message) toast.error(backend.message);

                throw error;
            }

            // Error interno del servidor
            toast.error("Ocurrió un error en el servidor.");
            throw error;
        }
    };

    const { data: companiesData = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ["dian-companies"],
        queryFn: getCompanies,
    });

    useEffect(() => {
        setCompanies(companiesData);
        setFilteredCompanies(companiesData);
    }, [companiesData]);

    const handleAceptar = async (companyCorreo) => {
        try {
            const res = await updateCompanyStatus({
                correo: companyCorreo,
                action: "aceptar",
                motivo: "",
            });

            toast.success(res.message || "Empresa aceptada");

            setMostrarMotivo(prev => ({ ...prev, [companyCorreo]: false }));
            refetch();
        } catch (error) {
            // Ya fue manejado arriba
        }
    };

    const handleRechazar = async (companyCorreo) => {
        const motivo = motivos[companyCorreo] || "";

        if (!motivo.trim()) {
            toast.error("Debes escribir un motivo");
            return;
        }

        try {
            const res = await updateCompanyStatus({
                correo: companyCorreo,
                action: "rechazar",
                motivo,
            });

            toast.success(res.message || "Empresa rechazada");

            setMotivos(prev => ({ ...prev, [companyCorreo]: "" }));
            setMostrarMotivo(prev => ({ ...prev, [companyCorreo]: false }));
            refetch();

        } catch (error) {
            // errores ya mostrados arriba
        }
    };

    const toggleMotivo = (companyCorreo) => {
        setMostrarMotivo(prev => ({
            ...prev,
            [companyCorreo]: !prev[companyCorreo]
        }));

        if (mostrarMotivo[companyCorreo]) {
            setMotivos(prev => ({ ...prev, [companyCorreo]: "" }));
        }
    };

    const handleMotivoChange = (companyCorreo, value) => {
        setMotivos(prev => ({
            ...prev,
            [companyCorreo]: value
        }));
    };

    const handleSearch = (value) => {
        setSearch(value);

        if (!value.trim()) {
            setFilteredCompanies(companies);
            return;
        }

        const filtered = companies.filter((company) => {
            const nombre = company.nombre?.toLowerCase() ?? "";
            const nit = company.nit?.toLowerCase() ?? "";
            const correo = company.correo?.toLowerCase() ?? "";
            const regimen = company.regimen?.toLowerCase() ?? "";

            return (
                nombre.includes(value.toLowerCase()) ||
                nit.includes(value.toLowerCase()) ||
                correo.includes(value.toLowerCase()) ||
                regimen.includes(value.toLowerCase())
            );
        });

        setFilteredCompanies(filtered);
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
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <table className="companies-table">
                <thead>
                    <tr>
                        <th>Nombre Comercial</th>
                        <th>NIT</th>
                        <th>Correo Empresa</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Régimen</th>
                        <th>Representante</th>
                        <th>Correo Representante</th>
                        <th>Teléfono Representante</th>
                        <th>Fecha Registro</th>
                        <th>Motivo</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="12" style={{ textAlign: "center" }}>
                                Cargando empresas...
                            </td>
                        </tr>
                    ) : isError ? (
                        <tr>
                            <td colSpan="12" style={{ textAlign: "center" }}>
                                Error al cargar empresas: {error.message}
                            </td>
                        </tr>
                    ) : filteredCompanies.length > 0 ? (
                        filteredCompanies.map((company) => (
                            <tr key={company.correo}>
                                <td>{company.nombre ?? "-"}</td>
                                <td>{company.nit ?? "-"}</td>
                                <td>{company.correo ?? "-"}</td>
                                <td>{company.telefono ?? "-"}</td>
                                <td>{company.direccion ?? "-"}</td>
                                <td>{company.regimen ?? "-"}</td>
                                <td>{company.nombre_admin ?? "-"}</td>
                                <td>{company.correo_admin ?? "-"}</td>
                                <td>{company.telefono_admin ?? "-"}</td>
                                <td>{formatDate(company.created_at)}</td>
                                <td>
                                    {mostrarMotivo[company.correo] ? (
                                        <input
                                            type="text"
                                            placeholder="Ingrese el motivo"
                                            value={motivos[company.correo] || ""}
                                            onChange={(e) => handleMotivoChange(company.correo, e.target.value)}
                                        />
                                    ) : (
                                        <span>-</span>
                                    )}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => handleAceptar(company.correo)} className="btn-accept">
                                            Aceptar
                                        </button>

                                        <button onClick={() => toggleMotivo(company.correo)} className="btn-reject">
                                            {mostrarMotivo[company.correo] ? "Cancelar" : "Rechazar"}
                                        </button>

                                        {mostrarMotivo[company.correo] && (
                                            <button
                                                onClick={() => handleRechazar(company.correo)}
                                                className="btn-confirm-reject"
                                                disabled={!motivos[company.correo]?.trim()}
                                            >
                                                Confirmar Rechazo
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="12" style={{ textAlign: "center" }}>
                                No se encontraron empresas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
