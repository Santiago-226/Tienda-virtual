const { User } = require('../models/User');
const mongoose = require('mongoose');

// @desc    Obtener perfil de usuario
// @route   GET /api/users/profile/:id
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se encontró el usuario especificado'
      });
    }
    
    // Incluir campos virtuales
    const userWithVirtuals = {
      ...user.toObject(),
      initials: user.initials,
      fullAddress: user.fullAddress
    };
    
    console.log(`👤 Perfil obtenido: ${user.email}`);
    res.json(userWithVirtuals);
  } catch (error) {
    console.error('❌ Error obteniendo perfil:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo obtener el perfil' 
    });
  }
};

// @desc    Obtener mi propio perfil (desde token)
// @route   GET /api/users/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    // req.user vendrá del middleware de autenticación
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se encontró el usuario'
      });
    }
    
    // Incluir campos virtuales
    const userWithVirtuals = {
      ...user.toObject(),
      initials: user.initials,
      fullAddress: user.fullAddress
    };
    
    console.log(`👤 Perfil propio obtenido: ${user.email}`);
    res.json(userWithVirtuals);
  } catch (error) {
    console.error('❌ Error obteniendo perfil propio:', error.message);
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
      address,
      avatar,
      preferences
    } = req.body;

    // Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'name, email y password son obligatorios'
      });
    }

    // Validar formato de email
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Email inválido',
        message: 'Por favor ingresa un email válido'
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
      address: address || {},
      avatar: avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      preferences: preferences || {
        newsletter: true,
        notifications: true,
        language: 'es'
      }
    });

    const savedUser = await user.save();
    
    console.log(`✅ Usuario registrado: ${savedUser.email}`);
    
    // Incluir campos virtuales en la respuesta
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      avatar: savedUser.avatar,
      phone: savedUser.phone,
      role: savedUser.role,
      address: savedUser.address,
      preferences: savedUser.preferences,
      isActive: savedUser.isActive,
      emailVerified: savedUser.emailVerified,
      lastLogin: savedUser.lastLogin,
      initials: savedUser.initials,
      fullAddress: savedUser.fullAddress,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt
    };
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userResponse
    });
  } catch (error) {
    console.error('❌ Error registrando usuario:', error.message);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({
        error: 'Error de validación',
        messages: errors
      });
    } else {
      res.status(500).json({ 
        error: 'Error del servidor', 
        message: 'No se pudo registrar el usuario' 
      });
    }
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

    // Verificar si la cuenta está activa
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Cuenta desactivada',
        message: 'Tu cuenta ha sido desactivada. Contacta al administrador.'
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
    
    // Incluir campos virtuales en la respuesta
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      role: user.role,
      address: user.address,
      preferences: user.preferences,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
      initials: user.initials,
      fullAddress: user.fullAddress,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
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
// @route   PUT /api/users/profile/:id
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se encontró el usuario especificado'
      });
    }

    // Actualizar campos permitidos (sin password aquí)
    const updateFields = [
      'name', 'phone', 'address', 'avatar', 
      'preferences'
    ];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        // Para objetos como address y preferences, hacer merge
        if (typeof req.body[field] === 'object' && !Array.isArray(req.body[field])) {
          user[field] = { ...user[field], ...req.body[field] };
        } else {
          user[field] = req.body[field];
        }
      }
    });

    const updatedUser = await user.save();
    
    console.log(`✅ Perfil actualizado: ${updatedUser.email}`);
    
    // Incluir campos virtuales en la respuesta
    const userResponse = {
      ...updatedUser.toObject(),
      initials: updatedUser.initials,
      fullAddress: updatedUser.fullAddress
    };
    
    res.json({
      message: 'Perfil actualizado exitosamente',
      user: userResponse
    });
  } catch (error) {
    console.error('❌ Error actualizando perfil:', error.message);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({
        error: 'Error de validación',
        messages: errors
      });
    } else {
      res.status(500).json({ 
        error: 'Error del servidor', 
        message: 'No se pudo actualizar el perfil' 
      });
    }
  }
};

// @desc    Actualizar mi propio perfil
// @route   PUT /api/users/me
// @access  Private
const updateMyProfile = async (req, res) => {
  try {
    // req.user vendrá del middleware de autenticación
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se encontró el usuario'
      });
    }

    // Actualizar campos permitidos (sin password, role, etc.)
    const updateFields = [
      'name', 'phone', 'address', 'avatar', 
      'preferences'
    ];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        // Para objetos como address y preferences, hacer merge
        if (typeof req.body[field] === 'object' && !Array.isArray(req.body[field])) {
          user[field] = { ...user[field], ...req.body[field] };
        } else {
          user[field] = req.body[field];
        }
      }
    });

    const updatedUser = await user.save();
    
    console.log(`✅ Perfil propio actualizado: ${updatedUser.email}`);
    
    // Incluir campos virtuales en la respuesta
    const userResponse = {
      ...updatedUser.toObject(),
      initials: updatedUser.initials,
      fullAddress: updatedUser.fullAddress
    };
    
    res.json({
      message: 'Perfil actualizado exitosamente',
      user: userResponse
    });
  } catch (error) {
    console.error('❌ Error actualizando perfil propio:', error.message);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({
        error: 'Error de validación',
        messages: errors
      });
    } else {
      res.status(500).json({ 
        error: 'Error del servidor', 
        message: 'No se pudo actualizar el perfil' 
      });
    }
  }
};

// @desc    Cambiar contraseña
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    // req.user vendrá del middleware de autenticación
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Datos requeridos',
        message: 'La contraseña actual y la nueva contraseña son obligatorias'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Contraseña inválida',
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Buscar usuario con password
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se encontró el usuario'
      });
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: 'Contraseña incorrecta',
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();
    
    console.log(`🔐 Contraseña cambiada: ${user.email}`);
    
    res.json({
      message: 'Contraseña cambiada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error cambiando contraseña:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo cambiar la contraseña' 
    });
  }
};

// @desc    Obtener todos los usuarios (Admin)
// @route   GET /api/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Filtros
    let filter = {};
    
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    if (req.query.active !== undefined) {
      filter.isActive = req.query.active === 'true';
    }
    
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments(filter);
    
    // Incluir campos virtuales
    const usersWithVirtuals = users.map(user => ({
      ...user.toObject(),
      initials: user.initials,
      fullAddress: user.fullAddress
    }));
    
    console.log(`👥 Enviando ${usersWithVirtuals.length} usuarios (página ${page})`);
    
    res.json({
      users: usersWithVirtuals,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudieron obtener los usuarios' 
    });
  }
};

// @desc    Obtener usuario por ID (Admin)
// @route   GET /api/users/:id
// @access  Private (Admin)
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se encontró el usuario especificado'
      });
    }
    
    // Incluir campos virtuales
    const userWithVirtuals = {
      ...user.toObject(),
      initials: user.initials,
      fullAddress: user.fullAddress
    };
    
    console.log(`👤 Usuario obtenido por ID: ${user.email}`);
    res.json(userWithVirtuals);
  } catch (error) {
    console.error('❌ Error obteniendo usuario por ID:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo obtener el usuario' 
    });
  }
};

// @desc    Actualizar usuario (Admin)
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se encontró el usuario especificado'
      });
    }

    // Actualizar campos permitidos (admin puede actualizar más campos)
    const updateFields = [
      'name', 'phone', 'address', 'avatar', 
      'preferences', 'role', 'isActive', 'emailVerified'
    ];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        // Para objetos como address y preferences, hacer merge
        if (typeof req.body[field] === 'object' && !Array.isArray(req.body[field])) {
          user[field] = { ...user[field], ...req.body[field] };
        } else {
          user[field] = req.body[field];
        }
      }
    });

    const updatedUser = await user.save();
    
    console.log(`✅ Usuario actualizado por admin: ${updatedUser.email}`);
    
    // Incluir campos virtuales en la respuesta
    const userResponse = {
      ...updatedUser.toObject(),
      initials: updatedUser.initials,
      fullAddress: updatedUser.fullAddress
    };
    
    res.json({
      message: 'Usuario actualizado exitosamente',
      user: userResponse
    });
  } catch (error) {
    console.error('❌ Error actualizando usuario:', error.message);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({
        error: 'Error de validación',
        messages: errors
      });
    } else {
      res.status(500).json({ 
        error: 'Error del servidor', 
        message: 'No se pudo actualizar el usuario' 
      });
    }
  }
};

// @desc    Eliminar usuario (Admin - borrado lógico)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No se encontró el usuario especificado'
      });
    }

    // Borrado lógico en lugar de físico
    user.isActive = false;
    await user.save();
    
    console.log(`🗑️ Usuario desactivado: ${user.email}`);
    res.json({
      message: 'Usuario desactivado exitosamente',
      deletedUser: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Error eliminando usuario:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo eliminar el usuario' 
    });
  }
};

// @desc    Buscar usuarios
// @route   GET /api/users/search?q=term
// @access  Private (Admin)
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({
        error: 'Parámetro de búsqueda requerido',
        message: 'Proporciona un término de búsqueda con ?q=término'
      });
    }

    const searchRegex = new RegExp(q, 'i');
    
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { 'address.city': searchRegex }
      ]
    }).limit(20);
    
    // Incluir campos virtuales
    const usersWithVirtuals = users.map(user => ({
      ...user.toObject(),
      initials: user.initials,
      fullAddress: user.fullAddress
    }));
    
    console.log(`🔍 Búsqueda "${q}": ${usersWithVirtuals.length} usuarios encontrados`);
    res.json(usersWithVirtuals);
  } catch (error) {
    console.error('❌ Error en búsqueda de usuarios:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo realizar la búsqueda' 
    });
  }
};

module.exports = {
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
};