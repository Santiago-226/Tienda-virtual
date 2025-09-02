const mongoose = require('mongoose');

// Esquema para productos agrícolas del e-commerce
const productSchema = new mongoose.Schema({
  // Información básica
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
    maxlength: [150, 'El nombre no puede exceder 150 caracteres'],
    index: true
  },

  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
  },

  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },

  precioOriginal: {
    type: Number,
    min: [0, 'El precio original no puede ser negativo'],
    default: 0
  },

  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(v);
      },
      message: 'Cada imagen debe ser una URL válida'
    }
  }],

  // Relación con categorías
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoría es obligatoria'],
    index: true
  },

  // Características y especificaciones
  caracteristicas: [{
    type: String,
    maxlength: [300, 'Cada característica no puede exceder 300 caracteres']
  }],

  especificaciones: {
    type: Map,
    of: String,
    validate: {
      validator: function(map) {
        if (!map) return true;
        return map.size <= 30;
      },
      message: 'No se pueden tener más de 30 especificaciones'
    }
  },

  // Inventario
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },

  // Calificación
  rating: {
    type: Number,
    min: [0, 'La calificación mínima es 0'],
    max: [5, 'La calificación máxima es 5'],
    default: 0
  },

  totalReviews: {
    type: Number,
    min: [0, 'El número de reseñas no puede ser negativo'],
    default: 0
  },

  // Extras
  marca: {
    type: String,
    trim: true,
    maxlength: [100, 'La marca no puede exceder 100 caracteres']
  },

  sku: {
    type: String,
    trim: true,
    unique: true,
    maxlength: [50, 'El SKU no puede exceder 50 caracteres']
  },

  peso: {
    type: String,
    trim: true,
    maxlength: [50, 'El peso no puede exceder 50 caracteres']
  },

  dimensiones: {
    type: String,
    trim: true,
    maxlength: [100, 'Las dimensiones no pueden exceder 100 caracteres']
  },

  garantia: {
    type: String,
    trim: true,
    maxlength: [200, 'La garantía no puede exceder 200 caracteres']
  },

  incluye: [{
    type: String,
    maxlength: [200, 'Cada ítem incluido no puede exceder 200 caracteres']
  }],

  // Estado del producto
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },

  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },

  salesCount: {
    type: Number,
    default: 0,
    min: [0, 'Las ventas no pueden ser negativas']
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ===== VIRTUALS =====
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

productSchema.virtual('discountPercentage').get(function () {
  if (this.precioOriginal && this.precioOriginal > this.precio) {
    return Math.round(((this.precioOriginal - this.precio) / this.precioOriginal) * 100);
  }
  return 0;
});

productSchema.virtual('formattedPrice').get(function () {
  return `$${this.precio.toLocaleString('es-CO')}`;
});

// ===== PRE-SAVE =====
productSchema.pre('save', function (next) {
  if (!this.slug && this.nombre) {
    this.slug = this.nombre
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// ===== MÉTODOS =====
productSchema.methods.updateRating = function (newRating) {
  const total = (this.rating * this.totalReviews) + newRating;
  this.totalReviews += 1;
  this.rating = Number((total / this.totalReviews).toFixed(1));
  return this.save();
};

productSchema.methods.incrementSales = function (quantity = 1) {
  this.salesCount += quantity;
  if (this.stock >= quantity) {
    this.stock -= quantity;
  }
  return this.save();
};

// ===== ESTÁTICOS =====
productSchema.statics.findByCategory = function (categoryId) {
  return this.find({ categoryId, isActive: true }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Product', productSchema);
