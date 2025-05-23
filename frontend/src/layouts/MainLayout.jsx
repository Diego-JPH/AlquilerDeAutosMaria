import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen p-4">{children}</main>
      <Footer />
    </>
  );
}