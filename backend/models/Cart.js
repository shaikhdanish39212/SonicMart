const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1'],
    max: [10, 'Maximum 10 items allowed per product']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  appliedCoupon: {
    code: String,
    discount: Number,
    discountAmount: Number
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  this.lastModified = Date.now();
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity, price) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
    if (existingItem.quantity > 10) {
      throw new Error('Maximum 10 items allowed per product');
    }
  } else {
    this.items.push({
      product: productId,
      quantity: quantity,
      price: price
    });
  }
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.product.toString() !== productId.toString()
  );
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      this.removeItem(productId);
    } else if (quantity > 10) {
      throw new Error('Maximum 10 items allowed per product');
    } else {
      item.quantity = quantity;
    }
  }
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.appliedCoupon = undefined;
};

// Method to apply coupon
cartSchema.methods.applyCoupon = function(couponCode, discount, discountAmount) {
  this.appliedCoupon = {
    code: couponCode,
    discount: discount,
    discountAmount: discountAmount
  };
};

// Method to remove coupon
cartSchema.methods.removeCoupon = function() {
  this.appliedCoupon = undefined;
};

// Virtual for final total after discount
cartSchema.virtual('finalTotal').get(function() {
  if (this.appliedCoupon && this.appliedCoupon.discountAmount) {
    return Math.max(0, this.totalPrice - this.appliedCoupon.discountAmount);
  }
  return this.totalPrice;
});

// Ensure virtual fields are serialized
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);
