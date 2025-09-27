import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';

interface Category {
  _id: string;
  nombre: string;
  slug: string;
  url: string;
  id: string;
}

interface Product {
  id: string;
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOriginal: number;
  images: string[];
  categoryId: Category;
  caracteristicas: string[];
  especificaciones: Record<string, string>;
  stock: number;
  rating: number;
  totalReviews: number;
  marca: string;
  sku: string;
  peso: string;
  dimensiones: string;
  garantia: string;
  incluye: string[];
  isActive: boolean;
  slug: string;
  salesCount: number;
  inStock: boolean;
  discountPercentage: number;
  formattedPrice: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onOpenModal: (product: Product, e: React.MouseEvent) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode, onOpenModal }) => {
  return (
    <div
      className={`group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 ${
        viewMode === "list" ? "flex" : "block"
      }`}
    >
      {/* Envuelve solo la imagen con Link */}
      <Link to={`/products/${product.id}`} className="block">
        <div
          className={`relative ${
            viewMode === "list" ? "w-48 h-32" : "w-full h-64"
          }`}
        >
          <img
            src={product.images[0] || "/placeholder-image.jpg"}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              -{product.discountPercentage}%
            </div>
          )}
          {!product.inStock && (
            <div className="absolute top-3 right-3 bg-gray-800 bg-opacity-75 text-white px-2 py-1 rounded-lg text-xs font-semibold">
              Sin stock
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <span className="bg-green-600 bg-opacity-90 text-white px-2 py-1 rounded-lg text-xs font-medium shadow">
              {product.categoryId.nombre}
            </span>
          </div>
        </div>
      </Link>

      <div
        className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
      >
        {/* Envuelve solo el título con Link */}
        <Link to={`/products/${product.id}`}>
          <h3 className="text-xl line-clamp-1 font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-200">
            {product.nombre}
          </h3>
        </Link>

        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {product.rating} ({product.totalReviews} reseñas)
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">
              {product.formattedPrice}
            </span>
            {product.precioOriginal > product.precio && (
              <span className="text-lg text-gray-500 line-through">
                ${product.precioOriginal.toLocaleString()}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              Stock: {product.stock}
            </div>
            <div className="text-xs text-gray-400">
              {product.marca}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-2">
          {/* Botón Agregar al Carrito */}
          <button
            type="button"
            onClick={(e) => onOpenModal(product, e)}
            disabled={!product.inStock}
            className={`w-full px-4 py-3 cursor-pointer rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
              product.inStock
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {product.inStock ? (
              <span className="flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </span>
            ) : (
              "Sin Stock"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;