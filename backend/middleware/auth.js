const jwt = require('jsonwebtoken');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

// Enhanced rate limiting for admin routes
const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs for admin routes
  message: {
    status: 'error',
    message: 'Too many admin requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Session tracking for enhanced security
const activeSessions = new Map();

// Generate session ID
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Clean expired sessions
const cleanExpiredSessions = () => {
  const now = Date.now();
  for (const [sessionId, session] of activeSessions.entries()) {
    if (session.expiresAt < now) {
      activeSessions.delete(sessionId);
    }
  }
};

// Clean sessions every hour
setInterval(cleanExpiredSessions, 60 * 60 * 1000);

// Enhanced protect middleware with session tracking
const protect = async (req, res, next) => {
  try {
    let token;
    let sessionId;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Check for session ID in headers
    if (req.headers['x-session-id']) {
      sessionId = req.headers['x-session-id'];
    }

    if (!token) {
      console.error('Authorization Error: NO_TOKEN', {
        status: 'error',
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      
      // Get user from token with additional fields
      const user = await User.findById(decoded.id).select('+lastLogin');
      if (!user) {
        console.error('Authorization Error: USER_NOT_FOUND', {
          status: 'error',
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
        return res.status(401).json({
          status: 'error',
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        console.error('Authorization Error: ACCOUNT_DEACTIVATED', {
          status: 'error',
          message: 'Account is deactivated',
          code: 'ACCOUNT_DEACTIVATED'
        });
        return res.status(401).json({
          status: 'error',
          message: 'Account is deactivated',
          code: 'ACCOUNT_DEACTIVATED'
        });
      }

      // Enhanced security for admin users
      if (user.role === 'admin') {
        const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
        
        // Validate session for admin users
        if (sessionId && activeSessions.has(sessionId)) {
          const session = activeSessions.get(sessionId);
          
          // Check if session is expired
          if (session.expiresAt < Date.now()) {
            activeSessions.delete(sessionId);
            console.error('Authorization Error: SESSION_EXPIRED', {
              status: 'error',
              message: 'Session expired',
              code: 'SESSION_EXPIRED'
            });
            return res.status(401).json({
              status: 'error',
              message: 'Session expired',
              code: 'SESSION_EXPIRED'
            });
          }
          
          // Check IP consistency for admin sessions
          if (session.ip !== clientIP) {
            activeSessions.delete(sessionId);
            console.error('Authorization Error: IP_MISMATCH', {
              status: 'error',
              message: 'Session security violation detected',
              code: 'IP_MISMATCH'
            });
            return res.status(401).json({
              status: 'error',
              message: 'Session security violation detected',
              code: 'IP_MISMATCH'
            });
          }
          
          // Update session activity
          session.lastActivity = Date.now();
        } else if (sessionId) {
          // Invalid session ID provided
          console.error('Authorization Error: INVALID_SESSION', {
            status: 'error',
            message: 'Invalid session',
            code: 'INVALID_SESSION'
          });
          return res.status(401).json({
            status: 'error',
            message: 'Invalid session',
            code: 'INVALID_SESSION'
          });
        }
      }

      // Update last login time
      if (Date.now() - user.lastLogin > 5 * 60 * 1000) { // Update if last login was more than 5 minutes ago
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });
      }

      // Add user and session info to request object
      req.user = user;
      req.sessionId = sessionId;
      req.clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
      
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.error('Authorization Error: TOKEN_EXPIRED', {
          status: 'error',
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
        return res.status(401).json({
          status: 'error',
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      console.error('Authorization Error: INVALID_TOKEN', {
        status: 'error',
        message: 'Invalid or malformed token',
        code: 'INVALID_TOKEN'
      });
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or malformed token',
        code: 'INVALID_TOKEN'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error in authentication',
      code: 'SERVER_ERROR'
    });
  }
};

// Enhanced admin middleware with session management
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    // Create or update admin session
    if (!req.sessionId) {
      const newSessionId = generateSessionId();
      const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      
      activeSessions.set(newSessionId, {
        userId: req.user._id.toString(),
        ip: req.clientIP,
        userAgent: req.headers['user-agent'] || 'Unknown',
        createdAt: Date.now(),
        lastActivity: Date.now(),
        expiresAt: expiresAt
      });
      
      // Send session ID in response header
      res.setHeader('X-Session-ID', newSessionId);
      req.sessionId = newSessionId;
    }
    
    // Log admin access for security audit
    console.log(`Admin access: ${req.user.email} from ${req.clientIP} at ${new Date().toISOString()}`);
    
    next();
  } else {
    res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin privileges required.',
      code: 'INSUFFICIENT_PRIVILEGES'
    });
  }
};

// Admin session cleanup endpoint
const adminLogout = (req, res, next) => {
  if (req.sessionId && activeSessions.has(req.sessionId)) {
    activeSessions.delete(req.sessionId);
  }
  next();
};

// Get active admin sessions (for monitoring)
const getActiveSessions = (req, res) => {
  if (req.user && req.user.role === 'admin') {
    const sessions = Array.from(activeSessions.entries()).map(([id, session]) => ({
      id,
      userId: session.userId,
      ip: session.ip,
      userAgent: session.userAgent,
      createdAt: new Date(session.createdAt),
      lastActivity: new Date(session.lastActivity),
      expiresAt: new Date(session.expiresAt)
    }));
    
    res.json({
      status: 'success',
      data: {
        totalSessions: sessions.length,
        sessions
      }
    });
  } else {
    res.status(403).json({
      status: 'error',
      message: 'Access denied'
    });
  }
};

// Optional authentication - doesn't require login but checks if user is logged in
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        
        // Get user from token
        const user = await User.findById(decoded.id);
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but we continue without user
        console.log('Optional auth: Invalid token');
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue without authentication
  }
};

module.exports = {
  protect,
  admin,
  optionalAuth,
  adminRateLimit,
  adminLogout,
  getActiveSessions,
  activeSessions // Export for testing/monitoring
};
