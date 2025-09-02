const mongoose = require('mongoose');

// Esquema para categorías
const categorySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la categoría es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    unique: true,
    index: true
  },

  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },

  image: {
    type: String,
    validate: {
      validator: function (v) {
        if (!v) return true; // Permitir vacío
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(v);
      },
      message: 'La imagen debe ser una URL válida'
    }
  },

  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true
  },

  // Métricas opcionales
  productCount: {
    type: Number,
    default: 0,
    min: [0, 'El número de productos no puede ser negativo']
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ===== VIRTUALS =====
categorySchema.virtual('url').get(function () {
  return `/categories/${this.slug || this._id}`;
});

// ===== MIDDLEWARE PRE-SAVE =====
categorySchema.pre('save', function (next) {
  // Generar slug si no existe
  if (!this.slug && this.nombre) {
    this.slug = this.nombre
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // quitar caracteres especiales
      .replace(/\s+/g, '-')         // espacios por guiones
      .replace(/-+/g, '-')          // múltiples guiones a uno
      .trim('-');                   // limpiar guiones extremos
  }

  // Normalizar el nombre
  if (this.nombre) {
    this.nombre = this.nombre.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  next();
});

// ===== MÉTODOS DEL MODELO =====

// Incrementar contador de productos
categorySchema.methods.incrementProductCount = function (quantity = 1) {
  this.productCount += quantity;
  return this.save();
};

// Reducir contador de productos
categorySchema.methods.decrementProductCount = function (quantity = 1) {
  if (this.productCount >= quantity) {
    this.productCount -= quantity;
  }
  return this.save();
};

// ===== MÉTODOS ESTÁTICOS =====
categorySchema.statics.findActive = function () {
  return this.find({ isActive: true }).sort({ nombre: 1 });
};

module.exports = mongoose.model('Category', categorySchema);
