const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { 
  broadcast, 
  sendToUser, 
  sendToRole, 
  getConnectedClientsCount,
  getConnectedClientsByRole 
} = require('../controllers/realtimeController');

// @desc    Get WebSocket connection status
// @route   GET /api/realtime/status
// @access  Private/Admin
router.get('/status', protect, admin, async (req, res) => {
  try {
    const totalConnections = getConnectedClientsCount();
    const adminConnections = getConnectedClientsByRole('admin');
    const userConnections = getConnectedClientsByRole('user');

    res.json({
      success: true,
      data: {
        totalConnections,
        adminConnections,
        userConnections,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Realtime status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Broadcast message to all connected clients
// @route   POST /api/realtime/broadcast
// @access  Private/Admin
router.post('/broadcast', protect, admin, async (req, res) => {
  try {
    const { message, type = 'announcement' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const broadcastData = {
      type,
      message,
      timestamp: new Date().toISOString(),
      sender: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role
      }
    };

    broadcast(broadcastData);

    res.json({
      success: true,
      message: 'Message broadcasted successfully',
      data: broadcastData
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Send message to specific user
// @route   POST /api/realtime/send-to-user
// @access  Private/Admin
router.post('/send-to-user', protect, admin, async (req, res) => {
  try {
    const { userId, message, type = 'notification' } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        message: 'User ID and message are required'
      });
    }

    const messageData = {
      type,
      message,
      timestamp: new Date().toISOString(),
      sender: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role
      }
    };

    sendToUser(userId, messageData);

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: messageData
    });
  } catch (error) {
    console.error('Send to user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Send message to users with specific role
// @route   POST /api/realtime/send-to-role
// @access  Private/Admin
router.post('/send-to-role', protect, admin, async (req, res) => {
  try {
    const { role, message, type = 'notification' } = req.body;

    if (!role || !message) {
      return res.status(400).json({
        success: false,
        message: 'Role and message are required'
      });
    }

    const messageData = {
      type,
      message,
      timestamp: new Date().toISOString(),
      sender: {
        id: req.user.id,
        name: req.user.name,
        role: req.user.role
      }
    };

    sendToRole(role, messageData);

    res.json({
      success: true,
      message: `Message sent to all ${role}s successfully`,
      data: messageData
    });
  } catch (error) {
    console.error('Send to role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get realtime statistics
// @route   GET /api/realtime/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const stats = {
      connections: {
        total: getConnectedClientsCount(),
        admins: getConnectedClientsByRole('admin'),
        users: getConnectedClientsByRole('user')
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        platform: process.platform
      },
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Realtime stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;