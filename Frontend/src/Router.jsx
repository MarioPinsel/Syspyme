import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginView from './views/Auth/LoginView'
import RegisterView from './views/Auth/RegisterView.jsx'
import RegisterVerify from './views/Auth/RegisterVerify.jsx'
import CompanyRegisterView from './views/CompanyRegisterView'
import AuthLayout from './layouts/AuthLayout'
import Homepage from './views/Homepage'
import LoginVerify from './views/Auth/LoginVerify.jsx'
import Inventory from "./views/Inventory.jsx"
import CreateProductView from "./views/Auth/CreateProduct.jsx";
import InventoryOptions from "./views/Auth/InventoryOptions.jsx";
import CreateSale from "./views/Auth/CreateSale.jsx";

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
          <Route path="create-product" element={<CreateProductView />} />
          <Route path="inventory-options" element={<InventoryOptions />} />
          <Route path="create-sale" element={<CreateSale />} />
        </Route>

        <Route path="/inventory" element={<AuthLayout />}>
          <Route path="info" element={<Inventory />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
} 