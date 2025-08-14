import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, 
  Award, ChevronLeft, ChevronRight, Plus, Minus, Check, User,
} from "lucide-react";
import { Link } from 'react-router-dom'; // Añade esta importación


// Tipos de datos ampliados
interface ProductDetail {
  id: number;
  nombre: string;
  precio: number;
  precioOriginal?: number;
  images: string[];
  category: string;
  descripcion: string;
  caracteristicas: string[];
  especificaciones: { [key: string]: string };
  stock: number;
  rating: number;
  totalReviews: number;
  marca: string;
  sku: string;
  peso?: string;
  dimensiones?: string;
  garantia?: string;
  incluye?: string[];
}

interface Review {
  id: number;
  usuario: string;
  rating: number;
  fecha: string;
  comentario: string;
  verificado: boolean;
}

// Datos de ejemplo del producto
const mockProductDetail: ProductDetail = {
  id: 1,
  nombre: "Semillas de Maíz Premium Variedad Híbrida",
  precio: 45000,
  precioOriginal: 55000,
  images: [
    "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop"
  ],
  category: "Semillas",
  descripcion: "Semillas de maíz híbrido de alta calidad, especialmente desarrolladas para el clima colombiano. Estas semillas ofrecen una excelente resistencia a plagas y enfermedades, con un alto potencial de rendimiento. Ideales para cultivos comerciales y de subsistencia.",
  caracteristicas: [
    "Alta resistencia a plagas y enfermedades",
    "Adaptado al clima tropical y subtropical",
    "Ciclo de cultivo de 120-130 días",
    "Alto potencial de rendimiento (8-12 ton/ha)",
    "Excelente calidad de grano",
    "Resistente a sequía moderada",
    "Certificación INIA"
  ],
  especificaciones: {
    "Variedad": "Híbrido F1",
    "Ciclo vegetativo": "120-130 días",
    "Altura de planta": "2.2 - 2.5 metros",
    "Rendimiento esperado": "8-12 ton/ha",
    "Densidad de siembra": "55,000 - 65,000 plantas/ha",
    "Época de siembra": "Marzo - Junio",
    "Tipo de grano": "Semidentado amarillo",
    "Humedad del grano": "14% máximo"
  },
  stock: 150,
  rating: 4.8,
  totalReviews: 127,
  marca: "AgroTienda Premium",
  sku: "AGT-MAZ-001",
  peso: "25 kg",
  dimensiones: "45 x 30 x 15 cm",
  garantia: "Garantía de germinación del 85%",
  incluye: [
    "1 bolsa de 25kg de semillas",
    "Manual de cultivo",
    "Certificado de calidad",
    "Guía de siembra"
  ]
};

const mockReviews: Review[] = [
  {
    id: 1,
    usuario: "Carlos Rodríguez",
    rating: 5,
    fecha: "2024-01-15",
    comentario: "Excelentes semillas, muy buena germinación. Las plantas crecieron fuertes y sanas. Recomendado 100%.",
    verificado: true
  },
  {
    id: 2,
    usuario: "María González",
    rating: 4,
    fecha: "2024-01-10",
    comentario: "Buen producto, aunque el precio es un poco alto. La calidad justifica la inversión.",
    verificado: true
  },
  {
    id: 3,
    usuario: "José Martínez",
    rating: 5,
    fecha: "2024-01-05",
    comentario: "Tercera vez que compro estas semillas. Siempre dan buenos resultados. Muy satisfecho con la compra.",
    verificado: true
  }
];

const ProductDetail = () => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("descripcion");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Simular carga de datos
  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProduct(mockProductDetail);
      setReviews(mockReviews);
      setLoading(false);
    };

    fetchProductDetail();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando producto...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">Producto no encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.precioOriginal ? 
    Math.round(((product.precioOriginal - product.precio) / product.precioOriginal) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to={`/productos`}>
          <button className="flex items-center space-x-1 hover:text-green-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a productos</span>
          </button>
          </Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">{product.nombre}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="relative group">
              <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                <img 
                  src={product.images[currentImageIndex]}
                  alt={product.nombre}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setShowImageModal(true)}
                />
                
                {/* Navegación de imágenes */}
                {product.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Badge de descuento */}
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discount}%
                  </div>
                )}
              </div>
            </div>

            {/* Miniaturas */}
            <div className="flex space-x-3 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index 
                      ? 'border-green-600' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={image}
                    alt={`${product.nombre} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  SKU: {product.sku}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.nombre}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? 'fill-current' : ''
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">
                    {product.rating} ({product.totalReviews} reseñas)
                  </span>
                </div>
              </div>
            </div>

            {/* Precio */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl font-bold text-green-600">
                  {formatPrice(product.precio)}
                </div>
                {product.precioOriginal && (
                  <div className="text-xl text-gray-500 line-through">
                    {formatPrice(product.precioOriginal)}
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-600 mb-6">
                Stock disponible: <span className="font-medium text-green-600">{product.stock} unidades</span>
              </div>

              {/* Cantidad y botones */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 font-medium">{quantity}</span>
                  <button 
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-lg font-medium text-gray-700">
                  Total: <span className="text-green-600">{formatPrice(product.precio * quantity)}</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Agregar al Carrito</span>
                </button>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex-1 border-2 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
                      isFavorite 
                        ? 'border-red-500 text-red-500 bg-red-50' 
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                    <span>Favoritos</span>
                  </button>
                  
                  <button className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:border-gray-400 transition-colors flex items-center justify-center space-x-2">
                    <Share2 className="h-5 w-5" />
                    <span>Compartir</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Truck className="h-5 w-5 text-green-600" />
                <span>Envío gratis en compras superiores a $50.000</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Shield className="h-5 w-5 text-green-600" />
                <span>{product.garantia}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Award className="h-5 w-5 text-green-600" />
                <span>Producto certificado por {product.marca}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de información */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab headers */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'descripcion', label: 'Descripción' },
              { id: 'especificaciones', label: 'Especificaciones' },
              { id: 'caracteristicas', label: 'Características' },
              { id: 'incluye', label: 'Qué incluye' },
              { id: 'reseñas', label: `Reseñas (${reviews.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-8">
            {activeTab === 'descripcion' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">{product.descripcion}</p>
              </div>
            )}

            {activeTab === 'especificaciones' && (
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(product.especificaciones).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-800">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'caracteristicas' && (
              <div className="grid md:grid-cols-2 gap-4">
                {product.caracteristicas.map((caracteristica, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{caracteristica}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'incluye' && product.incluye && (
              <div className="space-y-3">
                {product.incluye.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reseñas' && (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-800">{review.usuario}</span>
                            {review.verificado && (
                              <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                Verificado
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex text-yellow-400 text-sm">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'fill-current' : ''
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-gray-500 text-sm">{formatDate(review.fecha)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comentario}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;