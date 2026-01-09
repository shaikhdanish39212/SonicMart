const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Each user can have only one comparison list
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  maxItems: {
    type: Number,
    default: 4,
    min: 1,
    max: 10
  }
}, {
  timestamps: true
});

// Index for faster queries
comparisonSchema.index({ user: 1 });
comparisonSchema.index({ 'items.product': 1 });

// Virtual for item count
comparisonSchema.virtual('itemCount').get(function() {
  return this.items.length;
});

// Method to add product to comparison
comparisonSchema.methods.addProduct = function(productId) {
  const existingItem = this.items.find(item => item.product.toString() === productId.toString());
  
  if (existingItem) {
    throw new Error('Product is already in comparison list');
  }
  
  if (this.items.length >= this.maxItems) {
    throw new Error(`You can only compare up to ${this.maxItems} products`);
  }
  
  this.items.push({ product: productId });
  return this.save();
};

// Method to remove product from comparison
comparisonSchema.methods.removeProduct = function(productId) {
  this.items = this.items.filter(item => item.product.toString() !== productId.toString());
  return this.save();
};

// Method to clear all items
comparisonSchema.methods.clearAll = function() {
  this.items = [];
  return this.save();
};

// Static method to get or create comparison for user
comparisonSchema.statics.getOrCreateForUser = async function(userId) {
  let comparison = await this.findOne({ user: userId }).populate('items.product');
  
  if (!comparison) {
    comparison = new this({ user: userId, items: [] });
    await comparison.save();
    // Populate after save
    comparison = await this.findById(comparison._id).populate('items.product');
  }
  
  return comparison;
};

module.exports = mongoose.model('Comparison', comparisonSchema);