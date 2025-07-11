import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// Páginas públicas
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RecoverPasswordPage from "../pages/RecoverPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import VerifyCodePage from "../pages/VerifyCodePage";
import Home from "../pages/Home"; // Vista central que redirige a cliente/admin o vista pública
import RegisterEmployeePage from "../pages/RegisterEmployeePage";

// Cliente
import CreateReserve from "../pages/CreateReserve";
import ReservePage from "../pages/ReservePage";
import PaymentPage from "../pages/PaymentPage";

// Admin
import ManageVehicles from "../pages/ManageVehicles";
import ReservationsAdminPage from "../pages/ReservationAdminPage";
import ActualizarSucursal from "../pages/ActualizarSucursal"; // 👈 Import nuevo
import AdminMetrics from "../pages/admin/AdminMetrics";
import ClientRegisterListPage from "../pages/admin/ClientRegisterListPage";

// Empleado
import EmployeeReserve from "../pages/employee/ReservationEmployeePage";
import RegisterClientePorEmpleadoForm from "../components/RegisterFormEmpleado";
import EmployeeVehicleCatalogToReserve from "../components/EmployeeVehicleCatalogToReserve";
import EmployeeCreateReserveForm from "../components/EmployeeCreateReserveForm";
import EmployeePaymentPage from "../pages/EmployeePaymentPage";

export default function AppRouter({ isLoggedIn, onLogout }) {
  return (
    <Router>
      <MainLayout isLoggedIn={isLoggedIn} onLogout={onLogout}>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registerPage" element={<RegisterPage />} />
          <Route path="/recoverPassword" element={<RecoverPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verificarCodigo" element={<VerifyCodePage />} />
          <Route path="/registerEmployee" element={<RegisterEmployeePage />} />

          {/* Cliente */}
          <Route path="/create-reserve" element={<CreateReserve />} />
          <Route path="/reserve" element={<ReservePage />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* Admin */}
          <Route path="/manageVehicles" element={<ManageVehicles />} />
          <Route path="/adminReserve" element={<ReservationsAdminPage />} />
          <Route path="/admin/actualizar-sucursal" element={<ActualizarSucursal />} /> 
          <Route path="/adminMetrics" element={<AdminMetrics />} />
          <Route path="/admin/clientes-registrados" element={<ClientRegisterListPage />} />
          
          {/* Empleado */}
          <Route path="/employeeReserve" element={<EmployeeReserve />} />
          <Route path="/registrar-cliente" element={<RegisterClientePorEmpleadoForm />} />
          <Route path="/employee/catalog" element={<EmployeeVehicleCatalogToReserve />} />
          <Route path="/employee/create-reserve" element={<EmployeeCreateReserveForm />} />
          <Route path="/employee/payment" element={<EmployeePaymentPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}