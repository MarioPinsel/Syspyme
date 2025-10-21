import { Outlet, Link } from "react-router-dom";
import "../styles/LoginView.css";

function LoginView() {
  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          <form>
            <label>Usuario</label>
            <input type="text" placeholder="Ingresa tu Usuario" />

            <label>Contraseña</label>
            <input type="password" placeholder="Ingresa tu Contraseña" />

            <button type="submit">Continuar</button>
          </form>

          <p className="register-redirect">
            ¿No tienes una cuenta?{" "}
            <Link to="/auth/register" className="register-link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default LoginView;



