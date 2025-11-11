import '../../styles/Layouts/Verify.css';

export default function VerificationCode() {

  return (
    <div className="verification-container">
      <div className="verification-box">
        <h2>Código de Verificación</h2>
        <p className="verification-instructions">
          Revisa en la bandeja de tu correo electrónico por el código de verificación.
        </p>

        <form >
          <label>Código de Verificación</label>

          <div className="verification-code">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="code-input"
              />
            ))}
          </div>

          <button type="submit">Verificar</button>
        </form>

        <p className="register-redirect">
          ¿No recibiste el código?{" "}
          <a href="#" className="register-link">
            Reenviar código
          </a>
        </p>
      </div>
    </div>
  );
}