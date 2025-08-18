import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Tag,
  AlertCircle,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";

// Interfaces
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
}

interface CartSummary {
  subtotal: number;
  descuentos: number;
  envio: number;
  impuestos: number;
  total: number;
}

const Carrito = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  // Simular usuario logueado (cambiar cuando tengas autenticación)
  const isLoggedIn = false;

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        // TODO: Cargar desde backend cuando esté logueado
        // const response = await fetch('/api/cart', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await response.json();
        // setCartItems(data);
      } else {
        // Cargar desde localStorage
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveCartItems = async (items: CartItem[]) => {
    if (isLoggedIn) {
      // TODO: Guardar en backend cuando esté logueado
      // await fetch('/api/cart', {
      //   method: 'PUT',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify({ items })
      // });
    } else {
      // Guardar en localStorage
      localStorage.setItem("cart", JSON.stringify(items));
    }
    setCartItems(items);
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity: Math.max(1, Math.min(newQuantity, item.stock)),
        };
      }
      return item;
    });
    saveCartItems(updatedItems);
  };

  const removeItem = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    saveCartItems(updatedItems);
  };

  const clearCart = () => {
    saveCartItems([]);
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const applyCoupon = () => {
    // Simulación de cupones (reemplazar con lógica real)
    const validCoupons: { [key: string]: number } = {
      DESCUENTO10: 0.1,
      BLACKFRIDAY: 0.2,
    };

    if (validCoupons.hasOwnProperty(couponCode.toUpperCase())) {
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponError("");
      setCouponCode("");
    } else {
      setCouponError("Cupón no válido");
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateSummary = (): CartSummary => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.precio * item.quantity,
      0
    );

    let descuentos = 0;
    if (appliedCoupon === "DESCUENTO10") {
      descuentos = subtotal * 0.1;
    } else if (appliedCoupon === "BLACKFRIDAY") {
      descuentos = subtotal * 0.2;
    }

    const total = subtotal - descuentos;

    return {
      subtotal,
      descuentos,
      envio: 0,
      impuestos: 0,
      total,
    };
  };

  const summary = calculateSummary();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando carrito...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8">
              Explora nuestros productos y agrega algunos al carrito
            </p>
            <Link to="/productos">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold transition-colors">
                Explorar Productos
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/productos">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Continuar comprando</span>
              </button>
            </Link>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
            <span>Vaciar carrito</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
                  <ShoppingCart className="h-7 w-7 text-green-600" />
                  <span>Carrito de Compras ({cartItems.length} productos)</span>
                </h1>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Imagen del producto */}
                      <div className="flex-shrink-0">
                        <Link to={`/producto/${item.id}`}>
                          <img
                            src={item.image}
                            alt={item.nombre}
                            className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>

                      {/* Información del producto */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link to={`/producto/${item.id}`}>
                              <h3 className="text-lg font-medium text-gray-800 hover:text-green-600 cursor-pointer transition-colors">
                                {item.nombre}
                              </h3>
                            </Link>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm text-gray-500">
                                {item.category}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-500">
                                {item.marca}
                              </span>
                            </div>
                            {item.stock < 10 && (
                              <div className="flex items-center space-x-1 mt-2">
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                                <span className="text-sm text-orange-600">
                                  Solo quedan {item.stock} disponibles
                                </span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Controles de cantidad */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 font-medium min-w-12 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.stock}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Precio */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-800">
                              {formatPrice(item.precio * item.quantity)}
                            </div>
                            {item.precioOriginal && (
                              <div className="text-sm text-gray-500 line-through">
                                {formatPrice(item.precioOriginal * item.quantity)}
                              </div>
                            )}
                            <div className="text-sm text-gray-600">
                              {formatPrice(item.precio)} c/u
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="space-y-6">
            {/* Cupón de descuento */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Tag className="h-5 w-5 text-green-600" />
                <span>Cupón de descuento</span>
              </h3>

              {appliedCoupon ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-green-700 font-medium">
                        {appliedCoupon}
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-700 text-sm underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Código del cupón"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={!couponCode.trim()}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-sm">{couponError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Resumen de precios */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Resumen del pedido
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(summary.subtotal)}</span>
                </div>

                {summary.descuentos > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuentos</span>
                    <span>-{formatPrice(summary.descuentos)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-green-600">
                    {formatPrice(summary.total)}
                  </span>
                </div>
              </div>

              {/* Botón calcular envío */}
              <button className="w-full mb-4 border-2 border-gray-300 text-gray-600 hover:border-green-600 hover:text-green-600 py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Calcular Envío</span>
              </button>
            </div>

            {/* Botón de checkout */}
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
              <CreditCard className="h-5 w-5" />
              <span>Proceder al pago</span>
            </button>

            {/* Garantías */}
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Compra 100% segura</span>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-green-600" />
                <span>Entrega rápida y confiable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;