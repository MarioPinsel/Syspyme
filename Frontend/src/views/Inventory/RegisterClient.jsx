import "../../styles/Layouts/RegisterClient.css";

export default function RegisterClient() {
  return (
    <div className="cliente-container">
      <h2 className="titulo">Registrar Cliente</h2>

      <form className="cliente-form">
        <div className="campo">
          <label htmlFor="nombre">Nombre Completo:</label>
          <input
            type="text"
            id="nombre"
            placeholder="Ej: Santiago Ramirez"
          />
        </div>

        <div className="campo">
          <label htmlFor="cedula">Cédula:</label>
          <input
            type="text"
            id="cedula"
            placeholder="Ej: 1012345678"
          />
        </div>

        <div className="campo">
          <label htmlFor="correo">Correo:</label>
          <input
            type="email"
            id="correo"
            placeholder="Ej: correo@ejemplo.com"
          />
        </div>

        <div className="campo">
          <label htmlFor="celular">Celular:</label>
          <input
            type="text"
            id="celular"
            placeholder="Ej: 3001234567"
          />
        </div>

        <button type="submit" className="btn-enviar">Registrar</button>
      </form>
    </div>
  );
}