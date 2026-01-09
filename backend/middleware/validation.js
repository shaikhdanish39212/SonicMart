const { body, validationResult } = require('express-validator');

// Product validation rules
const productValidationRules = () => {
  return [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Product name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z0-9\s\-_()&.]+$/)
      .withMessage('Product name contains invalid characters'),
    
    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    
    body('price')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be a positive number'),
    
    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn(['headphones', 'speakers', 'microphones', 'keyboards-pianos', 'guitars-basses', 'drums-percussion', 'studio-equipment', 'dj-speakers', 'earbuds', 'earphones', 'home-theater', 'loud-speakers', 'neckband-earphones'])
      .withMessage('Invalid category'),
    
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer'),
    
    body('brand')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Brand must be between 2 and 50 characters'),
    
    body('sku')
      .trim()
      .isLength({ min: 8, max: 12 })
      .withMessage('SKU must be between 8 and 12 characters')
      .matches(/^[A-Z0-9]+$/i)
      .withMessage('SKU can only contain letters and numbers (alphanumeric)'),
    
    body('image')
      .optional()
      .isURL()
      .withMessage('Image must be a valid URL')
  ];
};

// User validation rules
const userValidationRules = () => {
  return [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name can only contain letters and spaces'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number')
  ];
};

// Order validation rules
const orderValidationRules = () => {
  return [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must contain at least one item'),
    
    body('items.*.product')
      .isMongoId()
      .withMessage('Invalid product ID'),
    
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer'),
    
    body('shippingAddress.fullName')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Full name is required'),
    
    body('shippingAddress.address')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Address must be between 5 and 200 characters'),
    
    body('shippingAddress.city')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('City is required'),
    
    body('shippingAddress.postalCode')
      .trim()
      .matches(/^[0-9]{5,10}$/)
      .withMessage('Invalid postal code'),
    
    body('shippingAddress.country')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Country is required')
  ];
};

// Contact form validation rules
const contactValidationRules = () => {
  return [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    
    body('subject')
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage('Subject must be between 5 and 100 characters'),
    
    body('message')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Message must be between 10 and 1000 characters')
  ];
};

// Payment validation rules
const paymentValidationRules = () => {
  return [
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be a positive number'),
    
    body('currency')
      .isIn(['INR'])
      .withMessage('Invalid currency'),
    
    body('paymentMethod')
      .isIn(['card', 'razorpay', 'paypal', 'cod', 'upi'])
      .withMessage('Invalid payment method')
  ];
};

// Generic validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Sanitization helper
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }
  return input;
};

// Rate limiting validation
const rateLimitValidation = {
  // Standard rate limit: 100 requests per 15 minutes
  standard: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      status: 'error',
      message: 'Too many requests from this IP, please try again later.'
    }
  },
  
  // Strict rate limit for sensitive operations: 5 requests per 15 minutes
  strict: {
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
      status: 'error',
      message: 'Too many attempts, please try again later.'
    }
  },
  
  // Login rate limit: 10 attempts per 15 minutes
  login: {
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
      status: 'error',
      message: 'Too many login attempts, please try again later.'
    }
  }
};

module.exports = {
  productValidationRules,
  userValidationRules,
  orderValidationRules,
  contactValidationRules,
  paymentValidationRules,
  validate,
  sanitizeInput,
  rateLimitValidation
};