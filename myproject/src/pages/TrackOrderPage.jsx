import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Force scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) {
      setError('Please enter both order number and email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Implement actual order tracking API call
      // const response = await ordersAPI.trackOrder(orderNumber, email);
      
      // Mock order details for now
      setTimeout(() => {
        setOrderDetails({
          orderNumber: orderNumber,
          status: 'Processing',
          estimatedDelivery: '3-5 business days',
          items: [
            { name: 'Sony WH-1000XM4 Headphones', quantity: 1, price: 29999 }
          ],
          total: 29999,
          trackingNumber: 'TRK' + orderNumber,
          statusHistory: [
            { status: 'Order Placed', date: '2025-09-24', time: '10:30 AM' },
            { status: 'Processing', date: '2025-09-25', time: '02:15 PM' },
            { status: 'Shipped', date: '2025-09-26', time: '09:45 AM' }
          ]
        });
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to track order. Please check your details and try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Track Your Order - SonicMart</title>
        <meta name="description" content="Track your SonicMart order status and delivery information." />
      </Helmet>

      <div className="min-h-screen bg-brand-gray py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-brand-navy mb-4">Track Your Order</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enter your order details below to track your SonicMart purchase and get real-time delivery updates.
            </p>
          </div>

          {/* Track Order Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <form onSubmit={handleTrackOrder} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-brand-navy mb-2">
                    Order Number
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Enter your order number (e.g., ORD123456)"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-navy mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-coral text-white py-3 px-6 rounded-lg font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-brand-coral focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Tracking Order...' : 'Track Order'}
              </button>
            </form>
          </div>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-2xl font-bold text-brand-navy mb-2">
                  Order #{orderDetails.orderNumber}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>Status: <span className="font-medium text-brand-teal">{orderDetails.status}</span></span>
                  <span>Tracking: <span className="font-medium">{orderDetails.trackingNumber}</span></span>
                  <span>Estimated Delivery: <span className="font-medium">{orderDetails.estimatedDelivery}</span></span>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-brand-navy mb-4">Order Items</h3>
                <div className="space-y-4">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-brand-gray rounded-lg">
                      <div>
                        <p className="font-medium text-brand-navy">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-brand-navy">₹{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-brand-navy">Total:</span>
                    <span className="text-lg font-bold text-brand-coral">₹{orderDetails.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Status History */}
              <div>
                <h3 className="text-lg font-semibold text-brand-navy mb-4">Order Status History</h3>
                <div className="space-y-4">
                  {orderDetails.statusHistory.map((status, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-brand-teal rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="font-medium text-brand-navy">{status.status}</p>
                        <p className="text-sm text-gray-600">{status.date} at {status.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-brand-navy mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Can't find your order or having issues with tracking? Our customer support team is here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:support@sonicmart.in"
                className="bg-brand-teal text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                Email Support
              </a>
              <a
                href="tel:1800-SONIC-01"
                className="bg-brand-navy text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                Call 1800-SONIC-01
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackOrderPage;