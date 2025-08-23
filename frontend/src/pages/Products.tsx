import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter, Grid, List, ShoppingCart, X, Plus, Minus, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, ProductListItem } from '../components/ProductCard';

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
  rating?: number;
}

// Componente Skeleton para vista de grid
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-300 rounded mb-4"></div>
        <div className="flex justify-between gap-2">
          <div className="h-10 bg-gray-300 rounded flex-1"></div>
          <div className="h-10 bg-gray-300 rounded flex-1"></div>
        </div>
      </div>
    </div>
  </div>
);

// Componente Skeleton para vista de lista
const ProductListItemSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="animate-pulse">
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
  </div>
);

// Componente de imagen optimizada para el modal
const OptimizedModalImage: React.FC<{
  src: string;
  alt: string;
  className: string;
}> = ({ src, alt, className }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="relative">
      {!imageLoaded && (
        <div className={`${className} bg-gray-300 animate-pulse flex items-center justify-center`}>
          <div className="text-gray-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
      
      <img
        src={imageError ? '../assets/images/LogoTienda.svg' : src}
        alt={alt}
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

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

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(15);

  // Obtener categorías únicas
  const categories = ["Todos", ...Array.from(new Set(products.map(p => p.category)))];

  // Función para formatear precios
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }, []);

  // Reemplaza el useEffect actual con este código:
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/products');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        
      } catch (error) {
        console.error('Error fetching products:', error);
        // Puedes mostrar un mensaje de error al usuario si lo deseas
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
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "nombre":
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); // Resetear a la primera página cuando cambian los filtros
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  // Obtener productos actuales para la página
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Función para cambiar de página con scroll al top
  const paginate = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll al top de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Efecto para scroll al top cuando cambia la página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Funciones del modal y carrito
  const openModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsModalOpen(true);
    setShowSuccessMessage(false);
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
    setShowSuccessMessage(false);
    // Restaurar scroll del body
    document.body.style.overflow = 'unset';
  }, []);

  const increaseQuantity = useCallback(() => {
    if (selectedProduct && quantity < (selectedProduct.stock || 10)) {
      setQuantity(prev => prev + 1);
    }
  }, [selectedProduct, quantity]);

  const decreaseQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  }, [quantity]);

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
        marca: selectedProduct.marca || 'Genérico',
        rating: selectedProduct.rating
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

  // Cleanup del scroll cuando se desmonta el componente
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Categorías */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="nombre">Nombre A-Z</option>
                <option value="precio-asc">Precio: Menor a Mayor</option>
                <option value="precio-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Calificación</option>
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
                  title="Vista en cuadrícula"
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
                  title="Vista en lista"
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
              `Mostrando ${indexOfFirstProduct + 1}-${Math.min(indexOfLastProduct, filteredProducts.length)} de ${filteredProducts.length} productos`
            )}
          </p>
          
          {!loading && filteredProducts.length > 0 && (
            <div className="text-sm text-gray-500">
              {viewMode === "grid" ? "Vista en cuadrícula" : "Vista en lista"}
            </div>
          )}
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
          // Estado vacío
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar los filtros de búsqueda
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Todos");
                setSortBy("nombre");
                setPriceRange({ min: 0, max: 1000000000 });
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          // Lista de productos
          <>
            <div className={
              viewMode === "grid" 
                ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {currentProducts.map(product => (
                viewMode === "grid" ? (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onOpenModal={openModal}
                    formatPrice={formatPrice}
                  />
                ) : (
                  <ProductListItem 
                    key={product.id} 
                    product={product} 
                    onOpenModal={openModal}
                    formatPrice={formatPrice}
                  />
                )
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Página anterior"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`w-10 h-10 rounded-lg border transition-colors ${
                        currentPage === page
                          ? "bg-green-600 text-white border-green-600"
                          : "border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Página siguiente"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Modal de confirmación */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del modal */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
                <h3 className="text-xl font-bold text-gray-800">Agregar al Carrito</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                  title="Cerrar modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {showSuccessMessage ? (
                /* Mensaje de éxito */
                <div className="p-8 text-center">
                  <div className="animate-bounce mb-4">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    ¡Producto agregado!
                  </h4>
                  <p className="text-gray-600">
                    {quantity} {quantity === 1 ? 'unidad' : 'unidades'} de{' '}
                    <span className="font-medium">{selectedProduct.nombre}</span>{' '}
                    se {quantity === 1 ? 'agregó' : 'agregaron'} a tu carrito
                  </p>
                  <div className="mt-4 text-green-600 font-medium">
                    Total: {formatPrice(selectedProduct.precio * quantity)}
                  </div>
                </div>
              ) : (
                /* Contenido del producto */
                <div className="p-6">
                  {/* Imagen y detalles básicos */}
                  <div className="flex space-x-4 mb-6">
                    <OptimizedModalImage
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.nombre}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 mb-1">
                        {selectedProduct.nombre}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedProduct.category}
                        {selectedProduct.marca && (
                          <span className="ml-2 text-green-600">• {selectedProduct.marca}</span>
                        )}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="text-xl font-bold text-green-600">
                          {formatPrice(selectedProduct.precio)}
                        </div>
                        {selectedProduct.precioOriginal && (
                          <>
                            <div className="text-sm text-gray-500 line-through">
                              {formatPrice(selectedProduct.precioOriginal)}
                            </div>
                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                              -{Math.round(((selectedProduct.precioOriginal - selectedProduct.precio) / selectedProduct.precioOriginal) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  {selectedProduct.descripcion && (
                    <div className="mb-6">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Descripción</h5>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {selectedProduct.descripcion}
                      </p>
                    </div>
                  )}

                  {/* Rating */}
                  {selectedProduct.rating && (
                    <div className="mb-6">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Calificación</h5>
                      <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => {
                            const ratingValue = i + 1;
                            return (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${
                                  selectedProduct.rating! >= ratingValue
                                    ? 'fill-current'
                                    : selectedProduct.rating! >= ratingValue - 0.5
                                    ? 'fill-current opacity-50'
                                    : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            );
                          })}
                        </div>
                        <span className="text-sm text-gray-600">
                          {selectedProduct.rating.toFixed(1)} de 5
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Stock disponible */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stock disponible:</span>
                      <span className={`font-medium text-sm ${
                        (selectedProduct.stock || 10) > 10 
                          ? 'text-green-600' 
                          : (selectedProduct.stock || 10) > 5 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                      }`}>
                        {selectedProduct.stock || 10} unidades
                      </span>
                    </div>
                    {(selectedProduct.stock || 10) <= 5 && (
                      <div className="mt-1 text-xs text-red-600">
                        ¡Pocas unidades disponibles!
                      </div>
                    )}
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
                        title="Disminuir cantidad"
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
                        title="Aumentar cantidad"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {quantity >= (selectedProduct.stock || 10) && (
                      <div className="mt-2 text-xs text-red-600 text-center">
                        Máximo stock alcanzado
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(selectedProduct.precio * quantity)}
                      </span>
                    </div>
                    {selectedProduct.precioOriginal && (
                      <div className="mt-2 text-sm text-gray-500">
                        Ahorro: {formatPrice((selectedProduct.precioOriginal - selectedProduct.precio) * quantity)}
                      </div>
                    )}
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