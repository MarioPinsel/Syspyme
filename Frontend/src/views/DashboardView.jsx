import "../styles/DashboardView.css";
import { Package, PlusSquare, Users, FileText } from "lucide-react";

export default function DashboardView() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>
          <span className="highlight">Bienvenido,</span> Admin
        </h1>
      </header>

      <section className="dashboard-main">
        <div className="dashboard-actions">
          <div className="action-card">
            <Package size={28} />
            <p>Ver inventario</p>
          </div>
          <div className="action-card">
            <PlusSquare size={28} />
            <p>Agregar producto</p>
          </div>
          <div className="action-card">
            <Users size={28} />
            <p>Ver empleados</p>
          </div>
          <div className="action-card">
            <FileText size={28} />
            <p>Factura electrónica</p>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <p className="stat-title">Productos registrados</p>
            <h3>250</h3>
          </div>
          <div className="stat-card">
            <p className="stat-title">Cantidad de empleados</p>
            <h3>8</h3>
          </div>
          <div className="stat-card">
            <p className="stat-title">Ventas totales</p>
            <h3>1,564</h3>
          </div>
        </div>
      </section>

      <section className="dashboard-activity">
        <h2>Actividades recientes</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span>Producto agregado</span>
            <span className="date">24 de Octubre 2025</span>
          </div>
          <div className="activity-item">
            <span>Producto eliminado</span>
            <span className="date">24 de Octubre 2025</span>
          </div>
          <div className="activity-item">
            <span>Venta realizada</span>
            <span className="date">24 de Octubre 2025</span>
          </div>
        </div>
      </section>

      <footer className="dashboard-footer">
        <div className="waves"></div>
      </footer>
    </div>
  );
}
