import "../../styles/RegisterView.css";
import { Link } from "react-router-dom";

export default function RegisterView() {
  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Registra tu empresa</h2>
        <form>
          <label>Nombre</label>
          <input type="text" placeholder="Ingresa el nombre de la empresa" />

          <label>NIT</label>
          <input type="text" placeholder="Ingresa el NIT de la empresa" />

          <label>Correo</label>
          <input type="text" placeholder="Ingresa el Email" />

          <label>Contraseña</label>
          <input type="password" placeholder="Ingresa la Contraseña" />

          <button type="submit">Registrarse</button>
        </form>

        <p className="login-redirect">
          ¿Tu empresa ya está registrada?{" "}
          <Link to="/auth/login" className="login-link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

