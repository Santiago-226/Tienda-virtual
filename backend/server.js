// IMPORTACIONES NECESARIAS
const express = require('express');        // Framework web
const cors = require('cors');              // Cross-Origin Resource Sharing
require('dotenv').config();                // Variables de entorno

// CREAR APLICACIÓN EXPRESS
const app = express();
const PORT = process.env.PORT || 5000;    // Puerto del servidor

// MIDDLEWARE GLOBAL
// Se ejecuta en cada petición HTTP
app.use(cors());           // Permite peticiones desde http://localhost:3000
app.use(express.json());   // Parsea automáticamente JSON del body

// DATOS DE EJEMPLO (Simulación de base de datos)
const productos = [
  {
    id: 1,
    nombre: "Semillas de Maíz Premium Variedad Híbrida",
    precio: 45000,
    precioOriginal: 55000,
    images: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop"
    ],
    category: "Semillas",
    descripcion: "Semillas de maíz híbrido de alta calidad, especialmente desarrolladas para el clima colombiano. Ofrecen alta resistencia a plagas y excelente rendimiento.",
    caracteristicas: [
      "Alta resistencia a plagas y enfermedades",
      "Adaptado al clima tropical y subtropical",
      "Ciclo de cultivo de 120-130 días",
      "Alto potencial de rendimiento (8-12 ton/ha)",
      "Excelente calidad de grano",
      "Resistente a sequía moderada",
      "Certificación INIA"
    ],
    especificaciones: {
      "Variedad": "Híbrido F1",
      "Ciclo vegetativo": "120-130 días",
      "Altura de planta": "2.2 - 2.5 metros",
      "Rendimiento esperado": "8-12 ton/ha",
      "Densidad de siembra": "55,000 - 65,000 plantas/ha",
      "Época de siembra": "Marzo - Junio",
      "Tipo de grano": "Semidentado amarillo",
      "Humedad del grano": "14% máximo"
    },
    stock: 150,
    rating: 4.8,
    totalReviews: 127,
    marca: "AgroTienda Premium",
    sku: "AGT-MAZ-001",
    peso: "25 kg",
    dimensiones: "45 x 30 x 15 cm",
    garantia: "Garantía de germinación del 85%",
    incluye: [
      "1 bolsa de 25kg de semillas",
      "Manual de cultivo",
      "Certificado de calidad",
      "Guía de siembra"
    ]
  },
  {
    id: 2,
    nombre: "Fertilizante Orgánico EcoGrow Plus",
    precio: 32000,
    precioOriginal: 40000,
    images: [
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ8-Z9FOr5s3y_OijQkth3Xyub9BRjgFGsoyh4wc8fo8p4ixTJOqSSHCgV9bQntAywrMJ749m6VXMRyu3yK3E5ImNFzw1mD2jXBKiV9aTn48DKwZ8lc41RHqw",
      "https://images.unsplash.com/photo-1589923188720-4a3b5cc6d822?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1589923188715-0e12e0d8d54f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1589923188794-ecbfc3ef6f75?w=800&h=600&fit=crop"
    ],
    category: "Fertilizantes",
    descripcion: "Fertilizante orgánico de liberación controlada, ideal para mejorar la calidad del suelo y estimular el crecimiento saludable de cultivos.",
    caracteristicas: [
      "100% orgánico certificado",
      "Mejora la estructura y fertilidad del suelo",
      "Aumenta la retención de agua",
      "Favorece la actividad microbiana",
      "Compatible con todo tipo de cultivos",
      "No contiene químicos sintéticos",
      "Aprobado para agricultura ecológica"
    ],
    especificaciones: {
      "Composición": "NPK 5-5-5",
      "Presentación": "Granulado",
      "Aplicación": "Directa al suelo",
      "Duración de liberación": "90 días",
      "Dosis recomendada": "50-100g por planta",
      "pH": "6.5 - 7.0",
      "Contenido de materia orgánica": "65%"
    },
    stock: 200,
    rating: 4.7,
    totalReviews: 89,
    marca: "EcoGrow",
    sku: "EGR-FERT-002",
    peso: "10 kg",
    dimensiones: "40 x 25 x 12 cm",
    garantia: "Calidad y pureza garantizada",
    incluye: [
      "1 saco de 10kg de fertilizante",
      "Guía de uso",
      "Certificado orgánico"
    ]
  }
];


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

//Mostrar Producto completo
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

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}`);
  console.log(`🛍️ Productos en http://localhost:${PORT}/api/products`);
});