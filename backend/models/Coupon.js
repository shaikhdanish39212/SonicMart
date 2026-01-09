const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  // Keep backwards compatibility
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  minOrderAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscountAmount: {
    type: Number,
    default: null
  },
  maxUsage: {
    type: Number,
    default: null // null means unlimited
  },
  usageCount: {
    type: Number,
    default: 0
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderAmount: Number,
    discountApplied: Number
  }],
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true,
  },
  // Keep backwards compatibility
  expiryDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCategories: [{
    type: String
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Pre-save middleware to handle backwards compatibility
couponSchema.pre('save', function(next) {
  // Sync discountPercentage with discountValue for backwards compatibility
  if (this.discountPercentage && !this.discountValue) {
    this.discountValue = this.discountPercentage;
    this.discountType = 'percentage';
  }
  
  // Sync expiryDate with validUntil for backwards compatibility
  if (this.expiryDate && !this.validUntil) {
    this.validUntil = this.expiryDate;
  }
  
  next();
});

// Instance method to check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  
  if (!this.isActive) {
    return { valid: false, reason: 'Coupon is not active' };
  }
  
  if (this.validFrom && this.validFrom > now) {
    return { valid: false, reason: 'Coupon is not yet valid' };
  }
  
  if (this.validUntil < now) {
    return { valid: false, reason: 'Coupon has expired' };
  }
  
  if (this.maxUsage && this.usageCount >= this.maxUsage) {
    return { valid: false, reason: 'Coupon usage limit reached' };
  }
  
  return { valid: true };
};

// Instance method to check if user can use this coupon
couponSchema.methods.canUserUse = function(userId) {
  // Check if user has already used this coupon
  const userUsage = this.usedBy.find(usage => 
    usage.user.toString() === userId.toString()
  );
  
  return !userUsage; // Return false if user has already used it
};

// Instance method to calculate discount
couponSchema.methods.calculateDiscount = function(orderAmount) {
  console.log('=== CALCULATE DISCOUNT DEBUG ===');
  console.log('Order Amount:', orderAmount);
  console.log('Min Order Amount:', this.minOrderAmount);
  console.log('Discount Type:', this.discountType);
  console.log('Discount Value:', this.discountValue);
  
  const validation = this.isValid();
  if (!validation.valid) {
    console.log('Coupon validation failed:', validation);
    return validation;
  }
  
  if (orderAmount < this.minOrderAmount) {
    const errorResult = { 
      valid: false, 
      reason: `Minimum order amount of ₹${this.minOrderAmount} required` 
    };
    console.log('Order amount check failed:', errorResult);
    return errorResult;
  }
  
  let discountAmount = 0;
  
  if (this.discountType === 'percentage') {
    discountAmount = (orderAmount * this.discountValue) / 100;
  } else {
    discountAmount = this.discountValue;
  }
  
  // Apply maximum discount limit if set
  if (this.maxDiscountAmount && discountAmount > this.maxDiscountAmount) {
    discountAmount = this.maxDiscountAmount;
  }
  
  const result = {
    valid: true,
    discountAmount: Math.round(discountAmount * 100) / 100
  };
  
  console.log('Final discount result:', result);
  console.log('=== END CALCULATE DISCOUNT DEBUG ===');
  
  return result;
};

// Instance method to use coupon
couponSchema.methods.useCoupon = function(userId, orderAmount, discountApplied) {
  this.usageCount += 1;
  this.usedBy.push({
    user: userId,
    orderAmount,
    discountApplied
  });
  
  return this.save();
};

// Static method to find active coupons
couponSchema.statics.findActiveCoupons = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now },
    $or: [
      { maxUsage: null },
      { $expr: { $lt: ['$usageCount', '$maxUsage'] } }
    ]
  });
};

module.exports = mongoose.model('Coupon', couponSchema);