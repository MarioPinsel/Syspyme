import "../styles/RegisterView.css";
import { Link } from "react-router-dom";

export default function RegisterView() {
  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Crea tu cuenta</h2>
        <form>
          <label>Nombre de la empresa</label>
          <input type="text" placeholder="Ingresa el nombre de la empresa" />

          <label>NIT</label>
          <input type="text" placeholder="Ingresa el NIT de la empresa" />

          <label>Correo</label>
          <input type="text" placeholder="Ingresa tu Email" />

          <label>Contraseña</label>
          <input type="password" placeholder="Ingresa tu Contraseña" />

          <button type="submit">Continuar</button>
        </form>

        <p className="login-redirect">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/auth/login" className="login-link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}