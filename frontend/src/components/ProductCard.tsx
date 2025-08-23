import React, { useState } from "react";
import { Star, Eye, ShoppingCart } from "lucide-react";
import { Link } from 'react-router-dom';

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

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
  formatPrice: (price: number) => string;
  viewMode?: "grid" | "list";
}

// Componente de imagen optimizada
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className: string;
  onLoad?: () => void;
}> = ({ src, alt, className, onLoad }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="relative overflow-hidden">
      {!imageLoaded && (
        <div
          className={`${className} bg-gray-300 animate-pulse flex items-center justify-center`}
        >
          <div className="text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      <img
        src={imageError ? "/placeholder.png" : src}
        alt={alt}
        className={`${className} ${
          imageLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

// Componente de rating con estrellas
const StarRating: React.FC<{ rating?: number; size?: "sm" | "md" }> = ({ 
  rating, 
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "h-3 w-3 sm:h-4 sm:w-4",
    md: "h-4 w-4"
  };

  return (
    <div className="flex items-center">
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => {
          if (!rating) {
            return (
              <Star
                key={i}
                className={`${sizeClasses[size]} text-gray-300`}
              />
            );
          }

          const ratingValue = i + 1;
          if (rating >= ratingValue) {
            return (
              <Star
                key={i}
                className={`${sizeClasses[size]} fill-current`}
              />
            );
          } else if (rating >= ratingValue - 0.5) {
            return (
              <Star
                key={i}
                className={`${sizeClasses[size]} text-yellow-400`}
                fill="url(#half-grad)"
              />
            );
          } else {
            return (
              <Star
                key={i}
                className={`${sizeClasses[size]} text-gray-300`}
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

      <span className={`text-gray-500 ml-1 ${size === 'sm' ? 'text-xs sm:text-sm' : 'text-sm'}`}>
        {rating
          ? `(${rating.toFixed(1)})`
          : "(Sin calificaciones)"}
      </span>
    </div>
  );
};

// Componente ProductCard para vista en grid
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenModal,
  formatPrice
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden border border-gray-100">
      <div className="relative overflow-hidden">
        <OptimizedImage
          src={product.images[0]}
          alt={product.nombre}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          onLoad={() => setImageLoaded(true)}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Badge de categoría */}
        <div className="absolute top-3 left-3">
          <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {product.category}
          </span>
        </div>

        {/* Descuento badge */}
        {product.precioOriginal && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              -{Math.round(((product.precioOriginal - product.precio) / product.precioOriginal) * 100)}%
            </span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link to={`/products/${product.id}`}>
            <button className="cursor-pointer bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors">
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
          </Link>
          <button
            onClick={() => onOpenModal(product)}
            className="cursor-pointer bg-green-600 hover:bg-green-700 p-2 rounded-full shadow-lg transition-colors"
          >
            <ShoppingCart className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-1 text-lg font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
            {product.nombre}
          </h3>
        </Link>

        <StarRating rating={product.rating} size="sm" />

        <div className="flex flex-col justify-between gap-3 mt-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(product.precio)}
            </div>
            {product.precioOriginal && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(product.precioOriginal)}
              </div>
            )}
          </div>

          {/* Stock disponible */}
          <div className="text-xs text-gray-500">
            Stock: {product.stock || 10} unidades
          </div>

          <div className="flex justify-between gap-2">
            <Link to={`/products/${product.id}`} className="flex-1">
              <button className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Ver más</span>
              </button>
            </Link>
            <button
              onClick={() => onOpenModal(product)}
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
};

// Componente ProductCard para vista en lista
export const ProductListItem: React.FC<ProductCardProps> = ({
  product,
  onOpenModal,
  formatPrice
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="flex">
        <div className="w-48 h-32 flex-shrink-0">
          <OptimizedImage
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
              <StarRating rating={product.rating} size="sm" />
              {product.precioOriginal && (
                <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                  -{Math.round(((product.precioOriginal - product.precio) / product.precioOriginal) * 100)}% OFF
                </span>
              )}
            </div>
            <Link to={`/products/${product.id}`}>
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 hover:text-green-600 transition-colors">
                {product.nombre}
              </h3>
            </Link>
            <p className="text-gray-600 line-clamp-2">
              {product.descripcion || "Producto de alta calidad para agricultura profesional"}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              Stock: {product.stock || 10} unidades • Marca: {product.marca || 'Genérico'}
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-3">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(product.precio)}
              </div>
              {product.precioOriginal && (
                <div className="text-sm text-gray-500 line-through">
                  {formatPrice(product.precioOriginal)}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Link to={`/products/${product.id}`}>
                <button className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Ver más</span>
                </button>
              </Link>
              <button 
                onClick={() => onOpenModal(product)}
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