require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Importar middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB Atlas
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🗄️  MongoDB Atlas conectado exitosamente!');
    console.log('🌍 Host:', mongoose.connection.host);
    console.log('📊 Base de datos:', mongoose.connection.name);
    console.log('🔗 Puerto:', mongoose.connection.port);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}

// Conectar a base de datos
connectDB();

// Middleware global
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: '🛒 E-commerce API funcionando!',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Conectado ✅' : 'Desconectado ❌',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      users: '/api/users', 
      orders: '/api/orders',
      health: '/health',
      dbInfo: '/api/db-info'
    }
  });
});

// Rutas API
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// Rutas de health check (mantener compatibilidad)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'MongoDB Atlas conectado ✅' : 'MongoDB Atlas desconectado ❌',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    version: '3.0.0'
  });
});

app.get('/api/db-info', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      // Importar modelos para contar documentos
      const { Product, User, Order } = require('./models');
      
      const productCount = await Product.countDocuments();
      const userCount = await User.countDocuments();
      const orderCount = await Order.countDocuments();
      
      res.json({
        connected: true,
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        readyState: mongoose.connection.readyState,
        readyStateText: 'Connected to MongoDB Atlas',
        collections: {
          products: productCount,
          users: userCount,
          orders: orderCount
        }
      });
    } else {
      res.status(500).json({
        connected: false,
        readyState: mongoose.connection.readyState,
        readyStateText: 'Disconnected from MongoDB Atlas'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Error obteniendo información de la base de datos',
      message: error.message
    });
  }
});

// Middleware de error (debe ir al final)
app.use(notFound);
app.use(errorHandler);

// Inicializar servidor
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 SERVIDOR E-COMMERCE INICIADO');
  console.log('='.repeat(50));
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📊 API Productos: http://localhost:${PORT}/api/products`);
  console.log(`👥 API Usuarios: http://localhost:${PORT}/api/users`);
  console.log(`🛒 API Órdenes: http://localhost:${PORT}/api/orders`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log(`📈 DB Info: http://localhost:${PORT}/api/db-info`);
  console.log('='.repeat(50));
  console.log('✅ Servidor listo para recibir peticiones');
});

// Manejo graceful de cierre
process.on('SIGTERM', async () => {
  console.log('🔄 Cerrando servidor...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Cerrando servidor...');
  await mongoose.connection.close();
  process.exit(0);
});