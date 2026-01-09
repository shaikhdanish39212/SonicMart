const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');
const { sendSecurityAlertNotification } = require('../utils/notificationService');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name price image averageRating');

    res.json({
      status: 'success',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching profile'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please enter a valid 10-digit phone number')
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

    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    // Send security alert notification for profile update
    try {
      await sendSecurityAlertNotification(user, 'profile_updated', 'Name or phone number was updated');
    } catch (notifError) {
      console.log('Security alert notification failed:', notifError.message);
    }

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating profile'
    });
  }
});

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const productId = req.params.productId;

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user._id);

    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Product is already in wishlist'
      });
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    // Populate wishlist for response
    await user.populate('wishlist', 'name price discountedPrice image images averageRating category brand stock');

    res.json({
      status: 'success',
      message: 'Product added to wishlist',
      data: {
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding to wishlist'
    });
  }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
router.delete('/wishlist/:productId', protect, async (req, res) => {
  try {
    const productId = req.params.productId;
    const user = await User.findById(req.user._id);

    // Check if product is in wishlist
    if (!user.wishlist.includes(productId)) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found in wishlist'
      });
    }

    // Remove from wishlist
    user.wishlist.pull(productId);
    await user.save();

    // Populate wishlist for response
    await user.populate('wishlist', 'name price discountedPrice image images averageRating category brand stock');

    res.json({
      status: 'success',
      message: 'Product removed from wishlist',
      data: {
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error while removing from wishlist'
    });
  }
});

// @desc    Get user's wishlist
// @route   GET /api/users/wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name price discountedPrice image images averageRating category brand stock isActive');

    // Filter out inactive products or null references
    const activeWishlistItems = user.wishlist.filter(product => 
      product && (product.isActive === undefined || product.isActive === true)
    );

    // Update user's wishlist if there are inactive products
    if (activeWishlistItems.length !== user.wishlist.length) {
      user.wishlist = activeWishlistItems.map(product => product._id);
      await user.save();
    }

    res.json({
      status: 'success',
      data: {
        wishlist: activeWishlistItems
      }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching wishlist'
    });
  }
});

// @desc    Get user's order history
// @route   GET /api/users/orders
// @access  Private
router.get('/orders', protect, async (req, res) => {
  try {
    console.log(`[DEBUG] Fetching orders for user: ${req.user._id}`);
    
    // First, check total orders in database
    const totalOrders = await Order.countDocuments();
    console.log(`[DEBUG] Total orders in database: ${totalOrders}`);
    
    // Check orders for this specific user
    const userOrders = await Order.find({ user: req.user._id });
    console.log(`[DEBUG] Orders found for user ${req.user._id}:`, userOrders.length);
    
    if (userOrders.length > 0) {
      console.log(`[DEBUG] Sample order:`, JSON.stringify(userOrders[0], null, 2));
    }
    
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name image images galleryImages')
      .sort({ createdAt: -1 });

    console.log(`[DEBUG] Populated orders count: ${orders.length}`);

    res.json({
      status: 'success',
      data: {
        orders
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching orders'
    });
  }
});

// @desc    Get user dashboard statistics
// @route   GET /api/user/dashboard-stats
// @access  Private
router.get('/dashboard-stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Order statistics
    const orderStats = await Order.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          avgOrderValue: { $avg: '$totalPrice' },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          },
          pendingOrders: {
            $sum: { $cond: [{ $in: ['$orderStatus', ['pending', 'confirmed', 'processing', 'shipped']] }, 1, 0] }
          }
        }
      }
    ]);

    // Wishlist count
    const wishlistCount = await req.user.populate('wishlist');
    const wishlistItems = wishlistCount.wishlist ? wishlistCount.wishlist.length : 0;

    // Reviews count (if you have a Review model)
    // const reviewsCount = await Review.countDocuments({ user: userId });
    const reviewsCount = 0; // Placeholder

    const stats = orderStats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      avgOrderValue: 0,
      completedOrders: 0,
      pendingOrders: 0
    };

    res.json({
      status: 'success',
      data: {
        totalOrders: stats.totalOrders,
        totalSpent: stats.totalSpent,
        wishlistItems: wishlistItems,
        reviewsGiven: reviewsCount,
        completedOrders: stats.completedOrders,
        pendingOrders: stats.pendingOrders,
        avgOrderValue: stats.avgOrderValue
      }
    });
  } catch (error) {
    console.error('Get user dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching dashboard statistics'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Order statistics
    const orderStats = await Order.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          avgOrderValue: { $avg: '$totalPrice' },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
          },
          pendingOrders: {
            $sum: { $cond: [{ $in: ['$orderStatus', ['pending', 'confirmed', 'processing', 'shipped']] }, 1, 0] }
          }
        }
      }
    ]);

    // Recent activity
    const recentOrders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber totalPrice orderStatus createdAt');

    // Favorite categories (based on orders)
    const favoriteCategories = await Order.aggregate([
      { $match: { user: userId } },
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
          count: { $sum: '$orderItems.quantity' },
          totalSpent: { $sum: { $multiply: ['$orderItems.quantity', '$orderItems.price'] } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const stats = orderStats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      avgOrderValue: 0,
      completedOrders: 0,
      pendingOrders: 0
    };

    res.json({
      status: 'success',
      data: {
        stats,
        recentOrders,
        favoriteCategories
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user statistics'
    });
  }
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
router.delete('/account', protect, [
  body('password')
    .notEmpty()
    .withMessage('Password is required to delete account')
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

    const { password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid password'
      });
    }

    // Check for pending orders
    const pendingOrders = await Order.countDocuments({
      user: req.user._id,
      orderStatus: { $in: ['pending', 'confirmed', 'processing', 'shipped'] }
    });

    if (pendingOrders > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete account with pending orders. Please wait for orders to be completed or contact support.'
      });
    }

    // Soft delete - deactivate account
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    await user.save();

    res.json({
      status: 'success',
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting account'
    });
  }
});

// @desc    Get available coupons for user
// @route   GET /api/users/coupons
// @access  Public
router.get('/coupons', async (req, res) => {
  try {
    // Only show active, non-expired coupons
    const currentDate = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      validUntil: { $gt: currentDate },
      $or: [
        { maxUsage: { $exists: false } },
        { maxUsage: null },
        { $expr: { $lt: ['$usageCount', '$maxUsage'] } }
      ]
    }).select('code description discountType discountValue minOrderAmount maxDiscountAmount validUntil');

    res.json({
      status: 'success',
      data: {
        coupons: coupons.map(coupon => ({
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minOrderAmount: coupon.minOrderAmount,
          maxDiscountAmount: coupon.maxDiscountAmount,
          expiresAt: coupon.validUntil // Map to frontend expected field
        }))
      }
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching coupons'
    });
  }
});

// @desc    Validate coupon code
// @route   POST /api/users/coupons/validate
// @access  Public
router.post('/coupons/validate', [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Coupon code is required'),
  body('orderAmount')
    .isNumeric()
    .withMessage('Order amount must be a number')
    .isFloat({ min: 0 })
    .withMessage('Order amount must be positive')
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

    const { code, orderAmount } = req.body;

    // Find the coupon
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true 
    });

    if (!coupon) {
      return res.status(404).json({
        status: 'error',
        message: 'Invalid coupon code'
      });
    }

    // Validate coupon using the model's isValid method
    const couponValidation = coupon.isValid();
    
    if (!couponValidation.valid) {
      return res.status(400).json({
        status: 'error',
        message: couponValidation.reason
      });
    }

    // Calculate discount using the model's calculateDiscount method
    const discountResult = coupon.calculateDiscount(parseFloat(orderAmount));
    
    console.log('Debug coupon calculation:', {
      couponCode: coupon.code,
      orderAmount: parseFloat(orderAmount),
      minOrderAmount: coupon.minOrderAmount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountResult: discountResult
    });
    
    if (!discountResult.valid) {
      return res.status(400).json({
        status: 'error',
        message: discountResult.reason
      });
    }

    res.json({
      status: 'success',
      data: {
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          description: coupon.description
        },
        discount: {
          amount: discountResult.discountAmount,
          orderAmount: parseFloat(orderAmount),
          finalAmount: parseFloat(orderAmount) - discountResult.discountAmount
        }
      }
    });

  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while validating coupon'
    });
  }
});

// @desc    Update notification settings
// @route   PUT /api/users/notifications
// @access  Private
router.put('/notifications', protect, async (req, res) => {
  try {
    const { notificationSettings } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { notificationSettings },
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      message: 'Notification settings updated successfully',
      data: {
        notificationSettings: user.notificationSettings
      }
    });

  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating notification settings'
    });
  }
});

// @desc    Update privacy settings
// @route   PUT /api/users/privacy
// @access  Private
router.put('/privacy', protect, async (req, res) => {
  try {
    const { privacySettings } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { privacySettings },
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      message: 'Privacy settings updated successfully',
      data: {
        privacySettings: user.privacySettings
      }
    });

  } catch (error) {
    console.error('Update privacy settings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating privacy settings'
    });
  }
});

// @desc    Get user settings
// @route   GET /api/users/settings
// @access  Private
router.get('/settings', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      status: 'success',
      data: {
        notificationSettings: user.notificationSettings,
        privacySettings: user.privacySettings
      }
    });

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching settings'
    });
  }
});

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
router.put('/change-password', protect, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: errors.array()[0].msg
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Check if new password is different from current
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        status: 'error',
        message: 'New password must be different from current password'
      });
    }

    // Update password
    user.password = newPassword; // Will be hashed by pre-save middleware
    await user.save();

    // Send security alert
    try {
      await sendSecurityAlertNotification(user, 'password_changed', 'Password was changed from profile settings');
    } catch (notifError) {
      console.log('Security alert notification failed:', notifError.message);
    }

    res.json({
      status: 'success',
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while changing password'
    });
  }
});

// @desc    Delete user account
// @route   DELETE /api/users/delete-account
// @access  Private
router.delete('/delete-account', protect, [
  body('password')
    .notEmpty()
    .withMessage('Password is required to delete account'),
  body('confirmText')
    .equals('DELETE MY ACCOUNT')
    .withMessage('Please type exactly "DELETE MY ACCOUNT" to confirm')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: errors.array()[0].msg
      });
    }

    const { password, confirmText } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid password'
      });
    }

    // Additional security check for confirmation text
    if (confirmText !== 'DELETE MY ACCOUNT') {
      return res.status(400).json({
        status: 'error',
        message: 'Confirmation text does not match'
      });
    }

    // Log security event
    console.log(`Account deletion initiated for user ${user.email} at ${new Date().toISOString()}`);

    // In a real e-commerce application, you might want to:
    // 1. Send a confirmation email before deletion
    // 2. Set account to "pending deletion" status with grace period
    // 3. Remove personal data but keep order history for legal compliance
    // 4. Send notification to admin for audit trail
    
    // For now, we'll do immediate deletion
    try {
      // Clean up related data
      await User.findByIdAndDelete(req.user._id);
      
      // Send security notification (if email service is configured)
      try {
        await sendSecurityAlertNotification(user.email, 'Account Deleted', 
          'Your account has been successfully deleted from our system.');
      } catch (emailError) {
        console.log('Email notification failed:', emailError.message);
        // Don't fail the deletion if email fails
      }

      res.json({
        status: 'success',
        message: 'Account has been successfully deleted. A confirmation email has been sent.'
      });
    } catch (deletionError) {
      console.error('Account deletion failed:', deletionError);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete account. Please try again.'
      });
    }

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while processing account deletion'
    });
  }
});

module.exports = router;
