# 📚 MANUAL 3 - PARTE 3: CONTROLLERS Y RUTAS API

## 📋 INFORMACIÓN DEL MANUAL

**Proyecto:** Sistema E-commerce Tecnológico - Manual 3 (Parte 3/4)  
**Prerequisito:** Manual 3 Parte 2 completado (Modelos creados)  
**Tiempo Estimado:** 60 minutos  
**Sesión del Cronograma:** 3 (MongoDB + Base de datos)  
**Estado:** MANUAL COMPLETO PASO A PASO ✅

---

## ⚠️ REQUISITOS PREVIOS

- ✅ **Manual 3 - Parte 2** completado exitosamente
- ✅ **Carpeta models/** con Product.js, User.js, Order.js, index.js
- ✅ **MongoDB Atlas** conectado y funcionando
- ✅ **server-simple.js** funcionando con productos
- ✅ **Frontend** cargando productos correctamente
- ✅ **Visual Studio Code** abierto en la carpeta del proyecto

---

## 🎯 OBJETIVOS DE LA PARTE 3

**CREAR:** Arquitectura profesional con Controllers y Rutas API

**AL FINALIZAR ESTA PARTE TENDRÁS:**
- 🏗️ **Controllers profesionales** para Product, User, Order
- 🛤️ **Rutas API REST** completas organizadas
- 🔄 **Migración de server-simple.js** a arquitectura profesional
- 🛡️ **Manejo de errores** robusto
- ✅ **APIs funcionando** sin romper el frontend

---

## 📅 PLAN DE TRABAJO (60 MINUTOS)

### **FASE 1: CREAR CONTROLLERS** (20 minutos)
- Product Controller con métodos CRUD
- User Controller preparado para autenticación
- Order Controller para sistema de pedidos

### **FASE 2: CREAR RUTAS** (20 minutos)
- Routes organizadas por módulo
- Middleware de validación
- Estructura REST profesional

### **FASE 3: MIGRACIÓN GRADUAL** (20 minutos)
- Actualizar server.js principal
- Preservar funcionalidad actual
- Testing completo

---

## 🏗️ FASE 1: CREAR CONTROLLERS (20 MINUTOS)

### **PASO 1.1: Crear carpeta controllers**

#### **1.1.1 Crear directorio**
```bash
cd backend
mkdir controllers
```

#### **1.1.2 Verificar creación**
```bash
# Windows
dir controllers

# Linux/Mac
ls -la controllers
```

### **PASO 1.2: Crear Product Controller**

#### **1.2.1 Crear controllers/productController.js**
**Crear archivo:** `backend/controllers/productController.js`

**PEGAR este contenido completo:**

```javascript
const { Product } = require('../models');

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    
    // Transformar productos para incluir ID numérico compatible con frontend
    const productsWithNumericId = products.map((product, index) => ({
      id: index + 1, // ID numérico secuencial (1, 2, 3...)
      _id: product._id, // Mantener _id original para referencias internas
      name: product.name,
      price: product.price,
      image: product.image,
      images: product.images || [product.image],
      category: product.category,
      description: product.description,
      features: product.features || [],
      specifications: product.specifications || {},
      stock: product.stock,
      rating: product.rating,
      reviewCount: product.reviewCount,
      slug: product.slug,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));
    
    console.log(`📦 Enviando ${productsWithNumericId.length} productos al frontend`);
    res.json(productsWithNumericId);
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudieron obtener los productos' 
    });
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    // Obtener todos los productos y encontrar por índice
    const allProducts = await Product.find({});
    const product = allProducts[productId - 1]; // ID 1 = índice 0, ID 2 = índice 1, etc.
    
    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: `No se encontró el producto con ID ${productId}`
      });
    }
    
    // Transformar producto con ID numérico
    const productWithNumericId = {
      id: productId,
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      images: product.images || [product.image],
      category: product.category,
      description: product.description,
      features: product.features || [],
      specifications: product.specifications || {},
      stock: product.stock,
      rating: product.rating,
      reviewCount: product.reviewCount,
      slug: product.slug,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
    
    console.log(`📦 Enviando producto: ${product.name} (ID: ${productId})`);
    res.json(productWithNumericId);
  } catch (error) {
    console.error('❌ Error obteniendo producto:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo obtener el producto' 
    });
  }
};

// @desc    Crear nuevo producto
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      images,
      category,
      features,
      specifications,
      stock,
      rating,
      reviewCount,
      slug
    } = req.body;

    // Validaciones básicas
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'name, description, price, image y category son obligatorios'
      });
    }

    const product = new Product({
      name,
      description,
      price,
      image,
      images: images || [image],
      category,
      features: features || [],
      specifications: specifications || {},
      stock: stock || 10,
      rating: rating || 4.5,
      reviewCount: reviewCount || 0,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
    });

    const savedProduct = await product.save();
    
    console.log(`✅ Producto creado: ${savedProduct.name}`);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('❌ Error creando producto:', error.message);
    if (error.code === 11000) {
      res.status(400).json({
        error: 'Producto duplicado',
        message: 'Ya existe un producto con ese nombre o slug'
      });
    } else {
      res.status(500).json({ 
        error: 'Error del servidor', 
        message: 'No se pudo crear el producto' 
      });
    }
  }
};

// @desc    Actualizar producto
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Buscar por _id de MongoDB, no por ID numérico
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: `No se encontró el producto con ID ${productId}`
      });
    }

    // Actualizar campos permitidos
    const updateFields = [
      'name', 'description', 'price', 'image', 'images', 
      'category', 'features', 'specifications', 'stock', 
      'rating', 'reviewCount', 'slug'
    ];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();
    
    console.log(`✅ Producto actualizado: ${updatedProduct.name}`);
    res.json(updatedProduct);
  } catch (error) {
    console.error('❌ Error actualizando producto:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo actualizar el producto' 
    });
  }
};

// @desc    Eliminar producto
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Buscar por _id de MongoDB
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: `No se encontró el producto con ID ${productId}`
      });
    }

    await Product.findByIdAndDelete(productId);
    
    console.log(`🗑️ Producto eliminado: ${product.name}`);
    res.json({
      message: 'Producto eliminado exitosamente',
      deletedProduct: {
        _id: product._id,
        name: product.name
      }
    });
  } catch (error) {
    console.error('❌ Error eliminando producto:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo eliminar el producto' 
    });
  }
};

// @desc    Buscar productos
// @route   GET /api/products/search?q=term
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({
        error: 'Parámetro de búsqueda requerido',
        message: 'Proporciona un término de búsqueda con ?q=término'
      });
    }

    const searchRegex = new RegExp(q, 'i');
    
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ]
    });
    
    console.log(`🔍 Búsqueda "${q}": ${products.length} productos encontrados`);
    res.json(products);
  } catch (error) {
    console.error('❌ Error en búsqueda:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo realizar la búsqueda' 
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
};
```

### **PASO 1.3: Crear User Controller**

#### **1.3.1 Crear controllers/userController.js**
**Crear archivo:** `backend/controllers/userController.js`

**PEGAR este contenido completo:**

```javascript
const { User } = require('../models');

// @desc    Obtener perfil de usuario
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // req.user vendrá del middleware de autenticación (futuro)
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se encontró el usuario especificado'
      });
    }
    
    console.log(`👤 Perfil obtenido: ${user.email}`);
    res.json(user);
  } catch (error) {
    console.error('❌ Error obteniendo perfil:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo obtener el perfil' 
    });
  }
};

// @desc    Registrar nuevo usuario
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address
    } = req.body;

    // Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'name, email y password son obligatorios'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'Usuario ya existe',
        message: 'Ya existe un usuario con ese email'
      });
    }

    // Crear nuevo usuario (el password se encripta automáticamente en el modelo)
    const user = new User({
      name,
      email,
      password,
      phone: phone || '',
      address: address || {}
    });

    const savedUser = await user.save();
    
    console.log(`✅ Usuario registrado: ${savedUser.email}`);
    
    // Responder sin el password
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      createdAt: savedUser.createdAt
    };
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userResponse
    });
  } catch (error) {
    console.error('❌ Error registrando usuario:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo registrar el usuario' 
    });
  }
};

// @desc    Autenticar usuario & obtener token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        error: 'Credenciales requeridas',
        message: 'email y password son obligatorios'
      });
    }

    // Buscar usuario con password (normalmente está excluido)
    const user = await User.findByEmailWithPassword(email);
    
    if (!user) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Actualizar último login
    await user.updateLastLogin();
    
    console.log(`🔐 Login exitoso: ${user.email}`);
    
    // TODO: Generar JWT token (implementar en futuras partes)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin
    };
    
    res.json({
      message: 'Login exitoso',
      user: userResponse
      // token: generateToken(user._id) // TODO: Implementar JWT
    });
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo procesar el login' 
    });
  }
};

// @desc    Actualizar perfil de usuario
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id; // En futuro vendrá de req.user.id
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se encontró el usuario especificado'
      });
    }

    // Actualizar campos permitidos (sin password aquí)
    const updateFields = ['name', 'phone', 'address', 'avatar', 'newsletter', 'notifications', 'language'];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    const updatedUser = await user.save();
    
    console.log(`✅ Perfil actualizado: ${updatedUser.email}`);
    res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ Error actualizando perfil:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo actualizar el perfil' 
    });
  }
};

// @desc    Obtener todos los usuarios (Admin)
// @route   GET /api/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    console.log(`👥 Enviando ${users.length} usuarios`);
    res.json(users);
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudieron obtener los usuarios' 
    });
  }
};

module.exports = {
  getUserProfile,
  registerUser,
  loginUser,
  updateUserProfile,
  getAllUsers
};
```

### **PASO 1.4: Crear Order Controller**

#### **1.4.1 Crear controllers/orderController.js**
**Crear archivo:** `backend/controllers/orderController.js`

**PEGAR este contenido completo:**

```javascript
const { Order, Product, User } = require('../models');

// @desc    Crear nueva orden
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      shippingAddress,
      paymentMethod
    } = req.body;

    // Validaciones básicas
    if (!userId || !items || !items.length || !shippingAddress) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'userId, items y shippingAddress son obligatorios'
      });
    }

    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'El usuario especificado no existe'
      });
    }

    // Validar y procesar items
    let subtotalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({
          error: 'Producto no encontrado',
          message: `Producto con ID ${item.productId} no existe`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: 'Stock insuficiente',
          message: `Solo hay ${product.stock} unidades de ${product.name}`
        });
      }

      const itemSubtotal = product.price * item.quantity;
      subtotalAmount += itemSubtotal;

      processedItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });

      // Reducir stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calcular totales
    const shippingCost = subtotalAmount > 50 ? 0 : 10; // Envío gratis sobre $50
    const tax = subtotalAmount * 0.16; // 16% de impuestos
    const totalAmount = subtotalAmount + shippingCost + tax;

    // Generar número de orden único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const order = new Order({
      orderNumber,
      user: userId,
      items: processedItems,
      subtotalAmount,
      shippingCost,
      tax,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'pending'
    });

    const savedOrder = await order.save();
    await savedOrder.populate('user', 'name email');
    await savedOrder.populate('items.product', 'name image');
    
    console.log(`✅ Orden creada: ${savedOrder.orderNumber} - $${totalAmount}`);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('❌ Error creando orden:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo crear la orden' 
    });
  }
};

// @desc    Obtener órdenes del usuario
// @route   GET /api/orders/user/:userId
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    
    console.log(`📦 Enviando ${orders.length} órdenes del usuario ${userId}`);
    res.json(orders);
  } catch (error) {
    console.error('❌ Error obteniendo órdenes:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudieron obtener las órdenes' 
    });
  }
};

// @desc    Obtener orden por ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    const order = await Order.findById(orderId)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image description');
    
    if (!order) {
      return res.status(404).json({
        error: 'Orden no encontrada',
        message: `No se encontró la orden con ID ${orderId}`
      });
    }
    
    console.log(`📋 Enviando orden: ${order.orderNumber}`);
    res.json(order);
  } catch (error) {
    console.error('❌ Error obteniendo orden:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo obtener la orden' 
    });
  }
};

// @desc    Actualizar estado de orden
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, trackingNumber } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        error: 'Orden no encontrada',
        message: `No se encontró la orden con ID ${orderId}`
      });
    }

    // Validar estado válido
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Estado inválido',
        message: `El estado debe ser uno de: ${validStatuses.join(', ')}`
      });
    }

    // Actualizar campos
    if (status) {
      order.status = status;
      
      // Agregar al historial
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: `Estado actualizado a ${status}`
      });
    }
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    const updatedOrder = await order.save();
    
    console.log(`✅ Orden actualizada: ${updatedOrder.orderNumber} - ${status}`);
    res.json(updatedOrder);
  } catch (error) {
    console.error('❌ Error actualizando orden:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo actualizar la orden' 
    });
  }
};

// @desc    Obtener todas las órdenes (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);
    
    console.log(`📊 Enviando ${orders.length} órdenes (página ${page}/${totalPages})`);
    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo órdenes:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudieron obtener las órdenes' 
    });
  }
};

// @desc    Obtener estadísticas de órdenes
// @route   GET /api/orders/stats
// @access  Private (Admin)
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    
    // Ventas totales
    const salesResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
    ]);
    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;
    
    // Ventas por mes (últimos 12 meses)
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    const stats = {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSales: totalSales.toFixed(2),
      averageOrderValue: totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0,
      monthlyStats
    };
    
    console.log(`📈 Estadísticas generadas: ${totalOrders} órdenes, $${totalSales}`);
    res.json(stats);
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudieron obtener las estadísticas' 
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getOrderStats
};
```

---

## 🛤️ FASE 2: CREAR RUTAS (20 MINUTOS)

### **PASO 2.1: Crear carpeta routes**

#### **2.1.1 Crear directorio**
```bash
cd backend
mkdir routes
```

#### **2.1.2 Verificar creación**
```bash
# Windows
dir routes

# Linux/Mac
ls -la routes
```

### **PASO 2.2: Crear Product Routes**

#### **2.2.1 Crear routes/productRoutes.js**
**Crear archivo:** `backend/routes/productRoutes.js`

**PEGAR este contenido completo:**

```javascript
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} = require('../controllers/productController');

// @route   GET /api/products
// @desc    Obtener todos los productos
// @access  Public
router.get('/', getAllProducts);

// @route   GET /api/products/search
// @desc    Buscar productos
// @access  Public
router.get('/search', searchProducts);

// @route   GET /api/products/:id
// @desc    Obtener producto por ID
// @access  Public
router.get('/:id', getProductById);

// @route   POST /api/products
// @desc    Crear nuevo producto
// @access  Private (Admin)
router.post('/', createProduct);

// @route   PUT /api/products/:id
// @desc    Actualizar producto
// @access  Private (Admin)
router.put('/:id', updateProduct);

// @route   DELETE /api/products/:id
// @desc    Eliminar producto
// @access  Private (Admin)
router.delete('/:id', deleteProduct);

module.exports = router;
```

### **PASO 2.3: Crear User Routes**

#### **2.3.1 Crear routes/userRoutes.js**
**Crear archivo:** `backend/routes/userRoutes.js`

**PEGAR este contenido completo:**

```javascript
const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  registerUser,
  loginUser,
  updateUserProfile,
  getAllUsers
} = require('../controllers/userController');

// @route   POST /api/users/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Autenticar usuario
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/users
// @desc    Obtener todos los usuarios (Admin)
// @access  Private (Admin)
router.get('/', getAllUsers);

// @route   GET /api/users/:id
// @desc    Obtener perfil de usuario
// @access  Private
router.get('/:id', getUserProfile);

// @route   PUT /api/users/:id
// @desc    Actualizar perfil de usuario
// @access  Private
router.put('/:id', updateUserProfile);

module.exports = router;
```

### **PASO 2.4: Crear Order Routes**

#### **2.4.1 Crear routes/orderRoutes.js**
**Crear archivo:** `backend/routes/orderRoutes.js`

**PEGAR este contenido completo:**

```javascript
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getOrderStats
} = require('../controllers/orderController');

// @route   POST /api/orders
// @desc    Crear nueva orden
// @access  Private
router.post('/', createOrder);

// @route   GET /api/orders
// @desc    Obtener todas las órdenes (Admin)
// @access  Private (Admin)
router.get('/', getAllOrders);

// @route   GET /api/orders/stats
// @desc    Obtener estadísticas de órdenes
// @access  Private (Admin)
router.get('/stats', getOrderStats);

// @route   GET /api/orders/user/:userId
// @desc    Obtener órdenes del usuario
// @access  Private
router.get('/user/:userId', getUserOrders);

// @route   GET /api/orders/:id
// @desc    Obtener orden por ID
// @access  Private
router.get('/:id', getOrderById);

// @route   PUT /api/orders/:id/status
// @desc    Actualizar estado de orden
// @access  Private (Admin)
router.put('/:id/status', updateOrderStatus);

module.exports = router;
```

### **PASO 2.5: Crear Middleware de Error**

#### **2.5.1 Crear carpeta middleware**
```bash
mkdir middleware
```

#### **2.5.2 Crear middleware/errorHandler.js**
**Crear archivo:** `backend/middleware/errorHandler.js`

**PEGAR este contenido completo:**

```javascript
// Middleware de manejo de errores personalizado
const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error capturado:', err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      error: 'Error de validación',
      message: 'Los datos proporcionados no son válidos',
      details: errors
    });
  }

  // Error de duplicado (código 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: 'Valor duplicado',
      message: `El ${field} ya existe`,
      field
    });
  }

  // Error de cast (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'ID inválido',
      message: 'El ID proporcionado no tiene un formato válido'
    });
  }

  // Error por defecto
  res.status(err.statusCode || 500).json({
    error: err.name || 'Error del servidor',
    message: err.message || 'Ha ocurrido un error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware para manejar rutas no encontradas
const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};
```

---

## 🔄 FASE 3: MIGRACIÓN GRADUAL (20 MINUTOS)

### **PASO 3.1: Actualizar server.js principal**

#### **3.1.1 Crear backup del server-simple.js**
```bash
# Crear copia de seguridad
copy server-simple.js server-simple-backup.js  # Windows
cp server-simple.js server-simple-backup.js    # Linux/Mac
```

#### **3.1.2 Crear nuevo server.js profesional**
**Crear archivo:** `backend/server.js` (reemplazar el existente si lo hay)

**PEGAR este contenido completo:**

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Importar middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB Atlas
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🗄️  MongoDB Atlas conectado exitosamente!');
    console.log('🌍 Host:', mongoose.connection.host);
    console.log('📊 Base de datos:', mongoose.connection.name);
    console.log('🔗 Puerto:', mongoose.connection.port);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}

// Conectar a base de datos
connectDB();

// Middleware global
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: '🛒 E-commerce API funcionando!',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Conectado ✅' : 'Desconectado ❌',
    endpoints: {
      products: '/api/products',
      users: '/api/users', 
      orders: '/api/orders',
      health: '/health',
      dbInfo: '/api/db-info'
    }
  });
});

// Rutas API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Rutas de health check (mantener compatibilidad)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'MongoDB Atlas conectado ✅' : 'MongoDB Atlas desconectado ❌',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    version: '3.0.0'
  });
});

app.get('/api/db-info', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      // Importar modelos para contar documentos
      const { Product, User, Order } = require('./models');
      
      const productCount = await Product.countDocuments();
      const userCount = await User.countDocuments();
      const orderCount = await Order.countDocuments();
      
      res.json({
        connected: true,
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        readyState: mongoose.connection.readyState,
        readyStateText: 'Connected to MongoDB Atlas',
        collections: {
          products: productCount,
          users: userCount,
          orders: orderCount
        }
      });
    } else {
      res.status(500).json({
        connected: false,
        readyState: mongoose.connection.readyState,
        readyStateText: 'Disconnected from MongoDB Atlas'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Error obteniendo información de la base de datos',
      message: error.message
    });
  }
});

// Middleware de error (debe ir al final)
app.use(notFound);
app.use(errorHandler);

// Inicializar servidor
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 SERVIDOR E-COMMERCE INICIADO');
  console.log('='.repeat(50));
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📊 API Productos: http://localhost:${PORT}/api/products`);
  console.log(`👥 API Usuarios: http://localhost:${PORT}/api/users`);
  console.log(`🛒 API Órdenes: http://localhost:${PORT}/api/orders`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log(`📈 DB Info: http://localhost:${PORT}/api/db-info`);
  console.log('='.repeat(50));
  console.log('✅ Servidor listo para recibir peticiones');
});

// Manejo graceful de cierre
process.on('SIGTERM', async () => {
  console.log('🔄 Cerrando servidor...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Cerrando servidor...');
  await mongoose.connection.close();
  process.exit(0);
});
```

### **PASO 3.2: Verificar estructura completa**

#### **3.2.1 Verificar archivos creados**
```bash
# En terminal backend
ls -la
```

**Deberías tener:**
```
backend/
├── controllers/
│   ├── productController.js ✅
│   ├── userController.js ✅
│   └── orderController.js ✅
├── middleware/
│   └── errorHandler.js ✅
├── models/
│   ├── index.js ✅
│   ├── Product.js ✅
│   ├── User.js ✅
│   └── Order.js ✅
├── routes/
│   ├── productRoutes.js ✅
│   ├── userRoutes.js ✅
│   └── orderRoutes.js ✅
├── config/
│   └── database.js
├── .env ✅
├── server.js ✅ (nuevo profesional)
├── server-simple.js ✅ (backup funcionando)
├── server-simple-backup.js ✅ (copia seguridad)
└── seed-products.js ✅
```

### **PASO 3.3: Probar el nuevo servidor**

#### **3.3.1 Detener servidor actual**
```bash
# En terminal donde corre server-simple.js
Ctrl + C
```

#### **3.3.2 Iniciar nuevo servidor profesional**
```bash
# En terminal backend
npx nodemon server.js
```

**Deberías ver:**
```bash
🗄️  MongoDB Atlas conectado exitosamente!
🌍 Host: ac-7cd2lsu-shard-00-01.mx7lpcr.mongodb.net
📊 Base de datos: ecommercecluster
🔗 Puerto: 27017
==================================================
🚀 SERVIDOR E-COMMERCE INICIADO
==================================================
📡 Puerto: 5000
🌐 URL: http://localhost:5000
📊 API Productos: http://localhost:5000/api/products
👥 API Usuarios: http://localhost:5000/api/users
🛒 API Órdenes: http://localhost:5000/api/orders
❤️  Health Check: http://localhost:5000/health
📈 DB Info: http://localhost:5000/api/db-info
==================================================
✅ Servidor listo para recibir peticiones
```

### **PASO 3.4: Testing completo de APIs**

#### **3.4.1 Probar endpoints de productos**

**En navegador, probar:**

1. **Obtener todos los productos:**
   - URL: http://localhost:5000/api/products
   - Debería mostrar tus 3 productos con ID numérico

2. **Obtener producto individual:**
   - URL: http://localhost:5000/api/products/1
   - Debería mostrar solo el iPhone

3. **Buscar productos:**
   - URL: http://localhost:5000/api/products/search?q=iPhone
   - Debería mostrar productos que contengan "iPhone"

#### **3.4.2 Probar frontend**

1. **Ir a:** http://localhost:3000
2. **Verificar que:**
   - ✅ Los productos cargan normalmente
   - ✅ "Ver detalles" funciona
   - ✅ Las imágenes cargan
   - ✅ El carrito funciona

#### **3.4.3 Probar endpoints de sistema**

1. **Health check:**
   - URL: http://localhost:5000/health
   - Debería mostrar información del sistema

2. **DB Info:**
   - URL: http://localhost:5000/api/db-info
   - Debería mostrar conteo de documentos

#### **3.4.4 Probar nuevas funcionalidades con herramientas**

**Si tienes Postman, Thunder Client o similar:**

**1. Crear un producto:**
```json
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "name": "iPad Air M2",
  "description": "La nueva iPad Air con chip M2 ofrece un rendimiento increíble",
  "price": 799,
  "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600",
  "category": "Tablets",
  "features": ["Chip M2", "Pantalla de 10.9 pulgadas", "Cámaras avanzadas"],
  "stock": 12,
  "rating": 4.6,
  "reviewCount": 89
}
```

**2. Registrar usuario:**
```json
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@test.com",
  "password": "123456",
  "phone": "+57 300 123 4567"
}
```

---

## ✅ VERIFICACIÓN FINAL PARTE 3

### **CHECKLIST DE COMPLETACIÓN:**

#### **✅ Controllers Creados:**
- [ ] ✅ `controllers/productController.js` con métodos CRUD
- [ ] ✅ `controllers/userController.js` con autenticación
- [ ] ✅ `controllers/orderController.js` con sistema de pedidos

#### **✅ Rutas Organizadas:**
- [ ] ✅ `routes/productRoutes.js` con endpoints REST
- [ ] ✅ `routes/userRoutes.js` con registro/login
- [ ] ✅ `routes/orderRoutes.js` con gestión de órdenes

#### **✅ Middleware Implementado:**
- [ ] ✅ `middleware/errorHandler.js` con manejo profesional de errores
- [ ] ✅ Logging de peticiones implementado
- [ ] ✅ Validación de datos en controllers

#### **✅ Servidor Profesional:**
- [ ] ✅ `server.js` con arquitectura organizada
- [ ] ✅ Rutas modulares conectadas
- [ ] ✅ Middleware de error configurado
- [ ] ✅ Compatibilidad con frontend preservada

#### **✅ Funcionalidad Verificada:**
- [ ] ✅ Frontend carga productos correctamente
- [ ] ✅ Página de detalles funciona
- [ ] ✅ APIs REST responden correctamente
- [ ] ✅ Búsqueda de productos funciona
- [ ] ✅ Manejo de errores implementado

### **COMANDOS DE VERIFICACIÓN FINAL:**

```bash
# 1. Verificar estructura
ls -la controllers/ routes/ middleware/

# 2. Verificar servidor corriendo
curl http://localhost:5000/health

# 3. Verificar productos API
curl http://localhost:5000/api/products

# 4. Verificar búsqueda
curl "http://localhost:5000/api/products/search?q=iPhone"

# 5. Verificar frontend
# Abrir http://localhost:3000 y probar navegación
```

---

## 🎉 FELICITACIONES - MANUAL 3 PARTE 3 COMPLETADO

**🏆 ARQUITECTURA PROFESIONAL IMPLEMENTADA:**

### **ANTES:**
- ❌ Un solo archivo server-simple.js
- ❌ Código mezclado y desorganizado
- ❌ Sin estructura escalable
- ❌ Manejo básico de errores

### **DESPUÉS:**
- ✅ **Arquitectura MVC** profesional implementada
- ✅ **Controllers** organizados por funcionalidad
- ✅ **Rutas modulares** fáciles de mantener
- ✅ **Middleware** personalizado de errores
- ✅ **APIs REST** completas y documentadas
- ✅ **Escalabilidad** preparada para crecimiento

### **FUNCIONALIDADES NUEVAS AGREGADAS:**
- **🔍 Búsqueda de productos** con filtros
- **👤 Sistema de usuarios** con registro/login
- **🛒 Sistema de órdenes** completo
- **📊 Estadísticas** y analytics básicas
- **🛡️ Manejo robusto** de errores y validaciones

### **ESTRUCTURA FINAL LOGRADA:**
```
🏗️ ARQUITECTURA PROFESIONAL
├── 📁 controllers/     (Lógica de negocio)
├── 📁 routes/          (Endpoints organizados)
├── 📁 middleware/      (Funciones intermedias)
├── 📁 models/          (Modelos de datos)
└── 📄 server.js        (Servidor principal)
```

---

## 📋 PREPARACIÓN PARA PARTE 4

### **MANUAL 3 - PARTE 4: AUTENTICACIÓN JWT Y SEGURIDAD**
**Lo que viene a continuación:**
- ✅ **Autenticación JWT** completa
- ✅ **Middleware de protección** de rutas
- ✅ **Roles y permisos** (user/admin)
- ✅ **Seguridad avanzada** (rate limiting, CORS)
- ✅ **Integración con frontend** para login/logout

### **YA TIENES PREPARADO:**
- ✅ **Controllers de usuario** con login/register
- ✅ **Modelos con encriptación** de passwords
- ✅ **Rutas organizadas** para expansión
- ✅ **Estructura escalable** para autenticación

---

**💾 MANUAL 3 - PARTE 3: CONTROLLERS Y RUTAS COMPLETADO** ✅

**Estado:** ✅ Arquitectura profesional implementada sin errores  
**Tiempo invertido:** ~60 minutos  
**Nivel alcanzado:** Backend profesional con APIs REST  
**Próximo paso:** Implementar autenticación JWT y seguridad  

**🚀 ¡EXCELENTE TRABAJO! Has transformado tu proyecto en una aplicación de nivel empresarial.** 🏆