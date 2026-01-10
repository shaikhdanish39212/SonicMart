const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http');
const { initializeWebSocket } = require('./controllers/realtimeController');
const logger = require('./utils/logger');
const { getDashboardStats } = require('./utils/dbQueries');

// Load environment variables
dotenv.config();

const app = express();

// Enhanced security middleware with production-ready CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:*", "http://127.0.0.1:*", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      fontSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'", "http://localhost:*", "http://127.0.0.1:*", "https:", "wss:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "same-origin" }
}));

// Disable HTTP caching for API responses to avoid 304 interfering with fetch
app.set('etag', false);
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Rate limiting - very generous for development
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 10000, // 10000 requests per minute for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Separate, more lenient rate limiter for product fetching
const productLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window  
  max: 5000, // 5000 product requests per minute
  message: 'Too many product requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
app.use('/api/products', productLimiter);

// CORS configuration (allow common local dev origins)
const defaultOrigins = [
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:5175',
  'http://127.0.0.1:5175',
  'http://localhost:5176',
  'http://127.0.0.1:5176',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];
const allowedOrigins = []
  .concat(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(url => url.trim()) : [])
  .concat(defaultOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin SSR)
    if (!origin) return callback(null, true);

    // Explicit allow-list
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Allow any localhost/127.0.0.1 port (e.g., Vite using 5174)
    const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;
    // Allow common LAN IPs (e.g., http://192.168.x.x:port)
    const lanRegex = /^http:\/\/192\.168\.\d+\.\d+(?::\d+)?$/;
    // Allow Vercel preview URLs
    const vercelRegex = /^https:\/\/sonic-mart.*\.vercel\.app$/;

    if (localhostRegex.test(origin) || lanRegex.test(origin) || vercelRegex.test(origin)) {
      return callback(null, true);
    }

    console.log(`🔒 CORS blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Additional CORS headers for problematic requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control, Pragma, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware with performance tracking
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Custom API request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();

  // Log the request start
  logger.info(`API Request: ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous'
  });

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - startTime;

    // Log API request completion
    logger.api(req.method, req.originalUrl || req.url, res.statusCode, duration, {
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id
    });

    // Log performance if slow
    if (duration > 2000) {
      logger.performance(`API ${req.method} ${req.originalUrl}`, duration, {
        statusCode: res.statusCode,
        userId: req.user?.id
      });
    }

    originalEnd.apply(this, args);
  };

  next();
});


// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve product images from myproject directory
app.use('/images', express.static(path.join(__dirname, '..', 'myproject', 'public', 'images')));

// Database connection with Atlas-optimized settings
const mongoOptions = {
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  w: 'majority'
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sounds-accessories', mongoOptions)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Please ensure MongoDB is running or configure a cloud database URI in .env');
    // Don't exit the process, just log the error
  });

// Base API endpoint - provide information about available endpoints
app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'Sounds Accessories API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      test: '/api/test',
      auth: '/api/auth/*',
      products: '/api/products',
      categories: '/api/products/categories',
      featured: '/api/products/featured/list',
      category: '/api/products/category/:category',
      cart: '/api/cart',
      orders: '/api/orders',
      users: '/api/users',
      admin: '/api/admin',
      footer: '/api/footer/*'
    },
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/user', require('./routes/users')); // Additional route for user dashboard
app.use('/api/products', require('./routes/products'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/comparison', require('./routes/comparison'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/footer', require('./routes/footer')); // Footer functionality (newsletter, contact)
app.use('/api/returns', require('./routes/returns')); // Returns and refunds functionality
app.use('/api/realtime', require('./routes/realtime')); // Real-time admin panel routes
app.use('/api/realtime', require('./routes/realtime')); // Real-time admin panel routes
app.use('/api/logs', require('./routes/logs')); // System logs management
app.use('/api/errors', require('./routes/errors')); // Frontend error logging

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Sounds Accessories API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend API is working correctly!',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      users: '/api/users',
      admin: '/api/admin'
    },
    note: 'Connect to MongoDB to use full functionality'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Comprehensive Sounds Accessories and Components API',
    version: '1.0.0',
    documentation: '/api/health'
  });
});



// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler with enhanced logging
app.use((error, req, res, next) => {
  // Enhanced error logging with context
  const errorContext = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous',
    stack: error.stack,
    body: req.body,
    params: req.params,
    query: req.query
  };

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    logger.warn('Invalid ObjectId provided', { ...errorContext, errorType: 'CastError' });
    return res.status(404).json({
      status: 'error',
      message: 'Resource not found'
    });
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(val => val.message);
    logger.warn('Validation error', { ...errorContext, errorType: 'ValidationError', validationErrors: messages });
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: messages
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    logger.warn('Duplicate key error', { ...errorContext, errorType: 'DuplicateKey', code: error.code });
    return res.status(400).json({
      status: 'error',
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    logger.security('Invalid JWT token provided', { ...errorContext, errorType: 'InvalidToken', severity: 'medium' });
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    logger.security('Expired JWT token used', { ...errorContext, errorType: 'ExpiredToken', severity: 'low' });
    return res.status(401).json({
      status: 'error',
      message: 'Token expired'
    });
  }

  // Rate limit errors
  if (error.status === 429) {
    logger.security('Rate limit exceeded', { ...errorContext, errorType: 'RateLimit', severity: 'medium' });
    return res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later'
    });
  }

  // All other errors
  logger.error('Unhandled server error', {
    ...errorContext,
    errorType: 'ServerError',
    errorName: error.name,
    critical: (error.statusCode || 500) >= 500
  });

  // Default error
  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket for real-time admin updates
initializeWebSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`📡 API URL: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket URL: ws://localhost:${PORT}/ws/admin`);
  console.log(`💾 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});