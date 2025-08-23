// ProductCard.tsx
import React from "react";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Link } from 'react-router-dom';


// Tipos de datos
export interface Product {
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

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
  onAddToCart: (product: Product) => void;
  getProductCartQuantity: (productId: number) => number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  onAddToCart,
  getProductCartQuantity
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (viewMode === "grid") {
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden border border-gray-100">
        <div className="relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.nombre}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badge de categoría */}
          <div className="absolute top-3 left-3">
            <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              {product.category}
            </span>
          </div>

          {/* Botones de acción */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link to={`/products/${product.id}`}>
              <button className="cursor-pointer bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors">
                <Eye className="h-4 w-4 text-gray-600" />
              </button>
            </Link>
            <button
              onClick={() => onAddToCart(product)}
              className="cursor-pointer bg-green-600 hover:bg-green-700 p-2 rounded-full shadow-lg transition-colors"
            >
              <ShoppingCart className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <Link to={`/products/${product.id}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-1">
              {product.nombre}
            </h3>
          </Link>

          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400 text-xs sm:text-sm">
              {[...Array(5)].map((_, i) => {
                if (!product.rating) {
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

          <div className="flex flex-col justify-between gap-3">
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(product.precio)}
            </div>

            <div className="flex justify-between gap-2">
              <Link to={`/products/${product.id}`} className="flex-1">
                <button className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Ver más</span>
                </button>
              </Link>
              <button
                onClick={() => onAddToCart(product)}
                className="cursor-pointer flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de lista
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="flex">
        <div className="w-48 h-32 flex-shrink-0">
          <img 
            src={product.images[0]} 
            alt={product.nombre}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-6 flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium mr-3">
                {product.category}
              </span>
              <div className="flex text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
              </div>
              {getProductCartQuantity(product.id) > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                  {getProductCartQuantity(product.id)} en carrito
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{product.nombre}</h3>
            <p className="text-gray-600">{product.descripcion || "Producto de alta calidad para agricultura profesional"}</p>
          </div>
          
          <div className="flex flex-col items-end space-y-3">
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(product.precio)}
            </div>

            <div className="flex gap-2">
              <Link to={`/products/${product.id}`}>
                <button className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Ver más</span>
                </button>
              </Link>
              <button 
                onClick={() => onAddToCart(product)}
                className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;