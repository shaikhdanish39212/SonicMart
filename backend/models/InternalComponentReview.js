const mongoose = require('mongoose');

const internalComponentReviewSchema = new mongoose.Schema({
  componentId: {
    type: String,
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
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
    trim: true,
    minLength: 10,
    maxLength: 500
  },
  title: {
    type: String,
    trim: true,
    maxLength: 100
  },
  helpful: {
    type: Number,
    default: 0
  },
  notHelpful: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
internalComponentReviewSchema.index({ componentId: 1, createdAt: -1 });
internalComponentReviewSchema.index({ componentId: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('InternalComponentReview', internalComponentReviewSchema);