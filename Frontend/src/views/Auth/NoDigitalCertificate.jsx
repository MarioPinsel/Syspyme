import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import Cookies from "js-cookie";
import "../../styles/Views/NoDigitalCertificate.css";

export default function DigitalCertificate() {
    const navigate = useNavigate();
    const [acceptedConditions, setAcceptedConditions] = useState(false);
    const [certificateHtml, setCertificateHtml] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

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
                // ✅ data ya ES el HTML directamente, no data.html
                setCertificateHtml(data || "<p>No se pudo cargar el certificado digital</p>");
            } catch (error) {
                console.error("Error al cargar certificado:", error);
                setCertificateHtml("<p>Error al cargar el certificado digital</p>");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificateHtml();
    }, []);

    const handleContinue = async () => {
        if (!acceptedConditions) return;

        setSubmitting(true);
        try {
            const token = Cookies.get("token");
            const { data } = await api.post("/auth/certificate/complete",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage(data.message || "Certificado digital procesado exitosamente");
            setShowSuccess(true);

        } catch (error) {
            console.error("Error al procesar certificado:", error);
            setMessage("Error al procesar el certificado digital");
            setShowSuccess(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleBackToHome = () => {
        navigate("/dashboard");
    };

    // Vista de éxito después del POST
    if (showSuccess) {
        return (
            <div className="certificate-container">
                <div className="success-view">
                    <div className="success-icon">✓</div>
                    <h1>Proceso Completado</h1>
                    <div className="message-content">
                        <p>{message}</p>
                    </div>
                    <button
                        onClick={handleBackToHome}
                        className="btn-home"
                    >
                        Volver al Inicio
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
                            El certificado digital es un documento requerido por la DIAN (según resolución 000165 de 2023 capítulo 2 Requisitos de la factura electronica de venta) para autenticar,firmar y asegurar
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
                            "Continuar"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}