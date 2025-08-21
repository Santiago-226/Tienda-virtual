// IMPORTACIONES NECESARIAS
const express = require('express');        // Framework web
const cors = require('cors');              // Cross-Origin Resource Sharing
require('dotenv').config();                // Variables de entorno

const productos = require('./Mockups'); // Ruta De Productos de pureba


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

// Ruta para obtener todos los productos
app.get('/api/products', (req, res) => {
  try {
    // Simula una respuesta de base de datos
    res.json(productos);
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener productos'
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

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}`);
  console.log(`🛍️ Productos en http://localhost:${PORT}/api/products`);
});