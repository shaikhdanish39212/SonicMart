const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

let wss = null;
const connectedClients = new Map();

/**
 * Initialize WebSocket server
 * @param {http.Server} server - HTTP server instance
 */
const initializeWebSocket = (server) => {
  try {
    wss = new WebSocket.Server({ 
      server,
      path: '/ws'
    });

    wss.on('connection', async (ws, req) => {
      logger.info('New WebSocket connection attempt');

      try {
        // Extract token from query parameters or headers
        const url = new URL(req.url, `http://${req.headers.host}`);
        const token = url.searchParams.get('token') || req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
          ws.close(1008, 'Authentication required');
          return;
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
          ws.close(1008, 'Invalid user');
          return;
        }

        // Store connection info
        const clientInfo = {
          ws,
          userId: user._id.toString(),
          userRole: user.role,
          connectedAt: new Date()
        };

        connectedClients.set(ws, clientInfo);

        logger.info(`WebSocket connection established for user: ${user.email}`);

        // Send welcome message
        ws.send(JSON.stringify({
          type: 'connection',
          message: 'Connected successfully',
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }));

        // Handle incoming messages
        ws.on('message', async (message) => {
          try {
            const data = JSON.parse(message);
            await handleWebSocketMessage(ws, data, clientInfo);
          } catch (error) {
            logger.error('Error handling WebSocket message:', error);
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Invalid message format'
            }));
          }
        });

        // Handle connection close
        ws.on('close', () => {
          connectedClients.delete(ws);
          logger.info(`WebSocket connection closed for user: ${user.email}`);
        });

        // Handle errors
        ws.on('error', (error) => {
          logger.error('WebSocket error:', error);
          connectedClients.delete(ws);
        });

      } catch (error) {
        logger.error('WebSocket authentication error:', error);
        ws.close(1008, 'Authentication failed');
      }
    });

    logger.info('WebSocket server initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize WebSocket server:', error);
  }
};

/**
 * Handle incoming WebSocket messages
 * @param {WebSocket} ws - WebSocket connection
 * @param {Object} data - Message data
 * @param {Object} clientInfo - Client information
 */
const handleWebSocketMessage = async (ws, data, clientInfo) => {
  const { type, payload } = data;

  switch (type) {
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      break;

    case 'subscribe':
      // Handle subscription to specific events
      handleSubscription(ws, payload, clientInfo);
      break;

    case 'unsubscribe':
      // Handle unsubscription from events
      handleUnsubscription(ws, payload, clientInfo);
      break;

    default:
      ws.send(JSON.stringify({
        type: 'error',
        message: `Unknown message type: ${type}`
      }));
  }
};

/**
 * Handle subscription requests
 * @param {WebSocket} ws - WebSocket connection
 * @param {Object} payload - Subscription payload
 * @param {Object} clientInfo - Client information
 */
const handleSubscription = (ws, payload, clientInfo) => {
  const { channel } = payload;

  if (!clientInfo.subscriptions) {
    clientInfo.subscriptions = new Set();
  }

  clientInfo.subscriptions.add(channel);

  ws.send(JSON.stringify({
    type: 'subscribed',
    channel: channel,
    message: `Subscribed to ${channel}`
  }));

  logger.info(`User ${clientInfo.userId} subscribed to ${channel}`);
};

/**
 * Handle unsubscription requests
 * @param {WebSocket} ws - WebSocket connection
 * @param {Object} payload - Unsubscription payload
 * @param {Object} clientInfo - Client information
 */
const handleUnsubscription = (ws, payload, clientInfo) => {
  const { channel } = payload;

  if (clientInfo.subscriptions) {
    clientInfo.subscriptions.delete(channel);
  }

  ws.send(JSON.stringify({
    type: 'unsubscribed',
    channel: channel,
    message: `Unsubscribed from ${channel}`
  }));

  logger.info(`User ${clientInfo.userId} unsubscribed from ${channel}`);
};

/**
 * Broadcast message to all connected clients
 * @param {Object} message - Message to broadcast
 * @param {Function} filter - Optional filter function for clients
 */
const broadcast = (message, filter = null) => {
  if (!wss) return;

  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      const clientInfo = connectedClients.get(ws);
      
      if (!filter || filter(clientInfo)) {
        ws.send(JSON.stringify(message));
      }
    }
  });
};

/**
 * Send message to specific user
 * @param {string} userId - Target user ID
 * @param {Object} message - Message to send
 */
const sendToUser = (userId, message) => {
  if (!wss) return;

  connectedClients.forEach((clientInfo, ws) => {
    if (clientInfo.userId === userId && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
};

/**
 * Send message to users with specific role
 * @param {string} role - Target role
 * @param {Object} message - Message to send
 */
const sendToRole = (role, message) => {
  broadcast(message, (clientInfo) => clientInfo.userRole === role);
};

/**
 * Send message to subscribed users
 * @param {string} channel - Channel name
 * @param {Object} message - Message to send
 */
const sendToChannel = (channel, message) => {
  broadcast(message, (clientInfo) => 
    clientInfo.subscriptions && clientInfo.subscriptions.has(channel)
  );
};

/**
 * Get connected clients count
 * @returns {number} Number of connected clients
 */
const getConnectedClientsCount = () => {
  return connectedClients.size;
};

/**
 * Get connected clients by role
 * @param {string} role - User role
 * @returns {number} Number of connected clients with specified role
 */
const getConnectedClientsByRole = (role) => {
  let count = 0;
  connectedClients.forEach((clientInfo) => {
    if (clientInfo.userRole === role) {
      count++;
    }
  });
  return count;
};

// Notification helpers for common events
const notifyOrderCreated = (order) => {
  sendToRole('admin', {
    type: 'notification',
    category: 'order',
    message: `New order #${order.orderNumber || order._id.slice(-6)} received`,
    data: order
  });
};

const notifyUserRegistered = (user) => {
  sendToRole('admin', {
    type: 'notification',
    category: 'user',
    message: `New user registered: ${user.name}`,
    data: { userId: user._id, name: user.name, email: user.email }
  });
};

const notifyLowStock = (product) => {
  sendToRole('admin', {
    type: 'notification',
    category: 'inventory',
    message: `Low stock alert for ${product.name}`,
    data: { productId: product._id, name: product.name, stock: product.stock }
  });
};

const notifyPaymentStatus = (userId, payment) => {
  sendToUser(userId, {
    type: 'notification',
    category: 'payment',
    message: `Payment ${payment.status}`,
    data: payment
  });
};

module.exports = {
  initializeWebSocket,
  broadcast,
  sendToUser,
  sendToRole,
  sendToChannel,
  getConnectedClientsCount,
  getConnectedClientsByRole,
  notifyOrderCreated,
  notifyUserRegistered,
  notifyLowStock,
  notifyPaymentStatus
};