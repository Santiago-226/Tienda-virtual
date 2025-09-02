const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getProductsOnSale
} = require('../controllers/productController');

// Importar middleware de autenticación y autorización (deberás crearlos)
// const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/products
// @desc    Obtener todos los productos con filtros y paginación
// @access  Public
router.get('/', getAllProducts);

// @route   GET /api/products/search
// @desc    Buscar productos por término
// @access  Public
router.get('/search', searchProducts);

// @route   GET /api/products/featured
// @desc    Obtener productos destacados
// @access  Public
router.get('/featured', getFeaturedProducts);

// @route   GET /api/products/on-sale
// @desc    Obtener productos en oferta
// @access  Public
router.get('/on-sale', getProductsOnSale);

// @route   GET /api/products/category/:categoryId
// @desc    Obtener productos por categoría
// @access  Public
router.get('/category/:categoryId', getProductsByCategory);

// @route   GET /api/products/:identifier
// @desc    Obtener producto por ID o slug
// @access  Public
router.get('/:identifier', getProductById);

// @route   POST /api/products
// @desc    Crear nuevo producto
// @access  Private (Admin)
// router.post('/', protect, admin, createProduct);
router.post('/', createProduct); // Temporalmente sin auth

// @route   PUT /api/products/:id
// @desc    Actualizar producto
// @access  Private (Admin)
// router.put('/:id', protect, admin, updateProduct);
router.put('/:id', updateProduct); // Temporalmente sin auth

// @route   DELETE /api/products/:id
// @desc    Eliminar producto (borrado lógico)
// @access  Private (Admin)
// router.delete('/:id', protect, admin, deleteProduct);
router.delete('/:id', deleteProduct); // Temporalmente sin auth

module.exports = router;