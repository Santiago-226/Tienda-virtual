const  Product  = require('../models/Product');
const Category  = require('../models/Category');
const mongoose = require('mongoose');

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    // Opciones de filtrado y paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Filtros
    let filter = { isActive: true };
    
    if (req.query.category) {
      filter.categoryId = req.query.category;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filter.precio = {};
      if (req.query.minPrice) filter.precio.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.precio.$lte = parseFloat(req.query.maxPrice);
    }
    
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }
    
    // Ordenamiento
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch(req.query.sort) {
        case 'price_asc':
          sort = { precio: 1 };
          break;
        case 'price_desc':
          sort = { precio: -1 };
          break;
        case 'name':
          sort = { nombre: 1 };
          break;
        case 'rating':
          sort = { rating: -1 };
          break;
        case 'sales':
          sort = { salesCount: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }
    
    // Búsqueda por texto
    if (req.query.search) {
      filter.$or = [
        { nombre: { $regex: req.query.search, $options: 'i' } },
        { descripcion: { $regex: req.query.search, $options: 'i' } },
        { marca: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(filter)
      .populate('categoryId', 'nombre slug')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(filter);
    
    // Transformar productos para incluir campos virtuales y formato compatible
    const productsWithVirtuals = products.map((product, index) => ({
      id: product._id, // Usamos el _id como id principal
      _id: product._id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      precioOriginal: product.precioOriginal,
      images: product.images,
      categoryId: product.categoryId,
      caracteristicas: product.caracteristicas,
      especificaciones: product.especificaciones ? Object.fromEntries(product.especificaciones) : {},
      stock: product.stock,
      rating: product.rating,
      totalReviews: product.totalReviews,
      marca: product.marca,
      sku: product.sku,
      peso: product.peso,
      dimensiones: product.dimensiones,
      garantia: product.garantia,
      incluye: product.incluye,
      isActive: product.isActive,
      slug: product.slug,
      salesCount: product.salesCount,
      inStock: product.inStock, // Campo virtual
      discountPercentage: product.discountPercentage, // Campo virtual
      formattedPrice: product.formattedPrice, // Campo virtual
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));
    
    console.log(`📦 Enviando ${productsWithVirtuals.length} productos al frontend (página ${page})`);
    
    res.json({
      products: productsWithVirtuals,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudieron obtener los productos' 
    });
  }
};

// @desc    Obtener un producto por ID o slug
// @route   GET /api/products/:identifier
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    let product;
    
    // Verificar si es un ObjectId válido
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findById(identifier).populate('categoryId', 'nombre slug');
    } 
    
    // Si no se encontró por ID o no es un ObjectId válido, buscar por slug
    if (!product) {
      product = await Product.findOne({ 
        slug: identifier,
        isActive: true 
      }).populate('categoryId', 'nombre slug');
    }
    
    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: `No se encontró el producto con identificador ${identifier}`
      });
    }
    
    // Transformar producto con campos virtuales
    const productWithVirtuals = {
      id: product._id,
      _id: product._id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      precioOriginal: product.precioOriginal,
      images: product.images,
      categoryId: product.categoryId,
      caracteristicas: product.caracteristicas,
      especificaciones: product.especificaciones ? Object.fromEntries(product.especificaciones) : {},
      stock: product.stock,
      rating: product.rating,
      totalReviews: product.totalReviews,
      marca: product.marca,
      sku: product.sku,
      peso: product.peso,
      dimensiones: product.dimensiones,
      garantia: product.garantia,
      incluye: product.incluye,
      isActive: product.isActive,
      slug: product.slug,
      salesCount: product.salesCount,
      inStock: product.inStock,
      discountPercentage: product.discountPercentage,
      formattedPrice: product.formattedPrice,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
    
    console.log(`📦 Enviando producto: ${product.nombre} (ID: ${product._id})`);
    res.json(productWithVirtuals);
  } catch (error) {
    console.error('❌ Error obteniendo producto:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo obtener el producto' 
    });
  }
};

// @desc    Crear nuevo producto
// @route   POST /api/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      precioOriginal,
      images,
      categoryId,
      caracteristicas,
      especificaciones,
      stock,
      marca,
      sku,
      peso,
      dimensiones,
      garantia,
      incluye
    } = req.body;

    // Validaciones básicas
    if (!nombre || !descripcion || !precio || !categoryId) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'nombre, descripcion, precio y categoryId son obligatorios'
      });
    }

    const product = new Product({
      nombre,
      descripcion,
      precio,
      precioOriginal: precioOriginal || precio,
      images: images || [],
      categoryId,
      caracteristicas: caracteristicas || [],
      especificaciones: especificaciones || {},
      stock: stock || 0,
      marca: marca || '',
      sku: sku || '',
      peso: peso || '',
      dimensiones: dimensiones || '',
      garantia: garantia || '',
      incluye: incluye || []
    });

    const savedProduct = await product.save();
    await savedProduct.populate('categoryId', 'nombre slug');
    
    console.log(`✅ Producto creado: ${savedProduct.nombre}`);
    
    // Incluir campos virtuales en la respuesta
    const productResponse = {
      ...savedProduct.toObject(),
      inStock: savedProduct.inStock,
      discountPercentage: savedProduct.discountPercentage,
      formattedPrice: savedProduct.formattedPrice
    };
    
    res.status(201).json(productResponse);
  } catch (error) {
    console.error('❌ Error creando producto:', error.message);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(400).json({
        error: 'Producto duplicado',
        message: `Ya existe un producto con ese ${field}`
      });
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({
        error: 'Error de validación',
        messages: errors
      });
    } else {
      res.status(500).json({ 
        error: 'Error del servidor', 
        message: 'No se pudo crear el producto' 
      });
    }
  }
};

// @desc    Actualizar producto
// @route   PUT /api/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Buscar por _id de MongoDB
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: `No se encontró el producto con ID ${productId}`
      });
    }

    // Actualizar campos permitidos
    const updateFields = [
      'nombre', 'descripcion', 'precio', 'precioOriginal', 'images', 
      'categoryId', 'caracteristicas', 'especificaciones', 'stock', 
      'marca', 'sku', 'peso', 'dimensiones', 'garantia', 'incluye', 'isActive'
    ];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();
    await updatedProduct.populate('categoryId', 'nombre slug');
    
    console.log(`✅ Producto actualizado: ${updatedProduct.nombre}`);
    
    // Incluir campos virtuales en la respuesta
    const productResponse = {
      ...updatedProduct.toObject(),
      inStock: updatedProduct.inStock,
      discountPercentage: updatedProduct.discountPercentage,
      formattedPrice: updatedProduct.formattedPrice
    };
    
    res.json(productResponse);
  } catch (error) {
    console.error('❌ Error actualizando producto:', error.message);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(400).json({
        error: 'Producto duplicado',
        message: `Ya existe un producto con ese ${field}`
      });
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({
        error: 'Error de validación',
        messages: errors
      });
    } else {
      res.status(500).json({ 
        error: 'Error del servidor', 
        message: 'No se pudo actualizar el producto' 
      });
    }
  }
};

// @desc    Eliminar producto (borrado lógico)
// @route   DELETE /api/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Buscar por _id de MongoDB
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        message: `No se encontró el producto con ID ${productId}`
      });
    }

    // Borrado lógico en lugar de físico
    product.isActive = false;
    await product.save();
    
    console.log(`🗑️ Producto desactivado: ${product.nombre}`);
    res.json({
      message: 'Producto desactivado exitosamente',
      deletedProduct: {
        _id: product._id,
        nombre: product.nombre
      }
    });
  } catch (error) {
    console.error('❌ Error eliminando producto:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo eliminar el producto' 
    });
  }
};

// @desc    Buscar productos
// @route   GET /api/products/search?q=term
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({
        error: 'Parámetro de búsqueda requerido',
        message: 'Proporciona un término de búsqueda con ?q=término'
      });
    }

    const searchRegex = new RegExp(q, 'i');
    
    const products = await Product.find({
      isActive: true,
      $or: [
        { nombre: searchRegex },
        { descripcion: searchRegex },
        { marca: searchRegex },
        { caracteristicas: searchRegex }
      ]
    }).populate('categoryId', 'nombre slug');
    
    // Incluir campos virtuales
    const productsWithVirtuals = products.map(product => ({
      ...product.toObject(),
      inStock: product.inStock,
      discountPercentage: product.discountPercentage,
      formattedPrice: product.formattedPrice
    }));
    
    console.log(`🔍 Búsqueda "${q}": ${productsWithVirtuals.length} productos encontrados`);
    res.json(productsWithVirtuals);
  } catch (error) {
    console.error('❌ Error en búsqueda:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo realizar la búsqueda' 
    });
  }
};

// @desc    Obtener productos por categoría
// @route   GET /api/products/category/:categoryId
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // 🔹 Buscar la categoría primero (por id o por slug)
    let category;
    if (mongoose.Types.ObjectId.isValid(categoryId)) {
      category = await Category.findById(categoryId);
    } else {
      category = await Category.findOne({ slug: categoryId });
    }

    if (!category) {
      return res.status(404).json({
        error: 'Categoría no encontrada',
        message: `No se encontró ninguna categoría con identificador ${categoryId}`
      });
    }

    // 🔹 Buscar productos de esa categoría
    const products = await Product.find({
      categoryId: category._id,
      isActive: true
    })
      .populate('categoryId', 'nombre slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ categoryId: category._id, isActive: true });

    const productsWithVirtuals = products.map(product => ({
      ...product.toObject(),
      inStock: product.inStock,
      discountPercentage: product.discountPercentage,
      formattedPrice: product.formattedPrice
    }));

    console.log(`📦 Enviando ${productsWithVirtuals.length} productos de categoría ${category.nombre}`);

    res.json({
      products: productsWithVirtuals,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo productos por categoría:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      message: 'No se pudieron obtener los productos'
    });
  }
};

// @desc    Obtener productos destacados
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.find({
      isActive: true,
      stock: { $gt: 0 }
    })
    .populate('categoryId', 'nombre slug')
    .sort({ rating: -1, salesCount: -1 })
    .limit(limit);
    
    // Incluir campos virtuales
    const productsWithVirtuals = products.map(product => ({
      ...product.toObject(),
      inStock: product.inStock,
      discountPercentage: product.discountPercentage,
      formattedPrice: product.formattedPrice
    }));
    
    console.log(`⭐ Enviando ${productsWithVirtuals.length} productos destacados`);
    res.json(productsWithVirtuals);
  } catch (error) {
    console.error('❌ Error obteniendo productos destacados:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudieron obtener los productos destacados' 
    });
  }
};

// @desc    Obtener productos en oferta
// @route   GET /api/products/on-sale
// @access  Public
const getProductsOnSale = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const products = await Product.find({
      isActive: true,
      precioOriginal: { $gt: 0, $gt: '$precio' }
    })
    .populate('categoryId', 'nombre slug')
    .sort({ discountPercentage: -1 })
    .limit(limit);
    
    // Incluir campos virtuales
    const productsWithVirtuals = products.map(product => ({
      ...product.toObject(),
      inStock: product.inStock,
      discountPercentage: product.discountPercentage,
      formattedPrice: product.formattedPrice
    }));
    
    console.log(`🛒 Enviando ${productsWithVirtuals.length} productos en oferta`);
    res.json(productsWithVirtuals);
  } catch (error) {
    console.error('❌ Error obteniendo productos en oferta:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudieron obtener los productos en oferta' 
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getProductsOnSale
};