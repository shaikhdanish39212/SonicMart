const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const { asyncErrorHandler } = require('../middleware/errorHandler');

// @desc    Log frontend errors
// @route   POST /api/errors
// @access  Public
router.post('/', asyncErrorHandler(async (req, res) => {
  const {
    message,
    stack,
    componentStack,
    eventId,
    timestamp,
    userAgent,
    url,
    userId,
    additionalInfo
  } = req.body;

  // Log the frontend error
  logger.error('Frontend Error Reported:', {
    message,
    stack,
    componentStack,
    eventId,
    timestamp,
    userAgent,
    url,
    userId,
    additionalInfo,
    ip: req.ip,
    reportedAt: new Date().toISOString()
  });

  res.status(200).json({
    success: true,
    message: 'Error logged successfully',
    eventId
  });
}));

// @desc    Get error statistics (Admin only)
// @route   GET /api/errors/stats
// @access  Private/Admin
router.get('/stats', asyncErrorHandler(async (req, res) => {
  // This would typically query from a database
  // For now, return mock data
  const stats = {
    totalErrors: 0,
    errorsByType: {},
    recentErrors: [],
    topPages: [],
    errorTrends: []
  };

  res.json({
    success: true,
    data: stats
  });
}));

module.exports = router;