import "../../styles/CreateProduct.css";

export default function CreateProductView() {
  return (
    <main className="page">
      <header className="page-header">
        <h1>Crear producto</h1>
        <p className="subtitle">
          Rellena los datos del producto.
        </p>
      </header>

      <form className="product-form" noValidate>
        <div className="form-row">
          <label htmlFor="code">
            Código
          </label>
          <input id="code" name="code" type="text" placeholder="EJ: P-0001" required />
        </div>

        <div className="form-row">
          <label htmlFor="name">
            Tipo de producto
          </label>

          <input id="name" name="name" type="text" placeholder="Nombre del producto" required />
        </div>

        <div className="form-grid">
          <div className="form-column">
            <label htmlFor="unitPrice">
              Precio por unidad (COP)
            </label>
            <div className="input-prefix">
              <span className="prefix">$</span>
              <input
                id="unitPrice"
                name="unitPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="form-column">
            <label htmlFor="quantity">
              Cantidad en inventario
            </label>
            <input id="quantity" name="quantity" type="number" min="0" step="1" placeholder="0" required />
          </div>

        </div>

        <div className="form-row">
          <label htmlFor="category">Descripción</label>
          <input id="category" name="category" type="text" placeholder="Descripción corta del producto" />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Guardar producto
          </button>
        </div>
      </form>
    </main>
  );
}
