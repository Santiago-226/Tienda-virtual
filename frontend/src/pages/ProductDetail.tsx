import React, { useState, useEffect } from "react";
import API_URL from "../config/api.config";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Truck,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  User,
  CheckCircle,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

// Tipos de datos ampliados
interface Category {
  _id: string;
  nombre: string;
  slug: string;
  url: string;
}

interface ProductDetail {
  _id: string;
  id: string;
  nombre: string;
  precio: number;
  precioOriginal?: number;
  images: string[];
  categoryId: Category;
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
}

const ProductDetail = () => {
  const { id: productId } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("descripcion");
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const navigate = useNavigate();

useEffect(() => {
  const fetchProductDetail = async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Primero obtener el producto
      const productResponse = await fetch(`${API_URL}/products/${productId}`);
      
      if (!productResponse.ok) {
        throw new Error("Error al cargar el producto");
      }

      const productData = await productResponse.json();
      setProduct(productData);

      // Setear el nombre de la categoría desde el objeto categoryId
      if (productData.categoryId && productData.categoryId.nombre) {
        setCategoryName(productData.categoryId.nombre);
      }

      // Luego intentar obtener las reviews (manejando posibles errores)
      try {
        const reviewsResponse = await fetch(`${API_URL}/products/${productId}/reviews`);
        
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData);
        } else if (reviewsResponse.status === 404) {
          // Endpoint de reviews no existe o no hay reviews
          console.log("No se encontraron reviews para este producto");
          setReviews([]);
        } else {
          console.warn("Error al cargar reviews:", reviewsResponse.status);
          setReviews([]);
        }
      } catch (reviewsError) {
        console.warn("Error al cargar reviews:", reviewsError);
        setReviews([]); // Asegurar que reviews sea un array vacío
      }

    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  fetchProductDetail();
}, [productId]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addToCart = async () => {
    if (!product) return;

    setAddingToCart(true);

    try {
      const cartItem: CartItem = {
        _id: product._id,
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        precioOriginal: product.precioOriginal,
        image: product.images[0],
        quantity: quantity,
        stock: product.stock,
        category: product.categoryId.nombre,
        marca: product.marca,
      };

      // Obtener carrito existente
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItemIndex = existingCart.findIndex(
        (item: CartItem) => item._id === product._id
      );

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
      localStorage.setItem("cart", JSON.stringify(existingCart));

      // Mostrar mensaje de éxito
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      // Resetear cantidad a 1
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const getCartItemCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    return cart.reduce(
      (total: number, item: CartItem) => total + item.quantity,
      0
    );
  };

  const getProductCartQuantity = () => {
    if (!product) return 0;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartItem = cart.find((item: CartItem) => item._id === product._id);
    return cartItem ? cartItem.quantity : 0;
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

  const discount =
    product?.precioOriginal && product.precioOriginal > product.precio
      ? Math.round(
          ((product.precioOriginal - product.precio) / product.precioOriginal) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer flex items-center space-x-1 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </button>
          <span className="text-gray-400">/</span>
          <Link to={`/categories/${product.categoryId._id}`}>
            <span className="text-gray-600 hover:text-green-600">
              {categoryName || product.categoryId.nombre}
            </span>
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{product.nombre}</span>
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
                  className="w-full h-full object-cover"
                />

                {/* Navegación de imágenes */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
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
                      ? "border-green-600"
                      : "border-gray-200 hover:border-gray-300"
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
                  {categoryName || product.categoryId.nombre}
                </span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {product.nombre}
              </h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? "fill-current" : ""
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
                {product.precioOriginal &&
                  product.precioOriginal > product.precio && (
                    <div className="text-xl text-gray-500 line-through">
                      {formatPrice(product.precioOriginal)}
                    </div>
                  )}
              </div>

              <div className="text-sm text-gray-600 mb-6">
                Stock disponible:{" "}
                <span className="font-medium text-green-600">
                  {product.stock} unidades
                </span>
              </div>

              {/* Cantidad y botones */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="cursor-pointer p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 font-medium">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="cursor-pointer p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-lg font-medium text-gray-700">
                  Total:{" "}
                  <span className="text-green-600">
                    {formatPrice(product.precio * quantity)}
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                {/* Mensaje de éxito */}
                {showSuccessMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-green-700 font-medium">
                        ¡Producto agregado al carrito!
                      </p>
                      <p className="text-green-600 text-sm">
                        {getProductCartQuantity()} unidad(es) de{" "}
                        {product.nombre} en tu carrito
                      </p>
                    </div>
                    <Link to="/carrito">
                      <button className="text-green-600 cursor-pointer hover:text-green-700 font-medium text-sm underline">
                        Ver carrito
                      </button>
                    </Link>
                  </div>
                )}

                {/* Información del carrito actual */}
                {getProductCartQuantity() > 0 && !showSuccessMessage && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-blue-700 text-sm">
                      Ya tienes {getProductCartQuantity()} unidad(es) de este
                      producto en tu carrito
                    </p>
                  </div>
                )}

                {/* Botón principal */}
                <button
                  onClick={addToCart}
                  disabled={addingToCart || product.stock === 0}
                  className="cursor-pointer w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>
                    {addingToCart
                      ? "Agregando..."
                      : product.stock === 0
                      ? "Sin stock"
                      : "Agregar al Carrito"}
                  </span>
                </button>

                {/* Botón secundario para ir al carrito */}
                {getCartItemCount() > 0 && (
                  <Link to="/carrito">
                    <button className="cursor-pointer w-full border-2 border-green-600 text-green-600 hover:bg-green-50 py-4 px-6 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2">
                      <ShoppingCart className="h-5 w-5" />
                      <span>Ver Carrito ({getCartItemCount()})</span>
                    </button>
                  </Link>
                )}
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
  { id: "descripcion", label: "Descripción" },
  { id: "especificaciones", label: "Especificaciones" },
  { id: "caracteristicas", label: "Características" },
  { id: "incluye", label: "Qué incluye" },
  { 
    id: "reseñas", 
    label: `Reseñas ${reviews.length > 0 ? `(${reviews.length})` : ''}`
  },
].map((tab) => (
  <button
    key={tab.id}
    onClick={() => setActiveTab(tab.id)}
    className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
      activeTab === tab.id
        ? "text-green-600 border-b-2 border-green-600"
        : "text-gray-600 hover:text-gray-800"
    }`}
  >
    {tab.label}
  </button>
))}
          </div>

          {/* Tab content */}
          <div className="p-8">
            {activeTab === "descripcion" && (
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {product.descripcion}
                </p>
              </div>
            )}

            {activeTab === "especificaciones" && (
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(product.especificaciones).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center py-3 border-b border-gray-100"
                    >
                      <span className="font-medium text-gray-800">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  )
                )}
              </div>
            )}

            {activeTab === "caracteristicas" && (
              <div className="grid md:grid-cols-2 gap-4">
                {product.caracteristicas.map((caracteristica, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{caracteristica}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "incluye" && product.incluye && (
              <div className="space-y-3">
                {product.incluye.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reseñas" && (
  <div className="space-y-6">
    {reviews.length === 0 ? (
      // Estado vacío cuando no hay reviews
      <div className="text-center py-12">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Aún no hay reseñas
        </h3>
        <p className="text-gray-600 mb-6">
          Sé el primero en compartir tu experiencia con este producto
        </p>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
          Escribir reseña
        </button>
      </div>
    ) : (
      // Lista de reviews cuando sí hay
      reviews.map((review) => (
        <div
          key={review.id}
          className="border-b border-gray-100 pb-6 last:border-b-0"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800">
                    {review.usuario}
                  </span>
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
                          i < review.rating ? "fill-current" : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">
                    {formatDate(review.fecha)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {review.comentario}
          </p>
        </div>
      ))
    )}
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;