import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../config/axios";
import Cookies from "js-cookie";
import "../../styles/Views/DianCompany.css";

export default function DianReports() {
    const [search, setSearch] = useState("");
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [certificateHtml, setCertificateHtml] = useState("");
    const [showCertificate, setShowCertificate] = useState(false);
    const [message, setMessage] = useState("");

    const getCompanies = async () => {
        const token = Cookies.get("token");
        const { data } = await api.get("/dian/getCompanies", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        return data.data || [];
    };

    const getCertificate = async (companyName) => {
        const token = Cookies.get("token");
        const { data } = await api.get(`/dian/getCertificate?companyName=${encodeURIComponent(companyName)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    };

    const acceptCertificate = async (companyName) => {
        const token = Cookies.get("token");
        const { data } = await api.post("/dian/acceptCertificate", 
            { companyName: companyName },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return data;
    };

    const { data: companiesData = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ["dian-companies-reports"],
        queryFn: getCompanies,
    });

    useEffect(() => {
        setCompanies(companiesData);
        setFilteredCompanies(companiesData);
    }, [companiesData]);

    const handleSearch = (value) => {
        setSearch(value);

        if (!value.trim()) {
            setFilteredCompanies(companies);
            return;
        }

        const filtered = companies.filter((company) => {
            const nombre = company.nombre?.toLowerCase() ?? "";
            return nombre.includes(value.toLowerCase());
        });

        setFilteredCompanies(filtered);
    };

    const handleSelectCompany = (company) => {
        setSelectedCompany(company);
    };

    const handleRevisar = async () => {
        if (!selectedCompany) return;
        
        try {
            const certificateData = await getCertificate(selectedCompany.nombre);
            setCertificateHtml(certificateData.html || "<p>No se pudo cargar el certificado</p>");
            setShowCertificate(true);
            setMessage("");
        } catch (error) {
            console.error("Error al obtener certificado:", error);
            setCertificateHtml("<p>Error al cargar el certificado</p>");
            setShowCertificate(true);
        }
    };

    const handleAceptar = async () => {
        if (!selectedCompany) return;
        
        try {
            const result = await acceptCertificate(selectedCompany.nombre);
            setMessage(result.message || "Certificado aceptado exitosamente");
            setSelectedCompany(null);
            refetch(); // Refrescar la lista
        } catch (error) {
            console.error("Error al aceptar certificado:", error);
            setMessage("Error al aceptar el certificado");
        }
    };

    const handleVolverRevision = () => {
        setShowCertificate(false);
        setCertificateHtml("");
    };

    const handleVolverInicio = () => {
        setShowCertificate(false);
        setSelectedCompany(null);
        setMessage("");
        setCertificateHtml("");
    };

    // Si estamos mostrando el certificado
    if (showCertificate) {
        return (
            <div className="dian-reports-container">
                <div className="certificate-view">
                    <h1>Certificado de la Empresa: {selectedCompany?.nombre}</h1>
                    
                    <div className="certificate-content">
                        <div 
                            dangerouslySetInnerHTML={{ __html: certificateHtml }} 
                            className="certificate-html"
                        />
                    </div>

                    <div className="certificate-actions">
                        <button 
                            onClick={handleVolverRevision}
                            className="btn-back"
                        >
                            Volver a Revisión
                        </button>
                    </div>

                    {message && (
                        <div className="message-box">
                            <p>{message}</p>
                            <button 
                                onClick={handleVolverInicio}
                                className="btn-home"
                            >
                                Volver al Inicio
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Vista principal de la tabla
    return (
        <div className="dian-reports-container">
            <h1>Revisión de Certificados - DIAN</h1>
            <p>Selecciona una empresa para revisar o aceptar su certificado</p>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar por nombre de empresa..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <div className="companies-section">
                <div className="companies-list">
                    <table className="companies-table">
                        <thead>
                            <tr>
                                <th>Nombre Comercial</th>
                                <th>Seleccionar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
                                        Cargando empresas...
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
                                        Error al cargar empresas: {error.message}
                                    </td>
                                </tr>
                            ) : filteredCompanies.length > 0 ? (
                                filteredCompanies.map((company) => (
                                    <tr 
                                        key={company.correo} 
                                        className={selectedCompany?.correo === company.correo ? "selected" : ""}
                                    >
                                        <td>{company.nombre ?? "-"}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleSelectCompany(company)}
                                                className={`btn-select ${selectedCompany?.correo === company.correo ? "selected" : ""}`}
                                            >
                                                {selectedCompany?.correo === company.correo ? "✓ Seleccionada" : "Seleccionar"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
                                        No se encontraron empresas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {selectedCompany && (
                    <div className="action-panel">
                        <h3>Empresa Seleccionada: {selectedCompany.nombre}</h3>
                        <div className="action-buttons">
                            <button 
                                onClick={handleRevisar}
                                className="btn-review"
                            >
                                Revisar Certificado
                            </button>
                            <button 
                                onClick={handleAceptar}
                                className="btn-accept"
                            >
                                Aceptar Certificado
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {message && !showCertificate && (
                <div className="message-box">
                    <p>{message}</p>
                    <button 
                        onClick={() => setMessage("")}
                        className="btn-close-message"
                    >
                        Cerrar
                    </button>
                </div>
            )}
        </div>
    );
}