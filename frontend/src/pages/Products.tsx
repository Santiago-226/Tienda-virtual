import React, { useState, useEffect } from "react";
import { Search, Filter, Grid, List, ShoppingCart, Star, Eye, X, Plus, Minus, CheckCircle } from "lucide-react";
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
  rating?:number;
}

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
  rating?:number;
}

// Componente Skeleton para vista de grid
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
    <div className="relative overflow-hidden">
      <div className="w-full h-48 bg-gray-300"></div>
    </div>
    <div className="p-6">
      <div className="h-6 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
      <div className="h-8 bg-gray-300 rounded mb-4"></div>
      <div className="flex justify-between gap-2">
        <div className="h-10 bg-gray-300 rounded flex-1"></div>
        <div className="h-10 bg-gray-300 rounded flex-1"></div>
      </div>
    </div>
  </div>
);

// Componente Skeleton para vista de lista
const ProductListItemSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
    <div className="flex">
      <div className="w-48 h-32 bg-gray-300 flex-shrink-0"></div>
      <div className="flex-1 p-6 flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center mb-4">
            <div className="h-6 bg-gray-300 rounded w-24 mr-3"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
        <div className="flex flex-col items-end space-y-3">
          <div className="h-8 bg-gray-300 rounded w-24"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-300 rounded w-24"></div>
            <div className="h-10 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("nombre");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000000 });

  // Estados para el modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Obtener categorías únicas
  const categories = ["Todos", ...Array.from(new Set(products.map(p => p.category)))];

  // Simular carga de datos del backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Simular un retraso de carga para mostrar el efecto skeleton
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrar y ordenar productos
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
      const matchesPrice = product.precio >= priceRange.min && product.precio <= priceRange.max;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Ordenar productos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "precio-asc":
          return a.precio - b.precio;
        case "precio-desc":
          return b.precio - a.precio;
        case "nombre":
          return a.nombre.localeCompare(b.nombre);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Funciones del modal y carrito
  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsModalOpen(true);
    setShowSuccessMessage(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
    setShowSuccessMessage(false);
  };

  const increaseQuantity = () => {
    if (selectedProduct && quantity < (selectedProduct.stock || 10)) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const addToCart = async () => {
    if (!selectedProduct) return;
    
    setAddingToCart(true);
    
    try {
      const cartItem: CartItem = {
        id: selectedProduct.id,
        nombre: selectedProduct.nombre,
        precio: selectedProduct.precio,
        precioOriginal: selectedProduct.precioOriginal,
        image: selectedProduct.images[0],
        quantity: quantity,
        stock: selectedProduct.stock || 10,
        category: selectedProduct.category,
        marca: selectedProduct.marca || 'Genérico'
      };
      
      // Obtener carrito existente
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = existingCart.findIndex((item: CartItem) => item.id === selectedProduct.id);
      
      if (existingItemIndex >= 0) {
        // Si el producto ya existe, actualizar cantidad
        const newQuantity = existingCart[existingItemIndex].quantity + quantity;
        if (newQuantity <= (selectedProduct.stock || 10)) {
          existingCart[existingItemIndex].quantity = newQuantity;
        } else {
          existingCart[existingItemIndex].quantity = selectedProduct.stock || 10;
        }
      } else {
        // Si es nuevo, agregarlo
        existingCart.push(cartItem);
      }
      
      // Guardar en localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Notificar al header que se actualizó el carrito
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Mostrar mensaje de éxito
      setShowSuccessMessage(true);
      
      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        closeModal();
      }, 1500);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const getProductCartQuantity = (productId: number) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = cart.find((item: CartItem) => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const ProductCard = ({ product }: { product: Product }) => (
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
            onClick={() => openModal(product)}
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
              onClick={() => openModal(product)}
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

  const ProductListItem = ({ product }: { product: Product }) => (
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
                onClick={() => openModal(product)}
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

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Nuestros <span className="text-green-600">Productos</span>
          </h1>
          <p className="text-xl text-gray-600">
            Encuentra todo lo que necesitas para tu proyecto agrícola
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-4 gap-4 items-end">
            {/* Búsqueda */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categorías */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Ordenar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="nombre">Nombre A-Z</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
              </select>
            </div>

            {/* Vista */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vista</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {loading ? (
              <div className="h-5 w-48 bg-gray-300 rounded animate-pulse"></div>
            ) : (
              `Mostrando ${filteredProducts.length} de ${products.length} productos`
            )}
          </p>
        </div>

        {/* Lista de productos */}
        {loading ? (
          // Mostrar skeletons durante la carga
          <div className={
            viewMode === "grid" 
              ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {Array.from({ length: 8 }).map((_, index) => (
              viewMode === "grid" ? (
                <ProductCardSkeleton key={index} />
              ) : (
                <ProductListItemSkeleton key={index} />
              )
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredProducts.map(product => (
              viewMode === "grid" ? (
                <ProductCard key={product.id} product={product} />
              ) : (
                <ProductListItem key={product.id} product={product} />
              )
            ))}
          </div>
        )}

        {/* Modal de confirmación */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header del modal */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Agregar al Carrito</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {showSuccessMessage ? (
                /* Mensaje de éxito */
                <div className="p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    ¡Producto agregado!
                  </h4>
                  <p className="text-gray-600">
                    {quantity} unidad(es) de {selectedProduct.nombre} se agregaron a tu carrito
                  </p>
                </div>
              ) : (
                /* Contenido del producto */
                <div className="p-6">
                  {/* Imagen y detalles básicos */}
                  <div className="flex space-x-4 mb-6">
                    <img
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.nombre}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 mb-1">
                        {selectedProduct.nombre}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedProduct.category}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="text-xl font-bold text-green-600">
                          {formatPrice(selectedProduct.precio)}
                        </div>
                        {selectedProduct.precioOriginal && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(selectedProduct.precioOriginal)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  {selectedProduct.descripcion && (
                    <div className="mb-6">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {selectedProduct.descripcion}
                      </p>
                    </div>
                  )}

                  {/* Stock disponible */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600">
                      Stock disponible: <span className="font-medium text-green-600">
                        {selectedProduct.stock || 10} unidades
                      </span>
                    </p>
                  </div>

                  {/* Selector de cantidad */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Cantidad
                    </label>
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800 mb-1">
                          {quantity}
                        </div>
                        <div className="text-sm text-gray-600">
                          {quantity === 1 ? 'unidad' : 'unidades'}
                        </div>
                      </div>
                      
                      <button
                        onClick={increaseQuantity}
                        disabled={quantity >= (selectedProduct.stock || 10)}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(selectedProduct.precio * quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex space-x-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={addToCart}
                      disabled={addingToCart}
                      className="flex-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-6 rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>
                        {addingToCart ? "Agregando..." : "Confirmar"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;