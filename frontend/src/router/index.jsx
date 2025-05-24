import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import MainLayout from "../layouts/MainLayout";

export default function AppRouter() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registerPage" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
