import React, { useState } from 'react';
import { Tag, Check, X, Loader } from 'lucide-react';
import { couponsAPI } from '../utils/api';

const CouponInput = ({ subtotal, onCouponApplied, appliedCoupon, onCouponRemoved }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await couponsAPI.validateCoupon(couponCode.trim(), subtotal);
      
      console.log('Coupon API response:', response);
      
      // Ensure we have valid data before sending to parent
      const discountAmount = Number(response.data?.discount?.amount) || 0;
      
      // Call parent component with coupon data
      onCouponApplied({
        code: response.data.coupon.code,
        discountAmount: discountAmount,
        discountType: response.data.coupon.discountType,
        discountValue: response.data.coupon.discountValue,
        description: response.data.coupon.description
      });

      setCouponCode('');
      setError(null);
    } catch (error) {
      console.error('Coupon validation error:', error);
      setError(error.message || 'Invalid coupon code');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    onCouponRemoved();
    setError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  return (
    <>
      {/* Only show coupon input if no coupon is applied */}
      {!appliedCoupon && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#20B2AA', color: 'white' }}>
              <Tag size={20} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: '#2C3E50' }}>
              Have a Coupon Code?
            </h3>
          </div>

          {/* Coupon Input Form */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter coupon code (e.g., WELCOME10)"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal text-lg font-mono text-brand-navy placeholder-gray-500"
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleApplyCoupon}
                disabled={loading || !couponCode.trim()}
                className="px-6 py-3 bg-gradient-to-r from-brand-coral to-brand-teal text-white rounded-xl font-semibold hover:from-brand-teal hover:to-brand-navy transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  'Apply'
                )}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                <X size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Quick Coupon Suggestions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-sm text-brand-navy opacity-70">Try:</span>
              {['WELCOME10', 'SAVE50', 'NEWUSER'].map((code) => (
                <button
                  key={code}
                  onClick={() => setCouponCode(code)}
                  className="px-3 py-1 text-xs bg-brand-gray hover:bg-brand-teal hover:text-white rounded-full transition-all duration-200 text-brand-navy"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Link to Coupons Page */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <a
              href="/coupons"
              target="_blank"
              className="text-sm text-brand-teal hover:text-brand-navy transition-colors flex items-center gap-1"
            >
              <Tag size={14} />
              View all available coupons
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default CouponInput;