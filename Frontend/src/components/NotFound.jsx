import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Views/NotFound.css";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="container text-center mt-5">
        <h1>Error 404</h1>
        <p>Lo sentimos en Syspyme, La página que estás buscando no existe.</p>
      </div>
      <Footer />
    </>
  );
}
