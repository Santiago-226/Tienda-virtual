import React, { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, Phone } from "lucide-react";
import LogoTienda from "../assets/images/Icon.svg";
import { Link, useLocation } from "react-router-dom";
import { brandConfig } from "../utils/brandConfig";

// Interfaz para los items del carrito
interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  precioOriginal?: number;
  image: string;
  quantity: number;
  stock: number;
  category: string;
  marca: string;
}

const Header = () => {
  const location = useLocation(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const menuItems = [
    { id: "/", label: "Inicio" },
    { id: "/products", label: "Productos" },
    { id: "/categories", label: "Categorías" },
    { id: "/about", label: "Nosotros" },
  ];

  // Función para actualizar el contador del carrito
  const updateCartData = () => {
    try {
      const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      const total = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
      
      setCartCount(count);
      setCartTotal(total);
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      setCartCount(0);
      setCartTotal(0);
    }
  };

  // Efecto para cargar los datos iniciales del carrito
  useEffect(() => {
    updateCartData();

    // Escuchar cambios en localStorage desde otras pestañas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        updateCartData();
      }
    };

    // Escuchar evento personalizado para cambios locales
    const handleCartUpdate = () => {
      updateCartData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Intervalo para verificar cambios (fallback)
    const interval = setInterval(updateCartData, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  // Efecto para actualizar el carrito cuando cambia la ruta
  useEffect(() => {
    updateCartData();
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <header className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 shadow-lg fixed w-full top-0 z-50 border-b border-green-700">
      <nav className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo empresarial - A la izquierda */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 backdrop-blur-sm p-1 sm:p-2">
                <img src={LogoTienda} alt="Agro Tienda Logo" className="w-full h-full object-contain" />
              </div>

              <div className="text-white min-w-0 hidden sm:block">
                <h1 className="text-base sm:text-lg md:text-xl font-bold leading-tight truncate">
                  {brandConfig.name}
                </h1>
                <p className="text-[10px] sm:text-xs text-green-100 leading-tight truncate">
                  {brandConfig.slogan}
                </p>
              </div>
            </Link>
          </div>

          {/* Menú Desktop - Centrado */}
          <div className="hidden lg:flex justify-center flex-1">
            <ul className="flex space-x-4 xl:space-x-8">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.id}
                    className={`text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg whitespace-nowrap ${
                      location.pathname === item.id
                        ? "text-green-900 bg-white/90 backdrop-blur-sm shadow-sm"
                        : "text-green-50 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Iconos de acción - A la derecha */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Carrito - Con funcionalidad completa */}
            <Link to="/carrito">
              <div className="relative group">
                <button className="cursor-pointer relative text-green-100 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 flex-shrink-0">
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                  
                  {/* Contador del carrito */}
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium min-w-4 sm:min-w-5 animate-pulse">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>

                {/* Tooltip con información del carrito - Solo desktop */}
                {cartCount > 0 && (
                  <div className="hidden lg:block absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800">Tu Carrito</h3>
                        <span className="text-sm text-gray-600">{cartCount} productos</span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span className="font-medium text-green-600">
                            {formatPrice(cartTotal)}
                          </span>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                          Ver Carrito Completo
                        </div>
                      </div>
                    </div>

                    {/* Flecha del tooltip */}
                    <div className="absolute bottom-full right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white"></div>
                  </div>
                )}
              </div>
            </Link>

            {/* Botón contactar - Solo desktop/tablet */}
            <button className="hidden sm:flex bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 md:px-4 rounded-lg transition-all duration-200 items-center space-x-2 shadow-md hover:shadow-lg">
              <Phone className="h-4 w-4" />
              <span className="font-medium text-sm">Contactar</span>
            </button>

            {/* Botón hamburguesa - Mobile */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-green-900/95 backdrop-blur-sm border-t border-green-700">
          <div className="px-4 py-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.id}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.id
                    ? "text-green-900 bg-white/90 font-medium shadow-sm"
                    : "text-green-50 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Información del carrito en móvil */}
            {cartCount > 0 && (
              <Link
                to="/carrito"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg transition-all duration-200 bg-green-800/50 border border-green-600/30"
              >
                <div className="flex items-center justify-between text-green-100">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Mi Carrito ({cartCount})</span>
                  </div>
                  <span className="font-medium text-green-200">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </Link>
            )}
            
            {/* Botón contactar en menú móvil */}
            <div className="pt-3 border-t border-green-700/50 mt-3">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md">
                <Phone className="h-4 w-4" />
                <span className="font-medium">Contactar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;