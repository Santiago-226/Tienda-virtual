const { Order, Product, User } = require('../models');
const mongoose = require('mongoose');

// @desc    Crear nueva orden
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingMethod,
      notes
    } = req.body;

    // Validaciones básicas
    if (!userId || !items || !items.length || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'userId, items, shippingAddress y paymentMethod son obligatorios'
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
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          error: 'Producto no encontrado',
          message: `Producto con ID ${item.product} no existe`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: 'Stock insuficiente',
          message: `Solo hay ${product.stock} unidades de ${product.nombre}`
        });
      }

      const itemSubtotal = product.precio * item.quantity;
      subtotalAmount += itemSubtotal;

      processedItems.push({
        product: product._id,
        name: product.nombre,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        price: product.precio,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });

      // Reducir stock y aumentar contador de ventas
      await product.incrementSales(item.quantity);
    }

    // Calcular costos de envío según el método
    let shippingCost = 0;
    switch (shippingMethod) {
      case 'express':
        shippingCost = 15;
        break;
      case 'overnight':
        shippingCost = 25;
        break;
      case 'pickup':
        shippingCost = 0;
        break;
      default: // standard
        shippingCost = subtotalAmount > 50 ? 0 : 10; // Envío gratis sobre $50
    }

    // Calcular impuestos (16% para Colombia)
    const tax = subtotalAmount * 0.16;
    const totalAmount = subtotalAmount + shippingCost + tax;

    // Crear la orden (el número se genera automáticamente en el pre-save)
    const order = new Order({
      user: userId,
      items: processedItems,
      subtotalAmount,
      shippingCost,
      tax,
      totalAmount,
      paymentMethod,
      shippingMethod: shippingMethod || 'standard',
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      notes: notes || ''
    });

    const savedOrder = await order.save();
    await savedOrder.populate('user', 'name email');
    await savedOrder.populate('items.product', 'nombre images');
    
    console.log(`✅ Orden creada: ${savedOrder.orderNumber} - $${totalAmount}`);
    
    // Incluir campos virtuales en la respuesta
    const orderResponse = {
      ...savedOrder.toObject(),
      itemCount: savedOrder.itemCount,
      isCompleted: savedOrder.isCompleted,
      canBeCancelled: savedOrder.canBeCancelled,
      formattedShippingAddress: savedOrder.formattedShippingAddress
    };
    
    res.status(201).json(orderResponse);
  } catch (error) {
    console.error('❌ Error creando orden:', error.message);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({
        error: 'Error de validación',
        messages: errors
      });
    } else {
      res.status(500).json({ 
        error: 'Error del servidor', 
        message: 'No se pudo crear la orden' 
      });
    }
  }
};

// @desc    Obtener órdenes del usuario
// @route   GET /api/orders/user/:userId
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtros
    let filter = { user: userId };
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    const orders = await Order.find(filter)
      .populate('items.product', 'nombre images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments(filter);
    
    // Incluir campos virtuales
    const ordersWithVirtuals = orders.map(order => ({
      ...order.toObject(),
      itemCount: order.itemCount,
      isCompleted: order.isCompleted,
      canBeCancelled: order.canBeCancelled,
      formattedShippingAddress: order.formattedShippingAddress
    }));
    
    console.log(`📦 Enviando ${ordersWithVirtuals.length} órdenes del usuario ${userId}`);
    
    res.json({
      orders: ordersWithVirtuals,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
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

// @desc    Obtener orden por ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    const order = await Order.findById(orderId)
      .populate('user', 'name email phone avatar')
      .populate('items.product', 'nombre images descripcion');
    
    if (!order) {
      return res.status(404).json({
        error: 'Orden no encontrada',
        message: `No se encontró la orden con ID ${orderId}`
      });
    }
    
    // Verificar que el usuario tiene acceso a esta orden
    // (En un sistema real, verificaríamos req.user.id contra order.user)
    
    // Incluir campos virtuales
    const orderWithVirtuals = {
      ...order.toObject(),
      itemCount: order.itemCount,
      isCompleted: order.isCompleted,
      canBeCancelled: order.canBeCancelled,
      formattedShippingAddress: order.formattedShippingAddress
    };
    
    console.log(`📋 Enviando orden: ${order.orderNumber}`);
    res.json(orderWithVirtuals);
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
    const { status, notes, trackingNumber, estimatedDelivery } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        error: 'Orden no encontrada',
        message: `No se encontró la orden con ID ${orderId}`
      });
    }

    // Validar estado válido
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Estado inválido',
        message: `El estado debe ser uno de: ${validStatuses.join(', ')}`
      });
    }

    // Actualizar usando el método del modelo
    if (status) {
      await order.updateStatus(status, req.user?.id, notes);
    }
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    if (estimatedDelivery) {
      order.estimatedDelivery = new Date(estimatedDelivery);
    }

    const updatedOrder = await order.save();
    await updatedOrder.populate('user', 'name email');
    
    console.log(`✅ Orden actualizada: ${updatedOrder.orderNumber} - ${status}`);
    
    // Incluir campos virtuales en la respuesta
    const orderResponse = {
      ...updatedOrder.toObject(),
      itemCount: updatedOrder.itemCount,
      isCompleted: updatedOrder.isCompleted,
      canBeCancelled: updatedOrder.canBeCancelled,
      formattedShippingAddress: updatedOrder.formattedShippingAddress
    };
    
    res.json(orderResponse);
  } catch (error) {
    console.error('❌ Error actualizando orden:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo actualizar la orden' 
    });
  }
};

// @desc    Cancelar orden (usuario)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { reason } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        error: 'Orden no encontrada',
        message: `No se encontró la orden con ID ${orderId}`
      });
    }

    // Verificar que la orden puede ser cancelada
    if (!order.canBeCancelled) {
      return res.status(400).json({
        error: 'No se puede cancelar',
        message: 'Esta orden ya no puede ser cancelada'
      });
    }

    // Verificar que el usuario es el dueño de la orden
    // (En un sistema real, verificaríamos req.user.id contra order.user)
    
    // Actualizar estado a cancelled
    await order.updateStatus('cancelled', null, reason || 'Cancelada por el usuario');
    
    // Restaurar stock de productos
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        product.salesCount = Math.max(0, product.salesCount - item.quantity);
        await product.save();
      }
    }

    const updatedOrder = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('items.product', 'nombre images');
    
    console.log(`❌ Orden cancelada: ${updatedOrder.orderNumber}`);
    
    // Incluir campos virtuales en la respuesta
    const orderResponse = {
      ...updatedOrder.toObject(),
      itemCount: updatedOrder.itemCount,
      isCompleted: updatedOrder.isCompleted,
      canBeCancelled: updatedOrder.canBeCancelled,
      formattedShippingAddress: updatedOrder.formattedShippingAddress
    };
    
    res.json({
      message: 'Orden cancelada exitosamente',
      order: orderResponse
    });
  } catch (error) {
    console.error('❌ Error cancelando orden:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo cancelar la orden' 
    });
  }
};

// @desc    Obtener todas las órdenes (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Filtros
    let filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }
    
    if (req.query.user) {
      filter.user = req.query.user;
    }
    
    if (req.query.search) {
      filter.$or = [
        { orderNumber: { $regex: req.query.search, $options: 'i' } },
        { 'shippingAddress.city': { $regex: req.query.search, $options: 'i' } },
        { 'user.name': { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Ordenamiento
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch(req.query.sort) {
        case 'total_asc':
          sort = { totalAmount: 1 };
          break;
        case 'total_desc':
          sort = { totalAmount: -1 };
          break;
        case 'date_asc':
          sort = { createdAt: 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }
    
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'nombre images')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Order.countDocuments(filter);
    
    // Incluir campos virtuales
    const ordersWithVirtuals = orders.map(order => ({
      ...order.toObject(),
      itemCount: order.itemCount,
      isCompleted: order.isCompleted,
      canBeCancelled: order.canBeCancelled,
      formattedShippingAddress: order.formattedShippingAddress
    }));
    
    console.log(`📊 Enviando ${ordersWithVirtuals.length} órdenes (página ${page})`);
    
    res.json({
      orders: ordersWithVirtuals,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
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
    // Estadísticas básicas
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    
    // Ventas totales (excluyendo órdenes canceladas)
    const salesResult = await Order.aggregate([
      { 
        $match: { 
          status: { $nin: ['cancelled', 'returned'] },
          paymentStatus: { $ne: 'failed' }
        } 
      },
      { 
        $group: { 
          _id: null, 
          totalSales: { $sum: '$totalAmount' },
          averageOrder: { $avg: '$totalAmount' }
        } 
      }
    ]);
    
    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;
    const averageOrder = salesResult.length > 0 ? salesResult[0].averageOrder : 0;
    
    // Ventas por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $nin: ['cancelled', 'returned'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          averageOrder: { $avg: '$totalAmount' }
        }
      },
      { 
        $sort: { '_id.year': 1, '_id.month': 1 } 
      },
      {
        $limit: 6
      }
    ]);
    
    // Productos más vendidos
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled', 'returned'] }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productName: '$product.nombre',
          totalSold: 1,
          totalRevenue: 1
        }
      }
    ]);
    
    const stats = {
      totals: {
        orders: totalOrders,
        sales: totalSales,
        averageOrder: parseFloat(averageOrder.toFixed(2))
      },
      byStatus: {
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders
      },
      monthlyStats,
      topProducts
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

// @desc    Actualizar información de pago
// @route   PUT /api/orders/:id/payment
// @access  Private
const updatePaymentStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { paymentStatus, paymentId } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        error: 'Orden no encontrada',
        message: `No se encontró la orden con ID ${orderId}`
      });
    }

    // Validar estado de pago
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'];
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        error: 'Estado de pago inválido',
        message: `El estado de pago debe ser uno de: ${validPaymentStatuses.join(', ')}`
      });
    }

    // Actualizar información de pago
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    
    if (paymentId) {
      order.paymentId = paymentId;
    }

    const updatedOrder = await order.save();
    await updatedOrder.populate('user', 'name email');
    
    console.log(`💳 Estado de pago actualizado: ${updatedOrder.orderNumber} - ${paymentStatus}`);
    
    // Incluir campos virtuales en la respuesta
    const orderResponse = {
      ...updatedOrder.toObject(),
      itemCount: updatedOrder.itemCount,
      isCompleted: updatedOrder.isCompleted,
      canBeCancelled: updatedOrder.canBeCancelled,
      formattedShippingAddress: updatedOrder.formattedShippingAddress
    };
    
    res.json(orderResponse);
  } catch (error) {
    console.error('❌ Error actualizando estado de pago:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo actualizar el estado de pago' 
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getOrderStats,
  updatePaymentStatus
};