import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import API_URL from "../config/api.config";

// Tipos de datos
interface Category {
  id: number;
  nombre: string;
  image: string;
  descripcion?: string;
}

const CategoriesGrid = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener categorías del backend
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        
        // Tomar las primeras 6 categorías
        setCategories(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
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
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Nuestras <span className="text-green-600">Categorías</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Explora nuestra amplia variedad de productos agrícolas organizados
            por categorías
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-yellow-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Grid de categorías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/categories/${category.id}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 cursor-pointer h-full">
                <div className="relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.nombre}
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent group-hover:from-black/50 transition-all duration-300"></div>
                  
                  {/* Overlay con el nombre de la categoría */}
                  <div className="absolute inset-0 flex items-end justify-center p-6">
                    <div className="text-center">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                        {category.nombre}
                      </h3>
                      {category.descripcion && (
                        <p className="text-white/90 text-sm sm:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {category.descripcion}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Indicador de hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-xs font-medium">Ver productos</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Botón para ver todas las categorías */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/categories"
            className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
          >
            Ver todas las categorías
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;