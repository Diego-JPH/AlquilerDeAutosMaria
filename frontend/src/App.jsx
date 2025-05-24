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
    setIsLoggedIn(false);
  };

  return <AppRouter isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />;
}
// This code initializes the main application component, managing the login state and rendering the router with the necessary props for authentication. It checks for a token in local storage to determine if the user is logged in and provides functions to handle login and logout actions. The `AppRouter` component is responsible for defining the application's routes and layouts.