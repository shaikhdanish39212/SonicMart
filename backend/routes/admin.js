const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Deal = require('../models/Deal');
const Coupon = require('../models/Coupon');
const Contact = require('../models/Contact');
const { protect, admin } = require('../middleware/auth');
const { generateUniqueSKU, generateSKUFromProduct, validateSKU } = require('../utils/skuGenerator');

const router = express.Router();

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    // Get current date ranges
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // User statistics
    const totalUsers = await User.countDocuments({ isActive: true });
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: startOfToday },
      isActive: true
    });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
      isActive: true
    });

    // Product statistics
    const totalProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({
      isActive: true,
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    });
    const outOfStockProducts = await Product.countDocuments({
      isActive: true,
      stock: 0
    });

    // Order statistics
    const totalOrders = await Order.countDocuments();
    const ordersToday = await Order.countDocuments({
      createdAt: { $gte: startOfToday }
    });
    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    const pendingOrders = await Order.countDocuments({
      orderStatus: 'pending'
    });

    // Revenue statistics
    const revenueStats = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          revenueThisMonth: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startOfMonth] },
                '$totalPrice',
                0
              ]
            }
          },
          revenueThisYear: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', startOfYear] },
                '$totalPrice',
                0
              ]
            }
          }
        }
      }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber totalPrice orderStatus createdAt user orderItems isPaid');

    // Top selling products  
    const topProducts = await Product.find({ isActive: true })
      .sort({ salesCount: -1 })
      .limit(10)
      .select('name salesCount price image');

    // Debug logging to see exactly what we're returning
    console.log('🔍 ADMIN DASHBOARD API - TOP PRODUCTS BEING RETURNED:');
    topProducts.forEach((p, i) => {
      console.log(`${i+1}. ${p.name} - ${p.salesCount} sales, Rs${p.price}`);
    });
    
    const premiumDJProducts = topProducts.filter(p => p.name.includes('Premium DJ Speakers'));
    console.log(`🔍 Premium DJ Speakers in response: ${premiumDJProducts.length}`);
    premiumDJProducts.forEach(p => {
      console.log(`- ${p.name}: ${p.salesCount} sales`);
    });

    // Category wise sales
    const categorySales = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalSales: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { totalSales: -1 } }
    ]);

    const revenue = revenueStats[0] || {
      totalRevenue: 0,
      revenueThisMonth: 0,
      revenueThisYear: 0
    };

    res.json({
      status: 'success',
      data: {
        stats: {
          users: {
            total: totalUsers,
            newToday: newUsersToday,
            newThisMonth: newUsersThisMonth
          },
          products: {
            total: totalProducts,
            lowStock: lowStockProducts,
            outOfStock: outOfStockProducts
          },
          orders: {
            total: totalOrders,
            today: ordersToday,
            thisMonth: ordersThisMonth,
            pending: pendingOrders
          },
          revenue: {
            total: revenue.totalRevenue,
            thisMonth: revenue.revenueThisMonth,
            thisYear: revenue.revenueThisYear
          }
        },
        recentOrders,
        topProducts,
        categorySales
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching dashboard stats'
    });
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    // Build filter
    let filter = {};
    if (req.query.role && req.query.role !== 'all') {
      filter.role = req.query.role;
    }
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }
    if (req.query.search) {
      const search = req.query.search;
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .select('-password');

    res.json({
      status: 'success',
      data: {
        users
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching users'
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// // @access  Private/Admin
router.get('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get user's order statistics
    const orderStats = await Order.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          avgOrderValue: { $avg: '$totalPrice' }
        }
      }
    ]);

    // Get recent orders
    const recentOrders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber totalPrice orderStatus createdAt');

    res.json({
      status: 'success',
      data: {
        user,
        orderStats: orderStats[0] || {
          totalOrders: 0,
          totalSpent: 0,
          avgOrderValue: 0
        },
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user'
    });
  }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', protect, admin, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone must be a valid 10-digit number'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, phone, role, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already exists'
        });
      }
    }

    // Update user
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json({
      status: 'success',
      message: 'User updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating user'
    });
  }
});

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private/Admin
router.post('/users', protect, admin, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone must be a valid 10-digit number'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, phone, role = 'user', isActive = true } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      isActive
    });

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating user'
    });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        status: 'error',
        message: 'You cannot delete your own account'
      });
    }

    // Hard delete - permanently remove the user from database
    await User.findByIdAndDelete(req.params.id);

    res.json({
      status: 'success',
      message: 'User deleted permanently'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting user'
    });
  }
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
router.put('/users/:id/role', protect, admin, [
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { role } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Prevent admin from changing their own role to user
    if (user._id.toString() === req.user._id.toString() && role === 'user') {
      return res.status(400).json({
        status: 'error',
        message: 'You cannot change your own role to user'
      });
    }

    user.role = role;
    await user.save();

    res.json({
      status: 'success',
      message: 'User role updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating user role'
    });
  }
});

// @desc    Get product analytics
// @route   GET /api/admin/analytics/products
// @access  Private/Admin
router.get('/analytics/products', protect, admin, async (req, res) => {
  try {
    // Most viewed products
    const mostViewed = await Product.find({ isActive: true })
      .sort({ viewCount: -1 })
      .limit(10)
      .select('name viewCount image category');

    // Best selling products
    const bestSelling = await Product.find({ isActive: true })
      .sort({ salesCount: -1 })
      .limit(10)
      .select('name salesCount image category price');

    // Products by category
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          avgPrice: { $avg: '$price' },
          totalSales: { $sum: '$salesCount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Low stock alerts
    const lowStockProducts = await Product.find({
      isActive: true,
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    })
    .select('name stock lowStockThreshold category')
    .sort({ stock: 1 })
    .limit(20);

    res.json({
      status: 'success',
      data: {
        mostViewed,
        bestSelling,
        categoryStats,
        lowStockProducts
      }
    });
  } catch (error) {
    console.error('Get product analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching product analytics'
    });
  }
});

// @desc    Get sales analytics
// @route   GET /api/admin/analytics/sales
// @access  Private/Admin
router.get('/analytics/sales', protect, admin, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter.createdAt = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case '30d':
        dateFilter.createdAt = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
        break;
      case '3m':
        dateFilter.createdAt = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
        break;
      case '1y':
        dateFilter.createdAt = { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
        break;
    }

    // Sales over time
    const salesOverTime = await Order.aggregate([
      { $match: { ...dateFilter, isPaid: true } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Revenue by payment method
    const revenueByPayment = await Order.aggregate([
      { $match: { ...dateFilter, isPaid: true } },
      {
        $group: {
          _id: '$paymentMethod',
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Order status distribution
    const orderStatusDistribution = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: {
        salesOverTime,
        revenueByPayment,
        orderStatusDistribution
      }
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching sales analytics'
    });
  }
});

// @desc    Get all products for admin
// @route   GET /api/admin/products
// @access  Private/Admin
router.get('/products', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build filter
    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'all') {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      status: 'success',
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products'
    });
  }
});

// @desc    Get a single product by ID
// @route   GET /api/admin/products/:id
// @access  Private/Admin
router.get('/products/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// @desc    Create a new product
// @route   POST /api/admin/products
// @access  Private/Admin
router.post('/products', protect, admin, async (req, res) => {
  try {
    const { name, description, price, category, stock, brand, image, sku } = req.body;
    
    // Generate SKU if not provided or validate existing SKU
    let productSku = sku;
    
    if (!productSku) {
      // Generate new SKU using brand and product name
      const checkUnique = async (skuToCheck) => {
        const existingProduct = await Product.findOne({ 
          sku: skuToCheck.toUpperCase() 
        });
        return !existingProduct;
      };

      productSku = await generateUniqueSKU(checkUnique, {
        brand: brand || '',
        productName: name || '',
        length: 10 // Default 10 characters
      });
    } else {
      // Validate provided SKU
      if (!validateSKU(productSku)) {
        return res.status(400).json({ 
          message: 'Invalid SKU format. SKU must be 8-12 alphanumeric characters.' 
        });
      }
      
      // Ensure uppercase
      productSku = productSku.toUpperCase();
      
      // Check if SKU already exists
      const existingProduct = await Product.findOne({ sku: productSku });
      if (existingProduct) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
    }
    
    // Set default image if not provided
    const productImage = image || null;
    
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      brand,
      image: productImage,
      sku: productSku,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
router.put('/products/:id', protect, admin, async (req, res) => {
  try {
    const { name, description, price, category, stock, brand, image, galleryImages, images, sku } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // Update basic fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;
      product.brand = brand || product.brand;

      // Handle SKU updates with validation
      if (sku !== undefined && sku !== product.sku) {
        // Validate the new SKU format
        if (!validateSKU(sku)) {
          return res.status(400).json({ 
            message: 'Invalid SKU format. SKU must be 8-12 alphanumeric characters.' 
          });
        }
        
        // Check if the new SKU is unique (excluding current product)
        const existingProduct = await Product.findOne({ 
          sku: sku.toUpperCase(),
          _id: { $ne: req.params.id }
        });
        
        if (existingProduct) {
          return res.status(400).json({ message: 'SKU already exists for another product' });
        }
        
        product.sku = sku.toUpperCase();
        console.log('Updating product SKU:', product.sku);
      }

      // Handle image updates
      if (image !== undefined) {
        product.image = image || null;
      }
      
      if (galleryImages !== undefined) {
        product.galleryImages = galleryImages || [];
      }
      
      // If images array is provided (from frontend form), convert it
      if (images !== undefined && Array.isArray(images)) {
        if (images.length > 0) {
          product.image = images[0];
          product.galleryImages = images.slice(1);
        } else {
          product.image = null;
          product.galleryImages = [];
        }
      }

      console.log('Updating product images:', {
        id: product._id,
        image: product.image,
        galleryImages: product.galleryImages,
        totalImages: [product.image, ...product.galleryImages]
      });

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// @desc    Delete a product (soft delete)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
router.delete('/products/:id', protect, admin, async (req, res) => {
  try {
    console.log('DELETE product request received for ID:', req.params.id);
    console.log('User making request:', req.user?.email);
    
    // Use soft delete by setting isActive to false instead of removing from database
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        isActive: false,
        deletedAt: new Date(),
        deletedBy: req.user._id
      },
      { new: true }
    );
    
    console.log('Product found and soft deleted:', product ? 'Yes' : 'No');

    if (product) {
      console.log('Product soft deleted successfully:', product.name);
      res.json({ 
        status: 'success',
        message: 'Product removed successfully', 
        deletedProduct: product 
      });
    } else {
      console.log('Product not found for ID:', req.params.id);
      res.status(404).json({ 
        status: 'error',
        message: 'Product not found' 
      });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to delete product',
      error: error.message 
    });
  }
});

// @desc    Restore a deleted product
// @route   PATCH /api/admin/products/:id/restore
// @access  Private/Admin
router.patch('/products/:id/restore', protect, admin, async (req, res) => {
  try {
    console.log('RESTORE product request received for ID:', req.params.id);
    console.log('User making request:', req.user?.email);
    
    // Restore product by setting isActive to true and clearing delete fields
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        isActive: true,
        $unset: { 
          deletedAt: 1,
          deletedBy: 1 
        }
      },
      { new: true }
    );
    
    console.log('Product found and restored:', product ? 'Yes' : 'No');

    if (product) {
      console.log('Product restored successfully:', product.name);
      res.json({ 
        status: 'success',
        message: 'Product restored successfully', 
        restoredProduct: product 
      });
    } else {
      console.log('Product not found for ID:', req.params.id);
      res.status(404).json({ 
        status: 'error',
        message: 'Product not found' 
      });
    }
  } catch (error) {
    console.error('Error restoring product:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to restore product',
      error: error.message 
    });
  }
});



// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build filter
    let filter = {};
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }
    if (status && status !== 'all') {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price image images galleryImages')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      status: 'success',
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch orders'
    });
  }
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
router.put('/orders/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const oldStatus = order.orderStatus;
      const newStatus = req.body.status || order.orderStatus;
      
      // Update order status
      order.orderStatus = newStatus;
      
      // Auto-update payment status based on order status
      if (newStatus === 'delivered' && !order.isPaid) {
        // Mark as paid when delivered (assuming COD or payment confirmed)
        order.isPaid = true;
        order.paidAt = new Date();
      } else if (newStatus === 'cancelled' && order.isPaid) {
        // Handle cancelled orders - keep payment status as is for refund processing
        // You might want to add refund logic here
      }
      
      // Update delivery status
      if (newStatus === 'delivered' && !order.isDelivered) {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      } else if (newStatus !== 'delivered' && order.isDelivered) {
        order.isDelivered = false;
        order.deliveredAt = undefined;
      }
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    res.json({
      status: 'success',
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch admin statistics'
    });
  }
});

// @desc    Get all deals
// @route   GET /api/admin/deals
// @access  Private/Admin
router.get('/deals', protect, admin, async (req, res) => {
  try {
    console.log('🔍 GET /api/admin/deals endpoint called');
    const deals = await Deal.find().populate('applicableProducts', 'name category').populate('createdBy', 'name email');
    console.log(`📊 Found ${deals.length} deals`);
    res.json({ status: 'success', data: deals });
  } catch (error) {
    console.error('❌ Error fetching deals:', error);
    res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
  }
});

// @desc    Create a deal
// @route   POST /api/admin/deals
// @access  Private/Admin
router.post('/deals', protect, admin, async (req, res) => {
  try {
    console.log('🔥 Creating new deal with data:', req.body);
    
    const newDeal = new Deal(req.body);
    await newDeal.save();
    
    console.log('✅ Deal created successfully:', newDeal._id);
    res.status(201).json({ status: 'success', data: newDeal });
  } catch (error) {
    console.error('❌ Deal creation failed:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      
      console.log('📋 Validation errors:', validationErrors);
      return res.status(400).json({ 
        status: 'error', 
        message: 'Validation failed',
        errors: validationErrors,
        details: Object.values(validationErrors).join(', ')
      });
    }
    
    // Handle other errors
    res.status(400).json({ 
      status: 'error', 
      message: error.message || 'Failed to create deal'
    });
  }
});

// @desc    Update a deal
// @route   PUT /api/admin/deals/:id
// @access  Private/Admin
router.put('/deals/:id', protect, admin, async (req, res) => {
  try {
    console.log('🔄 Updating deal:', req.params.id, 'with data:', req.body);
    
    const updatedDeal = await Deal.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { 
        new: true, 
        runValidators: true // This ensures validation runs on update
      }
    );
    
    if (!updatedDeal) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Deal not found' 
      });
    }
    
    console.log('✅ Deal updated successfully:', updatedDeal._id);
    res.json({ status: 'success', data: updatedDeal });
  } catch (error) {
    console.error('❌ Deal update failed:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      
      console.log('📋 Validation errors:', validationErrors);
      return res.status(400).json({ 
        status: 'error', 
        message: 'Validation failed',
        errors: validationErrors,
        details: Object.values(validationErrors).join(', ')
      });
    }
    
    res.status(400).json({ 
      status: 'error', 
      message: error.message || 'Failed to update deal'
    });
  }
});

// @desc    Delete a deal
// @route   DELETE /api/admin/deals/:id
// @access  Private/Admin
router.delete('/deals/:id', protect, admin, async (req, res) => {
  try {
    await Deal.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Deal deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Private/Admin
router.get('/coupons', protect, admin, async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json({ status: 'success', data: coupons });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// @desc    Create a coupon
// @route   POST /api/admin/coupons
// @access  Private/Admin
router.post('/coupons', protect, admin, async (req, res) => {
  try {
    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    res.status(201).json({ status: 'success', data: newCoupon });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// @desc    Update a coupon
// @route   PUT /api/admin/coupons/:id
// @access  Private/Admin
router.put('/coupons/:id', protect, admin, async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ status: 'success', data: updatedCoupon });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// @desc    Delete a coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
router.delete('/coupons/:id', protect, admin, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// @desc    Get all contacts
// @route   GET /api/admin/contacts
// @access  Private/Admin
router.get('/contacts', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || '';
    const category = req.query.category || '';

    // Build filter
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalContacts = await Contact.countDocuments(filter);

    res.json({ 
      status: 'success', 
      data: {
        contacts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalContacts / limit),
          totalContacts
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// @desc    Get contact by ID
// @route   GET /api/admin/contacts/:id
// @access  Private/Admin
router.get('/contacts/:id', protect, admin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ status: 'error', message: 'Contact not found' });
    }
    res.json({ status: 'success', data: contact });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// @desc    Update contact status
// @route   PUT /api/admin/contacts/:id
// @access  Private/Admin
router.put('/contacts/:id', protect, admin, async (req, res) => {
  try {
    const { status, priority, adminNotes } = req.body;
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ status: 'error', message: 'Contact not found' });
    }

    // Update fields
    if (status) contact.status = status;
    if (priority) contact.priority = priority;
    if (adminNotes) {
      contact.adminNotes.push({
        note: adminNotes,
        addedBy: req.user.name,
        addedAt: new Date()
      });
    }

    // Mark as resolved if status is resolved
    if (status === 'resolved' && contact.status !== 'resolved') {
      contact.resolvedAt = new Date();
      contact.resolvedBy = req.user.name;
    }

    await contact.save();
    res.json({ status: 'success', data: contact });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// @desc    Delete contact
// @route   DELETE /api/admin/contacts/:id
// @access  Private/Admin
router.delete('/contacts/:id', protect, admin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ status: 'success', message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;
