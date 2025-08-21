import React, { useState, useEffect } from "react";
import { Search, Filter, Grid, List, ShoppingCart, Star, Eye } from "lucide-react";
import { Link } from 'react-router-dom'; // Añade esta importación

// Tipos de datos
interface Product {
  id: number;
  nombre: string;
  precio: number;
  images: string [];
  category: string;
}


const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("nombre");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });

  // Obtener categorías únicas
  const categories = ["Todos", ...Array.from(new Set(products.map(p => p.category)))];

  // Simular carga de datos del backend
  useEffect(() => {
    const fetchProducts = async () => {
        setLoading(true);
        try {
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

  const ProductCard = ({ product }: { product: Product }) => (
    <Link to={`/products/${product.id}`}>
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
          <button className="bg-green-600 hover:bg-green-700 p-2 rounded-full shadow-lg transition-colors">
            <ShoppingCart className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      <div className="p-6">
        
          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-1">
            {product.nombre}
          </h3>
        

        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 text-sm">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <span className="text-gray-500 text-sm ml-2">(4.8)</span>
        </div>

        <div className="flex flex-col justify-between gap-3">
          <div className="text-2xl font-bold text-green-600">
            {formatPrice(product.precio)}
          </div>

          <div className="flex justify-between">
            <Link to={`/products/${product.id}`}>
              <button className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Ver más</span>
              </button>
            </Link>
            <button className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Agregar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </Link>
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
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{product.nombre}</h3>
            <p className="text-gray-600">Producto de alta calidad para agricultura profesional</p>
          </div>
          
          <div className="flex flex-col items-end space-y-3">
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(product.precio)}
            </div>

             <div className="flex justify-between">
            <Link to={`/products/${product.id}`}>
            <button className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Ver más</span>
            </button>
            </Link>
            <button className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Agregar</span>
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
        </div>

        {/* Lista de productos */}
        {filteredProducts.length === 0 ? (
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
      </div>
    </div>
  );
};

export default Products;