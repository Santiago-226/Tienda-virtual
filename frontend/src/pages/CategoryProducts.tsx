import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, Filter, Grid, List, ShoppingCart, X, Plus, Minus, CheckCircle, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { ProductCard, ProductListItem } from '../components/ProductCard';
import API_URL from '../config/api.config';

// Tipos de datos
interface Category {
  _id: string;
  nombre: string;
  slug: string;
  image: string;
  descripcion?: string;
}

interface Product {
  _id: string;
  id: string;
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
  _id: string;
  id: string;
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

interface CategoryProductsResponse {
  category: Category;
  products: Product[];
  count: number;
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

const CategoryProducts = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("nombre");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Estados para el modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(15);

  // Función para formatear precios
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }, []);

  // Fetch de información de la categoría y productos
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching category data for ID:', id);
        
        // Primero, obtener información detallada de la categoría
        const categoryResponse = await fetch(`${API_URL}/categories/${id}`);
        console.log('Category response status:', categoryResponse.status);
        
        if (!categoryResponse.ok) {
          if (categoryResponse.status === 404) {
            throw new Error('Categoría no encontrada');
          }
          throw new Error(`Error ${categoryResponse.status}: ${response.statusText}`);
        }
        
        const categoryData = await categoryResponse.json();
        console.log('Category data:', categoryData);
        setCategory(categoryData);
        
        // Luego, obtener los productos de la categoría
        const productsResponse = await fetch(`${API_URL}/products/category/${id}`);
        console.log('Products response status:', productsResponse.status);
        
        if (!productsResponse.ok) {
          throw new Error(`Error ${productsResponse.status}: ${productsResponse.statusText}`);
        }
        
        const productsData = await productsResponse.json();
        console.log('Products data:', productsData);
        
        // Verificamos la estructura de la respuesta
        let productsArray = productsData;
        
        // Si la respuesta tiene una propiedad products (como en CategoryProductsResponse)
        if (productsData.products && Array.isArray(productsData.products)) {
          productsArray = productsData.products;
        }
        // Si la respuesta tiene una propiedad data (común en algunas APIs)
        else if (productsData.data && Array.isArray(productsData.data)) {
          productsArray = productsData.data;
        }
        
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } catch (error) {
        console.error('Error fetching category data:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar los datos de la categoría');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  // Filtrar y ordenar productos
  useEffect(() => {
    let filtered = products.filter(product => {
      return product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
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
    setCurrentPage(1);
  }, [products, searchTerm, sortBy]);

  // Obtener productos actuales para la página
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Función para cambiar de página con scroll al top
  const paginate = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Funciones del modal y carrito
  const openModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsModalOpen(true);
    setShowSuccessMessage(false);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
    setShowSuccessMessage(false);
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
        _id: selectedProduct._id,
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
      
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = existingCart.findIndex((item: CartItem) => item.id === selectedProduct.id);
      
      if (existingItemIndex >= 0) {
        const newQuantity = existingCart[existingItemIndex].quantity + quantity;
        if (newQuantity <= (selectedProduct.stock || 10)) {
          existingCart[existingItemIndex].quantity = newQuantity;
        } else {
          existingCart[existingItemIndex].quantity = selectedProduct.stock || 10;
        }
      } else {
        existingCart.push(cartItem);
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      window.dispatchEvent(new Event('cartUpdated'));
      
      setShowSuccessMessage(true);
      
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

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <X className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/categories"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Ver todas las categorías
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {!loading && category && (
        <div className="relative bg-gradient-to-r from-green-600 to-green-700 text-white overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={category.image}
              alt={category.nombre}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-green-700/80"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Navegación de regreso */}
            <div className="mb-6">
              <Link
                to="/categories"
                className="inline-flex items-center text-white/90 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver a categorías
              </Link>
            </div>

            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {category.nombre}
              </h1>
              {category.descripcion && (
                <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-6">
                  {category.descripcion}
                </p>
              )}
              <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros y búsqueda */}
        {!loading && category && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="grid md:grid-cols-3 gap-4 items-end">
              {/* Búsqueda */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar en {category.nombre}</label>
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
        )}

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
              {searchTerm 
                ? `No hay productos que coincidan con "${searchTerm}" en esta categoría`
                : 'Esta categoría no tiene productos disponibles'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Limpiar búsqueda
              </button>
            )}
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

        {/* Modal de confirmación (igual que en Products) */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
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
                <div className="p-6">
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

                  {selectedProduct.descripcion && (
                    <div className="mb-6">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Descripción</h5>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {selectedProduct.descripcion}
                      </p>
                    </div>
                  )}

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
                  </div>

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

export default CategoryProducts;