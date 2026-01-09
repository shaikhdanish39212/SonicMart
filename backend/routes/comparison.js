const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Comparison = require('../models/Comparison');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @desc    Get user's comparison list
// @route   GET /api/comparison
// @access  Private
router.get('/', protect, async (req, res) => {
  console.log('📊 Getting comparison list for user:', req.user._id);
  
  try {
    const comparison = await Comparison.getOrCreateForUser(req.user._id);
    
    res.json({
      status: 'success',
      data: {
        comparison: {
          _id: comparison._id,
          items: comparison.items,
          itemCount: comparison.itemCount,
          maxItems: comparison.maxItems,
          createdAt: comparison.createdAt,
          updatedAt: comparison.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('💥 Error fetching comparison:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching comparison list'
    });
  }
});

// @desc    Add product to comparison
// @route   POST /api/comparison/items
// @access  Private
router.post('/items', protect, [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format')
], async (req, res) => {
  console.log('📝 Adding product to comparison:', {
    userId: req.user._id,
    productId: req.body.productId
  });
  
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

    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Get or create comparison list
    const comparison = await Comparison.getOrCreateForUser(req.user._id);
    
    // Add product to comparison
    await comparison.addProduct(productId);
    
    // Fetch updated comparison with populated products
    const updatedComparison = await Comparison.findById(comparison._id).populate('items.product');
    
    res.status(201).json({
      status: 'success',
      message: 'Product added to comparison',
      data: {
        comparison: {
          _id: updatedComparison._id,
          items: updatedComparison.items,
          itemCount: updatedComparison.itemCount,
          maxItems: updatedComparison.maxItems
        }
      }
    });
  } catch (error) {
    console.error('💥 Error adding to comparison:', error);
    
    if (error.message.includes('already in comparison') || error.message.includes('can only compare')) {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Error adding product to comparison'
    });
  }
});

// @desc    Remove product from comparison
// @route   DELETE /api/comparison/items/:productId
// @access  Private
router.delete('/items/:productId', protect, async (req, res) => {
  console.log('🗑️ Removing product from comparison:', {
    userId: req.user._id,
    productId: req.params.productId
  });
  
  try {
    const { productId } = req.params;

    // Get user's comparison list
    const comparison = await Comparison.findOne({ user: req.user._id });
    
    if (!comparison) {
      return res.status(404).json({
        status: 'error',
        message: 'Comparison list not found'
      });
    }

    // Remove product from comparison
    await comparison.removeProduct(productId);
    
    // Fetch updated comparison with populated products
    const updatedComparison = await Comparison.findById(comparison._id).populate('items.product');
    
    res.json({
      status: 'success',
      message: 'Product removed from comparison',
      data: {
        comparison: {
          _id: updatedComparison._id,
          items: updatedComparison.items,
          itemCount: updatedComparison.itemCount,
          maxItems: updatedComparison.maxItems
        }
      }
    });
  } catch (error) {
    console.error('💥 Error removing from comparison:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error removing product from comparison'
    });
  }
});

// @desc    Clear all items from comparison
// @route   DELETE /api/comparison
// @access  Private
router.delete('/', protect, async (req, res) => {
  console.log('🧹 Clearing comparison list for user:', req.user._id);
  
  try {
    // Get user's comparison list
    const comparison = await Comparison.findOne({ user: req.user._id });
    
    if (!comparison) {
      return res.status(404).json({
        status: 'error',
        message: 'Comparison list not found'
      });
    }

    // Clear all items
    await comparison.clearAll();
    
    res.json({
      status: 'success',
      message: 'Comparison list cleared',
      data: {
        comparison: {
          _id: comparison._id,
          items: [],
          itemCount: 0,
          maxItems: comparison.maxItems
        }
      }
    });
  } catch (error) {
    console.error('💥 Error clearing comparison:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error clearing comparison list'
    });
  }
});

// @desc    Update comparison settings (like max items)
// @route   PUT /api/comparison/settings
// @access  Private
router.put('/settings', protect, [
  body('maxItems')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Max items must be between 1 and 10')
], async (req, res) => {
  console.log('⚙️ Updating comparison settings for user:', req.user._id);
  
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

    const { maxItems } = req.body;

    // Get user's comparison list
    const comparison = await Comparison.getOrCreateForUser(req.user._id);
    
    // Update settings
    if (maxItems !== undefined) {
      comparison.maxItems = maxItems;
      
      // If current items exceed new max, remove excess items
      if (comparison.items.length > maxItems) {
        comparison.items = comparison.items.slice(0, maxItems);
      }
    }
    
    await comparison.save();
    
    // Fetch updated comparison with populated products
    const updatedComparison = await Comparison.findById(comparison._id).populate('items.product');
    
    res.json({
      status: 'success',
      message: 'Comparison settings updated',
      data: {
        comparison: {
          _id: updatedComparison._id,
          items: updatedComparison.items,
          itemCount: updatedComparison.itemCount,
          maxItems: updatedComparison.maxItems
        }
      }
    });
  } catch (error) {
    console.error('💥 Error updating comparison settings:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating comparison settings'
    });
  }
});

module.exports = router;