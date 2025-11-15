import "../../styles/Layouts/InventoryOptions.css";

export default function InventoryOptions() {
  return (
    <div className="inventario-container">
      <h2 className="titulo">Opciones</h2>

      <form className="inventario-form">
        <div className="campo">
          <label htmlFor="idInventario">ID del Inventario:</label>
          <input type="text" id="idInventario" placeholder="Ej: INV-001" />
        </div>

        <div className="campo">
          <label htmlFor="opciones">Seleccionar campo:</label>
          <select id="opciones" defaultValue="">
            <option value="" disabled>
              Selecciona una opción
            </option>
            <option value="precio">Precio por Unidad</option>
            <option value="cantidad">Cantidad</option>
            <option value="codigo">Código</option>
          </select>
        </div>

        <button type="submit" className="btn-enviar">
          Enviar
        </button>
      </form>
    </div>
  );
}
