import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout({ children, isLoggedIn, onLogout }) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <main className="flex-1 p-4">{children}</main>
      <Footer />
    </div>
  );
}