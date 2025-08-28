// IMPORTACIONES NECESARIAS
const express = require('express');        // Framework web
const cors = require('cors');              // Cross-Origin Resource Sharing
require('dotenv').config();                // Variables de entorno

const productos = require('./Mockups'); // Ruta De Productos de pureba
const categories = require('./Categories'); // Ruta De Categorias de pureba

// Importar configuración de base de datos
const connectDB = require('./config/database');

// Conectar a MongoDB Atlas (esto probará la conexión)
connectDB();

// CREAR APLICACIÓN EXPRESS
const app = express();
const PORT = process.env.PORT || 5000;    // Puerto del servidor

// MIDDLEWARE GLOBAL
// Se ejecuta en cada petición HTTP
app.use(cors());           // Permite peticiones desde http://localhost:3000
app.use(express.json());   // Parsea automáticamente JSON del body


// Simulación de reseñas
const reviews = {
  1: [
    {
      id: 1,
      usuario: "Carlos Rodríguez",
      rating: 5,
      fecha: "2024-01-15",
      comentario: "Excelentes semillas, muy buena germinación. Las plantas crecieron fuertes y sanas.",
      verificado: true
    },
    {
      id: 2,
      usuario: "María González",
      rating: 4,
      fecha: "2024-01-10",
      comentario: "Buen producto, aunque un poco caro. La calidad lo vale.",
      verificado: true
    }
  ],
  2: [
    {
      id: 1,
      usuario: "Pedro López",
      rating: 5,
      fecha: "2024-02-01",
      comentario: "Fertilizante excelente, vi resultados en 2 semanas.",
      verificado: true
    }
  ]
};



// RUTAS DE LA API

// Ruta de prueba - Verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ 
    message: '🛍️ Backend funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Ruta para obtener todos los productos con las categorías
app.get('/api/products', (req, res) => {
  try {
    // Combinar productos con información de categorías
    const productsWithCategories = productos.map(product => {
      const category = categories.find(cat => cat.id === product.categoryId);
      return {
        ...product,
        category: category ? category.nombre : 'Sin categoría'
      };
    });
    
    res.json(productsWithCategories);
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener productos'
    });
  }
});

// También podrías crear una ruta para obtener categorías si la necesitas
app.get('/api/categories', (req, res) => {
  try {
    res.json(categories);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener categorías'
    });
  }
});

// Ruta para obtener un producto específico por ID
app.get('/api/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const producto = productos.find(p => p.id === productId);

    if (!producto) {
      return res.status(404).json({ 
        message: 'Producto no encontrado',
        error: `No existe un producto con el ID ${productId}`
      });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener el producto'
    });
  }
});

// Ruta para obtener las reseñas de un producto
app.get('/api/products/:id/reviews', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    res.json(reviews[productId] || []);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener las reseñas'
    });
  }
});

// Ruta para obtener productos por categoría ID
app.get('/api/categories/:id/products', (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    
    // Verificar si la categoría existe
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
      return res.status(404).json({ 
        message: 'Categoría no encontrada',
        error: `No existe una categoría con el ID ${categoryId}`
      });
    }
    
    // Filtrar productos por categoryId
    const productsInCategory = productos.filter(product => product.categoryId === categoryId);
    
    // Combinar con información de la categoría
    const productsWithCategory = productsInCategory.map(product => ({
      ...product,
      category: category.nombre // Agregar el nombre de la categoría
    }));
    
    res.json({
      category: {
        id: category.id,
        nombre: category.nombre,
        image: category.image,
        descripcion: category.descripcion
      },
      products: productsWithCategory,
      count: productsWithCategory.length
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener productos de la categoría'
    });
  }
});

// Ruta alternativa para obtener solo la información de la categoría
app.get('/api/categories/:id', (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
      return res.status(404).json({ 
        message: 'Categoría no encontrada',
        error: `No existe una categoría con el ID ${categoryId}`
      });
    }
    
    // Contar productos en esta categoría
    const productCount = productos.filter(product => product.categoryId === categoryId).length;
    
    res.json({
      ...category,
      productCount: productCount
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener la categoría'
    });
  }
});

// Ruta de verificación de salud (NUEVA)
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'MongoDB Atlas conectado ✅' : 'MongoDB Atlas desconectado ❌',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    products: productos.length
  });
});

// Ruta de información de MongoDB Atlas (NUEVA)
app.get('/api/db-info', (req, res) => {
  const mongoose = require('mongoose');
  
  if (mongoose.connection.readyState === 1) {
    res.json({
      connected: true,
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      readyState: mongoose.connection.readyState,
      readyStateText: 'Connected to MongoDB Atlas',
      productsInMemory: productos.length
    });
  } else {
    res.status(500).json({
      connected: false,
      readyState: mongoose.connection.readyState,
      readyStateText: 'Disconnected from MongoDB Atlas'
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en puerto ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:3000`);
  console.log(`📊 API: http://localhost:${PORT}/api/products`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
  console.log(`🗃️  DB Info: http://localhost:${PORT}/api/db-info`);
  console.log(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🛍️  Productos en memoria: ${productos.length}`);
});