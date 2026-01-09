const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Current log level from environment (default to INFO)
const currentLogLevel = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

// Log file paths
const logFiles = {
  error: path.join(logsDir, 'error.log'),
  warn: path.join(logsDir, 'warn.log'),
  info: path.join(logsDir, 'info.log'),
  combined: path.join(logsDir, 'combined.log'),
  api: path.join(logsDir, 'api.log'),
  performance: path.join(logsDir, 'performance.log')
};

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 * @returns {string} Formatted log message
 */
const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}\n`;
};

/**
 * Write log to file
 * @param {string} filePath - Path to log file
 * @param {string} message - Formatted log message
 */
const writeToFile = (filePath, message) => {
  try {
    fs.appendFileSync(filePath, message);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
};

/**
 * Log a message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 */
const log = (level, message, meta = {}) => {
  const logLevel = LOG_LEVELS[level.toUpperCase()];
  
  // Check if we should log this level
  if (logLevel > currentLogLevel) {
    return;
  }

  const formattedMessage = formatMessage(level, message, meta);
  
  // Always write to combined log
  writeToFile(logFiles.combined, formattedMessage);
  
  // Write to specific level log
  if (logFiles[level.toLowerCase()]) {
    writeToFile(logFiles[level.toLowerCase()], formattedMessage);
  }
  
  // Console output for development
  if (process.env.NODE_ENV !== 'production') {
    const consoleMethod = level === 'ERROR' ? 'error' : 
                         level === 'WARN' ? 'warn' : 
                         level === 'DEBUG' ? 'debug' : 'log';
    console[consoleMethod](`[${level.toUpperCase()}] ${message}`, meta);
  }
};

/**
 * Logger object with convenience methods
 */
const logger = {
  error: (message, meta) => log('ERROR', message, meta),
  warn: (message, meta) => log('WARN', message, meta),
  info: (message, meta) => log('INFO', message, meta),
  debug: (message, meta) => log('DEBUG', message, meta),
  
  // API-specific logging
  api: (method, url, statusCode, responseTime, meta = {}) => {
    const apiMessage = `${method} ${url} - ${statusCode} - ${responseTime}ms`;
    const apiLog = formatMessage('API', apiMessage, meta);
    writeToFile(logFiles.api, apiLog);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API] ${apiMessage}`, meta);
    }
  },
  
  // Performance logging
  performance: (operation, duration, meta = {}) => {
    const perfMessage = `${operation} completed in ${duration}ms`;
    const perfLog = formatMessage('PERF', perfMessage, meta);
    writeToFile(logFiles.performance, perfLog);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[PERFORMANCE] ${perfMessage}`, meta);
    }
  },
  
  // Express middleware for API logging
  middleware: () => {
    return (req, res, next) => {
      const startTime = Date.now();
      
      // Override res.end to capture response
      const originalEnd = res.end;
      res.end = function(...args) {
        const responseTime = Date.now() - startTime;
        
        logger.api(
          req.method,
          req.originalUrl || req.url,
          res.statusCode,
          responseTime,
          {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            userId: req.user?.id,
            body: req.method === 'POST' || req.method === 'PUT' ? 
                  JSON.stringify(req.body).substring(0, 200) : undefined
          }
        );
        
        originalEnd.apply(this, args);
      };
      
      next();
    };
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { 
    message: error.message, 
    stack: error.stack 
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { 
    promise: promise.toString(),
    reason: reason.toString()
  });
});

module.exports = logger;