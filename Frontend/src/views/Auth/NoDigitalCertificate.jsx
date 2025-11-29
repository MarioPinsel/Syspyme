import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import "../../styles/Views/NoDigitalCertificate.css";

export default function DigitalCertificate() {
    const navigate = useNavigate();
    const [certificateHtml, setCertificateHtml] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // GET automático para obtener el HTML del certificado
    useEffect(() => {
        const fetchCertificateHtml = async () => {
            try {
                const token = Cookies.get("token");
                const { data } = await api.get("/auth/getCertificate", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCertificateHtml(data || "<p>No se pudo cargar el certificado digital</p>");
            } catch (error) {
                console.error("Error al cargar certificado:", error);
                setCertificateHtml("<p>Error al cargar el certificado digital</p>");
                toast.error("Error al cargar el certificado");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificateHtml();
    }, []);

    const handleContinue = async () => {
        setSubmitting(true);
        try {
            const token = Cookies.get("token");
            const { data } = await api.patch("/auth/sendCertificate",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.message) {
                setSuccessMessage(data.message);
            }

        } catch (error) {
            console.error("Error al procesar certificado:", error);

            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Error al procesar el certificado digital");
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Vista de éxito después del PATCH
    if (successMessage) {
        return (
            <div className="certificate-container">
                <div className="certificate-content" style={{ maxWidth: "600px", padding: "2.5rem" }}>
                    <div style={{
                        width: "64px",
                        height: "64px",
                        margin: "0 auto 1.5rem",
                        borderRadius: "50%",
                        background: "#4CAF50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>

                    <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem" }}>
                        ✓ Certificado Enviado
                    </h2>

                    <div style={{
                        background: "#f8f9fa",
                        padding: "1.5rem",
                        borderRadius: "8px",
                        marginBottom: "2rem",
                        border: "1px solid #e9ecef"
                    }}>
                        <p style={{
                            textAlign: "left",
                            lineHeight: "1.8",
                            fontSize: "1rem",
                            color: "#495057",
                            margin: 0,
                            whiteSpace: "pre-wrap"
                        }}>
                            {successMessage}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/dashboard")}
                        style={{ width: "100%", padding: "0.875rem" }}
                    >
                        Ir al Inicio
                    </button>
                </div>
            </div>
        );
    }

    // Vista principal del certificado
    return (
        <div className="certificate-container">
            <div className="certificate-content">
                <div className="certificate-header">
                    <h1>Certificado Digital Requerido</h1>
                    <p>Para continuar utilizando nuestros servicios, es necesario que obtenga su certificado digital.</p>
                </div>

                <div className="certificate-layout">
                    {/* Columna izquierda - Texto explicativo */}
                    <div className="explanation-section">
                        <h2>¿Por qué necesito un certificado digital?</h2>
                        <p>
                            El certificado digital es un documento requerido por la DIAN (según resolución 000165 de 2023 capítulo 2 Requisitos de la factura electronica de venta) para autenticar, firmar y asegurar
                            la integridad del documento electronico con el fin de asegurar que los datos no sean alterados y sean de
                            confianza para el emisor y receptor.
                        </p>
                    </div>

                    {/* Columna derecha - Solo el HTML del certificado */}
                    <div className="certificate-section">
                        <div className="certificate-preview">
                            <h3>Vista del Certificado</h3>
                            {loading ? (
                                <div className="loading-certificate">
                                    <div className="spinner"></div>
                                    <p>Cargando certificado...</p>
                                </div>
                            ) : (
                                <div
                                    dangerouslySetInnerHTML={{ __html: certificateHtml }}
                                    className="certificate-html"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="action-section">
                    <button
                        onClick={handleContinue}
                        disabled={submitting}
                        className="btn-continue"
                    >
                        {submitting ? (
                            <>
                                <div className="spinner-small"></div>
                                Procesando...
                            </>
                        ) : (
                            "Enviar Certificado"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}