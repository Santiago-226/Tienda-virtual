import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Eye } from "lucide-react";
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

const ProductCarousel = () => {
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

  // Obtener productos del backend y ordenar por rating
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        
        // Filtrar productos con rating y ordenar por rating descendente
        const productsWithRating = data.filter((product: Product) => product.rating);
        const sortedProducts = productsWithRating.sort((a: Product, b: Product) => {
          // Asegurarse de que ambos productos tienen rating
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA; // Orden descendente
        });
        
        // Tomar los primeros 8 productos con mejor rating
        setProducts(sortedProducts.slice(0, 8));
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
      const maxIndex = Math.ceil(products.length / itemsPerView) - 1;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  const prevSlide = () => {
    if (products.length <= itemsPerView) return;
    
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.ceil(products.length / itemsPerView) - 1;
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Productos <span className="text-green-600">Mejor Calificados</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestros productos agrícolas mejor calificados por nuestros clientes
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-yellow-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Carrusel */}
        <div className="relative" ref={carouselRef}>
          {/* Botones de navegación - Solo mostrar en pantallas grandes */}
          {products.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors focus:outline-none"
                aria-label="Productos anteriores"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>

              <button
                onClick={nextSlide}
                className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors focus:outline-none"
                aria-label="Siguientes productos"
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
              {products.map((product) => (
                <div
                  key={product.id}
                  className="px-2 sm:px-3"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <Link to={`/products/${product.id}`}>
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 cursor-pointer h-full flex flex-col">
                      <div className="relative overflow-hidden flex-grow">
                        <img
                          src={product.images[0]}
                          alt={product.nombre}
                          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Badge de categoría */}
                        <div className="absolute top-2 left-2">
                          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {product.category}
                          </span>
                        </div>

                        {/* Botón de vista rápida */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-lg transition-colors">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                          </div>
                        </div>
                      </div>

                      <div className="p-3 sm:p-4 flex flex-col flex-grow">
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                          {product.nombre}
                        </h3>

                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400 text-xs sm:text-sm">
                            {[...Array(5)].map((_, i) => {
                              if (!product.rating) {
                                // ⭐ si no hay rating → todas grises
                                return (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300"
                                  />
                                );
                              }

                              const ratingValue = i + 1;
                              if (product.rating >= ratingValue) {
                                return (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 sm:h-4 sm:w-4 fill-current"
                                  />
                                );
                              } else if (product.rating >= ratingValue - 0.5) {
                                return (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400"
                                    fill="url(#half-grad)"
                                  />
                                );
                              } else {
                                return (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300"
                                  />
                                );
                              }
                            })}

                            {/* Gradiente para media estrella */}
                            <svg width="0" height="0">
                              <defs>
                                <linearGradient id="half-grad">
                                  <stop
                                    offset="50%"
                                    stopColor="rgb(250 204 21)"
                                  />
                                  <stop
                                    offset="50%"
                                    stopColor="rgb(229 231 235)"
                                  />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>

                          {/* Texto al lado */}
                          <span className="text-gray-500 text-xs sm:text-sm ml-1">
                            {product.rating
                              ? `(${product.rating.toFixed(1)})`
                              : "(Sin calificaciones)"}
                          </span>
                        </div>

                        <div className="mt-auto">
                          <div className="text-lg sm:text-xl font-bold text-green-600">
                            {formatPrice(product.precio)}
                            {product.precioOriginal && (
                              <span className="text-xs sm:text-sm text-gray-500 line-through ml-1 sm:ml-2 block sm:inline">
                                {formatPrice(product.precioOriginal)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
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
              aria-label="Productos anteriores"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>

            {/* Indicadores */}
            <div className="flex space-x-2">
              {Array.from({
                length: Math.ceil(products.length / itemsPerView),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-green-600 w-4 sm:w-6"
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
              aria-label="Siguientes productos"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        )}

        {/* Botón para ver todos los productos */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/productos"
            className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
          >
            Ver todos los productos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;