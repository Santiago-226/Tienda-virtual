import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <Router>
      <Header />
      <main className="pt-10 md:pt-20"> {/* Para que no tape el contenido el header fijo */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
