import { Link } from "react-router-dom";
import "../../styles/Views/DianDashboardView.css";
import { Building, FileSearch } from "lucide-react";

export default function DIANDashboard() {
  return (
    <div className="dian-dashboard-container">
      <h1 className="dian-title">Panel de Control - DIAN</h1>

      <div className="dian-actions">
        
        <Link to="/dian/companies" className="dian-card">
          <Building size={60} />
          <p>Revisión de Empresas</p>
        </Link>

        <Link to="/dian/reports" className="dian-card">
          <FileSearch size={60} />
          <p>Revisión de Certificados</p>
        </Link>
          
      </div>
    </div>
  );
}