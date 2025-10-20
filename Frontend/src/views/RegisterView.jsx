import '../styles/RegisterView.css';
export default function RegisterView() {
    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Crea tu cuenta</h2>
                <form>
                    <label>Usuario</label>
                    <input type="text" placeholder="Ingresa tu Usuario" />

                    <label>Nombre</label>
                    <input type="text" placeholder="Ingresa tu Nombre" />

                    <label>Email</label>
                    <input type="text" placeholder="Ingresa tu Email" />

                    <label>Contraseña</label>
                    <input type="password" placeholder="Ingresa tu Contraseña" />



                    <button type="submit">Registrarse</button>
                </form>
            </div>
        </div>
    )
}
