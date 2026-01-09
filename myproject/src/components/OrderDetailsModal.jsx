import React from 'react';
import { getImageUrl } from '../utils/imageUrl';

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = new Date(date);
    const dateStr = dateObj.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const timeStr = dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${dateStr} at ${timeStr}`;
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '₹0.00';
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'returned':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const calculateTotal = () => {
    // Use the stored totalPrice first (this includes discounts)
    if (order.totalPrice !== undefined && order.totalPrice !== null) {
      return order.totalPrice;
    }
    if (order.totalAmount && order.totalAmount > 0) {
      return order.totalAmount;
    }
    if (order.total && order.total > 0) {
      return order.total;
    }
    // Calculate from order items if total not available
    if (order.orderItems && order.orderItems.length > 0) {
      return order.orderItems.reduce((sum, item) => {
        return sum + ((item.price || 0) * (item.quantity || 0));
      }, 0);
    }
    return 0;
  };

  const calculateSubtotal = () => {
    if (order.itemsPrice && order.itemsPrice > 0) {
      return order.itemsPrice;
    }
    // Calculate from order items
    if (order.orderItems && order.orderItems.length > 0) {
      return order.orderItems.reduce((sum, item) => {
        return sum + ((item.price || 0) * (item.quantity || 0));
      }, 0);
    }
    return 0;
  };

  const calculateDiscountAmount = () => {
    // If discountAmount is stored and valid, use it
    if (order.discountAmount && order.discountAmount > 0) {
      return order.discountAmount;
    }
    
    // If coupon is applied but discountAmount is 0, calculate from price difference
    if (order.couponCode) {
      const subtotal = calculateSubtotal();
      const shipping = order.shippingPrice || 0;
      const tax = order.taxPrice || 0;
      const total = order.totalPrice || order.totalAmount || order.total || 0;
      
      const expectedTotal = subtotal + shipping + tax;
      const discount = expectedTotal - total;
      
      return discount > 0 ? discount : 0;
    }
    
    return 0;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-xs sm:max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-medium text-gray-900" id="modal-title">
                Order Details
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 p-1"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-4 sm:px-6 sm:pb-6">
            {/* Header Row - Responsive grid */}
            <div className="bg-gray-100 rounded p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{order.orderNumber || `SA-2025-000015`}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.orderStatus || 'pending')}`}>
                    {getStatusText(order.orderStatus || 'pending')}
                  </span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Order Date</p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">{formatDate(order.createdAt || order.orderDate)}</p>
                </div>
              </div>
              
              {/* Price Breakdown - Full Width Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="lg:max-w-md">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Price Breakdown</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    {(order.shippingPrice || 0) > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-700">Shipping:</span>
                        <span className="font-medium">{formatCurrency(order.shippingPrice)}</span>
                      </div>
                    )}
                    {(order.taxPrice || 0) > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-700">Tax:</span>
                        <span className="font-medium">{formatCurrency(order.taxPrice)}</span>
                      </div>
                    )}
                    {order.couponCode && calculateDiscountAmount() > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm text-green-600">
                        <span>Coupon Discount ({order.couponCode}):</span>
                        <span className="font-medium">-{formatCurrency(calculateDiscountAmount())}</span>
                      </div>
                    )}
                    <div className="border-t pt-1 mt-2">
                      <div className="flex justify-between text-sm sm:text-base font-semibold">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-gray-900">{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Responsive layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              
              {/* Left Column: Order Items + Payment Information */}
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Order Items</h4>
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
                  {/* Show message when no items, or show actual items */}
                  {(!order.orderItems || order.orderItems.length === 0) ? (
                    <p className="text-xs sm:text-sm text-gray-500">No items to display</p>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {order.orderItems?.map((item, index) => (
                        <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                          <div className="flex-shrink-0">
                            {(item.image || item.images?.[0] || item.product?.image || item.product?.images?.[0]) ? (
                              <img
                                src={getImageUrl(item.image || item.images?.[0] || item.product?.image || item.product?.images?.[0])}
                                alt={item.name}
                                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                                onError={(e) => {
                                  e.target.src = '/images/placeholder.jpg';
                                  e.target.onerror = null;
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded flex items-center justify-center">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 mb-1 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                            <p className="text-xs text-gray-500">Price: {formatCurrency(item.price)}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs sm:text-sm font-semibold text-gray-900">{formatCurrency((item.price || 0) * (item.quantity || 0))}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Payment Information - moved to left column */}
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Payment Information</h4>
                  <div className="bg-gray-100 rounded-lg p-3 sm:p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Payment Method</p>
                        <p className="text-xs sm:text-sm text-gray-900">{order.paymentMethod || 'COD'}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Payment Status</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getPaymentStatusColor(order.isPaid ? 'paid' : 'pending')}`}>
                          {getStatusText(order.isPaid ? 'paid' : 'pending')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Shipping Address and Order Timeline */}
              <div>
                {/* Shipping Address */}
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Shipping Address</h4>
                <div className="bg-gray-100 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
                  <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                    <p className="font-medium text-gray-900">{order.shippingAddress?.fullName || order.shippingAddress?.name || 'N/A'}</p>
                    {order.shippingAddress?.address && <p>{order.shippingAddress.address}</p>}
                    <p>{order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.state || 'N/A'}</p>
                    {order.shippingAddress?.pincode && <p>PIN: {order.shippingAddress.pincode}</p>}
                    <p>{order.shippingAddress?.country || 'India'}</p>
                    {order.shippingAddress?.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                  </div>
                </div>

                {/* Order Timeline */}
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Order Timeline</h4>
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">Order Placed</p>
                        <p className="text-xs sm:text-sm text-gray-600">{formatDate(order.createdAt || order.orderDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">Last Updated</p>
                        <p className="text-xs sm:text-sm text-gray-600">{formatDate(order.updatedAt || order.createdAt || order.orderDate)}</p>
                      </div>
                    </div>

                    {/* Show cancellation status if order is cancelled */}
                    {order.orderStatus?.toLowerCase() === 'cancelled' && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">Order Cancelled</p>
                          <p className="text-xs sm:text-sm text-gray-600">{formatDate(order.cancelledAt || order.updatedAt || order.createdAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 sm:px-4 sm:py-2 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;