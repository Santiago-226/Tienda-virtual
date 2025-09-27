import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, Filter, Grid, List, ShoppingCart, X, Plus, Minus, CheckCircle, ChevronLeft, ChevronRight, ArrowLeft, Star } from "lucide-react";
import ProductCard from '../components/ProductCards';
import API_URL from '../config/api.config';

// Tipos de datos actualizados
interface Category {
  _id: string;
  nombre: string;
  slug: string;
  image: string;
  descripcion?: string;
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
  category?: string; // Para compatibilidad
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

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';
type ViewMode = 'grid' | 'list';

// Componente Skeleton para vista de grid
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
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

// Componente de Loading Screen (igual que en Products)
const LoadingScreen = () => (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Cargando productos...</p>
    </div>
  </div>
);

const CategoryProducts = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros y estado (igual que en Products)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Estado para el menú de filtros móvil
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  // Estado para mensaje de éxito
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [successProduct, setSuccessProduct] = useState<string>('');

  // Estado para la modal de producto
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

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
          throw new Error(`Error ${categoryResponse.status}: ${categoryResponse.statusText}`);
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
      } catch (error) {
        console.error('Error fetching category data:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar los datos de la categoría');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  // Obtener valores únicos para filtros
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(products.map(p => p.marca))];
    return uniqueBrands;
  }, [products]);

  const maxProductPrice = useMemo(() => {
    return Math.max(...products.map(p => p.precio), 0);
  }, [products]);

  // Actualizar maxPrice cuando se cargan los productos
  useEffect(() => {
    if (maxProductPrice > 0) {
      setMaxPrice(maxProductPrice);
    }
  }, [maxProductPrice]);

  // Filtrar y ordenar productos (igual que en Products)
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'all' || product.marca === selectedBrand;
      const matchesPrice = product.precio >= minPrice && product.precio <= maxPrice;
      const matchesRating = product.rating >= minRating;
      const matchesStock = !inStockOnly || product.inStock;

      return matchesSearch && matchesBrand && matchesPrice && matchesRating && matchesStock;
    });

    // Ordenar - Primero por el criterio seleccionado, luego poner sin stock al final
    filtered.sort((a, b) => {
      // Primero, verificar si alguno de los productos no tiene stock
      // Los productos sin stock deben ir al final sin importar el ordenamiento principal
      if (!a.inStock && b.inStock) return 1;
      if (a.inStock && !b.inStock) return -1;
      
      // Si ambos tienen stock o ambos no tienen stock, aplicar el ordenamiento normal
      switch (sortBy) {
        case 'name-asc':
          return a.nombre.localeCompare(b.nombre);
        case 'name-desc':
          return b.nombre.localeCompare(a.nombre);
        case 'price-asc':
          return a.precio - b.precio;
        case 'price-desc':
          return b.precio - a.precio;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedBrand, minPrice, maxPrice, minRating, inStockOnly, sortBy]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('all');
    setMinPrice(0);
    setMaxPrice(maxProductPrice);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Manejar cambios en los inputs de precio
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setMinPrice(Math.max(0, value));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setMaxPrice(Math.min(maxProductPrice, value));
  };

  // Validar que minPrice no sea mayor que maxPrice
  useEffect(() => {
    if (minPrice > maxPrice) {
      setMinPrice(maxPrice);
    }
  }, [minPrice, maxPrice]);

  const openProductModal = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(product);
    setSelectedQuantity(1);
    setSelectedImageIndex(0);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedQuantity(1);
    setSelectedImageIndex(0);
    document.body.style.overflow = 'unset';
  };

  const handleQuantityChange = (change: number) => {
    if (!selectedProduct) return;
    const newQuantity = selectedQuantity + change;
    if (newQuantity >= 1 && newQuantity <= selectedProduct.stock) {
      setSelectedQuantity(newQuantity);
    }
  };

  const addToCart = (product: Product, quantity: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
      const cartItem: CartItem = {
        _id: product._id,
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        precioOriginal: product.precioOriginal,
        image: product.images[0] || '/placeholder-image.jpg',
        quantity: quantity,
        stock: product.stock,
        category: product.categoryId.nombre,
        marca: product.marca,
        rating: product.rating
      };
      
      // Obtener carrito existente
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = existingCart.findIndex((item: CartItem) => item._id === product._id);

      if (existingItemIndex >= 0) {
        // Si el producto ya existe, actualizar cantidad
        const newQuantity = existingCart[existingItemIndex].quantity + quantity;
        if (newQuantity <= product.stock) {
          existingCart[existingItemIndex].quantity = newQuantity;
        } else {
          existingCart[existingItemIndex].quantity = product.stock;
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
      setSuccessProduct(product.nombre);
      setShowSuccessMessage(true);
      
      // Cerrar modal si está abierta
      if (isModalOpen) {
        closeProductModal();
      }
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Cerrar modal con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeProductModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Cleanup del scroll cuando se desmonta el componente
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Mostrar pantalla de carga completa mientras se cargan los datos iniciales
  if (loading && products.length === 0) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-red-200 max-w-md">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-700 mb-2">¡Oops!</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <Link 
              to="/categories"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Volver a categorías
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeInOut">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>¡{successProduct} agregado al carrito!</span>
          </div>
        </div>
      )}

      {/* Modal de Producto */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header de la Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Detalles del Producto</h2>
              <button
                onClick={closeProductModal}
                className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido de la Modal */}
            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Sección de Imágenes */}
                <div className="space-y-4">
                  {/* Imagen Principal */}
                  <div className="relative">
                    <img
                      src={selectedProduct.images[selectedImageIndex] || '/placeholder-image.jpg'}
                      alt={selectedProduct.nombre}
                      className="w-full h-60 object-cover rounded-lg shadow-md"
                    />
                    {selectedProduct.discountPercentage > 0 && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        -{selectedProduct.discountPercentage}%
                      </div>
                    )}
                    {!selectedProduct.inStock && (
                      <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-75 text-white px-3 py-2 rounded-lg font-semibold">
                        Sin stock
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {selectedProduct.images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto">
                      {selectedProduct.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 cursor-pointer w-15 h-15 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex === index
                              ? 'border-green-500 ring-2 ring-green-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${selectedProduct.nombre} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Información del Producto */}
                <div className="space-y-6">
                  {/* Título y Rating */}
                  <div>
                    <h1 className="text-xl lg:text-3xl font-bold text-gray-800 mb-2">
                      {selectedProduct.nombre}
                    </h1>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center">
                        <div className="flex items-center mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(selectedProduct.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {selectedProduct.rating} ({selectedProduct.totalReviews} reseñas)
                        </span>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-sm font-medium">
                        {selectedProduct.categoryId.nombre}
                      </span>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl lg:text-3xl font-bold text-green-600">
                        {formatPrice(selectedProduct.precio)}
                      </span>
                      {selectedProduct.precioOriginal > selectedProduct.precio && (
                        <div className="flex flex-col">
                          <span className="text-lg text-gray-500 line-through">
                            {formatPrice(selectedProduct.precioOriginal)}
                          </span>
                          <span className="text-sm text-red-500 font-medium">
                            Ahorra {formatPrice(selectedProduct.precioOriginal - selectedProduct.precio)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Información Básica */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Marca:</span>
                      <span className="ml-2 text-gray-600">{selectedProduct.marca}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Stock:</span>
                      <span className={`ml-2 font-medium ${selectedProduct.stock > 5 ? 'text-green-600' : 'text-orange-600'}`}>
                        {selectedProduct.stock} unidades
                      </span>
                    </div>
                  </div>

                  {/* Selector de Cantidad */}
                  {selectedProduct.inStock && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Cantidad</h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(-1)}
                            disabled={selectedQuantity <= 1}
                            className="p-2 cursor-pointer text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold text-gray-800 bg-white border-x border-gray-300">
                            {selectedQuantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(1)}
                            disabled={selectedQuantity >= selectedProduct.stock}
                            className="p-2 cursor-pointer text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-sm text-gray-600">
                          Total: <span className="font-semibold text-green-600">
                            {formatPrice(selectedProduct.precio * selectedQuantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botón Agregar al Carrito */}
                  <button
                    onClick={() => addToCart(selectedProduct, selectedQuantity)}
                    disabled={!selectedProduct.inStock}
                    className={`w-full px-6 cursor-pointer py-4 rounded-lg font-semibold text-white md:text-lg transition-all duration-300 transform hover:scale-105 ${
                      selectedProduct.inStock
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {selectedProduct.inStock ? (
                      <span className="flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Agregar {selectedQuantity} al Carrito
                      </span>
                    ) : (
                      'Producto Agotado'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section (MANTENIDO DE CATEGORYPRODUCTS ORIGINAL) */}
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

      {/* Mostrar skeletons durante la carga de productos */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
          
          <div className="lg:flex gap-8">
            {/* Sidebar de filtros skeleton */}
            <div className="lg:w-80 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-6"></div>
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="mb-6">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contenido principal skeleton */}
            <div className="flex-1">
              <div className="h-12 bg-gray-300 rounded-lg mb-6"></div>
              <div className="h-16 bg-gray-300 rounded-lg mb-6"></div>
              
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {Array.from({ length: 6 }).map((_, index) => (
                  viewMode === "grid" ? (
                    <ProductCardSkeleton key={index} />
                  ) : (
                    <ProductListItemSkeleton key={index} />
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Controles de vista */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Productos de <span className="text-green-600">{category?.nombre}</span>
                </h1>
                <p className="text-gray-600">
                  Descubre nuestros productos de {category?.nombre} de la mejor calidad
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:flex gap-8">
            {/* Botón de filtros móvil */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filtros
                {(selectedBrand !== "all" ||
                  minPrice > 0 ||
                  maxPrice < maxProductPrice ||
                  minRating > 0 ||
                  inStockOnly ||
                  sortBy !== "newest") && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Activos
                  </span>
                )}
              </button>
            </div>

            {/* Sidebar de filtros */}
            <div
              className={`lg:w-80 mb-8 lg:mb-0 ${
                isFiltersOpen ? "block" : "hidden lg:block"
              }`}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-28">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">🔍 Filtros</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                      Limpiar
                    </button>
                    <button
                      onClick={() => setIsFiltersOpen(false)}
                      className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Ordenar por */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordenar por
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="newest">Más reciente</option>
                      <option value="name-asc">Nombre A-Z</option>
                      <option value="name-desc">Nombre Z-A</option>
                      <option value="price-asc">Precio menor a mayor</option>
                      <option value="price-desc">Precio mayor a menor</option>
                      <option value="rating-desc">Mejor calificados</option>
                    </select>
                  </div>

                  {/* Marca */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marca
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="all">Todas las marcas</option>
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rango de precio con inputs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rango de Precio
                    </label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Precio Mínimo</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={minPrice}
                            onChange={handleMinPriceChange}
                            min="0"
                            max={maxProductPrice}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Precio Máximo</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={maxPrice}
                            onChange={handleMaxPriceChange}
                            min="0"
                            max={maxProductPrice}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder={maxProductPrice.toString()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating mínimo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calificación mínima
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() =>
                            setMinRating(rating === minRating ? 0 : rating)
                          }
                          className={`text-2xl cursor-pointer transition-all transform hover:scale-110 ${
                            rating <= minRating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                      {minRating > 0 && (
                        <span className="ml-2 text-sm text-gray-500">
                          {minRating}+ estrellas
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Solo en stock */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="inStock"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Solo productos en stock
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1">
              {/* Barra de búsqueda */}
              <div className="relative w-full max-w-3xl mx-auto px-2 sm:px-0 mb-6">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Buscar productos en ${category?.nombre}...`}
                  className="w-full pl-12 pr-10 py-3 sm:py-4 text-base sm:text-lg 
                           border-2 border-green-700 rounded-xl 
                           focus:outline-none focus:ring-4 focus:ring-green-200 
                           bg-white hover:bg-white transition-all"
                />

                {/* Icono lupa */}
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                
                {/* Botón limpiar */}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Barra de herramientas */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    {(searchTerm ||
                      selectedBrand !== "all" ||
                      minPrice > 0 ||
                      maxPrice < maxProductPrice ||
                      minRating > 0 ||
                      inStockOnly ||
                      sortBy !== "newest") && (
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Filtros activos
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600">
                    Mostrando {paginatedProducts.length} de{" "}
                    {filteredAndSortedProducts.length} productos
                  </div>
                </div>
              </div>

              {/* Lista/Grid de productos */}
              {paginatedProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Intenta ajustar tus filtros de búsqueda
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        : "space-y-4"
                    }
                  >
                    {paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        viewMode={viewMode}
                        onOpenModal={openProductModal}
                      />
                    ))}
                  </div>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <nav className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Anterior
                        </button>

                        {Array.from(
                          { length: Math.min(7, totalPages) },
                          (_, i) => {
                            let page;
                            if (totalPages <= 7) {
                              page = i + 1;
                            } else {
                              if (currentPage <= 4) {
                                page = i + 1;
                              } else if (currentPage >= totalPages - 3) {
                                page = totalPages - 6 + i;
                              } else {
                                page = currentPage - 3 + i;
                              }
                            }

                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  currentPage === page
                                    ? "bg-green-500 text-white"
                                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          }
                        )}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Siguiente
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Estilos para la animación del mensaje de éxito */}
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
          }
          .animate-fadeInOut {
            animation: fadeInOut 3s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default CategoryProducts;