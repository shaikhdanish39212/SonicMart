import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getImageUrl } from '../utils/imageUrl';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  
  // Get order details from navigation state 
  const orderDetails = location.state; 
  
  // Redirect if no order details found 
  useEffect(() => { 
    if (!orderDetails) { 
      navigate('/'); 
    } 
  }, [orderDetails, navigate]);
  
  if (!orderDetails) { 
    return null; 
  }
  
  const { orderId, orderTotal, items, shippingInfo, paymentMethod, paymentResult, transactionId } = orderDetails;
  
  const formatPrice = (price) => { 
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR' 
    }).format(price);
  };
  
  const getPaymentMethodLabel = (method) => { 
    switch (method) { 
      case 'card': return 'Credit/Debit Card'; 
      case 'upi': return 'UPI Payment'; 
      case 'cod': return 'Cash on Delivery'; 
      default: return method; 
    } 
  };
  
  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 7);
    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900">Order Confirmed!</h1>
          </div>
          <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        {/* Horizontal Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel - Order Details & Status (8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border" style={{ borderColor: '#20B2AA' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold" style={{ color: '#2C3E50' }}>Order #{orderId}</h2>
                  <p className="text-gray-600 text-sm">Placed on {new Date().toLocaleDateString('en-IN')}</p>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#FEFCF3', color: '#20B2AA', border: '1px solid #20B2AA' }}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Order Confirmed
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl p-4" style={{ backgroundColor: '#F8F9FA' }}>
                  <h3 className="font-semibold mb-2" style={{ color: '#2C3E50' }}>Order Total</h3>
                  <p className="text-xl font-bold" style={{ color: '#FF6B6B' }}>{formatPrice(orderTotal)}</p>
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: '#F8F9FA' }}>
                  <h3 className="font-semibold mb-2" style={{ color: '#2C3E50' }}>Payment Method</h3>
                  <p className="text-gray-700">{getPaymentMethodLabel(paymentMethod)}</p>
                </div>
                {transactionId && (
                  <div className="rounded-xl p-4" style={{ backgroundColor: '#F8F9FA' }}>
                    <h3 className="font-semibold mb-2" style={{ color: '#2C3E50' }}>Transaction ID</h3>
                    <p className="text-gray-700 text-sm font-mono">{transactionId}</p>
                  </div>
                )}
                <div className="rounded-xl p-4" style={{ backgroundColor: '#F8F9FA' }}>
                  <h3 className="font-semibold mb-2" style={{ color: '#2C3E50' }}>Estimated Delivery</h3>
                  <p className="text-gray-700">{getEstimatedDeliveryDate()}</p>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            {paymentResult && (
              <div className="p-4 border rounded-2xl" style={{ backgroundColor: '#FEFCF3', borderColor: '#20B2AA' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" style={{ color: '#20B2AA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold" style={{ color: '#2C3E50' }}>Payment {paymentResult.status === 'COMPLETED' ? 'Successful' : paymentResult.status}</h3>
                </div>
                <p className="text-gray-700 text-sm mt-1">
                  {paymentMethod === 'cod' ? 'Payment will be collected on delivery' : `Payment of ${formatPrice(paymentResult.amount)} was processed successfully`}
                </p>
                {paymentResult.cardLast4 && (
                  <p className="text-gray-700 text-sm">Card ending in ****{paymentResult.cardLast4}</p>
                )}
              </div>
            )}

            {/* Order Status Progress */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="font-semibold mb-4" style={{ color: '#2C3E50' }}>Order Status</h3>
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#20B2AA' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="mt-2 text-sm font-medium" style={{ color: '#20B2AA' }}>Order Placed</span>
                </div>
                <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="mt-2 text-sm text-gray-500">Processing</span>
                </div>
                <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="mt-2 text-sm text-gray-500">Shipped</span>
                </div>
                <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <span className="mt-2 text-sm text-gray-500">Delivered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Items & Actions (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Items Ordered */}
            <div className="bg-white rounded-2xl shadow-md p-6 border" style={{ borderColor: '#20B2AA' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#2C3E50' }}>Items Ordered</h2>
              <div className="space-y-4">
                {items.map((item) => {
                  const imageUrl = getImageUrl(item.image || item.images?.[0] || item.imageUrl);
                  console.log('Order confirmation item:', { 
                    name: item.name, 
                    originalImage: item.image, 
                    processedImageUrl: imageUrl 
                  });
                  
                  return (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-xl" style={{ borderColor: '#E5E7EB' }}>
                      <img 
                        src={imageUrl} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          console.warn('Image failed to load, using fallback:', imageUrl);
                          e.target.src = '/images/DJSpeaker1.png'; // Fallback image
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="font-medium" style={{ color: '#FF6B6B' }}>{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-md p-6 border" style={{ borderColor: '#20B2AA' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#2C3E50' }}>Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2" style={{ color: '#2C3E50' }}>Delivery Address</h3>
                  <div className="text-gray-700 text-sm">
                    <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}</p>
                    <p>{shippingInfo.country}</p>
                    {shippingInfo.phone && <p>Phone: {shippingInfo.phone}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-md p-6 border" style={{ borderColor: '#20B2AA' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: '#2C3E50' }}>What's Next?</h2>
              <div className="space-y-3">
                <Link 
                  to="/products" 
                  className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-white font-medium transition-colors"
                  style={{ backgroundColor: '#20B2AA' }}
                >
                  Continue Shopping
                </Link>
                <Link 
                  to="/orders" 
                  state={{ fromOrderConfirmation: true }}
                  className="flex items-center justify-center w-full px-4 py-3 rounded-xl border font-medium transition-colors"
                  style={{ borderColor: '#20B2AA', color: '#20B2AA' }}
                >
                  Track Order
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Information Strip */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-blue-800 mb-3">Important Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Order Confirmation</p>
                <p>You will receive an email confirmation shortly with all order details.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <div>
                <p className="font-medium">Shipping Updates</p>
                <p>We'll send you tracking information once your order ships.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364" />
              </svg>
              <div>
                <p className="font-medium">Returns & Exchanges</p>
                <p>Contact support within 30 days for returns or exchanges.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;