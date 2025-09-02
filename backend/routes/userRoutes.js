const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getMyProfile,
  registerUser,
  loginUser,
  updateUserProfile,
  updateMyProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers
} = require('../controllers/userController');

// Importar middleware de autenticación y autorización (deberás crearlos)
// const { protect, admin } = require('../middleware/authMiddleware');

// ==================== RUTAS PÚBLICAS ====================

// @route   POST /api/users/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Autenticar usuario & obtener token
// @access  Public
router.post('/login', loginUser);

// ==================== RUTAS PRIVADAS (Usuario autenticado) ====================

// @route   GET /api/users/me
// @desc    Obtener perfil del usuario autenticado
// @access  Private
// router.get('/me', protect, getMyProfile);
router.get('/me', getMyProfile); // Temporalmente sin auth

// @route   PUT /api/users/me
// @desc    Actualizar perfil del usuario autenticado
// @access  Private
// router.put('/me', protect, updateMyProfile);
router.put('/me', updateMyProfile); // Temporalmente sin auth

// @route   PUT /api/users/change-password
// @desc    Cambiar contraseña del usuario autenticado
// @access  Private
// router.put('/change-password', protect, changePassword);
router.put('/change-password', changePassword); // Temporalmente sin auth

// @route   GET /api/users/profile/:id
// @desc    Obtener perfil de usuario por ID
// @access  Private
// router.get('/profile/:id', protect, getUserProfile);
router.get('/profile/:id', getUserProfile); // Temporalmente sin auth

// @route   PUT /api/users/profile/:id
// @desc    Actualizar perfil de usuario por ID
// @access  Private
// router.put('/profile/:id', protect, updateUserProfile);
router.put('/profile/:id', updateUserProfile); // Temporalmente sin auth

// ==================== RUTAS DE ADMINISTRADOR ====================

// @route   GET /api/users
// @desc    Obtener todos los usuarios con filtros y paginación
// @access  Private (Admin)
// router.get('/', protect, admin, getAllUsers);
router.get('/', getAllUsers); // Temporalmente sin auth

// @route   GET /api/users/search
// @desc    Buscar usuarios por término
// @access  Private (Admin)
// router.get('/search', protect, admin, searchUsers);
router.get('/search', searchUsers); // Temporalmente sin auth

// @route   GET /api/users/:id
// @desc    Obtener usuario por ID (Admin)
// @access  Private (Admin)
// router.get('/:id', protect, admin, getUserById);
router.get('/:id', getUserById); // Temporalmente sin auth

// @route   PUT /api/users/:id
// @desc    Actualizar usuario (Admin - campos completos)
// @access  Private (Admin)
// router.put('/:id', protect, admin, updateUser);
router.put('/:id', updateUser); // Temporalmente sin auth

// @route   DELETE /api/users/:id
// @desc    Eliminar usuario (borrado lógico)
// @access  Private (Admin)
// router.delete('/:id', protect, admin, deleteUser);
router.delete('/:id', deleteUser); // Temporalmente sin auth

module.exports = router;