import { useQuery } from "@tanstack/react-query";
import api from "../config/axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import "../styles/Views/DashboardView.css";
import { Package, PlusSquare, Users, FileText } from "lucide-react";

export default function DashboardView() {

  const getStats = async () => {
    const token = Cookies.get("token");

    const { data } = await api.get("/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  };

  const { data: stats, } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getStats,
  });


  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          <span className="highlight">Bienvenido,</span> Admin
        </h1>

        <section className="dashboard-main">

          <div className="dashboard-actions">

            <Link to="/inventory" className="action-card">
              <Package size={28} />
              <p>Ver inventario</p>
            </Link>

            <Link to="/inventory/create-product" className="action-card">
              <PlusSquare size={28} />
              <p>Agregar producto</p>
            </Link>

            <Link to="/sales/register-client" className="action-card">
              <FileText size={28} />
              <p>Crear una venta</p>
            </Link>

            <Link to="/sales/register-client" className="action-card">
              <Users size={28} />
              <p>Crear nuevo empleado</p>
            </Link>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <p className="stat-title">Productos registrados</p>
              <h3>{stats?.products ?? 0}</h3>
            </div>

            <div className="stat-card">
              <p className="stat-title">Facturas totales</p>
              <h3>{stats?.invoices ?? 0}</h3>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}
