import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { couponsAPI } from '../utils/api';
import { FiCopy, FiTag, FiCalendar, FiPercent } from 'react-icons/fi';
import { BiRupee } from 'react-icons/bi';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponsAPI.getCoupons();
      setCoupons(response.data.coupons);
      setError(null);
    } catch (error) {
      setError('Failed to load coupons');
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDiscountText = (coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue} OFF`;
    } else {
      return `${coupon.discountValue} OFF`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream py-4">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral mx-auto"></div>
            <p className="mt-4 text-brand-navy">Loading amazing deals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Exclusive Coupons & Deals - SonicMart</title>
        <meta name="description" content="Save more with exclusive coupon codes from SonicMart. Get amazing discounts on premium audio equipment and accessories." />
        <meta name="keywords" content="coupons, deals, discounts, audio equipment, headphones, speakers" />
      </Helmet>

      <div className="min-h-screen bg-brand-cream py-3 sm:py-4 lg:py-6">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <FiTag className="text-2xl sm:text-3xl text-brand-coral mr-2 sm:mr-3" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-navy">Exclusive Coupons</h1>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-brand-navy max-w-2xl mx-auto opacity-80">
              Save more with our exclusive coupon codes! Click to copy and apply at checkout.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg mb-4 sm:mb-6">
              <p>{error}</p>
            </div>
          )}

          {coupons.length === 0 && !loading && !error ? (
            <div className="text-center py-6 sm:py-8 bg-white rounded-lg shadow-sm">
              <FiTag className="text-4xl sm:text-5xl text-brand-gray mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-brand-navy mb-2">No Active Coupons</h3>
              <p className="text-sm sm:text-base text-brand-navy opacity-60">Check back later for amazing deals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {coupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
                >
                  {/* Coupon Header */}
                  <div className="bg-gradient-to-r from-brand-coral to-brand-teal p-3 sm:p-4 lg:p-6 text-white">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center">
                        {coupon.discountType === 'percentage' ? (
                          <FiPercent className="text-lg sm:text-xl lg:text-2xl mr-2" />
                        ) : (
                          <BiRupee className="text-lg sm:text-xl lg:text-2xl mr-2" />
                        )}
                        <span className="text-lg sm:text-xl lg:text-2xl font-bold">
                          {getDiscountText(coupon)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Coupon Code */}
                    <div className="bg-white rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 border-2 border-white border-opacity-30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs sm:text-sm text-brand-navy opacity-70">Coupon Code</p>
                          <p className="text-base sm:text-lg lg:text-xl font-mono font-bold text-brand-navy">{coupon.code}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          className="bg-brand-teal hover:bg-brand-navy text-white p-1.5 sm:p-2 rounded-lg transition-colors duration-200"
                          title="Copy coupon code"
                        >
                          <FiCopy className="text-sm sm:text-base lg:text-lg" />
                        </button>
                      </div>
                    </div>

                    {copiedCode === coupon.code && (
                      <div className="text-center text-xs sm:text-sm bg-green-500 bg-opacity-80 rounded p-1 text-white">
                        ✓ Copied to clipboard!
                      </div>
                    )}
                  </div>

                  {/* Coupon Details */}
                  <div className="p-3 sm:p-4 lg:p-6">
                    {coupon.description && (
                      <p className="text-sm sm:text-base text-brand-navy mb-3 sm:mb-4">{coupon.description}</p>
                    )}

                    {/* Terms */}
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-brand-navy opacity-80">
                      {coupon.minOrderAmount && (
                        <div className="flex items-center">
                          <span className="text-brand-teal mr-2">•</span>
                          Minimum order: ₹{coupon.minOrderAmount}
                        </div>
                      )}
                      
                      {coupon.maxDiscountAmount && (
                        <div className="flex items-center">
                          <span className="text-brand-teal mr-2">•</span>
                          Maximum discount: ₹{coupon.maxDiscountAmount}
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <FiCalendar className="text-brand-teal mr-2" />
                        Valid until {formatDate(coupon.expiresAt)}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => copyToClipboard(coupon.code)}
                      className="w-full mt-4 bg-gradient-to-r from-brand-coral to-brand-teal text-white py-3 px-4 rounded-lg hover:from-brand-teal hover:to-brand-navy transition-all duration-200 font-semibold"
                    >
                      {copiedCode === coupon.code ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* How to Use Section */}
          {coupons.length > 0 && (
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-brand-navy mb-6 text-center">
                How to Use Coupons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-brand-coral bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-brand-coral">1</span>
                  </div>
                  <h3 className="font-semibold text-brand-navy mb-2">Copy Code</h3>
                  <p className="text-brand-navy opacity-70">Click on any coupon to copy the code</p>
                </div>
                <div className="text-center">
                  <div className="bg-brand-teal bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-brand-teal">2</span>
                  </div>
                  <h3 className="font-semibold text-brand-navy mb-2">Shop</h3>
                  <p className="text-brand-navy opacity-70">Add products to cart and proceed to checkout</p>
                </div>
                <div className="text-center">
                  <div className="bg-brand-navy bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-brand-navy">3</span>
                  </div>
                  <h3 className="font-semibold text-brand-navy mb-2">Apply & Save</h3>
                  <p className="text-brand-navy opacity-70">Paste the code at checkout and enjoy savings</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CouponsPage;