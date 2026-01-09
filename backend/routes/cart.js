const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image images galleryImages stock isActive discount');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out inactive products
    cart.items = cart.items.filter(item => item.product && item.product.isActive);
    await cart.save();

    res.json({
      status: 'success',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching cart'
    });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
router.post('/items', protect, [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required'),
  body('quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10')
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

    const { productId, quantity } = req.body;

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        status: 'error',
        message: `Only ${product.stock} items available in stock`
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    try {
      // Calculate price (with discount if applicable)
      const price = product.discount > 0 ? 
        product.price * (1 - product.discount / 100) : 
        product.price;

      cart.addItem(productId, quantity, price);
      await cart.save();

      // Populate the cart for response
      await cart.populate('items.product', 'name price image images galleryImages stock isActive discount');

      res.json({
        status: 'success',
        message: 'Item added to cart successfully',
        data: {
          cart
        }
      });
    } catch (error) {
      if (error.message === 'Maximum 10 items allowed per product') {
        return res.status(400).json({
          status: 'error',
          message: error.message
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Server error while adding item to cart'
    });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private
router.put('/items/:productId', protect, [
  body('quantity')
    .isInt({ min: 0, max: 10 })
    .withMessage('Quantity must be between 0 and 10')
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

    const { quantity } = req.body;
    const productId = req.params.productId;

    // Get cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    // Check if product exists in cart
    const cartItem = cart.items.find(item => 
      item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart'
      });
    }

    // If quantity is 0, remove item
    if (quantity === 0) {
      cart.removeItem(productId);
    } else {
      // Check stock availability
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found'
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          status: 'error',
          message: `Only ${product.stock} items available in stock`
        });
      }

      try {
        cart.updateItemQuantity(productId, quantity);
      } catch (error) {
        if (error.message === 'Maximum 10 items allowed per product') {
          return res.status(400).json({
            status: 'error',
            message: error.message
          });
        }
        throw error;
      }
    }

    await cart.save();

    // Populate the cart for response
    await cart.populate('items.product', 'name price image images galleryImages stock isActive discount');

    res.json({
      status: 'success',
      message: 'Cart updated successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating cart'
    });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
router.delete('/items/:productId', protect, async (req, res) => {
  try {
    const productId = req.params.productId;

    // Get cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    // Check if product exists in cart
    const cartItem = cart.items.find(item => 
      item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart'
      });
    }

    // Remove item
    cart.removeItem(productId);
    await cart.save();

    // Populate the cart for response
    await cart.populate('items.product', 'name price image images galleryImages stock isActive discount');

    res.json({
      status: 'success',
      message: 'Item removed from cart successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while removing item from cart'
    });
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    // Get cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    // Clear cart
    cart.clearCart();
    await cart.save();

    res.json({
      status: 'success',
      message: 'Cart cleared successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while clearing cart'
    });
  }
});

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
router.post('/coupon', protect, [
  body('couponCode')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Coupon code is required')
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

    const { couponCode } = req.body;

    // Get cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cart is empty'
      });
    }

    // Find coupon
    const coupon = await Coupon.findOne({ 
      code: couponCode.toUpperCase(),
      isActive: true 
    });

    if (!coupon) {
      return res.status(404).json({
        status: 'error',
        message: 'Invalid coupon code'
      });
    }

    // Check if coupon is valid
    const validationResult = coupon.isValid();
    if (!validationResult.valid) {
      return res.status(400).json({
        status: 'error',
        message: validationResult.reason
      });
    }

    // Check if user can use this coupon
    if (!coupon.canUserUse(req.user._id)) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already used this coupon'
      });
    }

    // Calculate discount
    const discountResult = coupon.calculateDiscount(cart.totalPrice);
    if (!discountResult.valid) {
      return res.status(400).json({
        status: 'error',
        message: discountResult.reason
      });
    }

    // If there's already a coupon applied, decrement its usage count
    if (cart.appliedCoupon && cart.appliedCoupon.code) {
      await Coupon.findOneAndUpdate(
        { code: cart.appliedCoupon.code },
        {
          $inc: { usageCount: -1 },
          $pull: {
            usedBy: { user: req.user._id }
          }
        }
      );
    }

    // Apply coupon to cart
    cart.applyCoupon(
      coupon.code,
      coupon.discountType === 'percentage' ? coupon.discountValue : null,
      discountResult.discountAmount
    );

    await cart.save();

    // Increment coupon usage count
    await Coupon.findByIdAndUpdate(coupon._id, {
      $inc: { usageCount: 1 },
      $push: {
        usedBy: {
          user: req.user._id,
          usedAt: new Date()
        }
      }
    });

    // Populate the cart for response
    await cart.populate('items.product', 'name price image images galleryImages stock isActive discount');

    res.json({
      status: 'success',
      message: 'Coupon applied successfully',
      data: {
        cart,
        discountApplied: discountResult.discountAmount
      }
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while applying coupon'
    });
  }
});

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
router.delete('/coupon', protect, async (req, res) => {
  try {
    // Get cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    // Get the applied coupon code before removing it
    const appliedCouponCode = cart.appliedCoupon?.code;

    // Remove coupon
    cart.removeCoupon();
    await cart.save();

    // Decrement coupon usage count if there was a coupon applied
    if (appliedCouponCode) {
      await Coupon.findOneAndUpdate(
        { code: appliedCouponCode },
        {
          $inc: { usageCount: -1 },
          $pull: {
            usedBy: { user: req.user._id }
          }
        }
      );
    }

    // Populate the cart for response
    await cart.populate('items.product', 'name price image images galleryImages stock isActive discount');

    res.json({
      status: 'success',
      message: 'Coupon removed successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    console.error('Remove coupon error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while removing coupon'
    });
  }
});

module.exports = router;
