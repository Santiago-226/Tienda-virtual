import React, { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import { Search, Filter, Grid3X3, List, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import API_URL from "../config/api.config";

// Tipos de datos
interface Category {
  _id: string;
  nombre: string;
  slug: string;
  image: string;
  descripcion?: string;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

type SortOption = 'name-asc' | 'name-desc' | 'products-asc' | 'products-desc' | 'newest' | 'oldest' | 'updated';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Obtener categorías del backend
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        setCategories(data);
        setFilteredCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filtrar y ordenar categorías
  useEffect(() => {
    let filtered = categories.filter(category =>
      category.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.descripcion && category.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.nombre.localeCompare(b.nombre);
        case 'name-desc':
          return b.nombre.localeCompare(a.nombre);
        case 'products-asc':
          return (a.productCount || 0) - (b.productCount || 0);
        case 'products-desc':
          return (b.productCount || 0) - (a.productCount || 0);
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'updated':
          return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
        default:
          return 0;
      }
    });

    setFilteredCategories(filtered);
    setCurrentPage(1); // Reset page when filtering
  }, [categories, searchTerm, sortBy]);

  // Calcular items de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

   // Función para cambiar de página con scroll al top
  const paginate = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  // Efecto para scroll al top cuando cambia la página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Función para obtener el texto descriptivo del ordenamiento
  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'name-asc': return 'Nombre A-Z';
      case 'name-desc': return 'Nombre Z-A';
      case 'products-asc': return 'Menos productos';
      case 'products-desc': return 'Más productos';
      case 'newest': return 'Más recientes';
      case 'oldest': return 'Más antiguas';
      case 'updated': return 'Recientemente actualizadas';
      default: return 'Nombre A-Z';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-white/20 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando categorías...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Todas las Categorías
          </h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
            Explora nuestra amplia variedad de productos agrícolas organizados por categorías
          </p>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-6 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Ordenar */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-[200px]"
                >
                  <option value="name-asc">Nombre A-Z</option>
                  <option value="name-desc">Nombre Z-A</option>
                  <option value="products-desc">Más productos primero</option>
                  <option value="products-asc">Menos productos primero</option>
                  <option value="newest">Más recientes</option>
                  <option value="oldest">Más antiguas</option>
                  <option value="updated">Recientemente actualizadas</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>

              {/* Vista */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-green-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm text-green-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Indicador de ordenamiento actual */}
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredCategories.length} categoría{filteredCategories.length !== 1 ? 's' : ''}
              {searchTerm && (
                <span> para "<strong>{searchTerm}</strong>"</span>
              )}
            </span>
            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
              Ordenado por: {getSortLabel(sortBy)}
            </span>
          </div>
        </div>

        {/* Contenido */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron categorías
            </h3>
            <p className="text-gray-600 mb-4">
              No hay categorías que coincidan con tu búsqueda.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <>
            {/* Vista Grid */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentItems.map((category) => (
                  <Link 
                    key={category._id}
                    to={`/categories/${category.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
                      <div className="relative overflow-hidden flex-1">
                        <img
                          src={category.image}
                          alt={category.nombre}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/50 transition-all duration-300"></div>
                        
                        <div className="absolute inset-0 flex items-end justify-center p-4">
                          <div className="text-center">
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-green-300 transition-colors">
                              {category.nombre}
                            </h3>
                            {category.productCount !== undefined && (
                              <div className="flex items-center justify-center space-x-2 text-white/90 text-sm">
                                <span>{category.productCount} producto{category.productCount !== 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                            <span className="text-white text-xs font-medium">Ver</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        {category.descripcion && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                            {category.descripcion}
                          </p>
                        )}
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          {category.productCount !== undefined && (
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">
                              {category.productCount} producto{category.productCount !== 1 ? 's' : ''}
                            </span>
                          )}
                          <span className="text-green-600 font-medium">Explorar →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Vista Lista */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {currentItems.map((category) => (
                  <Link 
                    key={category._id}
                    to={`/categories/${category.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden">
                      <div className="flex">
                        <div className="relative w-24 sm:w-32 lg:w-40 flex-shrink-0">
                          <img
                            src={category.image}
                            alt={category.nombre}
                            className="w-full h-24 sm:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 p-4 sm:p-6 flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                {category.nombre}
                              </h3>
                              {category.productCount !== undefined && (
                                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                                  {category.productCount} producto{category.productCount !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            {category.descripcion && (
                              <p className="text-gray-600 mb-2 line-clamp-2">
                                {category.descripcion}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {category.createdAt && (
                                <span>Creada: {new Date(category.createdAt).toLocaleDateString()}</span>
                              )}
                              {category.updatedAt && category.updatedAt !== category.createdAt && (
                                <span>Actualizada: {new Date(category.updatedAt).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="hidden sm:block">
                            <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium group-hover:bg-green-600 group-hover:text-white transition-colors">
                              Ver productos
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Información de paginación */}
            <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded-full">
                Página {currentPage} de {totalPages}
              </span>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    title="Página anterior"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Anterior
                  </button>

                  {/* Números de página */}
                  {(() => {
                    const pages = [];
                    const maxVisiblePages = 5;
                    
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                    
                    // Ajustar si estamos cerca del final
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    // Primera página y elipsis
                    if (startPage > 1) {
                      pages.push(
                        <button
                          key={1}
                          onClick={() => paginate(1)}
                          className="w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          1
                        </button>
                      );
                      if (startPage > 2) {
                        pages.push(
                          <span key="ellipsis1" className="px-2 text-gray-400">...</span>
                        );
                      }
                    }

                    // Páginas visibles
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => paginate(i)}
                          className={`w-10 h-10 rounded-lg border transition-colors ${
                            currentPage === i
                              ? "bg-green-600 text-white border-green-600"
                              : "border-gray-300 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }

                    // Última página y elipsis
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(
                          <span key="ellipsis2" className="px-2 text-gray-400">...</span>
                        );
                      }
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => paginate(totalPages)}
                          className="w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          {totalPages}
                        </button>
                      );
                    }

                    return pages;
                  })()}

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    title="Página siguiente"
                  >
                    Siguiente
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;