import React, { useState } from "react";
import { Menu, X, ShoppingCart, Search, Phone } from "lucide-react";
import LogoTienda from "../assets/images/Icon.svg";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState("inicio");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "inicio", label: "Inicio" },
    { id: "productos", label: "Productos" },
    { id: "servicios", label: "Servicios" },
    { id: "nosotros", label: "Nosotros" },
    { id: "contacto", label: "Contacto" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 shadow-lg fixed w-full top-0 z-50 border-b border-green-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo empresarial */}
          <div className="flex items-center space-x-2 sm:space-x-3 max-w-[70%] overflow-hidden">
            <div className="w-12 h-12 sm:w-16 flex justify-center sm:h-16 md:w-20 md:h-20 flex-shrink-0 backdrop-blur-sm p-1 sm:p-2">
              <img src={LogoTienda} alt="" />
            </div>

            <div className="text-white truncate">
              <h1 className="text-base sm:text-lg md:text-xl font-bold leading-tight">
                Agro Tienda
              </h1>
              <p className="text-[10px] sm:text-xs text-green-100 leading-tight">
                Tu aliado en cada siembra
              </p>
            </div>
          </div>

          {/* Menú de navegación - Desktop */}
          <ul className="hidden lg:flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveMenu(item.id)}
                  className={`text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg ${
                    activeMenu === item.id
                      ? "text-green-900 bg-white/90 backdrop-blur-sm shadow-sm"
                      : "text-green-50 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Iconos de acción - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-green-100 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
              <Search className="h-5 w-5" />
            </button>
            <button className="relative text-green-100 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg">
              <Phone className="h-4 w-4" />
              <span className="font-medium">Contactar</span>
            </button>
          </div>

          {/* Botón hamburguesa - Mobile */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden bg-green-900/95 backdrop-blur-sm border-t border-green-600/50`}
      >
        <div className="px-4 py-4 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                activeMenu === item.id
                  ? "text-green-900 bg-white/90 font-medium shadow-sm"
                  : "text-green-50 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Acciones móviles */}
          <div className="pt-4 border-t border-green-600/50 space-y-3">
            <button className="flex items-center space-x-3 text-green-100 hover:text-white w-full px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
              <Search className="h-5 w-5" />
              <span>Buscar productos</span>
            </button>
            <button className="flex items-center space-x-3 text-green-100 hover:text-white w-full px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              <span>Carrito (3)</span>
            </button>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-md">
              <Phone className="h-4 w-4" />
              <span className="font-medium">Contactar Ahora</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;