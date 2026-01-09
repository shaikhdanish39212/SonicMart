import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Heart, Star, Shield, Truck, Loader2, Check, X } from 'lucide-react';
import CouponInput from './CouponInput';
import { getImageUrl } from '../utils/imageUrl';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearSuccess, setShowClearSuccess] = useState(false);
  const [clearedItems, setClearedItems] = useState([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Render nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN') || '0'}`;
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) return;
    updateQuantity(productId, newQuantity);
  };

  const handleCouponApplied = (couponData) => {
    console.log('Coupon data received:', couponData);
    
    // Ensure discountAmount is a valid number
    const sanitizedCouponData = {
      ...couponData,
      discountAmount: Number(couponData.discountAmount) || 0
    };
    
    console.log('Sanitized coupon data:', sanitizedCouponData);
    setAppliedCoupon(sanitizedCouponData);
  };

  const handleCouponRemoved = () => {
    setAppliedCoupon(null);
  };

  const handleWishlistToggle = async (item) => {
    try {
      const productId = item._id || item.id;
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleClearCart = async () => {
    console.log('🗑️ Clear cart clicked - Current cart:', cart.length, 'items');
    
    // Store current cart for undo functionality
    const itemsToStore = [...cart];
    setClearedItems(itemsToStore);
    console.log('📦 Stored items for undo:', itemsToStore.length);
    
    setIsClearing(true);
    
    try {
      console.log('⏳ Calling clearCart...');
      await clearCart();
      setAppliedCoupon(null);
      
      console.log('✅ Cart cleared, showing success notification');
      // Show professional success notification
      setShowClearSuccess(true);
      
      // Smooth scroll to top after a brief delay
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        console.log('⏰ Auto-hiding success notification');
        setShowClearSuccess(false);
        setClearedItems([]);
      }, 5000);
      
    } catch (error) {
      console.error('❌ Clear cart error:', error);
      setShowClearSuccess(false);
    } finally {
      setIsClearing(false);
      console.log('🏁 Clear cart process finished');
    }
  };

  const handleUndoClear = () => {
    // TODO: Implement restore functionality if needed
    // For now, just hide the notification
    setShowClearSuccess(false);
    setClearedItems([]);
  };

  const handleProceedToCheckout = () => {
    // Navigate to place order with coupon and pricing information
    navigate('/place-order', {
      state: {
        appliedCoupon,
        subtotal,
        couponDiscount,
        shipping,
        total
      }
    });
  };

  const subtotal = getTotalPrice();
  const couponDiscount = appliedCoupon ? (Number(appliedCoupon.discountAmount) || 0) : 0;
  const shipping = subtotal > 999 ? 0 : 50;
  const total = subtotal - couponDiscount + shipping;

  console.log('Cart calculations:', { subtotal, couponDiscount, shipping, total, appliedCoupon });

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FEFCF3' }}>
        {/* Success Notification - Fixed at top when shown */}
        {showClearSuccess && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
            <div className="p-4 rounded-2xl shadow-xl border-l-4 success-banner"
                 style={{ 
                   backgroundColor: '#d4edda', 
                   borderColor: '#28a745'
                 }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                       style={{ backgroundColor: '#28a745' }}>
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Cart cleared successfully!</p>
                    <p className="text-sm text-green-700">
                      {clearedItems.length} {clearedItems.length === 1 ? 'item was' : 'items were'} removed from your cart.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowClearSuccess(false)}
                    className="px-3 py-2 text-green-600 hover:bg-green-200 rounded-lg transition-colors text-lg"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="section-padding">
          <div className="content-container">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2C3E50' }}>
                Shopping Cart
              </h1>
              <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: '#FF6B6B' }}></div>
            </div>

            {/* Empty State */}
            <div className="text-center py-12">
              <div 
                className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#F8F9FA' }}
              >
                <ShoppingBag size={64} style={{ color: '#FF6B6B' }} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: '#2C3E50' }}>
                Your Cart is Empty
              </h2>
              <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: '#2C3E50', opacity: 0.8 }}>
                Discover amazing products and start building your perfect collection. 
                Every great journey begins with a single item!
              </p>
            
              {/* Call-to-action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/products"
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                  style={{ backgroundColor: '#FF6B6B' }}
                >
                  <ShoppingBag size={24} />
                  Start Shopping
                  <ArrowRight size={24} />
                </Link>
                <Link 
                  to="/categories"
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg border-2"
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: '#20B2AA',
                    borderColor: '#20B2AA'
                  }}
                >
                  Browse Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main cart with items
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFCF3' }}>
      {/* Success Notification - Fixed at top when shown */}
      {showClearSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
          <div className="p-4 rounded-2xl shadow-xl border-l-4 success-banner"
               style={{ 
                 backgroundColor: '#d4edda', 
                 borderColor: '#28a745'
               }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: '#28a745' }}>
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-green-800">Cart cleared successfully!</p>
                  <p className="text-sm text-green-700">
                    {clearedItems.length} {clearedItems.length === 1 ? 'item was' : 'items were'} removed from your cart.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleUndoClear}
                  className="px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-200 rounded-lg transition-colors"
                >
                  Undo
                </button>
                <button 
                  onClick={() => setShowClearSuccess(false)}
                  className="px-3 py-2 text-green-600 hover:bg-green-200 rounded-lg transition-colors text-lg"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="section-padding">
        <div className="content-container">
          {/* Modern Header - Ultra Compact */}
          <div className="text-center mb-2 sm:mb-3 lg:mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2" style={{ color: '#2C3E50' }}>
              Shopping Cart
            </h1>
            <div className="flex items-center justify-center gap-1 mb-1 sm:mb-2">
              <div className="w-4 sm:w-6 h-0.5 rounded-full" style={{ backgroundColor: '#FF6B6B' }}></div>
              <div className="w-2 sm:w-3 h-0.5 rounded-full" style={{ backgroundColor: '#20B2AA' }}></div>
              <div className="w-4 sm:w-6 h-0.5 rounded-full" style={{ backgroundColor: '#FF6B6B' }}></div>
            </div>
            <p className="text-sm sm:text-base font-medium" style={{ color: '#2C3E50', opacity: 0.8 }}>
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items Section */}
            <div className="xl:col-span-2 space-y-2 sm:space-y-3 lg:space-y-4">
              {cart.map((item, index) => (
              <div 
                key={item.id || `cart-item-${item.name}-${index}`} 
                  className="rounded-xl sm:rounded-2xl shadow-lg p-2 sm:p-3 lg:p-4 transition-all duration-300 hover:shadow-2xl transform hover:scale-[1.02]"
                  style={{ backgroundColor: 'white' }}
                >
                  <div className="flex flex-col sm:flex-row lg:flex-row gap-2 sm:gap-3 lg:gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                      <div 
                        className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center shadow-md"
                        style={{ backgroundColor: '#F8F9FA' }}
                      >
                        {(() => {
                          // Prioritize image fields: image, mainImage, then images array
                          const imageSource = item.image || item.mainImage || (item.images && item.images[0]) || item.imageUrl;
                          const imageUrl = getImageUrl(imageSource);
                          console.log('Cart item image URL resolution:', {
                            productName: item.name,
                            imageSource: imageSource,
                            resolvedUrl: imageUrl,
                            itemImages: item.images,
                            itemImage: item.image,
                            itemMainImage: item.mainImage,
                            itemImageUrl: item.imageUrl
                          });
                          return (
                            <img 
                              src={imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.log('Cart item image failed to load:', {
                                  productName: item.name,
                                  originalSrc: e.target.src,
                                  imageSource: imageSource,
                                  fullItem: item
                                });
                                e.target.src = getImageUrl('/images/DJSpeaker1.png');
                              }}
                            />
                          );
                        })()}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2 sm:space-y-3 text-center sm:text-left">
                      <div>
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-0.5 sm:mb-1" style={{ color: '#2C3E50' }}>
                          {item.name}
                        </h3>
                        <p className="text-sm sm:text-base" style={{ color: '#2C3E50', opacity: 0.7 }}>
                          {item.category}
                        </p>
                      </div>

                      <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              className="sm:w-3 sm:h-3"
                              fill={i < 4 ? '#FFD700' : 'none'} 
                              style={{ color: '#FFD700' }} 
                            />
                          ))}
                        </div>
                        <span className="text-xs" style={{ color: '#2C3E50', opacity: 0.6 }}>
                          (4.0)
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 sm:gap-3">
                        {/* Quantity Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="text-sm font-medium" style={{ color: '#2C3E50' }}>Quantity:</span>
                          <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
                              style={{ backgroundColor: '#F8F9FA', color: '#2C3E50' }}
                            >
                              <Minus size={12} className="sm:w-3 sm:h-3" />
                            </button>
                            <span className="text-base sm:text-lg font-bold w-8 sm:w-10 text-center" style={{ color: '#2C3E50' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
                              style={{ backgroundColor: '#20B2AA', color: 'white' }}
                            >
                              <Plus size={12} className="sm:w-3 sm:h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
                          <div className="text-center sm:text-right">
                            <div className="text-lg sm:text-xl font-bold" style={{ color: '#FF6B6B' }}>
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            <div className="text-xs" style={{ color: '#2C3E50', opacity: 0.6 }}>
                              {formatPrice(item.price)} each
                            </div>
                          </div>
                          
                          <div className="flex gap-1 sm:gap-2">
                            <button 
                              onClick={() => handleWishlistToggle(item)}
                              className="p-1.5 sm:p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-md" 
                              style={{ 
                                backgroundColor: isInWishlist(item._id || item.id) ? '#FFE5E5' : '#F8F9FA',
                                transform: 'translateY(0px)'
                              }}
                              title={isInWishlist(item._id || item.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                              <Heart 
                                size={14} 
                                className="sm:w-4 sm:h-4"
                                style={{ color: '#FF6B6B' }}
                                fill={isInWishlist(item._id || item.id) ? '#FF6B6B' : 'none'}
                              />
                            </button>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 sm:p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-md" 
                              style={{ backgroundColor: '#FFE5E5' }}
                              title="Remove from Cart"
                            >
                              <Trash2 size={14} className="sm:w-4 sm:h-4" style={{ color: '#FF6B6B' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Section */}
            <div className="xl:col-span-1">
              <div 
                className="rounded-2xl sm:rounded-3xl shadow-lg p-3 sm:p-4 lg:p-6 sticky top-4 sm:top-8"
                style={{ backgroundColor: 'white' }}
              >
                {/* Summary Header */}
                <div className="text-center mb-2 sm:mb-3">
                  <h2 className="text-lg sm:text-xl font-bold mb-1" style={{ color: '#2C3E50' }}>
                    Order Summary
                  </h2>
                  <div className="w-8 sm:w-12 h-0.5 mx-auto rounded-full" style={{ backgroundColor: '#FF6B6B' }}></div>
                </div>

                {/* Enhanced Order Summary - Amazon/Flipkart Style */}
                <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                  {/* Subtotal and Items */}
                  <div className="flex justify-between items-center py-1 sm:py-1.5">
                    <span className="text-sm sm:text-base lg:text-lg" style={{ color: '#2C3E50' }}>
                      Price ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
                    </span>
                    <span className="text-sm sm:text-base lg:text-lg font-semibold" style={{ color: '#2C3E50' }}>
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {/* Applied Coupon Display - Professional Style */}
                  {appliedCoupon && (
                    <div 
                      className="p-2 sm:p-3 rounded-lg border-l-4 relative"
                      style={{ 
                        backgroundColor: '#E8F5E8', 
                        borderColor: '#28a745',
                        border: '1px solid #28a745'
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="p-0.5 rounded-full" style={{ backgroundColor: '#28a745' }}>
                            <Check size={12} className="sm:w-3 sm:h-3 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1 mb-0.5">
                              <span className="font-bold text-green-800 text-xs">
                                {appliedCoupon.code}
                              </span>
                              <span className="text-xs px-1 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                                Applied
                              </span>
                            </div>
                            <p className="text-xs text-green-700 mb-0.5">
                              {appliedCoupon.description}
                            </p>
                            <p className="text-xs font-semibold text-green-800">
                              You saved {formatPrice(couponDiscount)}!
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={handleCouponRemoved}
                          className="text-green-600 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="Remove coupon"
                        >
                          <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Discount Breakdown */}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-green-700">
                        Coupon Discount ({appliedCoupon?.code})
                      </span>
                      <span className="text-sm font-bold text-green-700">
                        -{formatPrice(couponDiscount)}
                      </span>
                    </div>
                  )}

                  {/* Shipping */}
                  <div className="flex justify-between items-center py-1 sm:py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: '#2C3E50' }}>
                        Delivery Charges
                      </span>
                      {shipping === 0 && (
                        <span className="text-xs px-1 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                          FREE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck size={14} style={{ color: shipping === 0 ? '#20B2AA' : '#2C3E50' }} />
                      {shipping > 0 ? (
                        <div className="text-right">
                          <span className="text-sm font-semibold" style={{ color: '#2C3E50' }}>
                            {formatPrice(shipping)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-semibold" style={{ color: '#20B2AA' }}>
                          FREE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subtotal before discount (only show if coupon applied) */}
                  {couponDiscount > 0 && (
                    <>
                      <div 
                        className="border-t pt-1 sm:pt-2"
                        style={{ borderColor: '#E5E7EB' }}
                      >
                        <div className="flex justify-between items-center py-1">
                          <span className="text-sm" style={{ color: '#6B7280' }}>
                            Total (before discount)
                          </span>
                          <span className="text-sm line-through" style={{ color: '#6B7280' }}>
                            {formatPrice(subtotal + shipping)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Final Total with Professional Styling */}
                  <div 
                    className="border-t-2 pt-2 sm:pt-3 mt-2 sm:mt-3"
                    style={{ borderColor: '#F8F9FA' }}
                  >
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <span className="text-base sm:text-lg font-bold" style={{ color: '#2C3E50' }}>
                        Total Amount
                      </span>
                      <div className="text-right">
                        <div className="text-xl sm:text-2xl font-bold" style={{ color: '#FF6B6B' }}>
                          {formatPrice(total)}
                        </div>
                        {couponDiscount > 0 && (
                          <div className="text-xs text-green-600 font-medium mt-0.5">
                            You saved {formatPrice(couponDiscount)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Total Savings Highlight */}
                    {couponDiscount > 0 && (
                      <div 
                        className="p-2 rounded text-center"
                        style={{ backgroundColor: '#FFF7ED', border: '1px solid #FB923C' }}
                      >
                        <span className="text-orange-700 font-semibold text-sm">
                          🎉 Total Savings: {formatPrice(couponDiscount)} with {appliedCoupon?.code}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {subtotal < 1000 && (
                  <div 
                    className="rounded-xl p-2 sm:p-3 mb-3 sm:mb-4 text-center"
                    style={{ backgroundColor: '#F8F9FA' }}
                  >
                    <Truck size={16} className="mx-auto mb-1" style={{ color: '#20B2AA' }} />
                    <p className="text-xs mb-1" style={{ color: '#2C3E50' }}>
                      Add {formatPrice(1000 - subtotal)} more for
                    </p>
                    <p className="text-sm font-bold" style={{ color: '#20B2AA' }}>
                      FREE SHIPPING!
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: '#20B2AA',
                          width: `${Math.min((subtotal / 1000) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Coupon Input */}
                <div className="mb-3 sm:mb-4">
                  <CouponInput 
                    subtotal={subtotal}
                    appliedCoupon={appliedCoupon}
                    onCouponApplied={handleCouponApplied} 
                    onCouponRemoved={handleCouponRemoved} 
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  <button 
                    onClick={handleProceedToCheckout}
                    className="block w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-white text-center transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-base sm:text-lg"
                    style={{ backgroundColor: '#FF6B6B' }}
                  >
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <Shield size={20} className="sm:w-6 sm:h-6" />
                      Proceed to Checkout
                      <ArrowRight size={20} className="sm:w-6 sm:h-6" />
                    </div>
                  </button>

                  <button 
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="block w-full py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-center transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
                    style={{ 
                      backgroundColor: isClearing ? '#f8f8f8' : '#FFF5F5', 
                      color: '#FF6B6B',
                      border: '2px solid #FF6B6B',
                      opacity: isClearing ? 0.7 : 1
                    }}
                  >
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      {isClearing ? (
                        <>
                          <Loader2 size={18} className="sm:w-5 sm:h-5 animate-spin" />
                          Clearing Cart...
                        </>
                      ) : (
                        <>
                          <Trash2 size={18} className="sm:w-5 sm:h-5" />
                          Clear Cart
                        </>
                      )}
                    </div>
                  </button>

                  <Link 
                    to="/products"
                    className="block w-full py-3 rounded-2xl font-semibold text-center transition-all duration-300 hover:scale-105 border-2"
                    style={{ 
                      backgroundColor: 'transparent', 
                      color: '#20B2AA',
                      borderColor: '#20B2AA'
                    }}
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t" style={{ borderColor: '#F8F9FA' }}>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Shield size={20} style={{ color: '#20B2AA' }} />
                      <span className="text-xs font-medium" style={{ color: '#2C3E50' }}>
                        Secure Payment
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Truck size={20} style={{ color: '#20B2AA' }} />
                      <span className="text-xs font-medium" style={{ color: '#2C3E50' }}>
                        Fast Delivery
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-center mt-4" style={{ color: '#2C3E50', opacity: 0.7 }}>
                    SSL encrypted • 30-day returns • 24/7 support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;