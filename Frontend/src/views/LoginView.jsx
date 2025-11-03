import { Outlet, Link } from "react-router-dom";
import "../styles/LoginView.css";

function LoginView() {
  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          <form>
            <label>Nombre de la empresa</label>
            <input type="text" placeholder="Ingresa el nombre de la empresa" />

            <label>Contraseña de la empresa</label>
            <input type="password" placeholder="Ingresa la Contraseña de la empresa" />
           <label>Nombre del usuario/Correo</label>
            <input type="text" placeholder="Ingresa tu Usuario ó correo" />

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



