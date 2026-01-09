const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const logger = require('./logger');

/**
 * Get dashboard statistics for admin
 * @returns {Object} Dashboard statistics
 */
const getDashboardStats = async () => {
  try {
    const stats = await Promise.all([
      // Total products
      Product.countDocuments(),
      
      // Total orders
      Order.countDocuments(),
      
      // Total users
      User.countDocuments(),
      
      // Total revenue
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      // Pending orders
      Order.countDocuments({ status: 'pending' }),
      
      // Low stock products (stock <= 10)
      Product.countDocuments({ stock: { $lte: 10 } })
    ]);

    return {
      totalProducts: stats[0],
      totalOrders: stats[1],
      totalUsers: stats[2],
      totalRevenue: stats[3][0]?.total || 0,
      pendingOrders: stats[4],
      lowStockProducts: stats[5]
    };
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Get recent orders with user information
 * @param {number} limit - Number of orders to fetch
 * @returns {Array} Recent orders
 */
const getRecentOrders = async (limit = 10) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return orders;
  } catch (error) {
    logger.error('Error fetching recent orders:', error);
    throw error;
  }
};

/**
 * Get top selling products
 * @param {number} limit - Number of products to fetch
 * @returns {Array} Top selling products
 */
const getTopSellingProducts = async (limit = 10) => {
  try {
    const products = await Order.aggregate([
      { $unwind: '$items' },
      { 
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $project: {
          _id: 1,
          name: '$productInfo.name',
          image: '$productInfo.images.0',
          totalSold: 1,
          totalRevenue: 1
        }
      }
    ]);

    return products;
  } catch (error) {
    logger.error('Error fetching top selling products:', error);
    throw error;
  }
};

/**
 * Get sales data for chart (last 30 days)
 * @returns {Array} Daily sales data
 */
const getSalesData = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          totalSales: 1,
          orderCount: 1
        }
      }
    ]);

    return salesData;
  } catch (error) {
    logger.error('Error fetching sales data:', error);
    throw error;
  }
};

/**
 * Get low stock products
 * @param {number} threshold - Stock threshold (default: 10)
 * @returns {Array} Low stock products
 */
const getLowStockProducts = async (threshold = 10) => {
  try {
    const products = await Product.find({
      stock: { $lte: threshold }
    })
    .select('name stock category price images')
    .sort({ stock: 1 })
    .lean();

    return products;
  } catch (error) {
    logger.error('Error fetching low stock products:', error);
    throw error;
  }
};

/**
 * Get user registration statistics
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Object} User registration stats
 */
const getUserRegistrationStats = async (days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    const totalNewUsers = await User.countDocuments({
      createdAt: { $gte: startDate }
    });

    return {
      totalNewUsers,
      dailyStats: stats
    };
  } catch (error) {
    logger.error('Error fetching user registration stats:', error);
    throw error;
  }
};

/**
 * Get order status distribution
 * @returns {Array} Order status counts
 */
const getOrderStatusDistribution = async () => {
  try {
    const distribution = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    return distribution;
  } catch (error) {
    logger.error('Error fetching order status distribution:', error);
    throw error;
  }
};

/**
 * Get category-wise product distribution
 * @returns {Array} Category distribution
 */
const getCategoryDistribution = async () => {
  try {
    const distribution = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    return distribution;
  } catch (error) {
    logger.error('Error fetching category distribution:', error);
    throw error;
  }
};

/**
 * Search products with advanced filters
 * @param {Object} filters - Search filters
 * @returns {Object} Search results with pagination
 */
const searchProducts = async (filters = {}) => {
  try {
    const {
      q, // search query
      category,
      minPrice,
      maxPrice,
      inStock,
      page = 1,
      limit = 20,
      sort = 'createdAt'
    } = filters;

    // Build query
    const query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Count total documents
    const total = await Product.countDocuments(query);

    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    return {
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error searching products:', error);
    throw error;
  }
};

module.exports = {
  getDashboardStats,
  getRecentOrders,
  getTopSellingProducts,
  getSalesData,
  getLowStockProducts,
  getUserRegistrationStats,
  getOrderStatusDistribution,
  getCategoryDistribution,
  searchProducts
};