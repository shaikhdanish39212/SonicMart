const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: [true, 'Order number is required'],
    trim: true,
    uppercase: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  reason: {
    type: String,
    required: [true, 'Return reason is required'],
    enum: [
      'defective',
      'wrong-item',
      'not-as-described',
      'changed-mind',
      'damaged-shipping',
      'compatibility-issues',
      'poor-quality',
      'other'
    ]
  },
  reasonText: {
    type: String,
    trim: true,
    maxlength: [50, 'Reason text cannot exceed 50 characters']
  },
  comments: {
    type: String,
    trim: true,
    maxlength: [1000, 'Comments cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processing', 'completed'],
    default: 'pending'
  },
  returnType: {
    type: String,
    enum: ['refund', 'exchange', 'repair'],
    default: 'refund'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  processedDate: {
    type: Date
  },
  processedBy: {
    type: String
  },
  refundAmount: {
    type: Number,
    min: 0
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  adminNotes: [{
    note: String,
    addedBy: String,
    addedAt: { type: Date, default: Date.now }
  }],
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  images: [{
    url: String,
    description: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes
returnSchema.index({ orderNumber: 1 });
returnSchema.index({ email: 1 });
returnSchema.index({ status: 1 });
returnSchema.index({ requestDate: -1 });

// Instance methods
returnSchema.methods.approve = function(processedBy, refundAmount) {
  this.status = 'approved';
  this.processedDate = new Date();
  this.processedBy = processedBy;
  if (refundAmount) this.refundAmount = refundAmount;
  return this.save();
};

returnSchema.methods.reject = function(processedBy, reason) {
  this.status = 'rejected';
  this.processedDate = new Date();
  this.processedBy = processedBy;
  this.adminNotes.push({
    note: `Return rejected: ${reason}`,
    addedBy: processedBy
  });
  return this.save();
};

returnSchema.methods.addNote = function(note, addedBy) {
  this.adminNotes.push({
    note,
    addedBy,
    addedAt: new Date()
  });
  return this.save();
};

// Static methods
returnSchema.statics.getPendingReturns = function() {
  return this.find({ status: 'pending' }).sort({ requestDate: -1 });
};

returnSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ requestDate: -1 });
};

returnSchema.statics.getByOrderNumber = function(orderNumber) {
  return this.find({ orderNumber: orderNumber.toUpperCase() });
};

module.exports = mongoose.model('Return', returnSchema);