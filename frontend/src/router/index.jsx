import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import RegisterPage from "../pages/RegisterPage"; 

export default function AppRouter() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registerPage" element={<RegisterPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}