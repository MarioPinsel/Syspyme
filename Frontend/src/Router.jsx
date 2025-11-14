import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginView from './views/Auth/LoginView'
import RegisterView from './views/Auth/RegisterView.jsx'
import RegisterVerify from './views/Auth/RegisterVerify.jsx'
import CompanyRegisterView from './views/CompanyRegisterView'
import AuthLayout from './layouts/AuthLayout'
import Homepage from './views/Homepage'
import LoginVerify from './views/Auth/LoginVerify.jsx'
import Inventory from "./views/Inventory.jsx"

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
          <Route path="companyRegister" element={<CompanyRegisterView />} />
          <Route path="loginVerify" element={<LoginVerify />} />
          <Route path="registerVerify" element={<RegisterVerify />} />
        </Route>

        <Route path="/inventory" element={<AuthLayout />}>
          <Route path="info" element={<Inventory />} />
        </Route>


      </Routes>
    </BrowserRouter>
  )
} 