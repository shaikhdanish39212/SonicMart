import React from 'react';

const ShippingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-coral to-brand-navy text-white py-3 sm:py-4 lg:py-6">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">Audio Equipment Shipping</h1>
          <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Safe, secure delivery of headphones, speakers & audio accessories across India with premium packaging and real-time tracking.
          </p>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-4 sm:py-6 lg:py-8 bg-white">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-brand-navy mb-4 sm:mb-6 lg:mb-8">Audio Equipment Delivery Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-gradient-to-br from-brand-cream to-brand-gray rounded-xl p-4 sm:p-6 lg:p-8 border border-brand-teal">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-teal bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Standard Audio Delivery</h3>
                <p className="text-3xl font-bold text-brand-teal mb-2">FREE</p>
                <p className="text-sm text-gray-600 mb-4">On audio orders above ₹999</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• 3-5 business days</p>
                  <p>• Secure audio packaging</p>
                  <p>• Real-time tracking</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-cream to-brand-gray rounded-xl p-8 border border-brand-coral">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-coral bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-coral" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11h14V7l-7-5z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Express Audio Delivery</h3>
                <p className="text-3xl font-bold text-brand-coral mb-2">₹149</p>
                <p className="text-sm text-gray-600 mb-4">Same/Next day for premium audio</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• 0-1 business day</p>
                  <p>• Metro cities only</p>
                  <p>• Premium audio packaging</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-cream to-brand-gray rounded-xl p-8 border border-brand-teal">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-teal bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Scheduled Audio Delivery</h3>
                <p className="text-3xl font-bold text-brand-teal mb-2">₹99</p>
                <p className="text-sm text-gray-600 mb-4">Choose your audio delivery slot</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• 2-4 business days</p>
                  <p>• Audio specialist time slots</p>
                  <p>• Setup assistance available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Timeline */}
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-4 sm:mb-6 lg:mb-8">Delivery Timeline by Region</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Region</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Standard Delivery</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Express Delivery</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Major Cities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Metro Cities</td>
                  <td className="px-6 py-4 text-gray-600">1-2 days</td>
                  <td className="px-6 py-4 text-gray-600">Same day</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Tier 1 Cities</td>
                  <td className="px-6 py-4 text-gray-600">2-3 days</td>
                  <td className="px-6 py-4 text-gray-600">Next day</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Pune, Ahmedabad, Surat, Jaipur, Lucknow, Kanpur</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Tier 2 Cities</td>
                  <td className="px-6 py-4 text-gray-600">3-4 days</td>
                  <td className="px-6 py-4 text-gray-600">1-2 days</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Indore, Bhopal, Visakhapatnam, Vadodara, Coimbatore</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Other Cities</td>
                  <td className="px-6 py-4 text-gray-600">4-5 days</td>
                  <td className="px-6 py-4 text-gray-600">2-3 days</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Rest of India</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Shipping Process */}
      <section className="py-4 sm:py-6 lg:py-8 bg-white">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-4 sm:mb-6 lg:mb-8">How We Ship Your Order</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-lg sm:text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Processing</h3>
              <p className="text-sm text-gray-600">Your order is verified and prepared for shipping within 24 hours.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Packaging</h3>
              <p className="text-sm text-gray-600">Items are carefully packed with protective materials to ensure safe delivery.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dispatch</h3>
              <p className="text-sm text-gray-600">Your package is handed over to our delivery partner with tracking information.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery</h3>
              <p className="text-sm text-gray-600">Your order is delivered to your doorstep with real-time tracking updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Partners */}
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-4 sm:mb-6 lg:mb-8">Our Shipping Partners</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 items-center">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 text-center hover:shadow-md transition-shadow">
              <div className="font-bold text-red-600 text-lg sm:text-xl">BlueDart</div>
              <p className="text-xs text-gray-500 mt-1">Express Delivery</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 text-center hover:shadow-md transition-shadow">
              <div className="font-bold text-orange-600 text-lg sm:text-xl">Delhivery</div>
              <p className="text-xs text-gray-500 mt-1">Nationwide Coverage</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <div className="font-bold text-yellow-600 text-xl">Ekart</div>
              <p className="text-xs text-gray-500 mt-1">Flipkart Logistics</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <div className="font-bold text-green-600 text-xl">DTDC</div>
              <p className="text-xs text-gray-500 mt-1">Reliable Service</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <div className="font-bold text-blue-600 text-xl">FedEx</div>
              <p className="text-xs text-gray-500 mt-1">International</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <div className="font-bold text-indigo-600 text-xl">Xpressbees</div>
              <p className="text-xs text-gray-500 mt-1">Last Mile</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Shipping FAQ</h2>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Is free shipping available?</h3>
              <p className="text-gray-600">Yes! We offer free standard shipping on all orders above ₹499. Orders below this amount have a shipping charge of ₹49.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Can I change my delivery address after placing an order?</h3>
              <p className="text-gray-600">Yes, you can change your delivery address within 2 hours of placing the order. After that, the order enters processing and address changes may not be possible.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">What if I'm not available during delivery?</h3>
              <p className="text-gray-600">Our delivery partners will attempt delivery up to 3 times. You can also reschedule delivery or choose a pickup point for your convenience.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Do you ship to remote areas?</h3>
              <p className="text-gray-600">Yes, we deliver to most PIN codes across India. Remote areas might take 1-2 additional days. You can check serviceability during checkout.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingPage;