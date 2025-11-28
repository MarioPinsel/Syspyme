import { Link, useLocation } from "react-router-dom";
import "../../styles/Views/DianVerification.css";

export default function CompanyVerificationSuccess() {
  const location = useLocation();
  const { message } = location.state || {};

  const defaultMessage = 'La información de la empresa ha sido enviada a la DIAN para su verificación. Por favor, revise periódicamente el correo electrónico del representante, donde recibirá la notificación del resultado del proceso. El tiempo estimado de respuesta es de 24 a 72 horas. Una vez reciba el correo, siga las instrucciones proporcionadas para completar su registro.';

  const displayMessage = message || defaultMessage;

  return (
    <div className="verification-success-container">
      <div className="verification-success-box">
        <div className="success-icon">✓</div>
        <h1>Solicitud Enviada a la DIAN</h1>
        <h2>Proceso de Verificación en Curso</h2>
        <div className="message-content">
          <p>{displayMessage}</p>
        </div>
        <Link to="/" className="success-btn">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}