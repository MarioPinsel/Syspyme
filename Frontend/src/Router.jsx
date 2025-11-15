import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginView from './views/Auth/LoginView'
import RegisterView from './views/Auth/RegisterView.jsx'
import RegisterVerify from './views/Auth/RegisterVerify.jsx'
import CompanyRegisterView from './views/CompanyRegisterView'
import AuthLayout from './layouts/AuthLayout'
import Homepage from './views/Homepage'
import LoginVerify from './views/Auth/LoginVerify.jsx'
import Inventory from "./views/Inventory.jsx"
import CreateProductView from "./views/Inventory/CreateProduct.jsx";
import InventoryOptions from "./views/Inventory/ActualizarProducto.jsx";
import CreateSale from "./views/Inventory/CreateSale.jsx";
import RegisterClient from "./views/Inventory/RegisterClient.jsx";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index={true} element={<Homepage />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginView />} />
          <Route path="register" element={<RegisterView />} />
          <Route path="company-register" element={<CompanyRegisterView />} />
          <Route path="loginVerify" element={<LoginVerify />} />
          <Route path="registerVerify" element={<RegisterVerify />} />


        </Route>

        <Route path="/inventory" element={<AuthLayout />}>
          <Route path="inicio" element={<Inventory />} />
          <Route path="create-product" element={<CreateProductView />} />
          <Route path="inventory-options" element={<InventoryOptions />} />
          <Route path="create-sale" element={<CreateSale />} />
          <Route path="register-client" element={<RegisterClient />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
} 