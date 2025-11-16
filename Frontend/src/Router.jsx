import { BrowserRouter, Routes, Route } from "react-router-dom"
import Global from './layouts/Global.jsx'
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
import CreateSale from "./views/Inventory/CreateSale.jsx";
import RegisterClient from "./views/Inventory/RegisterClient.jsx";
import Dashboard from "./views/DashboardView.jsx"
import BorrarProducto from "./views/Inventory/BorrarProducto.jsx"
import AgregarProducto from "./views/Inventory/AgregarProducto.jsx"
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Global />}>
          <Route index={true} element={<Homepage />} />
        </Route>

        <Route path="/auth" element={<Global />}>
          <Route path="login" element={<LoginView />} />
          <Route path="loginVerify" element={<LoginVerify />} />
          <Route path="register" element={<RegisterView />} />
          <Route path="companyRegister" element={<CompanyRegisterView />} />
          <Route path="registerVerify" element={<RegisterVerify />} />
          <Route path="companyRegisterVerify" element={<CompanyRegisterVerify />} />
        </Route>

        <Route path="/inventory" element={<Global />}>
          <Route index={true} element={<Inventory />} />
          <Route path="create-product" element={<CreateProductView />} />
          <Route path="actualizarproduct" element={<ActualizarProduct />} />
          <Route path="deleteProduct" element={<BorrarProducto />} />
          <Route path="agregarProduct" element={<AgregarProducto />} />
        </Route>

        <Route path="/sales" element={<Global />}>
          <Route path="create-sale" element={<CreateSale />} />
          <Route path="register-client" element={<RegisterClient />} />
        </Route>
        <Route path="dashboard" element={<Global />}>
          <Route index={true} element={<Dashboard />} />
        </Route>


      </Routes>
    </BrowserRouter >
  )
} 