const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: [
        'headphones',
        'earbuds',
        'earphones',
        'speakers',
        'microphones',
        'neckband-earphones',
        'dj-speakers',
        'loud-speakers',
        'home-theater',
        'guitars-basses',
        'keyboards-pianos',
        'drums-percussion',
        'studio-equipment',
        // Internal component categories
        'internal-components',
        'acoustic-elements',
        'audio-amplifiers',
        'audio-circuits',
        'connectors-cables',
        'control-interfaces',
        'mechanical-parts',
        'speaker-drivers'
      ],
      message: 'Please select a valid category'
    }
  },
  subcategory: {
    type: String,
    maxlength: [50, 'Subcategory cannot exceed 50 characters']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    maxlength: [50, 'Brand name cannot exceed 50 characters']
  },
  model: {
    type: String,
    maxlength: [50, 'Model cannot exceed 50 characters']
  },
  image: {
    type: String,
    required: [true, 'Main product image is required']
  },
  galleryImages: [{
    type: String
  }],
  images: [{
    type: String
  }],
  specifications: {
    frequency: String,
    impedance: String,
    sensitivity: String,
    driverSize: String,
    connectivity: [String], // Bluetooth, Wired, USB, etc.
    batteryLife: String,
    chargingTime: String,
    weight: String,
    dimensions: String,
    warranty: String,
    color: [String],
    material: String
  },
  features: [{
    type: String,
    maxlength: [100, 'Feature cannot exceed 100 characters']
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Low stock threshold cannot be negative']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true
  },
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  salesCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  dealName: {
    type: String,
    trim: true,
    maxlength: [50, 'Deal name cannot exceed 50 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

// Virtual for calculating discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out-of-stock';
  if (this.stock <= this.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

// Pre-save middleware to update lastUpdated
productSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  
  // Calculate original price if discount is provided
  if (this.discount > 0 && !this.originalPrice) {
    this.originalPrice = this.price;
    this.price = this.price * (1 - this.discount / 100);
  }
  
  next();
});

// Method to calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
    return;
  }
  
  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
  this.totalReviews = this.reviews.length;
};

// Static method to find active products
productSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Static method to find featured products
productSchema.statics.findFeatured = function() {
  return this.find({ isActive: true, isFeatured: true });
};

// Static method to find products by category
productSchema.statics.findByCategory = function(category) {
  return this.find({ isActive: true, category: category });
};

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);