import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../config/axios";
import Cookies from "js-cookie";
import { toast } from "sonner"; 
import "../../styles/Views/DianCompany.css";

export default function DianReports() {
    const [search, setSearch] = useState("");
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [certificateHtml, setCertificateHtml] = useState("");
    const [showCertificate, setShowCertificate] = useState(false);
    const [message, setMessage] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [accepting, setAccepting] = useState(false); 

    const getCompanies = async () => {
        const token = Cookies.get("token");
        const { data } = await api.get("/dian/companiesPending", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data.data || [];
    };

    const getCertificate = async (companyName) => {
        const token = Cookies.get("token");
        const response = await api.get(
            `/dian/getCertificate?companyName=${encodeURIComponent(companyName)}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'text',
            }
        );
        return response.data;
    };

    const validateCertificate = async (companyName, action, motivo = "") => {
        const token = Cookies.get("token");
        const { data } = await api.post(
            "/dian/validateCertificate",
            {
                companyName,
                action,
                motivo
            },
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
            const html = await getCertificate(selectedCompany.nombre);
            setCertificateHtml(html || "<p>No se pudo cargar el certificado</p>");
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

        setAccepting(true); // ✅ Activar estado de carga
        const toastId = toast.loading("Aceptando certificado..."); // ✅ Toast de carga

        try {
            const result = await validateCertificate(selectedCompany.nombre, 'aceptar');
            
            // ✅ Toast de éxito
            toast.success(result.message || "✅ Certificado aceptado exitosamente", {
                id: toastId
            });
            
            setMessage(result.message || "Certificado aceptado exitosamente");
            setSelectedCompany(null);
            setShowCertificate(false);
            refetch();
        } catch (error) {
            console.error("Error al aceptar certificado:", error);
            const errorMessage = error.response?.data?.message || "Error al aceptar el certificado";
            
            // ✅ Toast de error
            toast.error(errorMessage, {
                id: toastId
            });
            
            setMessage(errorMessage);
        } finally {
            setAccepting(false);
        }
    };

    const handleRechazar = () => {
        setShowRejectModal(true);
    };

    const handleConfirmReject = async () => {
        if (!rejectReason.trim()) {
            toast.error("Debe ingresar un motivo del rechazo"); 
            return;
        }

        setSubmitting(true);
        const toastId = toast.loading("Rechazando certificado..."); 

        try {
            const result = await validateCertificate(selectedCompany.nombre, 'rechazar', rejectReason);
            
            
            toast.success(result.message || "✅ Certificado rechazado exitosamente", {
                id: toastId
            });
            
            setMessage(result.message || "Certificado rechazado exitosamente");
            setSelectedCompany(null);
            setShowCertificate(false);
            setShowRejectModal(false);
            setRejectReason("");
            refetch();
        } catch (error) {
            console.error("Error al rechazar certificado:", error);
            const errorMessage = error.response?.data?.message || "Error al rechazar el certificado";
            
            
            toast.error(errorMessage, {
                id: toastId
            });
            
            setMessage(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelReject = () => {
        setShowRejectModal(false);
        setRejectReason("");
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

    // Vista del certificado
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
                            disabled={submitting || accepting}
                        >
                            Volver a Revisión
                        </button>

                        <button
                            onClick={handleAceptar}
                            className="btn-accept"
                            disabled={submitting || accepting}
                        >
                            {accepting ? (
                                <>
                                    <div className="spinner-small"></div>
                                    Aceptando...
                                </>
                            ) : (
                                "✓ Aceptar Certificado"
                            )}
                        </button>

                        <button
                            onClick={handleRechazar}
                            className="btn-reject"
                            disabled={submitting || accepting}
                        >
                            {submitting ? "Procesando..." : "✗ Rechazar Certificado"}
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

                {/* Modal de rechazo */}
                {showRejectModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Rechazar Certificado</h3>
                            <p>Ingrese el motivo del rechazo:</p>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Ejemplo: La información proporcionada no es clara, faltan datos del representante legal, etc."
                                rows="5"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    border: "1px solid #ddd",
                                    fontSize: "14px",
                                    fontFamily: "Arial, sans-serif",
                                    resize: "vertical"
                                }}
                            />
                            <div className="modal-actions">
                                <button
                                    onClick={handleCancelReject}
                                    className="btn-cancel"
                                    disabled={submitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmReject}
                                    className="btn-confirm-reject"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="spinner-small"></div>
                                            Enviando...
                                        </>
                                    ) : (
                                        "Confirmar Rechazo"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Vista principal de la tabla
    return (
        <div className="dian-reports-container">
            <h1>Revisión de Certificados - DAIN</h1>
            <p>Selecciona una empresa para revisar o validar su certificado</p>

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
                                        key={company.nombre}
                                        className={selectedCompany?.nombre === company.nombre ? "selected" : ""}
                                    >
                                        <td>{company.nombre ?? "-"}</td>
                                        <td>
                                            <button
                                                onClick={() => handleSelectCompany(company)}
                                                className={`btn-select ${selectedCompany?.nombre === company.nombre ? "selected" : ""}`}
                                            >
                                                {selectedCompany?.nombre === company.nombre
                                                    ? "✓ Seleccionada"
                                                    : "Seleccionar"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>
                                        No se encontraron empresas con certificados pendientes.
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