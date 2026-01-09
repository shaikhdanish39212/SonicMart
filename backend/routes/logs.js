const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { protect, admin } = require('../middleware/auth');

const logsDir = path.join(__dirname, '..', 'logs');

// @desc    Get available log files
// @route   GET /api/logs
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const logFiles = fs.readdirSync(logsDir).filter(file => file.endsWith('.log'));
    
    const logInfo = logFiles.map(file => {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      
      return {
        name: file,
        size: stats.size,
        modified: stats.mtime,
        created: stats.ctime
      };
    });

    res.json({
      success: true,
      data: logInfo
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get specific log file content
// @route   GET /api/logs/:filename
// @access  Private/Admin
router.get('/:filename', protect, admin, async (req, res) => {
  try {
    const { filename } = req.params;
    const { lines = 100, search = '' } = req.query;
    
    // Validate filename to prevent directory traversal
    if (!filename.endsWith('.log') || filename.includes('..')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid log file name'
      });
    }

    const filePath = path.join(logsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Log file not found'
      });
    }

    const content = fs.readFileSync(filePath, 'utf8');
    let logLines = content.split('\n').filter(line => line.trim());

    // Filter by search term if provided
    if (search) {
      logLines = logLines.filter(line => 
        line.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Get last N lines
    const recentLines = logLines.slice(-parseInt(lines));

    res.json({
      success: true,
      data: {
        filename,
        lines: recentLines,
        totalLines: logLines.length,
        fileSize: fs.statSync(filePath).size
      }
    });
  } catch (error) {
    console.error('Get log file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Clear specific log file
// @route   DELETE /api/logs/:filename
// @access  Private/Admin
router.delete('/:filename', protect, admin, async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename
    if (!filename.endsWith('.log') || filename.includes('..')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid log file name'
      });
    }

    const filePath = path.join(logsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Log file not found'
      });
    }

    // Clear the file content instead of deleting it
    fs.writeFileSync(filePath, '');

    res.json({
      success: true,
      message: `Log file ${filename} cleared successfully`
    });
  } catch (error) {
    console.error('Clear log file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Download log file
// @route   GET /api/logs/:filename/download
// @access  Private/Admin
router.get('/:filename/download', protect, admin, async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Validate filename
    if (!filename.endsWith('.log') || filename.includes('..')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid log file name'
      });
    }

    const filePath = path.join(logsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Log file not found'
      });
    }

    res.download(filePath, filename);
  } catch (error) {
    console.error('Download log file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get log statistics
// @route   GET /api/logs/stats/summary
// @access  Private/Admin
router.get('/stats/summary', protect, admin, async (req, res) => {
  try {
    const logFiles = fs.readdirSync(logsDir).filter(file => file.endsWith('.log'));
    
    let totalSize = 0;
    let totalLines = 0;
    let errorCount = 0;
    let warnCount = 0;
    
    const fileStats = logFiles.map(file => {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim()).length;
      
      totalSize += stats.size;
      totalLines += lines;
      
      // Count error and warning lines
      const errors = (content.match(/\[ERROR\]/g) || []).length;
      const warnings = (content.match(/\[WARN\]/g) || []).length;
      
      errorCount += errors;
      warnCount += warnings;
      
      return {
        name: file,
        size: stats.size,
        lines,
        errors,
        warnings,
        modified: stats.mtime
      };
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalFiles: logFiles.length,
          totalSize,
          totalLines,
          totalErrors: errorCount,
          totalWarnings: warnCount
        },
        files: fileStats
      }
    });
  } catch (error) {
    console.error('Log stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;