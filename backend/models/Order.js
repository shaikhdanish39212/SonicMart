const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  sku: {
    type: String,
    required: true
  }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: 'India'
  },
  phone: {
    type: String,
    required: true
  }
});

const paymentResultSchema = new mongoose.Schema({
  id: String,
  status: String,
  update_time: String,
  email_address: String,
  razorpay_payment_id: String,
  razorpay_order_id: String,
  razorpay_signature: String
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'razorpay', 'paypal', 'cod', 'upi']
  },
  paymentResult: paymentResultSchema,
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
    min: 0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
    min: 0
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0.0,
    min: 0
  },
  couponCode: {
    type: String,
    uppercase: true
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  orderNumber: {
    type: String,
    unique: true
    // Not required initially - will be set by pre-save middleware
  },
  trackingNumber: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  },
  cancelReason: {
    type: String
  },
  returnReason: {
    type: String
  },
  refundAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'processed', 'failed'],
    default: 'none'
  },
  notes: [{
    message: {
      type: String,
      required: true
    },
    addedBy: {
      type: String,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ isDelivered: 1 });

// Utility function to generate user-friendly order number
async function generateOrderNumber() {
  const currentYear = new Date().getFullYear();
  
  // Use atomic findOneAndUpdate to ensure unique sequential numbers
  const lastOrder = await mongoose.model('Order').findOne(
    { orderNumber: { $regex: `^SA-${currentYear}-` } },
    { orderNumber: 1 }
  ).sort({ orderNumber: -1 });

  let sequentialNumber = 1;
  if (lastOrder && lastOrder.orderNumber) {
    // Extract the number from the last order number (e.g., "SA-2025-000016" -> 16)
    const lastNumber = parseInt(lastOrder.orderNumber.split('-')[2]);
    sequentialNumber = lastNumber + 1;
  }

  // Generate unique number with timestamp fallback to prevent duplicates
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const finalNumber = String(sequentialNumber).padStart(6, '0');
  
  // Check if this number already exists, if so, use timestamp-based number
  const existingOrder = await mongoose.model('Order').findOne({ orderNumber: `SA-${currentYear}-${finalNumber}` });
  if (existingOrder) {
    return `SA-${currentYear}-${timestamp}`;
  }
  
  return `SA-${currentYear}-${finalNumber}`;
}

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    this.orderNumber = await generateOrderNumber();
  }
  next();
});

// Virtual for order total items count
orderSchema.virtual('totalItems').get(function() {
  return this.orderItems ? this.orderItems.reduce((total, item) => total + item.quantity, 0) : 0;
});

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  const now = new Date();
  const orderDate = this.createdAt;
  const diffTime = Math.abs(now - orderDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to calculate total price
orderSchema.methods.calculateTotalPrice = function() {
  this.itemsPrice = this.orderItems.reduce((total, item) => 
    total + (item.price * item.quantity), 0
  );
  
  this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice - this.discountAmount;
  return this.totalPrice;
};

// Method to update order status
orderSchema.methods.updateStatus = function(status, note) {
  this.orderStatus = status;
  
  if (status === 'delivered') {
    this.isDelivered = true;
    this.deliveredAt = new Date();
  }
  
  if (note) {
    this.notes.push({
      message: note,
      addedBy: 'system'
    });
  }
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ orderStatus: status });
};

// Static method to find recent orders
orderSchema.statics.findRecent = function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return this.find({ createdAt: { $gte: startDate } });
};

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);