const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Return = require('../models/Return');
const { protect, admin } = require('../middleware/auth');

// @desc    Submit return request
// @route   POST /api/returns/request
// @access  Public
router.post('/request', [
  body('orderNumber')
    .notEmpty()
    .withMessage('Order number is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Order number must be between 3-50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('reason')
    .notEmpty()
    .withMessage('Return reason is required')
    .isIn(['defective', 'wrong-item', 'not-as-described', 'changed-mind', 'damaged-shipping', 'compatibility-issues', 'poor-quality', 'other'])
    .withMessage('Invalid return reason'),
  body('comments')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Comments cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { orderNumber, email, reason, reasonText, comments, returnType = 'refund' } = req.body;

    // Check if return request already exists for this order and email
    const existingReturn = await Return.findOne({ 
      orderNumber: orderNumber.toUpperCase(), 
      email: email.toLowerCase() 
    });

    if (existingReturn) {
      return res.status(400).json({
        success: false,
        message: 'A return request already exists for this order. Please contact support for assistance.'
      });
    }

    // Create new return request
    const returnRequest = new Return({
      orderNumber: orderNumber.toUpperCase(),
      email: email.toLowerCase(),
      reason,
      reasonText: reasonText || '',
      comments: comments || '',
      returnType,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await returnRequest.save();
    
    console.log('Return request saved:', { orderNumber: orderNumber.toUpperCase(), email, reason });

    res.status(201).json({
      success: true,
      message: 'Return request submitted successfully! You will receive an email confirmation within 24 hours.',
      returnId: returnRequest._id,
      orderNumber: returnRequest.orderNumber
    });

  } catch (error) {
    console.error('Return request error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A return request already exists for this order'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @desc    Get return request by order number and email
// @route   POST /api/returns/check
// @access  Public
router.post('/check', [
  body('orderNumber').notEmpty().withMessage('Order number is required'),
  body('email').isEmail().withMessage('Please provide a valid email address')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { orderNumber, email } = req.body;
    
    const returnRequest = await Return.findOne({ 
      orderNumber: orderNumber.toUpperCase(), 
      email: email.toLowerCase() 
    });

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: 'No return request found for this order'
      });
    }

    res.json({
      success: true,
      data: {
        returnId: returnRequest._id,
        orderNumber: returnRequest.orderNumber,
        status: returnRequest.status,
        reason: returnRequest.reason,
        requestDate: returnRequest.requestDate,
        processedDate: returnRequest.processedDate,
        refundAmount: returnRequest.refundAmount,
        trackingNumber: returnRequest.trackingNumber
      }
    });

  } catch (error) {
    console.error('Return check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all return requests (Admin only)
// @route   GET /api/returns
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    
    const [returns, totalCount] = await Promise.all([
      Return.find(query)
        .sort({ requestDate: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Return.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        returns,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalReturns: totalCount,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get returns error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update return request status (Admin only)
// @route   PUT /api/returns/:id
// @access  Private/Admin
router.put('/:id', protect, admin, [
  body('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected', 'processing', 'completed'])
    .withMessage('Invalid status'),
  body('refundAmount')
    .optional()
    .isNumeric()
    .withMessage('Refund amount must be a number'),
  body('adminNote')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Admin note cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { status, refundAmount, adminNote, trackingNumber } = req.body;
    
    const returnRequest = await Return.findById(req.params.id);
    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found'
      });
    }

    // Update fields
    if (status) {
      returnRequest.status = status;
      returnRequest.processedDate = new Date();
      returnRequest.processedBy = req.user.name || req.user.email;
    }
    
    if (refundAmount) returnRequest.refundAmount = refundAmount;
    if (trackingNumber) returnRequest.trackingNumber = trackingNumber;
    
    if (adminNote) {
      returnRequest.adminNotes.push({
        note: adminNote,
        addedBy: req.user.name || req.user.email
      });
    }

    await returnRequest.save();

    res.json({
      success: true,
      message: 'Return request updated successfully',
      data: returnRequest
    });

  } catch (error) {
    console.error('Update return error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;