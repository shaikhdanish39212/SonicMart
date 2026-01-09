import React, { useState, useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useProductComparison } from '../context/ProductComparisonContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ProductCardModern from '../components/ProductCardModern';
import { FaExchangeAlt, FaShoppingBag, FaTags, FaArrowLeft } from 'react-icons/fa';
const WishlistPage = () => {
  ;
const { wishlist, loading: wishlistLoading, error, clearError } = useWishlist();
const { getComparisonCount } = useProductComparison();
const { isAuthenticated, user, loading: authLoading } = useAuth();
const navigate = useNavigate();
const location = useLocation();
const [backButtonHover, setBackButtonHover] = useState(false);
const [compareButtonHover, setCompareButtonHover] = useState(false);
const [startShoppingButtonHover, setStartShoppingButtonHover] = useState(false);
const [browseCategoriesButtonHover, setBrowseCategoriesButtonHover] = useState(false);

// Redirect to login only after auth state is fully resolved
useEffect(() => {
  if (!authLoading && !isAuthenticated) {
    navigate('/login', { replace: true, state: { from: location.pathname } });
  }
}, [authLoading, isAuthenticated, navigate, location.pathname]);

useEffect(() => { if (error) { const timer = setTimeout(() => { clearError(); }, 5000);
  return () => clearTimeout(timer); } }, [error, clearError]);
// Reusable single loader UI
const renderLoader = () => (
  <div className="min-h-screen" style={{ backgroundColor: '#FEFCF3' }}>
    <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-6 flex items-center justify-center">
          <svg className="animate-spin h-12 w-12 text-rose-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#2C3E50' }}>Loading Your Wishlist</h3>
        <p className="text-gray-600">Fetching your favorite products...</p>
      </div>
    </div>
  </div>
);

// While auth is initializing, show a single spinner and avoid premature redirects
if (authLoading) { return renderLoader(); }
if (!isAuthenticated) { return null; }
if (wishlistLoading) { return renderLoader(); }
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFCF3' }}>
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 via-orange-600/5 to-red-600/5"></div>
        <div className="relative max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4">
            {/* Left Side - Navigation & Title */}
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-0">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 text-gray-600 hover:bg-white transition-all duration-300 shadow-lg text-xs sm:text-sm shrink-0"
                style={{ color: backButtonHover ? '#FF6B6B' : '#6B7280' }}
                onMouseEnter={() => setBackButtonHover(true)}
                onMouseLeave={() => setBackButtonHover(false)}
              >
                <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <span className="font-medium whitespace-nowrap">Back</span>
              </button>
              <div>
                <div className="flex items-center gap-3 sm:gap-4 mb-1 sm:mb-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(to right, #FF6B6B, #FF5252)' }}>
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      role="img"
                    >
                      <path d="M12 21s-6.3-4.5-9.2-7.4C1 12 1 8.5 3.2 6.6 5.3 4.8 8.2 5.3 10 7.3L12 9.4l2-2.1c1.8-2 4.7-2.5 6.8-0.7C23 8.5 23 12 21.2 13.6 18.3 16.5 12 21 12 21z" />
                    </svg>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight tracking-tight" style={{ color: '#2C3E50' }}>My Wishlist</h1>
                </div>
                {user && (
                  <p className="text-xs text-gray-500 mb-1">Welcome back, {user.name}!</p>
                )}
                <p className="text-sm sm:text-base text-gray-600">
                  {wishlist?.length > 0 
                    ? `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} saved for later` 
                    : 'Your favorite products will appear here'
                  }
                </p>
              </div>
            </div>
            {/* Right Side - Statistics */}
            {wishlist?.length > 0 && (
              <div className="hidden sm:flex items-center gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold" style={{ color: '#2C3E50' }}>{wishlist.length}</div>
                  <div className="text-xs text-gray-600">Items</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold" style={{ color: '#2C3E50' }}>{getComparisonCount()}</div>
                  <div className="text-xs text-gray-600">In Compare</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-lg sm:text-xl">⚠</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-red-800">Something went wrong</h3>
                <p className="text-sm sm:text-base text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Comparison Link */}
        {getComparisonCount() > 0 && (
          <div className="mb-6 sm:mb-8">
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
              style={{ background: compareButtonHover ? 'linear-gradient(to right, #1BA39C, #FF5252)' : 'linear-gradient(to right, #20B2AA, #FF6B6B)' }}
              onMouseEnter={() => setCompareButtonHover(true)}
              onMouseLeave={() => setCompareButtonHover(false)}
            >
              <FaExchangeAlt className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
              <span className="whitespace-nowrap">Compare Products ({getComparisonCount()})</span>
            </Link>
          </div>
        )}
        
        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="max-w-lg mx-auto">
              {/* Enhanced Empty State - Crisp SVG */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 rounded-full grid place-items-center shadow-xl overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #F8F9FA, #FF6B6B)' }}>
                <svg
                  viewBox="0 0 24 24"
                  width="56"
                  height="56"
                  fill="currentColor"
                  className="text-gray-500"
                  aria-hidden="true"
                  shapeRendering="geometricPrecision"
                >
                  <path d="M12 21s-6.3-4.5-9.2-7.4C1 12 1 8.5 3.2 6.6 5.3 4.8 8.2 5.3 10 7.3L12 9.4l2-2.1c1.8-2 4.7-2.5 6.8-0.7C23 8.5 23 12 21.2 13.6 18.3 16.5 12 21 12 21z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4" style={{ color: '#2C3E50' }}>Your Wishlist is Empty</h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4">
                Discover amazing products and save your favorites for later. Start building your dream collection today!
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
                <Link
                  to="/products"
                  className="px-6 sm:px-8 py-3 sm:py-4 text-white rounded-lg sm:rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 text-sm sm:text-base"
                  style={{ background: startShoppingButtonHover ? 'linear-gradient(to right, #FF5252, #FF4444)' : 'linear-gradient(to right, #FF6B6B, #FF5252)' }}
                  onMouseEnter={() => setStartShoppingButtonHover(true)}
                  onMouseLeave={() => setStartShoppingButtonHover(false)}
                >
                  <FaShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                  <span>Start Shopping</span>
                </Link>
                <Link
                  to="/categories"
                  className="px-6 sm:px-8 py-3 sm:py-4 border-2 rounded-lg sm:rounded-xl transition-all duration-300 font-semibold inline-flex items-center justify-center gap-2 text-sm sm:text-base"
                  style={{ borderColor: '#FF6B6B', color: '#FF6B6B', backgroundColor: browseCategoriesButtonHover ? '#FEFCF3' : 'transparent' }}
                  onMouseEnter={() => setBrowseCategoriesButtonHover(true)}
                  onMouseLeave={() => setBrowseCategoriesButtonHover(false)}
                >
                  <FaTags className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                  <span>Browse Categories</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
            {wishlist.map((product, index) => (
              <div
                key={product._id || product.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="opacity-0 animate-fadeInUp"
              >
                <ProductCardModern product={product} variant="wishlist" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;