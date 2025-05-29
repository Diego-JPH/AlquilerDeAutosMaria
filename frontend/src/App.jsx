import { useState, useEffect } from "react";
import AppRouter from "./router";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return <AppRouter isLoggedIn={isLoggedIn} onLogout={handleLogout} />;
}