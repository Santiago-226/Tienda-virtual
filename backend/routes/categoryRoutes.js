const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getPopularCategories,
  searchCategories,
  getCategoryStats,
  updateProductCount
} = require('../controllers/categoryController');

// Importar middleware de autenticación y autorización (deberás crearlos)
// const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/categories
// @desc    Obtener todas las categorías
// @access  Public
router.get('/', getAllCategories);

// @route   GET /api/categories/search
// @desc    Buscar categorías por término
// @access  Public
router.get('/search', searchCategories);

// @route   GET /api/categories/popular
// @desc    Obtener categorías populares
// @access  Public
router.get('/popular', getPopularCategories);

// @route   GET /api/categories/stats
// @desc    Obtener estadísticas de categorías
// @access  Private (Admin)
// router.get('/stats', protect, admin, getCategoryStats);
router.get('/stats', getCategoryStats); // Temporalmente sin auth

// @route   PUT /api/categories/:id/update-count
// @desc    Actualizar contador de productos de una categoría
// @access  Private (Sistema/Admin)
router.put('/:id/update-count', updateProductCount);

// @route   GET /api/categories/:identifier
// @desc    Obtener categoría por ID o slug
// @access  Public
router.get('/:identifier', getCategoryById);

// @route   POST /api/categories
// @desc    Crear nueva categoría
// @access  Private (Admin)
// router.post('/', protect, admin, createCategory);
router.post('/', createCategory); // Temporalmente sin auth

// @route   PUT /api/categories/:id
// @desc    Actualizar categoría
// @access  Private (Admin)
// router.put('/:id', protect, admin, updateCategory);
router.put('/:id', updateCategory); // Temporalmente sin auth

// @route   DELETE /api/categories/:id
// @desc    Eliminar categoría (borrado lógico)
// @access  Private (Admin)
// router.delete('/:id', protect, admin, deleteCategory);
router.delete('/:id', deleteCategory); // Temporalmente sin auth

module.exports = router;
