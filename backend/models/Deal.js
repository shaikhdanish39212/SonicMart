const mongoose = require('mongoose');

// Smart validation functions
const isValidText = (text, minWords = 1) => {
  if (!text || !text.trim()) return false;
  
  const cleanText = text.trim();
  
  // Must contain letters
  if (!/[a-zA-Z]/.test(cleanText)) return false;
  
  // Cannot be only numbers
  if (/^\d+$/.test(cleanText)) return false;
  
  // Cannot be random characters (more than 80% consonants)
  const consonantPattern = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g;
  const consonantCount = (cleanText.match(consonantPattern) || []).length;
  const consonantRatio = consonantCount / cleanText.replace(/\s/g, '').length;
  
  if (consonantRatio > 0.8 && cleanText.length > 10) return false;
  
  // Check word count
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  if (words.length < minWords) return false;
  
  // Check for meaningful words (at least 50% should be > 2 characters)
  const meaningfulWords = words.filter(word => word.length > 2);
  if (meaningfulWords.length / words.length < 0.5) return false;
  
  return true;
};

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Deal title is required'],
    trim: true,
    minlength: [5, 'Deal title must be at least 5 characters long'],
    maxlength: [100, 'Deal title cannot be more than 100 characters'],
    validate: {
      validator: function(v) {
        // Check for valid characters only (including currency symbols)
        if (!/^[a-zA-Z0-9\s\-\%\&\!\.\,\(\)\'\"₹$€£¥¢]+$/.test(v)) {
          return false;
        }
        
        // Check for meaningful content
        if (!isValidText(v, 2)) {
          return false;
        }
        
        // Check for repeated characters
        if (/(.)\1{4,}/.test(v)) {
          return false;
        }
        
        return true;
      },
      message: 'Deal title must contain meaningful words and valid characters only'
    }
  },
  description: {
    type: String,
    required: [true, 'Deal description is required'],
    trim: true,
    minlength: [15, 'Deal description must be at least 15 characters long'],
    maxlength: [500, 'Deal description cannot be more than 500 characters'],
    validate: {
      validator: function(v) {
        // Check for valid characters only (including currency symbols)
        if (!/^[a-zA-Z0-9\s\-\%\&\!\.\,\(\)\'\"₹$€£¥¢]+$/.test(v)) {
          return false;
        }
        
        // Check for meaningful content
        if (!isValidText(v, 3)) {
          return false;
        }
        
        // Check for repeated characters
        if (/(.)\1{4,}/.test(v)) {
          return false;
        }
        
        return true;
      },
      message: 'Deal description must contain meaningful content and valid characters only'
    }
  },
  type: {
    type: String,
    required: [true, 'Deal type is required'],
    enum: ['percentage', 'fixed', 'bogo', 'bundle'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [1, 'Discount value must be at least 1%'],
    max: [90, 'Discount value cannot exceed 90%'],
    validate: {
      validator: function(v) {
        // Check if it's a valid number
        if (isNaN(v)) return false;
        
        // Check decimal places (max 2)
        if (v % 1 !== 0 && v.toString().split('.')[1].length > 2) {
          return false;
        }
        
        return true;
      },
      message: 'Discount value must be a valid number with maximum 2 decimal places'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'guitars-basses',
      'keyboards-pianos', 
      'drums-percussion',
      'studio-equipment',
      'microphones',
      'speakers-monitors',
      'accessories',
      'all'
    ],
    default: 'all'
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  minimumOrderAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order amount cannot be negative']
  },
  maxUsage: {
    type: Number,
    default: null, // null means unlimited
    min: [1, 'Max usage must be at least 1']
  },
  usageCount: {
    type: Number,
    default: 0,
    min: [0, 'Usage count cannot be negative']
  },
  validFrom: {
    type: Date,
    required: [true, 'Valid from date is required'],
    validate: {
      validator: function(v) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return v >= today;
      },
      message: 'Start date cannot be in the past'
    }
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required'],
    validate: {
      validator: function(v) {
        // Check if end date is after start date
        if (this.validFrom && v <= this.validFrom) {
          return false;
        }
        
        // Check duration (1 day to 1 year)
        if (this.validFrom) {
          const duration = (v - this.validFrom) / (1000 * 60 * 60 * 24);
          if (duration < 1 || duration > 365) {
            return false;
          }
        }
        
        return true;
      },
      message: 'End date must be after start date and deal duration must be between 1 day and 1 year'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  bannerImage: {
    type: String,
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }],
  termsAndConditions: {
    type: String,
    maxlength: [1000, 'Terms and conditions cannot be more than 1000 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware for additional validation
dealSchema.pre('save', function(next) {
  console.log('🔍 Backend validation running for deal:', this.title);
  
  // Additional validation logic if needed
  if (this.validFrom && this.validUntil) {
    const duration = (this.validUntil - this.validFrom) / (1000 * 60 * 60 * 24);
    console.log(`📅 Deal duration: ${duration} days`);
    
    if (duration < 1) {
      return next(new Error('Deal must last at least 1 day'));
    }
    
    if (duration > 365) {
      return next(new Error('Deal cannot last more than 1 year'));
    }
  }
  
  console.log('✅ Backend validation passed');
  next();
});

// Pre-validate middleware
dealSchema.pre('validate', function(next) {
  console.log('🛡️ Running pre-validation checks for deal');
  
  // Log validation data
  console.log('Title:', `"${this.title}"`);
  console.log('Description:', `"${this.description}"`);
  console.log('Discount:', this.discountValue);
  console.log('Dates:', this.validFrom, 'to', this.validUntil);
  
  next();
});

// Virtual for checking if deal is currently valid
dealSchema.virtual('isCurrentlyValid').get(function() {
  const now = new Date();
  return this.isActive && 
         this.validFrom <= now && 
         this.validUntil >= now &&
         (this.maxUsage === null || this.usageCount < this.maxUsage);
});

// Virtual for days remaining
dealSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const validUntil = new Date(this.validUntil);
  const diffTime = validUntil - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Index for performance
dealSchema.index({ category: 1, isActive: 1 });
dealSchema.index({ validFrom: 1, validUntil: 1 });
dealSchema.index({ featured: 1, isActive: 1 });

// Middleware to validate dates
dealSchema.pre('save', function(next) {
  if (this.validUntil <= this.validFrom) {
    next(new Error('Valid until date must be after valid from date'));
  }
  next();
});

// Static method to find active deals
dealSchema.statics.findActiveDeal = function(category = null) {
  const now = new Date();
  const query = {
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
    $or: [
      { maxUsage: null },
      { $expr: { $lt: ['$usageCount', '$maxUsage'] } }
    ]
  };

  if (category && category !== 'all') {
    query.category = { $in: [category, 'all'] };
  }

  return this.find(query).sort({ featured: -1, createdAt: -1 });
};

// Static method to find featured deals
dealSchema.statics.findFeaturedDeals = function(limit = 5) {
  const now = new Date();
  return this.find({
    isActive: true,
    featured: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
    $or: [
      { maxUsage: null },
      { $expr: { $lt: ['$usageCount', '$maxUsage'] } }
    ]
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

// Method to apply deal to order
dealSchema.methods.applyToOrder = function(orderAmount, products = []) {
  if (!this.isCurrentlyValid) {
    throw new Error('Deal is not currently valid');
  }

  if (orderAmount < this.minimumOrderAmount) {
    throw new Error(`Minimum order amount of ₹${this.minimumOrderAmount} required`);
  }

  let discount = 0;

  switch (this.type) {
    case 'percentage':
      discount = (orderAmount * this.discountValue) / 100;
      break;
    case 'fixed':
      discount = Math.min(this.discountValue, orderAmount);
      break;
    case 'bogo':
      // Buy one get one logic would need product-specific implementation
      discount = 0; // Placeholder
      break;
    case 'bundle':
      // Bundle deal logic would need product-specific implementation
      discount = 0; // Placeholder
      break;
    default:
      discount = 0;
  }

  return {
    discount: Math.round(discount * 100) / 100,
    finalAmount: Math.max(0, orderAmount - discount),
    dealApplied: this._id
  };
};

module.exports = mongoose.model('Deal', dealSchema);