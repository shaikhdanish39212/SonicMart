const logger = require('../utils/logger');

/**
 * Centralized error handling middleware for Express
 */

// Custom error class for API errors
class APIError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation error class
class ValidationError extends APIError {
  constructor(errors) {
    super('Validation failed', 400);
    this.errors = errors;
    this.type = 'ValidationError';
  }
}

// Authentication error class
class AuthenticationError extends APIError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.type = 'AuthenticationError';
  }
}

// Authorization error class
class AuthorizationError extends APIError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.type = 'AuthorizationError';
  }
}

// Not found error class
class NotFoundError extends APIError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.type = 'NotFoundError';
  }
}

// Rate limit error class
class RateLimitError extends APIError {
  constructor(message = 'Too many requests') {
    super(message, 429);
    this.type = 'RateLimitError';
  }
}

/**
 * Error handler for different types of errors
 */
const handleCastError = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new APIError(message, 400);
};

const handleDuplicateFieldsError = (error) => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new APIError(message, 400);
};

const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(el => el.message);
  return new ValidationError(errors);
};

const handleJWTError = () => {
  return new AuthenticationError('Invalid token. Please log in again!');
};

const handleJWTExpiredError = () => {
  return new AuthenticationError('Your token has expired! Please log in again.');
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: 'error',
    statusCode: err.statusCode,
    message: err.message,
    error: err,
    stack: err.stack,
    timestamp: err.timestamp || new Date().toISOString()
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    const response = {
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
      timestamp: err.timestamp || new Date().toISOString()
    };

    // Add validation errors if present
    if (err.errors) {
      response.errors = err.errors;
    }

    res.status(err.statusCode).json(response);
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('UNKNOWN ERROR:', err);
    
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Something went wrong!',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Global error handling middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error details
  logger.error('Error occurred:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    timestamp: new Date().toISOString()
  });

  let error = { ...err };
  error.message = err.message;

  // Handle specific error types
  if (err.name === 'CastError') error = handleCastError(error);
  if (err.code === 11000) error = handleDuplicateFieldsError(error);
  if (err.name === 'ValidationError') error = handleValidationError(error);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Send appropriate error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Async error wrapper - catches async errors and passes to error handler
 */
const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Handle 404 errors
 */
const notFoundHandler = (req, res, next) => {
  const err = new NotFoundError(`Route ${req.originalUrl}`);
  next(err);
};

/**
 * Unhandled rejection handler
 */
const unhandledRejectionHandler = () => {
  process.on('unhandledRejection', (err, promise) => {
    logger.error('UNHANDLED PROMISE REJECTION! Shutting down...', {
      message: err.message,
      stack: err.stack,
      promise: promise.toString()
    });
    
    process.exit(1);
  });
};

/**
 * Uncaught exception handler
 */
const uncaughtExceptionHandler = () => {
  process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! Shutting down...', {
      message: err.message,
      stack: err.stack
    });
    
    process.exit(1);
  });
};

/**
 * Graceful shutdown handler
 */
const gracefulShutdownHandler = (server) => {
  process.on('SIGTERM', () => {
    logger.info('SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      logger.info('Process terminated!');
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT RECEIVED. Shutting down gracefully');
    server.close(() => {
      logger.info('Process terminated!');
    });
  });
};

module.exports = {
  APIError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
  globalErrorHandler,
  asyncErrorHandler,
  notFoundHandler,
  unhandledRejectionHandler,
  uncaughtExceptionHandler,
  gracefulShutdownHandler
};