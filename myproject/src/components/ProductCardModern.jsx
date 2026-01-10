import { memo, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Scale, Heart, TrendingUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProductComparison } from '../context/ProductComparisonContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/currency';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getImageUrl } from '../utils/imageUrl';
import { productsAPI } from '../utils/api';

const ProductCardModern = memo(({ product, viewType = 'grid' }) => {
  ;
  const { addToCart, isAddingToCart } = useCart();
  const { addToComparison, removeFromComparison, isInComparison } = useProductComparison();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [localStats, setLocalStats] = useState({
    averageRating: 0,
    totalReviews: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Always fetch fresh product stats to ensure consistency across all 230 products
  useEffect(() => {
    const fetchFreshStats = async (retryCount = 0) => {
      try {
        setIsLoadingStats(true);
        const productId = product._id || product.id;
        if (!productId) {
          setIsLoadingStats(false);
          return;
        }

        console.log(`🔄 Fetching fresh stats for product: ${productId}` + (retryCount > 0 ? ` (retry ${retryCount})` : ''));

        // Use productsAPI with cache-busting to ensure fresh data
        const data = await productsAPI.getProduct(productId, true);
        const freshProduct = data.data?.product || data.data;
        if (freshProduct) {
          const freshStats = {
            averageRating: freshProduct.averageRating || 0,
            totalReviews: freshProduct.totalReviews || 0
          };

          console.log(`✅ Fresh stats for ${productId}:`, freshStats);
          setLocalStats(freshStats);

          // Update sessionStorage for consistency
          try {
            const key = 'updatedProductStats';
            const existing = JSON.parse(sessionStorage.getItem(key) || '{}');
            existing[productId] = { ...freshStats, ts: Date.now() };
            sessionStorage.setItem(key, JSON.stringify(existing));
          } catch { }
        }
      } catch (error) {
        console.warn(`❌ Failed to fetch fresh stats for ${product._id}:`, error);

        // If it's a rate limit error (429) or network error, retry with exponential backoff
        if ((error.response?.status === 429 || error.message?.includes('Failed to fetch')) && retryCount < 3) {
          const backoffDelay = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; // 1s, 2s, 4s + jitter
          console.log(`⏳ Rate limited, retrying after ${backoffDelay.toFixed(0)}ms...`);
          setTimeout(() => {
            fetchFreshStats(retryCount + 1);
          }, backoffDelay);
          return; // Don't proceed to finally block
        }

        // Use the product's existing stats as absolute fallback
        setLocalStats({
          averageRating: product.averageRating || product.rating || 0,
          totalReviews: product.totalReviews || product.reviewCount || 0
        });
      } finally {
        setIsLoadingStats(false);
      }
    };

    // Listen for global rating updates (after review submission)
    const handler = (e) => {
      const { productId, averageRating, totalReviews } = e.detail || {};
      const thisId = product._id || product.id;
      if (!thisId || !productId) return;
      if (String(thisId) === String(productId)) {
        console.log(`📡 Received rating update for ${thisId}:`, { averageRating, totalReviews });
        setLocalStats({ averageRating, totalReviews });
      }
    };
    window.addEventListener('product-rating-updated', handler);

    // Always fetch fresh stats with staggered timing to prevent server overload
    const delay = Math.random() * 2000; // Random delay 0-2 seconds
    const timeoutId = setTimeout(() => {
      fetchFreshStats();
    }, delay);

    return () => {
      window.removeEventListener('product-rating-updated', handler);
      clearTimeout(timeoutId);
    };
  }, [product._id, product.id]);

  // Check if this is an internal component by looking at the image path, category, or name pattern
  const isInternalComponent = product.category === 'internal-components' ||
    product.image?.includes('/internal_components/images/') ||
    product.images?.[0]?.includes('/internal_components/images/') ||
    product.imageUrl?.includes('/internal_components/images/') ||
    product.isInternalComponent;

  // Check if this product has deal pricing
  const isDealProduct = product.type === 'special-deal' || product.dealInfo;

  // Generate the correct navigation path
  const getProductPath = () => {
    const basePath = isInternalComponent ? `/component/${product._id || product.id}` : `/product/${product._id || product.id}`;

    // Add deal parameters if this is a deal product
    if (isDealProduct && product.discount) {
      const params = new URLSearchParams({
        deal: 'true',
        dealPrice: product.price,
        originalPrice: product.originalPrice || product.price,
        discount: product.discount
      });
      return `${basePath}?${params.toString()}`;
    }

    return basePath;
  };

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
        // Could show a toast notification or redirect to login
        alert('Please login to add items to your wishlist');
      }
    }
  }, [addToWishlist, removeFromWishlist, isInWishlist, product]);
  const renderStars = (rating) => {
    ;
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

  // Use discount from API directly (deals have proper discount values)
  // Handle both number and string discount values
  const apiDiscount = product.discount ? Number(product.discount) : 0;
  const discountPercentage = apiDiscount > 0 ? apiDiscount :
    (product.originalPrice && product.originalPrice > (product.discountedPrice || product.price)
      ? Math.round(((product.originalPrice - (product.discountedPrice || product.price)) / product.originalPrice) * 100)
      : 0);

  // Compute robust display price so category pages show deal price even if only discount% is present
  const original = product.originalPrice || product.price;
  const hasExplicitDiscounted = typeof product.discountedPrice === 'number' && product.discountedPrice < original;
  const computedDiscounted = (discountPercentage > 0)
    ? Math.max(0, Math.round(original * (1 - (discountPercentage / 100))))
    : null;
  const displayPrice = hasExplicitDiscounted
    ? product.discountedPrice
    : (computedDiscounted ?? product.price);
  const showOriginal = (discountPercentage > 0 || hasExplicitDiscounted)
    ? original
    : (product.originalPrice && product.originalPrice !== product.price ? product.originalPrice : null);
  const savings = showOriginal ? Math.max(0, showOriginal - displayPrice) : 0;

  // Grid view (default) - Mobile-first responsive card design
  if (viewType === 'grid') {
    return (
      <div
        className="group relative rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 sm:duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 border overflow-hidden"
        style={{
          backgroundColor: '#FEFCF3',
          borderColor: '#20B2AA'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top Badges - Mobile Optimized */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 flex flex-col gap-1 sm:gap-2">
          {discountPercentage > 0 && (
            <div
              className="text-white px-2 py-1 sm:px-3 rounded-full text-xs font-bold shadow-lg animate-pulse"
              style={{ backgroundColor: '#2C3E50' }}
            >
              {discountPercentage}% OFF
            </div>
          )}
          {product.featured && (
            <div
              className="text-white px-2 py-1 sm:px-3 rounded-full text-xs font-bold shadow-lg"
              style={{ backgroundColor: '#20B2AA' }}
            >
              <TrendingUp className="w-3 h-3 inline mr-1" />
              <span className="hidden sm:inline">TRENDING</span>
              <span className="sm:hidden">HOT</span>
            </div>
          )}
        </div>

        {/* Action Icons - Fixed positioning */}
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleWishlist(e);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group/wishlist"
            style={{
              backgroundColor: isInWishlist(product._id || product.id) ? '#FF6B6B' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Heart
              className={`w-4 h-4 transition-all duration-300 ${isInWishlist(product._id || product.id)
                  ? 'scale-110'
                  : 'group-hover/wishlist:scale-110'
                }`}
              style={{
                color: isInWishlist(product._id || product.id) ? 'white' : '#FF6B6B',
                fill: isInWishlist(product._id || product.id) ? 'white' : 'none'
              }}
            />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleComparison(e);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group/compare"
            style={{
              backgroundColor: isInComparison(product._id || product.id) ? '#20B2AA' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Scale
              className={`w-4 h-4 transition-all duration-300 ${isInComparison(product._id || product.id)
                  ? 'scale-110'
                  : 'group-hover/compare:scale-110'
                }`}
              style={{
                color: isInComparison(product._id || product.id) ? 'white' : '#20B2AA'
              }}
            />
          </button>
        </div>

        {/* Product Image - Mobile Responsive */}
        <div className="relative overflow-hidden h-40 sm:h-48 lg:h-64 cursor-pointer" style={{ backgroundColor: '#F8F9FA' }}>
          <Link to={getProductPath()} className="block w-full h-full">
            {(product.images?.[0] || product.image || product.imageUrl) ? (
              <LazyLoadImage
                src={getImageUrl(product.images?.[0] || product.image || product.imageUrl)}
                alt={product.name}
                effect="blur"
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 sm:group-hover:scale-110 p-1 sm:p-2"
                wrapperClassName="w-full h-full"
                onError={(e) => {
                  console.error('Image load failed:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-1 sm:p-2">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-medium text-center">No Image</span>
              </div>
            )}
          </Link>

          {/* Stock Indicator */}
          <div className="absolute bottom-2 right-2">
            {product.stock > 0 ? (
              <div
                className="px-2 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: '#20B2AA', color: 'white' }}
              >
                In Stock
              </div>
            ) : (
              <div
                className="px-2 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: '#FF6B6B', color: 'white' }}
              >
                Out of Stock
              </div>
            )}
          </div>
        </div>

        {/* Product Info - Mobile Optimized */}
        <div className="p-2 sm:p-3">
          {/* Brand - Hide on very small screens */}
          {product.brand && (
            <div
              className="hidden sm:block text-xs font-bold uppercase tracking-wider mb-2 opacity-80"
              style={{ color: '#20B2AA' }}
            >{product.brand}
            </div>
          )
          }

          {/* Product Name - Mobile Responsive */}
          <h3
            className="text-xs sm:text-sm font-bold mb-1 sm:mb-2 line-clamp-2 leading-tight group-hover:transition-colors duration-300"
            style={{ color: '#2C3E50' }}
          >
            <Link
              to={getProductPath()}
              className="hover:transition-colors touch-target"
              style={{ color: '#2C3E50' }}
            >{product.name}</Link>
          </h3>

          {/* Rating & Reviews - Mobile Simplified */}
          <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
            {isLoadingStats ? (
              <div className="flex items-center gap-2">
                <div className="animate-pulse bg-gray-200 rounded w-16 h-4"></div>
                <div className="animate-pulse bg-gray-200 rounded w-8 h-4"></div>
              </div>
            ) : (
              <>
                <div className="flex">{renderStars(localStats.averageRating)}</div>
                <span className="text-xs sm:text-sm font-medium" style={{ color: '#2C3E50' }}>
                  {localStats.averageRating > 0 ? localStats.averageRating.toFixed(1) : '0.0'}
                </span>
                <span className="text-xs sm:text-sm hidden sm:inline" style={{ color: '#FF6B6B' }}>
                  ({localStats.totalReviews})
                </span>
              </>
            )}
          </div>

          {/* Price Section - Mobile Optimized */}
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <span className="text-base sm:text-lg lg:text-xl font-black" style={{ color: '#2C3E50' }}>{formatPrice(displayPrice)}</span>
              {showOriginal && showOriginal !== displayPrice && (
                <span className="text-sm sm:text-base line-through" style={{ color: '#FF6B6B' }}>{formatPrice(showOriginal)}
                </span>
              )
              }
            </div>
            {discountPercentage > 0 && (
              <div className="text-xs sm:text-sm font-semibold" style={{ color: '#20B2AA' }}>
                <span className="hidden sm:inline">You save {formatPrice(savings)} ({discountPercentage}%)</span>
                <span className="sm:hidden">Save {discountPercentage}%</span>
              </div>
            )}
          </div>

          {/* Add to Cart Button - Mobile Optimized */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart(product._id || product.id) || product.stock === 0}
            className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 transform touch-target ${product.stock === 0
                ? 'cursor-not-allowed'
                : isAddingToCart(product._id || product.id)
                  ? 'scale-95'
                  : 'hover:scale-105 shadow-lg hover:shadow-xl active:scale-95'
              }`}
            style={{
              background: product.stock === 0
                ? '#F8F9FA'
                : isAddingToCart(product._id || product.id)
                  ? 'linear-gradient(135deg, #FF6B6B 0%, #20B2AA 100%)'
                  : 'linear-gradient(135deg, #FF6B6B 0%, #20B2AA 100%)',
              color: product.stock === 0 ? '#2C3E50' : 'white'
            }}
          >
            {isAddingToCart(product._id || product.id) ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                <span className="hidden sm:inline">Adding to Cart...</span>
                <span className="sm:hidden">Adding...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </div>
            )}
          </button>
        </div>
      </div>
    );
  }

  // List view - Horizontal layout inspired by Amazon/Flipkart
  return (
    <div
      className="group rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 overflow-hidden"
      style={{
        backgroundColor: '#FEFCF3',
        borderColor: '#20B2AA'
      }}
    >
      <div className="flex">
        {/* Product Image - Clickable */}
        <div className="relative flex-shrink-0 w-64 h-48 cursor-pointer" style={{ backgroundColor: '#F8F9FA' }}>
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <div
                className="text-white px-2 py-1 rounded-lg text-xs font-bold"
                style={{ backgroundColor: '#FF6B6B' }}
              >
                {discountPercentage}% OFF
              </div>
            )}
          </div>

          {/* Action Icons - Wishlist & Compare */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleWishlist(e);
              }}
              className="p-1 rounded-full transition-all duration-300 transform hover:scale-110"
              style={{ backgroundColor: '#F8F9FA' }}
            >
              <Heart
                className="w-4 h-4"
                style={{
                  color: isInWishlist(product._id || product.id) ? '#FF6B6B' : '#2C3E50',
                  fill: isInWishlist(product._id || product.id) ? '#FF6B6B' : 'none'
                }}
              />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleComparison(e);
              }}
              className="p-1 rounded-full transition-all duration-300 transform hover:scale-110"
              style={{
                backgroundColor: isInComparison(product._id || product.id) ? '#20B2AA' : '#F8F9FA'
              }}
            >
              <Scale
                className="w-4 h-4"
                style={{
                  color: isInComparison(product._id || product.id) ? 'white' : '#2C3E50'
                }}
              />
            </button>
          </div>

          <Link to={getProductPath()} className="block w-full h-full">
            {(product.images?.[0] || product.image || product.imageUrl) ? (
              <LazyLoadImage
                src={getImageUrl(product.images?.[0] || product.image || product.imageUrl)}
                alt={product.name}
                effect="blur"
                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                wrapperClassName="w-full h-full"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs text-center font-medium">No Image Available</span>
              </div>
            )}
          </Link>
        </div>

        {/* Product Info */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Brand */}
            {product.brand && (
              <div
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: '#20B2AA' }}
              >{product.brand}
              </div>
            )
            }

            {/* Product Name */}
            <h3 className="text-xl font-bold mb-2 line-clamp-2" style={{ color: '#2C3E50' }}>
              <Link
                to={getProductPath()}
                className="hover:transition-colors"
                style={{ color: '#2C3E50' }}
              >{product.name}</Link>
            </h3>

            {/* Description */}
            <p className="text-sm mb-3 line-clamp-2" style={{ color: '#FF6B6B' }}>{product.description}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              {isLoadingStats ? (
                <div className="flex items-center gap-2">
                  <div className="animate-pulse bg-gray-200 rounded w-20 h-4"></div>
                  <div className="animate-pulse bg-gray-200 rounded w-12 h-4"></div>
                </div>
              ) : (
                <>
                  <div className="flex">{renderStars(localStats.averageRating)}</div>
                  <span className="text-sm font-medium" style={{ color: '#2C3E50' }}>
                    {localStats.averageRating > 0 ? localStats.averageRating.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-sm" style={{ color: '#FF6B6B' }}>
                    ({localStats.totalReviews} reviews)
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-end justify-between">
            {/* Price */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl font-black" style={{ color: '#2C3E50' }}>{formatPrice(displayPrice)}</span>
                {showOriginal && showOriginal !== displayPrice && (
                  <span className="text-lg line-through" style={{ color: '#FF6B6B' }}>{formatPrice(showOriginal)}
                  </span>
                )
                }
              </div>
              {discountPercentage > 0 && (
                <div className="text-sm font-semibold" style={{ color: '#20B2AA' }}>
                  Save {formatPrice(savings)}
                </div>
              )
              }
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart(product._id || product.id) || product.stock === 0}
              className="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105"
              style={{
                background: product.stock === 0
                  ? '#F8F9FA'
                  : isAddingToCart(product._id || product.id)
                    ? 'linear-gradient(135deg, #FF6B6B 0%, #20B2AA 100%)'
                    : 'linear-gradient(135deg, #FF6B6B 0%, #20B2AA 100%)',
                color: product.stock === 0 ? '#2C3E50' : 'white'
              }}
            >
              {isAddingToCart(product._id || product.id) ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </div>
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                <div className="flex items-center">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
);

ProductCardModern.displayName = 'ProductCardModern';

export default ProductCardModern;
