import React from "react";
import {
  Leaf,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  CreditCard,
  Shield,
  Clock,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Sección principal del footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start border border-gray-800 rounded-xl p-8 bg-gray-800/50">
          {/* Columna 1: Información de la empresa */}
          <div className="space-y-6">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-500 mr-3" />
              <span className="text-2xl font-bold">AgroTienda</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Proveedores líderes de productos agrícolas de alta calidad en
              Colombia. Ofrecemos semillas certificadas, fertilizantes orgánicos
              y herramientas profesionales.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Columna 2: Información de contacto */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Carrera 45 # 20-10, Bogotá, Colombia
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">+57 1 234 5678</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">info@agrotienda.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Lun-Vie: 8:00 AM - 6:00 PM
                  <br />
                  Sáb: 9:00 AM - 2:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sección de métodos de pago y seguridad */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="text-gray-400">Aceptamos:</span>
              <div className="flex space-x-2">
                <CreditCard className="h-8 w-8 text-gray-400" />
                <div className="h-8 w-8 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                  PSE
                </div>
                <div className="h-8 w-8 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                  EF
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-gray-400">Sitio seguro protegido</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AgroTienda. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
