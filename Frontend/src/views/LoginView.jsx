import './LoginView.css';


function LoginView() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Crea una cuenta</h2>
        <form>
          <label>Nombre</label>
          <input type="text" placeholder="Ingresa tu Nombre" />

          <label>Usuario</label>
          <input type="text" placeholder="Ingresa tu Usuario" />

          <label>Email</label>
          <input type="text" placeholder="Ingresa tu Email" />

          <label>Contraseña</label>
          <input type="password" placeholder="Ingresa tu Contraseña" />

          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
}

export default LoginView;


