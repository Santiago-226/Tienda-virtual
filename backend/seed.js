require('dotenv').config();
const mongoose = require('mongoose');
const { fakerES: faker } = require('@faker-js/faker');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔗 Conectando a MongoDB Atlas...');
const maskedURI = MONGODB_URI.replace(/:[^:]*@/, ':****@');
console.log('🔐 URI:', maskedURI);

// Configuración de Mongoose
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 30000);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    
    console.log(`✅ MongoDB Atlas conectado: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
};

// Generar SKU único
const generateSKU = (prefix) => {
  return `${prefix}-${faker.string.alphanumeric(6).toUpperCase()}`;
};

//Generar slug
const slugify = (text) => 
  text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, ''); // limpia guiones al inicio/fin


// Función principal
const seedDatabase = async () => {
  const connected = await connectDB();
  
  if (!connected) {
    console.log('📦 Generando datos de ejemplo (sin conexión)...');
    process.exit(1);
  }

  try {
    // Limpiar colecciones
    console.log('🧹 Limpiando colecciones...');
    await mongoose.connection.db.collection('products').deleteMany({});
    await mongoose.connection.db.collection('categories').deleteMany({});
    console.log('✅ Colecciones limpiadas');

    // Importar modelos
    const Product = require('./models/Product');
    const Category = require('./models/Category');

    // Crear categorías con URLs válidas
    const categoriesData = [
      {
        nombre: 'Semillas',
        descripcion: 'Variedad de semillas de alta calidad para diferentes cultivos y climas',
        image: 'https://agrawdata.com/wp-content/uploads/2024/03/tipologias-de-semillas-agricolas.webp', 
        slug: slugify('Semillas')
      },
      {
        nombre: 'Fertilizantes',
        descripcion: 'Abonos y fertilizantes orgánicos y químicos para mejorar el crecimiento de tus cultivos',
        image: 'https://www.suministrosagricolasluque.com/wp-content/uploads/2018/05/C%C3%B3mo-utilizar-correctamente-el-fertilizante-adecuado.jpg', // URL simplificada
        slug: slugify('Fertilizantes')
      },
      {
        nombre: 'Herramientas Agrícolas',
        descripcion: 'Herramientas especializadas para el trabajo en el campo y cultivos',
        image: 'https://ageusa.com/wp-content/uploads/2022/08/4-2.jpg', // URL simplificada
        slug: slugify('Herramientas Agrícolas')
      }
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log('✅ Categorías creadas:', categories.length);

    // Crear productos con URLs válidas
    const productsData = [
      // Semilla 1
      {
        nombre: 'Semilla de Maíz Híbrido Premium',
        descripcion: 'Semilla de maíz de alto rendimiento, resistente a plagas y adaptable a diversos climas.',
        precio: 45.99,
        precioOriginal: 52.50,
        images: ['https://www.agrosavia.co/media/tcag3xcj/jos%C3%A9-jaime-tapia-6.jpg',
            'https://blog.cambiagro.com/wp-content/uploads/2024/05/tipos-de-semilla-de-maiz.jpg'
        ],
        categoryId: categories[0]._id,
        caracteristicas: ['Alto rendimiento', 'Resistente a sequías', 'Ciclo de 90-100 días'],
        especificaciones: { 'Peso': '5 kg', 'Tipo': 'Híbrido', 'Época': 'Primavera-Verano' },
        stock: 150,
        rating: 4.5,
        totalReviews: 23,
        marca: 'AgroSeed',
        sku: generateSKU('SSD'),
        peso: '5 kg',
        dimensiones: '30x20x10 cm',
        garantia: 'Garantía de germinación',
        incluye: ['Bolsa de semillas', 'Guía de cultivo'],
        salesCount: 45,
        slug: slugify('Semilla de Maíz Híbrido Premium')
      },
      // Semilla 2
      {
        nombre: 'Semilla de Tomate Cherry Orgánico',
        descripcion: 'Semillas de tomate cherry orgánico certificado, ideal para huertos familiares.',
        precio: 8.50,
        precioOriginal: 10.00,
        images: ['https://i.blogs.es/866293/tomates-cherry1/840_560.jpg',
            'https://corp.ametllerorigen.com/wp-content/uploads/2022/04/9S2A3548.jpg'
        ],
        categoryId: categories[0]._id,
        caracteristicas: ['Certificación orgánica', 'Sabor dulce', 'Alta productividad'],
        especificaciones: { 'Peso': '1 kg', 'Tipo': 'Orgánico', 'Germinación': '90%' },
        stock: 200,
        rating: 4.7,
        totalReviews: 56,
        marca: 'BioHuerto',
        sku: generateSKU('SSD'),
        peso: '1 kg',
        dimensiones: '15x10x5 cm',
        garantia: 'Germinación garantizada',
        incluye: ['Sobre de semillas', 'Instrucciones'],
        salesCount: 124,
        slug: slugify('Semilla de Tomate Cherry Orgánico')
      },
      // Fertilizante 1
      {
        nombre: 'Fertilizante Orgánico NutriGrow',
        descripcion: 'Fertilizante 100% orgánico con nutrientes esenciales para el desarrollo de plantas.',
        precio: 29.75,
        precioOriginal: 35.00,
        images: ['https://www.suministrosagricolasluque.com/wp-content/uploads/2018/04/Ventajas-de-los-fertilizantes-org%C3%A1nicos.jpg'],
        categoryId: categories[1]._id,
        caracteristicas: ['100% orgánico', 'Mejora el suelo', 'Aumenta retención de agua'],
        especificaciones: { 'Peso': '20 kg', 'Composición': 'Humus de lombriz', 'NPK': '5-3-4' },
        stock: 80,
        rating: 4.8,
        totalReviews: 37,
        marca: 'EcoGrow',
        sku: generateSKU('FERT'),
        peso: '20 kg',
        dimensiones: '40x30x15 cm',
        garantia: 'Resultados en 15 días',
        incluye: ['Bolsa', 'Medidor de pH', 'Guía'],
        salesCount: 92,
        slug: slugify('Fertilizante Orgánico NutriGrow')
      },
      // Fertilizante 2
      {
        nombre: 'Abono Foliar NutriQuick',
        descripcion: 'Abono foliar de rápida absorción con micronutrientes esenciales.',
        precio: 42.25,
        precioOriginal: 49.99,
        images: ['https://www.buscador.portaltecnoagricola.com/app/imagenes_aplicacion/portaltecnoagricola-lainco-ABONO-FOLIAR-N-5-L_.jpg'],
        categoryId: categories[1]._id,
        caracteristicas: ['Absorción rápida', 'Corrige deficiencias', 'Aumenta resistencia'],
        especificaciones: { 'Contenido': '1 litro', 'NPK': '10-5-8', 'Dilución': '5 ml por litro' },
        stock: 60,
        rating: 4.4,
        totalReviews: 29,
        marca: 'AgroNutri',
        sku: generateSKU('FERT'),
        peso: '1.2 kg',
        dimensiones: '12x8x8 cm',
        garantia: 'Resultados en 7 días',
        incluye: ['Botella', 'Medidor', 'Guía'],
        salesCount: 78,
        slug: slugify('Abono Foliar NutriQuick')
      },
      // Herramienta 1
      {
        nombre: 'Tijeras de Podar Profesionales',
        descripcion: 'Tijeras de podar de alta resistencia con mangos ergonómicos y hoja de acero inoxidable.',
        precio: 24.99,
        precioOriginal: 0,
        images: ['https://disfecol.com.co/wp-content/uploads/2020/09/P126.1.png'],
        categoryId: categories[2]._id,
        caracteristicas: ['Acero inoxidable', 'Mangos ergonómicos', 'Corte preciso'],
        especificaciones: { 'Material': 'Acero', 'Longitud': '22 cm', 'Peso': '280 g' },
        stock: 45,
        rating: 4.3,
        totalReviews: 18,
        marca: 'ProGarden',
        sku: generateSKU('HERR'),
        peso: '280 g',
        dimensiones: '22x12x5 cm',
        garantia: '2 años',
        incluye: ['Tijeras', 'Funda', 'Guía'],
        salesCount: 67,
        slug: slugify('Tijeras de Podar Profesionales')
      },
      // Herramienta 2
      {
        nombre: 'Carretilla Agrícola de Acero',
        descripcion: 'Carretilla robusta con estructura de acero y llanta neumática. Capacidad de 100 litros.',
        precio: 89.99,
        precioOriginal: 109.99,
        images: ['https://upload.wikimedia.org/wikipedia/commons/5/55/Brouette_chantier.JPG'],
        categoryId: categories[2]._id,
        caracteristicas: ['Estructura reforzada', 'Llanta neumática', 'Capacidad 100L'],
        especificaciones: { 'Material': 'Acero', 'Capacidad': '100 litros', 'Peso': '15 kg' },
        stock: 25,
        rating: 4.6,
        totalReviews: 42,
        marca: 'FieldTools',
        sku: generateSKU('HERR'),
        peso: '15 kg',
        dimensiones: '120x60x50 cm',
        garantia: '5 años',
        incluye: ['Carretilla armada', 'Llave'],
        salesCount: 36,
        slug: slugify('Carretilla Agrícola de Acero')
      }
    ];

    const products = await Product.insertMany(productsData);
    console.log('✅ Productos creados:', products.length);

    // Actualizar contadores
    for (const category of categories) {
      const count = await Product.countDocuments({ categoryId: category._id });
      category.productCount = count;
      await category.save();
    }

    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log('📊 Resumen:');
    console.log('- Categorías:', categories.length);
    console.log('- Productos:', products.length);
    
    // Mostrar algunos productos
    console.log('\n🛍️  Algunos productos creados:');
    products.slice(0, 3).forEach((product, index) => {
      console.log(`${index + 1}. ${product.nombre} - $${product.precio}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error.message);
    
    // Mostrar más detalles del error de validación
    if (error.name === 'ValidationError') {
      console.log('🔍 Errores de validación:');
      for (const field in error.errors) {
        console.log(`- ${field}: ${error.errors[field].message}`);
      }
    }
    
    process.exit(1);
  }
};

// Ejecutar
seedDatabase();