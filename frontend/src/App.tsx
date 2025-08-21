import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from './pages/ProductDetail';
import Carrito from './pages/Carrito';
import Footer from './components/Footer';
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <Header />
      <ScrollToTop />
      <main className="pt-10 md:pt-20"> {/* Para que no tape el contenido el header fijo */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
      </main>
      <Footer/>
    </Router>
  );
}

export default App;
