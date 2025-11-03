import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginView from './views/LoginView'
import RegisterView from './views/RegisterView'
import CompanyRegisterView from './views/CompanyRegisterVIew'
import AuthLayout from './layouts/AuthLayout'
import Homepage from './views/Homepage'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/register" element={<RegisterView />} />
          <Route path="/auth/company-register" element={<CompanyRegisterView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
} 
