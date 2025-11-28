import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../config/axios";
import Cookies from "js-cookie";
import "../../styles/Views/DianCompany.css";

export default function DIANCompanies() {
    const [search, setSearch] = useState("");
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [motivos, setMotivos] = useState({});
    const [mostrarMotivo, setMostrarMotivo] = useState({}); // Estado para controlar qué empresa muestra el motivo

    const getCompanies = async () => {
        const token = Cookies.get("token");
        const { data } = await api.get("/dian/getCompanies", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        return data.data || [];
    };

    const updateCompanyStatus = async (companyData) => {
        const token = Cookies.get("token");
        const { data } = await api.post("/dian/register", companyData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
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
            await updateCompanyStatus({
                action: "accept",
                companyCorreo: companyCorreo,
                estado: "aceptado",
                motivo: ""
            });
            
            // Ocultar motivo si estaba visible
            setMostrarMotivo(prev => ({ ...prev, [companyCorreo]: false }));
            refetch();
            alert("Empresa aceptada exitosamente");
            
        } catch (error) {
            console.error("Error al aceptar empresa:", error);
            alert("Error al aceptar empresa");
        }
    };

    const handleRechazar = async (companyCorreo) => {
        const motivo = motivos[companyCorreo] || "";
        
        if (!motivo.trim()) {
            alert("Por favor ingresa un motivo para rechazar");
            return;
        }

        try {
            await updateCompanyStatus({
                action: "reject",
                companyCorreo: companyCorreo,
                estado: "rechazado",
                motivo: motivo.trim()
            });
            
            // Limpiar y ocultar motivo después de rechazar
            setMotivos(prev => ({ ...prev, [companyCorreo]: "" }));
            setMostrarMotivo(prev => ({ ...prev, [companyCorreo]: false }));
            refetch();
            alert("Empresa rechazada exitosamente");
            
        } catch (error) {
            console.error("Error al rechazar empresa:", error);
            alert("Error al rechazar empresa");
        }
    };

    // Mostrar/ocultar input de motivo
    const toggleMotivo = (companyCorreo) => {
        setMostrarMotivo(prev => ({
            ...prev,
            [companyCorreo]: !prev[companyCorreo]
        }));
        
        // Si se oculta, limpiar el motivo
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
                            <td colSpan="12" style={{ textAlign: "center", padding: "20px" }}>
                                Cargando empresas...
                            </td>
                        </tr>
                    ) : isError ? (
                        <tr>
                            <td colSpan="12" style={{ textAlign: "center", padding: "20px" }}>
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
                                <td>{company.nombreAdmin ?? "-"}</td>
                                <td>{company.correoAdmin ?? "-"}</td>
                                <td>{company.telefonoAdmin ?? "-"}</td>
                                <td>{formatDate(company.created_at)}</td>
                                <td>
                                    {mostrarMotivo[company.correo] ? (
                                        <input
                                            type="text"
                                            placeholder="Ingrese el motivo de rechazo"
                                            value={motivos[company.correo] || ""}
                                            onChange={(e) => handleMotivoChange(company.correo, e.target.value)}
                                            className="motivo-input"
                                        />
                                    ) : (
                                        <span>-</span>
                                    )}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            onClick={() => handleAceptar(company.correo)}
                                            className="btn-accept"
                                        >
                                            Aceptar
                                        </button>
                                        <button 
                                            onClick={() => toggleMotivo(company.correo)}
                                            className="btn-reject"
                                        >
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
                            <td colSpan="12" style={{ textAlign: "center", padding: "20px" }}>
                                No se encontraron empresas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}