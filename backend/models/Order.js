const mongoose = require('mongoose');

// Sub-esquema para items de la orden
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  
  // Información del producto al momento de la compra
  name: {
    type: String,
    required: true
  },
  
  image: {
    type: String,
    required: true
  },
  
  price: {
    type: Number,
    required: true,
    min: 0
  },
  
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

// Esquema principal de órdenes
const orderSchema = new mongoose.Schema({
  // Identificación de la orden
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Relación con el usuario
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Items de la orden
  items: [orderItemSchema],
  
  // Información financiera
  subtotalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Estados de la orden
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      message: '{VALUE} no es un estado válido'
    },
    default: 'pending',
    index: true
  },
  
  // Información de pago
  paymentMethod: {
    type: String,
    enum: {
      values: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
      message: '{VALUE} no es un método de pago válido'
    },
    required: true
  },
  
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      message: '{VALUE} no es un estado de pago válido'
    },
    default: 'pending',
    index: true
  },
  
  paymentId: String, // ID de transacción del procesador de pagos
  
  // Direcciones
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'Colombia' },
    phone: String
  },
  
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  
  // Información de envío
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'overnight', 'pickup'],
    default: 'standard'
  },
  
  trackingNumber: String,
  
  estimatedDelivery: Date,
  
  deliveredAt: Date,
  
  // Notas y comentarios
  notes: {
    type: String,
    maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
  },
  
  // Historial de cambios de estado
  statusHistory: [{
    status: String,
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }]
  
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// ===== VIRTUALS =====

// Virtual para el total de items
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual para verificar si la orden está completada
orderSchema.virtual('isCompleted').get(function() {
  return ['delivered', 'cancelled', 'returned'].includes(this.status);
});

// Virtual para verificar si se puede cancelar
orderSchema.virtual('canBeCancelled').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

// Virtual para dirección de envío formateada
orderSchema.virtual('formattedShippingAddress').get(function() {
  const addr = this.shippingAddress;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

// ===== ÍNDICES =====
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ 'items.product': 1 });

// ===== MIDDLEWARE PRE-SAVE =====

// Generar número de orden automáticamente
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    const timestamp = Date.now().toString().slice(-6);
    this.orderNumber = `ORD-${timestamp}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Calcular totales automáticamente
orderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    // Calcular subtotal
    this.subtotalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
    
    // Calcular total final
    this.totalAmount = this.subtotalAmount + this.shippingCost + this.tax - this.discount;
    
    // Asegurar que el total no sea negativo
    if (this.totalAmount < 0) {
      this.totalAmount = 0;
    }
  }
  next();
});

// Actualizar historial de estado
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date()
    });
  }
  next();
});

// ===== MÉTODOS DEL MODELO =====

// Método para actualizar estado
orderSchema.methods.updateStatus = function(newStatus, changedBy, notes) {
  this.status = newStatus;
  
  if (changedBy || notes) {
    this.statusHistory.push({
      status: newStatus,
      changedBy,
      notes,
      changedAt: new Date()
    });
  }
  
  // Actualizar fecha de entrega si es delivered
  if (newStatus === 'delivered') {
    this.deliveredAt = new Date();
  }
  
  return this.save();
};

// Método para calcular el total
orderSchema.methods.calculateTotal = function() {
  this.subtotalAmount = this.items.reduce((total, item) => total + item.subtotal, 0);
  this.totalAmount = this.subtotalAmount + this.shippingCost + this.tax - this.discount;
  
  if (this.totalAmount < 0) {
    this.totalAmount = 0;
  }
  
  return this;
};

// Método para agregar item
orderSchema.methods.addItem = function(productId, productData, quantity) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.subtotal = existingItem.price * existingItem.quantity;
  } else {
    this.items.push({
      product: productId,
      name: productData.name,
      image: productData.image,
      price: productData.price,
      quantity: quantity,
      subtotal: productData.price * quantity
    });
  }
  
  return this.calculateTotal();
};

// Método para remover item
orderSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.product.toString() !== productId.toString()
  );
  
  return this.calculateTotal();
};

// ===== MÉTODOS ESTÁTICOS =====

// Encontrar órdenes por usuario
orderSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 }).populate('user', 'name email');
};

// Encontrar órdenes por estado
orderSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 }).populate('user', 'name email');
};

// Obtener estadísticas de órdenes
orderSchema.statics.getOrderStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);
  
  return stats;
};

// Obtener órdenes recientes
orderSchema.statics.getRecentOrders = function(limit = 10) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email')
    .populate('items.product', 'name image');
};

module.exports = mongoose.model('Order', orderSchema);