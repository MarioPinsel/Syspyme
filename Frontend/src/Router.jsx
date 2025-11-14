import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginView from './views/Auth/LoginView'
import RegisterView from './views/Auth/RegisterView.jsx'
import RegisterVerify from './views/Auth/RegisterVerify.jsx'
import CompanyRegisterView from './views/Auth/CompanyRegisterView'
import CompanyRegisterVerify from './views/Auth/CompanyRegisterVerify.jsx'
import Global from './layouts/Global.jsx'
import Homepage from './views/Homepage'
import LoginVerify from './views/Auth/LoginVerify.jsx'
import Inventory from "./views/Inventory.jsx"
import Dashboard from "./views/DashboardView.jsx"


export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Global />}>
          <Route index={true} element={<Homepage />} />
        </Route>

        <Route path="/auth" element={<Global />}>
          <Route path="login" element={<LoginView />} />
          <Route path="register" element={<RegisterView />} />
          <Route path="companyRegister" element={<CompanyRegisterView />} />
          <Route path="loginVerify" element={<LoginVerify />} />
          <Route path="registerVerify" element={<RegisterVerify />} />
          <Route path="companyRegisterVerify" element={<CompanyRegisterVerify />} />
        </Route>

        <Route path="/inventory" element={<Global />}>
          <Route path="info" element={<Inventory />} />
        </Route>

        <Route path="dashboard" element={<Global />}>
          <Route path="admin" element={<Dashboard />} />
        </Route>


      </Routes>
    </BrowserRouter >
  )
} 