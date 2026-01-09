import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Filter, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { productsAPI } from '../utils/api';

const ReviewsSection = ({ product, reviews, setReviews, reviewStats, setReviewStats, onReviewSubmitted }) => {
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [reviewSort, setReviewSort] = useState('newest');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: ''
  });

  const handleSubmitReview = async () => {
    // Enhanced validation and logging
    console.log('🔄 Starting review submission...');
    console.log('Review data:', { rating: newReview.rating, comment: newReview.comment });
    console.log('User:', user);
    console.log('Product:', product);
    
    // DEBUG: Add temporary alert to see if function is called
    console.log('🚨 DEBUG: handleSubmitReview called with:', {
      rating: newReview.rating,
      ratingType: typeof newReview.rating,
      comment: newReview.comment,
      commentLength: newReview.comment.length,
      user: !!user,
      product: !!product
    });
    
    // Enhanced validation with detailed logging
    if (newReview.rating === 0 || newReview.rating < 1 || newReview.rating > 5) {
      console.log('❌ Review validation failed: invalid rating:', newReview.rating);
      showError('Please select a rating between 1 and 5 stars');
      return;
    }
    
    if (!newReview.comment.trim() || newReview.comment.trim().length === 0) {
      console.log('❌ Review validation failed: comment is empty');
      showError('Please write a review comment');
      return;
    }
    // Min 10, Max 500 characters
    const len = newReview.comment.trim().length;
    if (len < 10) {
      console.log('❌ Review validation failed: comment too short:', len);
      showError('Review comment must be at least 10 characters');
      return;
    }
    if (len > 500) {
      console.log('❌ Review validation failed: comment too long:', len);
      showError('Review comment must be 500 characters or less');
      return;
    }

    if (!user) {
      console.log('❌ Review submission failed: user not logged in');
      showError('Please log in to submit a review');
      return;
    }

    // Check if product exists and has valid ID
    if (!product || !product._id) {
      console.log('❌ Review submission failed: product information missing');
      return;
    }

    try {
      console.log('📡 Submitting review for product:', product._id);
      
      // Prepare review data - backend only expects rating and comment
      // Ensure rating is a proper integer
      const rating = parseInt(newReview.rating);
      const comment = newReview.comment.trim();
      
      const reviewData = {
        rating: rating,
        comment: comment
        // Note: title is for UI only, not sent to backend
      };
      
      console.log('📦 Review data being sent to API:', reviewData);
      console.log('📦 Data types:', {
        rating: typeof reviewData.rating,
        comment: typeof reviewData.comment,
        ratingValue: reviewData.rating,
        commentLength: reviewData.comment.length
      });
      
      console.log('📝 Review payload:', reviewData);
      console.log('📝 Review payload types:', {
        rating: typeof reviewData.rating,
        comment: typeof reviewData.comment,
        ratingValue: reviewData.rating,
        commentLength: reviewData.comment.length
      });
      
      // Check authentication first
      const token = localStorage.getItem('token');
      console.log('🔑 Auth token present:', !!token);
      console.log('🔑 Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      console.log('👤 User object:', user);
      console.log('👤 User ID:', user?.id || user?._id);
      
      if (!token) {
        console.log('❌ No auth token found');
        showWarning('Please log in to submit a review');
        return;
      }

      // Make the API call with detailed logging
      console.log('🌐 Making API call to:', `${window.location.origin.replace('5174', '5000')}/api/products/${product._id}/reviews`);
      
      const response = await productsAPI.addReview(product._id, reviewData);
      console.log('✅ Review API response:', response);
      
      if (response && response.status === 'success') {
        console.log('🎉 Review submitted successfully!');
        showSuccess('Review submitted successfully!');
        
        // Reset form
        setNewReview({ rating: 0, title: '', comment: '' });
        setShowReviewForm(false);

        // Compute updated stats to broadcast to product lists/cards
        try {
          let averageRating, totalReviews;
          if (response.data && response.data.updatedStats) {
            averageRating = response.data.updatedStats.averageRating;
            totalReviews = response.data.updatedStats.totalReviews;
          } else {
            // Fallback: estimate from current stats (useful for internal components path)
            const currentAvg = reviewStats?.averageRating ?? (product?.averageRating || product?.rating || 0);
            const currentTotal = reviewStats?.totalReviews ?? (product?.totalReviews || product?.reviewCount || 0);
            const newTotal = currentTotal + 1;
            const newAvgRaw = ((currentAvg * currentTotal) + parseInt(newReview.rating)) / newTotal;
            averageRating = Math.round(newAvgRaw * 10) / 10;
            totalReviews = newTotal;
          }

          const payload = {
            productId: product._id,
            averageRating,
            totalReviews
          };

          // Dispatch a global event so any mounted product card can update immediately
          window.dispatchEvent(new CustomEvent('product-rating-updated', { detail: payload }));

          // Persist to sessionStorage so cards that mount later can also pick it up
          try {
            const key = 'updatedProductStats';
            const existing = JSON.parse(sessionStorage.getItem(key) || '{}');
            existing[product._id] = { averageRating, totalReviews, ts: Date.now() };
            sessionStorage.setItem(key, JSON.stringify(existing));
          } catch (e) {
            console.warn('Session storage persistence skipped:', e);
          }
        } catch (e) {
          console.warn('Failed to compute/broadcast updated stats:', e);
        }

        // Optional: light reload to fetch fresh product data (kept per previous behavior)
        console.log('🔄 Refreshing page to show new review...');
        setTimeout(() => {
          window.location.reload();
        }, 500);
        
      } else {
        console.error('❌ Review submission failed - unexpected response format:', response);
        showError('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('💥 Error submitting review:', error);
      console.error('📊 Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        productId: product._id,
        userId: user?.id || user?._id,
        reviewData: {
          rating: parseInt(newReview.rating),
          comment: newReview.comment.trim(),
          commentLength: newReview.comment.trim().length
        },
        timestamp: new Date().toISOString()
      });
      
      // Log the exact API call that failed
      console.error('🔗 Failed API endpoint:', `${window.location.origin.replace('5174', '5000')}/api/products/${product._id}/reviews`);
      
      // Show user-friendly error message with toast
      let errorMessage = 'Failed to submit review. Please try again.';
      
      if (error.message.includes('Invalid review data')) {
        errorMessage = 'Please check your review: rating must be 1-5 stars and comment must be 10-500 characters.';
      } else if (error.message.includes('already reviewed')) {
        errorMessage = 'You have already reviewed this product.';
      } else if (error.message.includes('not found')) {
        errorMessage = 'Product not found. Please refresh and try again.';
      } else if (error.message.includes('session')) {
        errorMessage = 'Your session has expired. Please log in again.';
      }
      
      showError(errorMessage);
    }
  };

  const handleVoteReview = (reviewId, voteType) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        if (review.userVoted === voteType) {
          // Remove vote
          return {
            ...review,
            helpful: voteType === 'helpful' ? review.helpful - 1 : review.helpful,
            notHelpful: voteType === 'not-helpful' ? review.notHelpful - 1 : review.notHelpful,
            userVoted: null
          };
        } else {
          // Add or change vote
          const updatedReview = { ...review };
          if (review.userVoted === 'helpful') {
            updatedReview.helpful -= 1;
          } else if (review.userVoted === 'not-helpful') {
            updatedReview.notHelpful -= 1;
          }
          
          if (voteType === 'helpful') {
            updatedReview.helpful += 1;
          } else {
            updatedReview.notHelpful += 1;
          }
          
          updatedReview.userVoted = voteType;
          return updatedReview;
        }
      }
      return review;
    }));
  };

  const getFilteredAndSortedReviews = () => {
    let filtered = reviews;

    // Apply filters
    if (reviewFilter === 'verified') {
      filtered = filtered.filter(review => review.verified);
    } else if (reviewFilter.includes('star')) {
      const rating = parseInt(reviewFilter.charAt(0));
      filtered = filtered.filter(review => review.rating === rating);
    }

    // Apply sorting
    switch (reviewSort) {
      case 'oldest':
        filtered = [...filtered].reverse();
        break;
      case 'helpful':
        filtered = [...filtered].sort((a, b) => b.helpful - a.helpful);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      default:
        // newest is default
        break;
    }

    return filtered;
  };

  // Apply sorting to the filtered reviews

  const filteredReviews = getFilteredAndSortedReviews();
  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: '#2C3E50' }}>Customer Reviews</h2>
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 sm:w-5 h-4 sm:h-5 ${i < Math.floor(reviewStats.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                style={{ fill: i < Math.floor(reviewStats.averageRating) ? '#FF6B6B' : '#e5e7eb' }}
              />
            ))}
          </div>
          <span className="text-base sm:text-lg font-semibold" style={{ color: '#2C3E50' }}>
            {reviewStats.averageRating.toFixed(1)}
          </span>
          <span className="text-sm sm:text-base text-gray-500">({reviewStats.totalReviews} reviews)</span>
        </div>
      </div>

      {/* Review Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Rating Breakdown */}
        <div>
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: '#2C3E50' }}>Rating Breakdown</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviewStats.starBreakdown[rating] || 0;
              const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-xs sm:text-sm font-medium w-6 sm:w-8" style={{ color: '#2C3E50' }}>{rating}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${percentage}%`,
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #20B2AA 100%)'
                      }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 w-6 sm:w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Filters */}
        <div>
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: '#2C3E50' }}>Filter & Sort</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="review-filter" className="block text-xs sm:text-sm font-medium mb-1" style={{ color: '#2C3E50' }}>Filter by:</label>
              <select 
                id="review-filter"
                name="reviewFilter"
                value={reviewFilter} 
                onChange={(e) => setReviewFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:border-transparent focus:outline-none"
                style={{ borderColor: '#e5e7eb', backgroundColor: 'white', color: '#2C3E50' }}
              >
                <option value="all">All Reviews</option>
                <option value="verified">Verified Purchases</option>
                <option value="5star">5 Stars</option>
                <option value="4star">4 Stars</option>
                <option value="3star">3 Stars</option>
                <option value="2star">2 Stars</option>
                <option value="1star">1 Star</option>
              </select>
            </div>
            <div>
              <label htmlFor="review-sort" className="block text-xs sm:text-sm font-medium mb-1" style={{ color: '#2C3E50' }}>Sort by:</label>
              <select 
                id="review-sort"
                name="reviewSort"
                value={reviewSort} 
                onChange={(e) => setReviewSort(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:border-transparent focus:outline-none"
                style={{ borderColor: '#e5e7eb', backgroundColor: 'white', color: '#2C3E50' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="helpful">Most Helpful</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
        {displayedReviews.length > 0 ? displayedReviews.map((review) => (
          <div key={review.id} className="border-b pb-4 sm:pb-6 last:border-b-0" style={{ borderColor: '#F8F9FA' }}>
            <div className="flex items-start space-x-3 sm:space-x-4">
              {/* User Avatar */}
              <div 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-semibold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #20B2AA 100%)' }}
              >{review?.userName?.charAt(0) || 'U'}</div>
              
              {/* Review Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 mb-2">
                  <span className="font-semibold text-sm sm:text-base" style={{ color: '#2C3E50' }}>{review?.userName || 'Anonymous'}</span>
                  {review?.verified && (
                    <span 
                      className="text-xs px-2 py-1 rounded-full self-start sm:self-auto"
                      style={{ backgroundColor: '#20B2AA', color: 'white' }}
                    >
                      Verified Purchase
                    </span>
                  )}
                </div>
                
                {/* Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 sm:w-4 h-3 sm:h-4 ${i < (review?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                        style={{ fill: i < (review?.rating || 0) ? '#FF6B6B' : '#e5e7eb' }}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">{review?.date}</span>
                </div>
                
                {/* Review Title */}
                {review?.title && (
                  <h4 className="font-semibold mb-2 text-sm sm:text-base" style={{ color: '#2C3E50' }}>{review.title}</h4>
                )}
                
                {/* Review Comment */}
                <p className="text-gray-700 mb-3 leading-relaxed text-sm sm:text-base">{review?.comment}</p>
                
                {/* Review Photos */}
                {review?.photos && review.photos.length > 0 && (
                  <div className="flex space-x-2 mb-3 overflow-x-auto pb-1">
                    {review.photos.map((photo, index) => (
                      <img 
                        key={`review-photo-${review.id}-${index}`}
                        src={photo} 
                        alt={`Review photo ${index + 1}`}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
                        style={{ borderColor: '#20B2AA' }}
                      />
                    ))}
                  </div>
                )}
                
                {/* Helpful Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <button 
                    onClick={() => handleVoteReview(review.id, 'helpful')}
                    className={`flex items-center justify-center sm:justify-start space-x-1 px-3 py-2 rounded-full text-xs sm:text-sm transition-all duration-300 ${
                      review.userVoted === 'helpful' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                    }`}
                  >
                    <ThumbsUp className="w-3 sm:w-4 h-3 sm:h-4" />
                    <span>Helpful ({review?.helpful || 0})</span>
                  </button>
                  <button 
                    onClick={() => handleVoteReview(review.id, 'not-helpful')}
                    className={`flex items-center justify-center sm:justify-start space-x-1 px-3 py-2 rounded-full text-xs sm:text-sm transition-all duration-300 ${
                      review.userVoted === 'not-helpful' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                    }`}
                  >
                    <ThumbsDown className="w-3 sm:w-4 h-3 sm:h-4" />
                    <span>Not Helpful ({review?.notHelpful || 0})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-6 sm:py-8">
            <p className="text-gray-500 text-sm sm:text-base">No reviews match your current filters. Try adjusting the filters above.</p>
          </div>
        )}
      </div>

      {/* Show More/Less Button */}
      {filteredReviews.length > 3 && (
        <div className="text-center mb-4 sm:mb-6">
          <button 
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="px-4 sm:px-6 py-2 sm:py-3 border rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-lg"
            style={{ 
              borderColor: '#20B2AA',
              color: '#20B2AA',
              backgroundColor: 'white'
            }}
          >
            {showAllReviews ? 'Show Less' : `Show All ${filteredReviews.length} Reviews`}
          </button>
        </div>
      )}

      {/* Write Review Section - Show for all products including internal components */}
      {product && product._id && (
        <div className="text-center">
          {!showReviewForm ? (
            <button 
              onClick={() => setShowReviewForm(true)}
              className="px-6 sm:px-8 py-3 rounded-lg sm:rounded-xl text-sm sm:text-base transition-all duration-300 font-semibold hover:shadow-xl transform hover:scale-105"
              style={{ 
                background: 'linear-gradient(135deg, #FF6B6B 0%, #20B2AA 100%)',
                color: 'white'
              }}
            >
              Write a Review
            </button>
          ) : (
          <div className="max-w-2xl mx-auto text-left">
            <div className="rounded-lg sm:rounded-xl p-4 sm:p-6 border-2" style={{ borderColor: '#F8F9FA', backgroundColor: 'white' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold" style={{ color: '#2C3E50' }}>Write Your Review</h3>
                <button 
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl p-1"
                >
                  ×
                </button>
              </div>

              {/* Rating Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>
                  Rating <span style={{ color: '#FF6B6B' }}>*</span>
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                      className="transition-colors duration-200 p-1"
                    >
                      <Star 
                        className={`w-6 sm:w-8 h-6 sm:h-8 ${rating <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        style={{ fill: rating <= newReview.rating ? '#FF6B6B' : '#e5e7eb' }}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs sm:text-sm text-gray-600">{newReview.rating > 0 ? `${newReview.rating} star${newReview.rating > 1 ? 's' : ''}` : 'Select rating'}</span>
                </div>
              </div>

              {/* Title Input */}
              <div className="mb-4">
                <label htmlFor="review-title" className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>
                  Review Title (Optional)
                </label>
                <input
                  id="review-title"
                  name="reviewTitle"
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Summarize your experience..."
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg sm:rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent focus:outline-none"
                  style={{ 
                    borderColor: '#e5e7eb',
                    color: '#2C3E50',
                    backgroundColor: 'white'
                  }}
                />
              </div>

              {/* Comment Input */}
              <div className="mb-4">
                <label htmlFor="review-comment" className="block text-sm font-medium mb-2" style={{ color: '#2C3E50' }}>
                  Your Review <span style={{ color: '#FF6B6B' }}>*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="review-comment"
                    name="reviewComment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your detailed experience with this product..."
                    rows="4"
                    maxLength="500"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg sm:rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent resize-none focus:outline-none"
                    style={{ 
                      borderColor: '#e5e7eb',
                      color: '#2C3E50',
                      backgroundColor: 'white'
                    }}
                  />
                  {/* Character Counter */}
                  <div className="mt-1 text-xs text-right" style={{ 
                    color: newReview.comment.length > 250 ? '#FF6B6B' : '#6B7280' 
                  }}>
                    {newReview.comment.length}/500 characters
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubmitReview}
                  className="flex-1 py-3 text-sm sm:text-base rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                  style={{ 
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #20B2AA 100%)',
                    color: 'white'
                  }}
                >
                  Submit Review
                </button>
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setNewReview({ rating: 0, title: '', comment: '' });
                  }}
                  className="px-6 py-3 text-sm sm:text-base border rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                  style={{ 
                    borderColor: '#e5e7eb',
                    color: '#2C3E50',
                    backgroundColor: 'white'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;