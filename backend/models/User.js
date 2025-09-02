const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// Esquema para usuarios del sistema
const userSchema = new mongoose.Schema({
  // Información personal
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
    minlength: [2, 'El nombre debe tener al menos 2 caracteres']
  },
  
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingresa un email válido'
    ],
    index: true
  },
  
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No incluir password en consultas por defecto
  },
  
  // Información de perfil
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Debe ser una URL válida'
    }
  },
  
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Número de teléfono inválido'
    }
  },
  
  // Sistema de roles
  role: {
    type: String,
    enum: {
      values: ['customer', 'admin', 'moderator'],
      message: '{VALUE} no es un rol válido'
    },
    default: 'customer'
  },
  
  // Información de dirección
  address: {
    street: {
      type: String,
      trim: true,
      maxlength: [100, 'La dirección no puede exceder 100 caracteres']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [50, 'La ciudad no puede exceder 50 caracteres']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [50, 'El estado no puede exceder 50 caracteres']
    },
    zipCode: {
      type: String,
      trim: true,
      maxlength: [20, 'El código postal no puede exceder 20 caracteres']
    },
    country: {
      type: String,
      default: 'Colombia',
      maxlength: [50, 'El país no puede exceder 50 caracteres']
    }
  },
  
  // Control de cuenta
  isActive: {
    type: Boolean,
    default: true
  },
  
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  // Fechas importantes
  lastLogin: {
    type: Date
  },
  
  // Preferencias del usuario
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      enum: ['es', 'en'],
      default: 'es'
    }
  },
  
  // Tokens para recuperación de contraseña
  resetPasswordToken: String,
  resetPasswordExpire: Date

}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpire;
      return ret;
    }
  }
});

// ===== VIRTUALS =====

// Virtual para obtener iniciales
userSchema.virtual('initials').get(function() {
  return this.name.split(' ').map(n => n[0]).join('').toUpperCase();
});

// Virtual para nombre completo de dirección
userSchema.virtual('fullAddress').get(function() {
  if (!this.address.street) return '';
  
  const parts = [
    this.address.street,
    this.address.city,
    this.address.state,
    this.address.zipCode,
    this.address.country
  ].filter(part => part);
  
  return parts.join(', ');
});

// ===== ÍNDICES =====
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'address.city': 1 });

// ===== MIDDLEWARE PRE-SAVE =====

// Encriptar password antes de guardar
userSchema.pre('save', async function(next) {
  // Solo encriptar si el password fue modificado
  if (!this.isModified('password')) return next();
  
  try {
    // Generar salt y encriptar password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Actualizar lastLogin cuando se modifica
userSchema.pre('save', function(next) {
  if (this.isModified('lastLogin')) {
    this.lastLogin = new Date();
  }
  next();
});

// ===== MÉTODOS DEL MODELO =====

// Método para comparar passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Método para actualizar último login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Método para verificar si es admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

// Método para verificar si puede moderar
userSchema.methods.canModerate = function() {
  return this.role === 'admin' || this.role === 'moderator';
};

// ===== MÉTODOS ESTÁTICOS =====

// Encontrar usuarios por rol
userSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true });
};

// Encontrar usuarios activos
userSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

// Buscar usuario por email (incluyendo password)
userSchema.statics.findByEmailWithPassword = function(email) {
  return this.findOne({ email }).select('+password');
};

module.exports = mongoose.model('User', userSchema);