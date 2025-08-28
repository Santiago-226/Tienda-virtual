import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Eye, Percent } from "lucide-react";
import { Link } from 'react-router-dom';
import API_URL from "../config/api.config";

// Tipos de datos
interface Product {
  id: number;
  nombre: string;
  precio: number;
  images: string[];
  category: string;
  descripcion?: string;
  stock?: number;
  marca?: string;
  precioOriginal?: number;
  rating?: number;
}

const DiscountProductCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Determinar cuántos items mostrar según el tamaño de pantalla
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerView(4); // Desktop grande: 4 items
      } else if (window.innerWidth >= 1024) {
        setItemsPerView(3); // Desktop: 3 items
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2); // Tablet: 2 items
      } else {
        setItemsPerView(1); // Móvil: 1 item
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    
    return () => {
      window.removeEventListener('resize', updateItemsPerView);
    };
  }, []);

  // Calcular porcentaje de descuento
  const calculateDiscountPercentage = (precio: number, precioOriginal: number) => {
    return Math.round(((precioOriginal - precio) / precioOriginal) * 100);
  };

  // Obtener productos del backend y ordenar por descuento
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        
        // Filtrar productos que tienen precio original (descuento) y ordenar por porcentaje de descuento
        const productsWithDiscount = data.filter((product: Product) => 
          product.precioOriginal && product.precioOriginal > product.precio
        );
        
        const sortedProducts = productsWithDiscount.sort((a: Product, b: Product) => {
          const discountA = calculateDiscountPercentage(a.precio, a.precioOriginal!);
          const discountB = calculateDiscountPercentage(b.precio, b.precioOriginal!);
          return discountB - discountA; // Orden descendente
        });
        
        // Tomar los primeros 10 productos con mayor descuento
        setProducts(sortedProducts.slice(0, 10));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const nextSlide = () => {
    if (products.length <= itemsPerView) return;
    
    setCurrentIndex((prevIndex) => {
      const maxIndex = products.length - itemsPerView;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  const prevSlide = () => {
    if (products.length <= itemsPerView) return;
    
    setCurrentIndex((prevIndex) => {
      const maxIndex = products.length - itemsPerView;
      return prevIndex === 0 ? maxIndex : prevIndex - 1;
    });
  };

  // Calcular el ancho de cada slide
  const getSlideWidth = () => {
    if (carouselRef.current) {
      return carouselRef.current.offsetWidth / itemsPerView;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando ofertas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay productos con descuento, no mostrar el componente
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Productos en <span className="text-red-600 italic">Oferta!</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Aprovecha nuestras mejores ofertas en productos agrícolas de calidad
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Carrusel */}
        <div className="relative" ref={carouselRef}>
          {/* Botones de navegación - Solo mostrar en pantallas grandes */}
          {products.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors focus:outline-none"
                aria-label="Ofertas anteriores"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>

              <button
                onClick={nextSlide}
                className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors focus:outline-none"
                aria-label="Siguientes ofertas"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Contenedor del carrusel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * getSlideWidth()}px)`,
                width: `${products.length * (100 / itemsPerView)}%`,
              }}
            >
              {products.map((product) => {
                const discountPercentage = calculateDiscountPercentage(
                  product.precio,
                  product.precioOriginal!
                );
                
                return (
                  <div
                    key={product.id}
                    className="px-2 sm:px-3"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <Link to={`/products/${product.id}`}>
                      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col relative">
                        <div className="relative overflow-hidden flex-grow">
                          <img
                            src={product.images[0]}
                            alt={product.nombre}
                            className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {/* Badge de descuento */}
                          <div className="absolute top-2 left-2">
                            <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                              <Percent className="h-3 w-3 mr-1" />
                              {discountPercentage}% OFF
                            </div>
                          </div>

                          {/* Botón de vista rápida */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-lg transition-colors">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                            </div>
                          </div>

                          {/* Etiqueta "OFERTA" */}
                          <div className="absolute bottom-2 left-2">
                            <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                              OFERTA
                            </span>
                          </div>
                        </div>

                        <div className="p-3 sm:p-4 flex flex-col flex-grow">
                          <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                            {product.nombre}
                          </h3>

                          <div className="mt-auto">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg sm:text-xl font-bold text-red-600">
                                {formatPrice(product.precio)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.precioOriginal!)}
                              </span>
                            </div>
                            
                            <div className="text-xs sm:text-sm text-green-600 font-medium">
                              Ahorras: {formatPrice(product.precioOriginal! - product.precio)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Indicadores de paginación y botones de navegación para móvil */}
        {products.length > itemsPerView && (
          <div className="flex items-center justify-center mt-8 space-x-4">
            {/* Botón anterior para móvil */}
            <button
              onClick={prevSlide}
              className="md:hidden bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              aria-label="Ofertas anteriores"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>

            {/* Indicadores */}
            <div className="flex space-x-2">
              {Array.from({
                length: products.length - itemsPerView + 1,
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-red-600 w-4 sm:w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir a la página ${index + 1}`}
                />
              ))}
            </div>

            {/* Botón siguiente para móvil */}
            <button
              onClick={nextSlide}
              className="md:hidden bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              aria-label="Siguientes ofertas"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        )}

        {/* Botón para ver todas las ofertas */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/products?filter=discount"
            className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
          >
            Ver todas las ofertas
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DiscountProductCarousel;