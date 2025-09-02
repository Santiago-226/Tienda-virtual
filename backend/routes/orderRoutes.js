const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getOrderStats,
  updatePaymentStatus
} = require('../controllers/orderController');

// Importar middleware de autenticación y autorización (deberás crearlos)
// const { protect, admin } = require('../middleware/authMiddleware');

// ==================== RUTAS PRIVADAS (Usuario autenticado) ====================

// @route   POST /api/orders
// @desc    Crear nueva orden
// @access  Private
// router.post('/', protect, createOrder);
router.post('/', createOrder); // Temporalmente sin auth

// @route   GET /api/orders/user/:userId
// @desc    Obtener órdenes del usuario con filtros y paginación
// @access  Private
// router.get('/user/:userId', protect, getUserOrders);
router.get('/user/:userId', getUserOrders); // Temporalmente sin auth

// @route   GET /api/orders/:id
// @desc    Obtener orden por ID
// @access  Private
// router.get('/:id', protect, getOrderById);
router.get('/:id', getOrderById); // Temporalmente sin auth

// @route   PUT /api/orders/:id/cancel
// @desc    Cancelar orden (usuario)
// @access  Private
// router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/cancel', cancelOrder); // Temporalmente sin auth

// @route   PUT /api/orders/:id/payment
// @desc    Actualizar información de pago
// @access  Private
// router.put('/:id/payment', protect, updatePaymentStatus);
router.put('/:id/payment', updatePaymentStatus); // Temporalmente sin auth

// ==================== RUTAS DE ADMINISTRADOR ====================

// @route   GET /api/orders
// @desc    Obtener todas las órdenes con filtros y paginación
// @access  Private (Admin)
// router.get('/', protect, admin, getAllOrders);
router.get('/', getAllOrders); // Temporalmente sin auth

// @route   GET /api/orders/stats
// @desc    Obtener estadísticas de órdenes
// @access  Private (Admin)
// router.get('/stats', protect, admin, getOrderStats);
router.get('/stats', getOrderStats); // Temporalmente sin auth

// @route   PUT /api/orders/:id/status
// @desc    Actualizar estado de orden
// @access  Private (Admin)
// router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/status', updateOrderStatus); // Temporalmente sin auth

module.exports = router;