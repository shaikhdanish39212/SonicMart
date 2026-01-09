const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Newsletter = require('../models/Newsletter');
const Contact = require('../models/Contact');

// @desc    Subscribe to newsletter
// @route   POST /api/footer/newsletter
// @access  Public
router.post('/newsletter', [
  body('email').isEmail().withMessage('Please provide a valid email address')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, source = 'footer', preferences = {} } = req.body;

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return res.status(400).json({
          success: false,
          message: 'Email is already subscribed to our newsletter'
        });
      } else {
        // Reactivate if previously unsubscribed
        existingSubscriber.status = 'active';
        existingSubscriber.unsubscribedAt = undefined;
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.source = source;
        existingSubscriber.preferences = { ...existingSubscriber.preferences, ...preferences };
        await existingSubscriber.save();
        
        return res.json({
          success: true,
          message: 'Welcome back! You have been resubscribed to our newsletter'
        });
      }
    }

    // Create new subscription
    const newsletter = new Newsletter({
      email: email.toLowerCase(),
      source,
      preferences: {
        marketing: preferences.marketing !== false,
        productUpdates: preferences.productUpdates !== false,
        deals: preferences.deals !== false,
        ...preferences
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await newsletter.save();
    console.log('Newsletter subscription saved:', email);

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter! Thank you for joining SonicMart.'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email is already subscribed to our newsletter'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @desc    Submit contact form
// @route   POST /api/footer/contact
// @access  Public
router.post('/contact', [
  body('name').notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('subject').notEmpty().trim().isLength({ min: 1, max: 200 }).withMessage('Subject is required and must be less than 200 characters'),
  body('message').notEmpty().trim().isLength({ min: 1, max: 2000 }).withMessage('Message is required and must be less than 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, subject, message, category = 'general' } = req.body;

    // Create new contact entry
    const contact = new Contact({
      name: name.trim(),
      email: email.toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      category,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await contact.save();
    console.log('Contact form saved:', { name, email, subject });

    res.json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you within 24 hours.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @desc    Get footer links/info
// @route   GET /api/footer/info
// @access  Public
router.get('/info', async (req, res) => {
  try {
    const footerInfo = {
      companyInfo: {
        name: 'Sounds Accessories',
        address: '123 Music Street, Audio City, AC 12345',
        phone: '+1 (555) 123-4567',
        email: 'info@soundsaccessories.com'
      },
      socialLinks: {
        facebook: 'https://facebook.com/soundsaccessories',
        twitter: 'https://twitter.com/soundsaccessories',
        instagram: 'https://instagram.com/soundsaccessories',
        youtube: 'https://youtube.com/soundsaccessories'
      },
      quickLinks: [
        { name: 'About Us', url: '/about' },
        { name: 'Contact', url: '/contact' },
        { name: 'Privacy Policy', url: '/privacy' },
        { name: 'Terms of Service', url: '/terms' },
        { name: 'Return Policy', url: '/returns' },
        { name: 'Shipping Info', url: '/shipping' }
      ],
      categories: [
        { name: 'Guitars & Basses', url: '/category/guitars-basses' },
        { name: 'Keyboards & Pianos', url: '/category/keyboards-pianos' },
        { name: 'Drums & Percussion', url: '/category/drums-percussion' },
        { name: 'Studio Equipment', url: '/category/studio-equipment' },
        { name: 'Microphones', url: '/category/microphones' },
        { name: 'Speakers & Monitors', url: '/category/speakers-monitors' }
      ]
    };

    res.json({
      success: true,
      data: footerInfo
    });
  } catch (error) {
    console.error('Footer info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;