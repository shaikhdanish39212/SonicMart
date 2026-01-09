const express = require('express');
const router = express.Router();
const { getDeals, getDealById } = require('../controllers/dealController');

// @desc    Get all deals with filtering and pagination
// @route   GET /api/deals
// @access  Public
router.get('/', getDeals);

// @desc    Get deal by ID
// @route   GET /api/deals/:id
// @access  Public
router.get('/:id', getDealById);

module.exports = router;