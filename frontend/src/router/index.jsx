import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import MainLayout from "../layouts/MainLayout";
import RegisterPage from "../pages/RegisterPage"; 
import CreateReserve from "../pages/CreateReserve"
import ManageVehicles from "../pages/ManageVehicles";
import RecoverPasswordPage from "../pages/RecoverPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
export default function AppRouter() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registerPage" element={<RegisterPage />} />
          <Route path="/create-reserve" element={<CreateReserve />} />
          <Route path="/manageVehicles" element={<ManageVehicles />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recoverPassword" element={<RecoverPasswordPage/>} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
