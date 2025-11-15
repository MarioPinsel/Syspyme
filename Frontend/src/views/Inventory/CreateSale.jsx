import "../../styles/CreateSale.css";

export default function CrearVenta() {
  return (
    <div className="venta-container">

      <h2 className="titulo-venta">Crear Venta</h2>

      <div className="documento-box">
        <h3>Datos</h3>

        <div className="campo">
          <label htmlFor="producto">Producto:</label>
          <input type="text" id="producto" placeholder="Ej: Arroz 500g" />
        </div>

        <div className="campo">
          <label htmlFor="codigo">Código:</label>
          <input type="text" id="codigo" placeholder="Ej: PRODU-001" />
        </div>

        <div className="campo">
          <label htmlFor="cantidad">Cantidad:</label>
          <input type="number" min="0" id="cantidad" placeholder="1" />
        </div>

        <button className="btn-add">Añadir</button>
      </div>


      <div className="lista-box">
        <h3>Productos Agregados</h3>

        <div className="item-ejemplo">
          <span> Mario agrega logica </span>
        </div>

        <div className="item-ejemplo">
          <span> Mario agrega logica x2</span>
        </div>
      </div>

      <div className="pago-box">
        <h3>Método de Pago</h3>

        <div className="campo">
          <label htmlFor="metodoPago">Método:</label>
          <select id="metodoPago" defaultValue="">
            <option value="" disabled>Selecciona método</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>

        <div className="campo">
          <label htmlFor="tipoPago">Tipo de Pago:</label>
          <select id="tipoPago" defaultValue="">
            <option value="" disabled>Selecciona tipo</option>
            <option value="contado">Contado</option>
            <option value="credito">Crédito</option>
          </select>
        </div>

        <div className="campo">
          <label htmlFor="cuotas">Cuotas:</label>
          <input type="number" min="0" id="cuotas" placeholder="Ej: 45 xd" />
        </div>
      </div>

      <div className="acciones">
        <button className="btn-realizar">Realizar Venta</button>
      </div>
    </div>
  );
}
