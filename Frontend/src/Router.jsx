import { BrowserRouter, Routes, Route } from "react-router-dom";
import Common from './layouts/Common.jsx';
import Main from './layouts/main.jsx';

import LoginView from './views/Auth/LoginView.jsx';
import RegisterView from './views/Auth/RegisterView.jsx';
import RegisterVerify from './views/Auth/RegisterVerify.jsx';
import CompanyRegisterView from './views/Auth/CompanyRegisterView';
import CompanyRegisterVerify from './views/Auth/CompanyRegisterVerify.jsx';
import Homepage from './views/Homepage';
import LoginVerify from './views/Auth/LoginVerify.jsx';
import EmployeeDashboard from "./views/Admin/EmployeeDashboardView.jsx";
import NewCompanyRegisterView from "./views/Auth/NewCompanyRegisterView.jsx"
import DianLoginView from "./views/Dian/DianLoginView.jsx";
import DianDashboard from "./views/Dian/DianDashboard.jsx"
import DianCompany from "./views/Dian/DianCompany.jsx";
import DianReports from "./views/Dian/DianReports.jsx";
import DianVerification from "./views/Dian/DianVerification.jsx"

import Inventory from "./views/Inventory/Inventory.jsx";
import CreateProductView from "./views/Inventory/CreateProduct.jsx";
import ActualizarProduct from "./views/Inventory/ActualizarProducto.jsx";
import CreateSale from "./views/Sales/CreateSale.jsx";
import RegisterClient from "./views/Sales/RegisterClient.jsx";
import Dashboard from "./views/Admin/DashboardView.jsx";
import BorrarProducto from "./views/Inventory/BorrarProducto.jsx";
import AgregarProducto from "./views/Inventory/AgregarProducto.jsx";
import RegistrarEmpleado from "./views/Admin/RegisterEmployee.jsx";
import BuscarFactura from "./views/Sales/BuscarFactura.jsx";

import RequireAuth from "./components/RequireAuth.jsx";
import NotFound from "./components/NotFound.jsx"; 

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Main />}>
          <Route index element={<Homepage />} />
        </Route>

        <Route path="/auth" element={<Main />}>
          <Route path="login" element={<LoginView />} />
          <Route path="loginVerify" element={<LoginVerify />} />
          <Route path="register" element={<RegisterView />} />
          <Route path="newregister" element={<NewCompanyRegisterView/>} />
          <Route path="companyRegister" element={<CompanyRegisterView />} />
          <Route path="registerVerify" element={<RegisterVerify />} />
          <Route path="companyRegisterVerify" element={<CompanyRegisterVerify />} />
          <Route path="login-dian" element={<DianLoginView/>} />
        </Route>

        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/dashboard" element={<Common />}>
            <Route index element={<Dashboard />} />
            <Route path="register-employee" element={<RegistrarEmpleado />} />
          </Route>

          <Route path="/inventory" element={<Common />}>
            <Route index element={<Inventory />} />
            <Route path="create-product" element={<CreateProductView />} />
            <Route path="actualizarproduct" element={<ActualizarProduct />} />
            <Route path="deleteProduct" element={<BorrarProducto />} />
            <Route path="agregarProduct" element={<AgregarProducto />} />
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["employee", "admin"]} />}>
          <Route path="/sales" element={<Common />}>
            <Route path="create-sale" element={<CreateSale />} />
            <Route path="register-client" element={<RegisterClient />} />
            <Route path="BuscarFactura" element={<BuscarFactura />} />
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["employee"]} />}>
          <Route path="/employee" element={<Common />}>
            <Route index element={<EmployeeDashboard />} />
          </Route>
        </Route>

     
        <Route element={<RequireAuth allowedRoles={["dian"]} />}>
          <Route path="/dian" element={<Common />}>
            <Route index element={<DianDashboard />} />
            <Route path="companies" element={<DianCompany/>} />
            <Route path="reports" element={<DianReports />} />
            <Route path ="verification" element={<DianVerification />} />
          </Route>
        </Route>
        
      {/* <Route path="/dian" element={<Common />}>
  <Route index element={<DianDashboard />} />
  <Route path="companies" element={<DianCompany/>} />
  <Route path="reports" element={<DianReports />} />
  <Route path ="verification" element={<DianVerification />} />
</Route>*/}

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}