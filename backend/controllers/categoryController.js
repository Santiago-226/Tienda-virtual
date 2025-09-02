const { Category, Product } = require('../models');
const mongoose = require('mongoose');

// @desc    Obtener todas las categorías
// @route   GET /api/categories
// @access  Public
const getAllCategories = async (req, res) => {
  try {
    const { active, includeProducts } = req.query;
    
    let filter = {};
    
    // Filtrar por categorías activas si se solicita
    if (active === 'true') {
      filter.isActive = true;
    }
    
    const categories = await Category.find(filter).sort({ nombre: 1 }).lean();
    
    // Incluir información de productos si se solicita
    let categoriesWithProducts = categories;
    if (includeProducts === 'true') {
      categoriesWithProducts = await Promise.all(
        categories.map(async (category) => {
          const products = await Product.find({ 
            categoryId: category._id,  
            isActive: true 
          }).limit(5); // Limitar a 5 productos por categoría
          
          return {
            ...category.toObject(),
            recentProducts: products
          };
        })
      );
    }
    
    // Incluir campos virtuales
    const categoriesWithVirtuals = categoriesWithProducts.map(category => ({
      ...category,
      url: category.url
    }));
    
    console.log(`📂 Enviando ${categoriesWithVirtuals.length} categorías`);
    res.json(categoriesWithVirtuals);
  } catch (error) {
    console.error('❌ Error obteniendo categorías:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudieron obtener las categorías' 
    });
  }
};

// @desc    Obtener categoría por ID o slug
// @route   GET /api/categories/:identifier
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { includeProducts, page, limit } = req.query;
    
    let category;
    
    // Verificar si es un ObjectId válido
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      category = await Category.findById(identifier);  // ← Quita el .lean()
    } 
    
    // Si no se encontró por ID, buscar por slug
    if (!category) {
      category = await Category.findOne({ 
        $or: [
          { slug: identifier },
          { nombre: { $regex: identifier, $options: 'i' } }
        ],
        isActive: true 
      });
    }
    
    if (!category) {
      return res.status(404).json({
        error: 'Categoría no encontrada',
        message: `No se encontró la categoría con identificador ${identifier}`
      });
    }
    
    // Convertir a objeto para incluir virtuals
    let categoryData = category.toObject();
    categoryData.url = `/categories/${category.slug || category._id}`;
    
    // Incluir productos si se solicita
    if (includeProducts === 'true') {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 12;
      const skip = (pageNum - 1) * limitNum;
      
      const products = await Product.find({ 
        categoryId: category._id, 
        isActive: true 
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
      
      const totalProducts = await Product.countDocuments({ 
        categoryId: category._id, 
        isActive: true 
      });
      
      categoryData.products = products;
      categoryData.productsPagination = {
        current: pageNum,
        pages: Math.ceil(totalProducts / limitNum),
        total: totalProducts
      };
    }
    
    console.log(`📂 Enviando categoría: ${category.nombre}`);
    res.json(categoryData);
  } catch (error) {
    console.error('❌ Error obteniendo categoría:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo obtener la categoría' 
    });
  }
};

// @desc    Crear nueva categoría
// @route   POST /api/categories
// @access  Private (Admin)
const createCategory = async (req, res) => {
  try {
    const { nombre, descripcion, image } = req.body;

    // Validaciones básicas
    if (!nombre || !descripcion) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'nombre y descripcion son obligatorios'
      });
    }

    // Verificar si la categoría ya existe
    const existingCategory = await Category.findOne({ 
      $or: [
        { nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } },
        { slug: nombre.toLowerCase().replace(/\s+/g, '-') }
      ]
    });
    
    if (existingCategory) {
      return res.status(400).json({
        error: 'Categoría ya existe',
        message: 'Ya existe una categoría con ese nombre o slug similar'
      });
    }

    const category = new Category({
      nombre,
      descripcion,
      image: image || ''
    });

    const savedCategory = await category.save();
    
    console.log(`✅ Categoría creada: ${savedCategory.nombre}`);
    
    // Incluir campo virtual en la respuesta
    const categoryResponse = {
      ...savedCategory.toObject(),
      url: savedCategory.url
    };
    
    res.status(201).json(categoryResponse);
  } catch (error) {
    console.error('❌ Error creando categoría:', error.message);
    
    if (error.code === 11000) {
      res.status(400).json({
        error: 'Categoría duplicada',
        message: 'Ya existe una categoría con ese nombre o slug'
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
        message: 'No se pudo crear la categoría' 
      });
    }
  }
};

// @desc    Actualizar categoría
// @route   PUT /api/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({
        error: 'Categoría no encontrada',
        message: `No se encontró la categoría con ID ${categoryId}`
      });
    }

    // Verificar si el nuevo nombre ya existe en otra categoría
    if (req.body.nombre && req.body.nombre !== category.nombre) {
      const existingCategory = await Category.findOne({
        _id: { $ne: categoryId },
        $or: [
          { nombre: { $regex: new RegExp(`^${req.body.nombre}$`, 'i') } },
          { slug: req.body.nombre.toLowerCase().replace(/\s+/g, '-') }
        ]
      });
      
      if (existingCategory) {
        return res.status(400).json({
          error: 'Nombre duplicado',
          message: 'Ya existe otra categoría con ese nombre'
        });
      }
    }

    // Actualizar campos permitidos
    const updateFields = ['nombre', 'descripcion', 'image', 'isActive'];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        category[field] = req.body[field];
      }
    });

    const updatedCategory = await category.save();
    
    console.log(`✅ Categoría actualizada: ${updatedCategory.nombre}`);
    
    // Incluir campo virtual en la respuesta
    const categoryResponse = {
      ...updatedCategory.toObject(),
      url: updatedCategory.url
    };
    
    res.json(categoryResponse);
  } catch (error) {
    console.error('❌ Error actualizando categoría:', error.message);
    
    if (error.code === 11000) {
      res.status(400).json({
        error: 'Categoría duplicada',
        message: 'Ya existe una categoría con ese nombre o slug'
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
        message: 'No se pudo actualizar la categoría' 
      });
    }
  }
};

// @desc    Eliminar categoría (borrado lógico)
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({
        error: 'Categoría no encontrada',
        message: `No se encontró la categoría con ID ${categoryId}`
      });
    }

    // Verificar si la categoría tiene productos asociados
    const productCount = await Product.countDocuments({ 
      categoryId: category._id,
      isActive: true 
    });
    
    if (productCount > 0) {
      return res.status(400).json({
        error: 'Categoría en uso',
        message: `No se puede eliminar la categoría porque tiene ${productCount} productos asociados`
      });
    }

    // Borrado lógico en lugar de físico
    category.isActive = false;
    await category.save();
    
    console.log(`🗑️ Categoría desactivada: ${category.nombre}`);
    res.json({
      message: 'Categoría desactivada exitosamente',
      deletedCategory: {
        _id: category._id,
        nombre: category.nombre
      }
    });
  } catch (error) {
    console.error('❌ Error eliminando categoría:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo eliminar la categoría' 
    });
  }
};

// @desc    Obtener categorías populares (con más productos)
// @route   GET /api/categories/popular
// @access  Public
const getPopularCategories = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    const categories = await Category.find({ isActive: true })
      .sort({ productCount: -1, nombre: 1 })
      .limit(limit)
      .lean();
    
    // Incluir campos virtuales
    const categoriesWithVirtuals = categories.map(category => ({
      ...category.toObject(),
      url: category.url
    }));
    
    console.log(`🏆 Enviando ${categoriesWithVirtuals.length} categorías populares`);
    res.json(categoriesWithVirtuals);
  } catch (error) {
    console.error('❌ Error obteniendo categorías populares:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudieron obtener las categorías populares' 
    });
  }
};

// @desc    Buscar categorías
// @route   GET /api/categories/search?q=term
// @access  Public
const searchCategories = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({
        error: 'Parámetro de búsqueda requerido',
        message: 'Proporciona un término de búsqueda con ?q=término'
      });
    }

    const searchRegex = new RegExp(q, 'i');
    
    const categories = await Category.find({
      isActive: true,
      $or: [
        { nombre: searchRegex },
        { descripcion: searchRegex },
        { slug: searchRegex }
      ]
    }).limit(10).lean();
    
    // Incluir campos virtuales
    const categoriesWithVirtuals = categories.map(category => ({
      ...category.toObject(),
      url: category.url
    }));
    
    console.log(`🔍 Búsqueda "${q}": ${categoriesWithVirtuals.length} categorías encontradas`);
    res.json(categoriesWithVirtuals);
  } catch (error) {
    console.error('❌ Error en búsqueda de categorías:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo realizar la búsqueda' 
    });
  }
};

// @desc    Obtener estadísticas de categorías
// @route   GET /api/categories/stats
// @access  Private (Admin)
const getCategoryStats = async (req, res) => {
  try {
    // Estadísticas básicas
    const totalCategories = await Category.countDocuments();
    const activeCategories = await Category.countDocuments({ isActive: true });
    
    // Categorías con más productos
    const topCategories = await Category.find({ isActive: true })
      .sort({ productCount: -1 })
      .limit(5);
    
    // Productos por categoría (agregación)
    const productsByCategory = await Category.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'products'
        }
      },
      {
        $project: {
          nombre: 1,
          productCount: 1,
          activeProducts: {
            $size: {
              $filter: {
                input: '$products',
                as: 'product',
                cond: { $eq: ['$$product.isActive', true] }
              }
            }
          }
        }
      },
      { $sort: { activeProducts: -1 } }
    ]);
    
    const stats = {
      totals: {
        categories: totalCategories,
        activeCategories,
        inactiveCategories: totalCategories - activeCategories
      },
      topCategories: topCategories.map(cat => ({
        _id: cat._id,
        nombre: cat.nombre,
        productCount: cat.productCount,
        url: cat.url
      })),
      productsByCategory
    };
    
    console.log(`📊 Estadísticas de categorías generadas`);
    res.json(stats);
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas de categorías:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudieron obtener las estadísticas' 
    });
  }
};

// @desc    Actualizar contador de productos de categoría
// @route   PUT /api/categories/:id/update-count
// @access  Private (Sistema - uso interno)
const updateProductCount = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { action } = req.body; // 'increment' or 'decrement'
    
    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({
        error: 'Categoría no encontrada',
        message: `No se encontró la categoría con ID ${categoryId}`
      });
    }

    if (action === 'increment') {
      await category.incrementProductCount();
    } else if (action === 'decrement') {
      await category.decrementProductCount();
    } else {
      return res.status(400).json({
        error: 'Acción inválida',
        message: 'La acción debe ser "increment" o "decrement"'
      });
    }

    const updatedCategory = await Category.findById(categoryId);
    
    console.log(`🔢 Contador de productos actualizado: ${updatedCategory.nombre} - ${updatedCategory.productCount}`);
    res.json({
      message: 'Contador actualizado exitosamente',
      productCount: updatedCategory.productCount
    });
  } catch (error) {
    console.error('❌ Error actualizando contador de productos:', error.message);
    res.status(500).json({ 
      error: 'Error del servidor', 
      message: 'No se pudo actualizar el contador' 
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getPopularCategories,
  searchCategories,
  getCategoryStats,
  updateProductCount
};