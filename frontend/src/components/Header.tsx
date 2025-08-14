import React, { useState } from "react";
import { Menu, X, ShoppingCart, Phone } from "lucide-react";
import LogoTienda from "../assets/images/Icon.svg";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "/", label: "Inicio" },
    { id: "/productos", label: "Productos" },
    { id: "/servicios", label: "Servicios" },
    { id: "/nosotros", label: "Nosotros" },
    { id: "/contacto", label: "Contacto" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 shadow-lg fixed w-full top-0 z-50 border-b border-green-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo empresarial */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 backdrop-blur-sm p-1 sm:p-2">
              <img src={LogoTienda} alt="Agro Tienda Logo" className="w-full h-full object-contain" />
            </div>

            <div className="text-white min-w-0 flex-1">
              <h1 className="text-base sm:text-lg md:text-xl font-bold leading-tight truncate">
                Agro Tienda
              </h1>
              <p className="text-[10px] sm:text-xs text-green-100 leading-tight truncate">
                Tu aliado en cada siembra
              </p>
            </div>
          </div>

          {/* Menú Desktop */}
          <ul className="hidden lg:flex space-x-8 mx-8">
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

          {/* Iconos de acción - Siempre visibles */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Carrito - Siempre visible */}
            <button className="relative text-green-100 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 flex-shrink-0">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">
                3
              </span>
            </button>

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