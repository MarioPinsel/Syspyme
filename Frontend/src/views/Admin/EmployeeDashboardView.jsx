import { Link } from "react-router-dom";
import "../../styles/Views/EmployeeDashboardView.css";
import { UserPlus, FilePlus2,Receipt } from "lucide-react";

export default function EmployeeDashboardView() {
  return (
    <div className="employee-dashboard-container">
      <h1 className="employee-title">Panel del Empleado</h1>

      <div className="employee-actions">
        
        <Link to="/sales/register-client" className="employee-card">
          <UserPlus size={60} />
          <p>Crear Cliente</p>
        </Link>

        <Link to="/sales/create-sale" className="employee-card">
          <FilePlus2 size={60} />
          <p>Registrar Venta</p>
        </Link>

    
        <Link to="/inventory/BuscarFactura" className="employee-card">
              <Receipt size={60} />
              <p>Buscar Factura</p>
             </Link>
          
      </div>
    </div>
  );
}
