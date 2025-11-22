import { BrowserRouter, Routes, Route } from "react-router-dom"
import Common from './layouts/Common.jsx'
import Main from './layouts/main.jsx'

import LoginView from './views/Auth/LoginView.jsx'
import RegisterView from './views/Auth/RegisterView.jsx'
import RegisterVerify from './views/Auth/RegisterVerify.jsx'
import CompanyRegisterView from './views/Auth/CompanyRegisterView'
import CompanyRegisterVerify from './views/Auth/CompanyRegisterVerify.jsx'
import Homepage from './views/Homepage'
import LoginVerify from './views/Auth/LoginVerify.jsx'

import Inventory from "./views/Inventory/Inventory.jsx"
import CreateProductView from "./views/Inventory/CreateProduct.jsx";
import ActualizarProduct from "./views/Inventory/ActualizarProducto.jsx";
import CreateSale from "./views/Sales/CreateSale.jsx";
import RegisterClient from "./views/Sales/RegisterClient.jsx";
import Dashboard from "./views/Admin/DashboardView.jsx"
import BorrarProducto from "./views/Inventory/BorrarProducto.jsx"
import AgregarProducto from "./views/Inventory/AgregarProducto.jsx"
import RegistrarEmpleado from "./views/Admin/RegisterEmployee.jsx"
import BuscarFactura from "./views/Inventory/BuscarFactura.jsx"

import RequireAuth from "./components/RequireAuth.jsx";


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
          <Route path="companyRegister" element={<CompanyRegisterView />} />
          <Route path="registerVerify" element={<RegisterVerify />} />
          <Route path="companyRegisterVerify" element={<CompanyRegisterVerify />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={"admin"} />}>
          <Route path="/dashboard" element={<Common />}>
            <Route index element={<Dashboard />} />
            <Route path="register-employee" element={<RegistrarEmpleado />} />
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/inventory" element={<Common />}>
            <Route index element={<Inventory />} />
            <Route path="create-product" element={<CreateProductView />} />
            <Route path="actualizarproduct" element={<ActualizarProduct />} />
            <Route path="deleteProduct" element={<BorrarProducto />} />
            <Route path="agregarProduct" element={<AgregarProducto />} />
             <Route path="BuscarFactura" element={<BuscarFactura />} />
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["employee", "admin"]} />}>
          <Route path="/sales" element={<Common />}>
            <Route index element={<CreateSale />} />
            <Route path="register-client" element={<RegisterClient />} />
          </Route>
        </Route>



      </Routes>
    </BrowserRouter >
  );
}
