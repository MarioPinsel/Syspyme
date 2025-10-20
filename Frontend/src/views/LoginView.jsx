import { Outlet } from 'react-router-dom';
import '../styles/LoginView.css';


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
        </div>
      </div>
      <Outlet />
    </>
  );

}

export default LoginView;


