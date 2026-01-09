const express = require('express');
const {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', protect, createOrder);

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', protect, verifyPayment);

// @desc    Get payment details
// @route   GET /api/payments/:paymentId
// @access  Private
router.get('/:paymentId', protect, getPaymentDetails);

// @desc    Refund payment
// @route   POST /api/payments/refund
// @access  Private/Admin
router.post('/refund', protect, admin, refundPayment);

module.exports = router;
