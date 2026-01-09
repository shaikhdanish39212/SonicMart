import { memo, useState, useCallback } from 'react';
import { Star, ShoppingCart, Scale, Heart, TrendingUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProductComparison } from '../context/ProductComparisonContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/currency';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getImageUrl } from '../utils/imageUrl';

const ComponentProductCard = memo(({ product, viewType = 'grid', onViewDetails }) => {
  const { addToCart, isAddingToCart } = useCart();
  const { addToComparison, removeFromComparison, isInComparison } = useProductComparison();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleAddToCart = useCallback(() => {
    console.log('Adding to cart product:', product._id || product.id);
    addToCart(product);
    console.log('Cart operation completed');
  }, [addToCart, product]);

  const handleToggleComparison = useCallback((e) => {
    if (e) e.stopPropagation();
    console.log('Toggling comparison for product:', product._id || product.id);
    
    if (isInComparison(product._id || product.id)) {
      removeFromComparison(product._id || product.id);
    } else {
      addToComparison(product);
    }
  }, [addToComparison, removeFromComparison, isInComparison, product]);

  const handleToggleWishlist = useCallback(async (e) => {
    if (e) e.stopPropagation();
    console.log('Toggling wishlist for product:', product._id || product.id);
    
    const productId = product._id || product.id;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      const success = await addToWishlist(productId);
      if (success === false) {
        alert('Please login to add items to your wishlist');
      }
    }
  }, [addToWishlist, removeFromWishlist, isInWishlist, product]);

  const handleCardClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(product);
    }
  }, [product, onViewDetails]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-200" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.originalPrice > (product.discountedPrice || product.price)
    ? Math.round(((product.originalPrice - (product.discountedPrice || product.price)) / product.originalPrice) * 100)
    : 0;

  // Grid view (default) - Modern card design inspired by Amazon/Flipkart
  if (viewType === 'grid') {
    return (
      <div
        className="group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 overflow-hidden cursor-pointer"
        style={{ 
          backgroundColor: '#FEFCF3',
          borderColor: '#20B2AA'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <div 
              className="text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse"
              style={{ backgroundColor: '#2C3E50' }}
            >
              {discountPercentage}% OFF
            </div>
          )}
          {product.featured && (
            <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <TrendingUp className="w-3 h-3" />
              Featured
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg ${
            isInWishlist(product._id || product.id)
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
          }`}
          title={isInWishlist(product._id || product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`w-4 h-4 ${isInWishlist(product._id || product.id) ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <LazyLoadImage
            src={getImageUrl(product.image)}
            alt={product.name}
            effect="blur"
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              if (!e.target.src.includes('/images/DJSpeaker1.png')) {
                e.target.src = getImageUrl('/images/DJSpeaker1.png');
              }
            }}
          />
          
          {/* Quick Action Overlay */}
          <div className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-3 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleComparison(e);
              }}
              className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg ${
                isInComparison(product._id || product.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              title={isInComparison(product._id || product.id) ? "Remove from Comparison" : "Add to Comparison"}
            >
              <Scale className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-5 space-y-3">
          {/* Brand & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">{product.brand}</span>
            <div className="flex items-center gap-1">
              {renderStars(product.averageRating || product.rating)}
              <span className="text-sm text-gray-600 ml-1">
                ({product.totalReviews || product.reviews || 0})
              </span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(product.discountedPrice || product.price)}
            </span>
            {product.originalPrice && product.originalPrice > (product.discountedPrice || product.price) && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? `In Stock (${product.stock || 0})` : 'Out of Stock'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={!product.inStock || isAddingToCart(product._id || product.id)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {isAddingToCart(product._id || product.id) ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view layout (if needed)
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden cursor-pointer"
         onClick={handleCardClick}>
      {/* List view content - simplified for this example */}
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-green-600 font-bold">
          {formatPrice(product.discountedPrice || product.price)}
        </p>
      </div>
    </div>
  );
});

ComponentProductCard.displayName = 'ComponentProductCard';
export default ComponentProductCard;