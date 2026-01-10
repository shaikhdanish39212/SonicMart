import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import PaymentService from '../utils/paymentService';
import { ordersAPI } from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';
import RazorpayCheckout from '../components/RazorpayCheckout';
import { useSVGFix } from '../hooks/useSVGFix';

const PlaceOrderPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Get coupon data and pricing from navigation state
  const appliedCoupon = location.state?.appliedCoupon || null;
  const pricingFromCart = location.state || {};

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');



  const [orderNotes, setOrderNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Fix SVG attribute issues
  useSVGFix();

  // Check authentication - redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: '/place-order',
          message: 'Please log in to place an order'
        }
      });
    }
  }, [isAuthenticated, navigate]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Calculate totals - use values from cart page if available, otherwise calculate
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Use pricing from CartPage if available, otherwise calculate
  const subtotal = pricingFromCart.subtotal || getTotalPrice();
  const shippingCost = pricingFromCart.shipping !== undefined ? pricingFromCart.shipping : (subtotal >= 999 ? 0 : 50);
  const couponDiscount = pricingFromCart.couponDiscount || 0;
  const finalTotal = pricingFromCart.total || (subtotal + shippingCost - couponDiscount);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  // Check form validity without side effects (for use in render)
  const isFormValid = () => {
    // Check required shipping fields
    if (!shippingInfo.firstName.trim() || !shippingInfo.lastName.trim() ||
      !shippingInfo.email.trim() || !shippingInfo.phone.trim() ||
      !shippingInfo.address.trim() || !shippingInfo.city.trim() ||
      !shippingInfo.state.trim() || !shippingInfo.pincode.trim()) {
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      return false;
    }

    // Basic phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(shippingInfo.phone)) {
      return false;
    }

    // Basic pincode validation
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(shippingInfo.pincode)) {
      return false;
    }



    return true;
  };

  // Form validation with error setting - only called on submit
  const validateForm = () => {
    const newErrors = {};

    // Shipping validation
    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.pincode.trim()) newErrors.pincode = 'Pincode is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (shippingInfo.email && !emailRegex.test(shippingInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (shippingInfo.phone && !phoneRegex.test(shippingInfo.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Pincode validation
    const pincodeRegex = /^[0-9]{6}$/;
    if (shippingInfo.pincode && !pincodeRegex.test(shippingInfo.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }



    // No additional validation required for Razorpay as it handles all payment details
    // Razorpay will handle payment validation on their secure platform

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission and payment
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Generate order ID
      const orderId = 'ORD' + Date.now();

      // Calculate final amount including COD fees if applicable
      const finalAmountWithFees = finalTotal + (paymentMethod === 'cod' ? 20 : 0);

      // Prepare order details for payment processing
      const orderDetails = {
        orderId,
        amount: finalAmountWithFees,
        items: cart,
        shippingInfo,
        orderNotes,
        taxPrice: 0,
        shippingPrice: shippingCost,
        codFee: paymentMethod === 'cod' ? 20 : 0
      };

      let paymentResult;

      // Process payment based on selected method
      if (paymentMethod === 'razorpay') {
        // This should not happen as Razorpay uses its own component
        throw new Error('Razorpay payments should be handled by the RazorpayCheckout component');
      } else if (paymentMethod === 'cod') {
        // Handle Cash on Delivery payment
        paymentResult = await PaymentService.processCODPayment(orderDetails);
      } else if (paymentMethod === 'upi') {
        // Handle UPI payment
        paymentResult = await PaymentService.processUPIPayment(orderDetails);
      } else {
        throw new Error('Invalid payment method selected.');
      }

      await completeOrder(paymentResult, orderDetails, orderId);
    } catch (error) {
      console.error('Order placement failed:', error);
      alert(error.error || error.message || 'Order placement failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Complete order after successful payment
  const completeOrder = async (paymentResult, orderDetails, orderId) => {
    try {
      // Prepare order data for backend API
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image || item.images?.[0] || item.galleryImages?.[0] || item.imageUrl,
          price: item.price,
          product: item._id || item.id
        })),
        shippingAddress: {
          fullName: `${orderDetails.shippingInfo.firstName} ${orderDetails.shippingInfo.lastName}`,
          address: orderDetails.shippingInfo.address,
          city: orderDetails.shippingInfo.city,
          state: orderDetails.shippingInfo.state,
          zipCode: orderDetails.shippingInfo.pincode,
          phone: orderDetails.shippingInfo.phone,
          email: orderDetails.shippingInfo.email
        },
        paymentMethod,
        paymentResult,
        itemsPrice: getTotalPrice(),
        taxPrice: 0,
        shippingPrice: shippingCost,
        totalPrice: finalTotal,
        couponCode: appliedCoupon?.code || null,
        couponDiscount: couponDiscount || 0,
        orderNotes
      };

      // Create order in backend (if user is authenticated)
      let backendOrder = null;
      try {
        // Always create order for COD payments
        // For Razorpay payments, the order is already created during payment verification
        if (paymentMethod === 'cod' || paymentResult.paymentMethod === 'COD') {
          console.log('Creating COD order in backend:', orderData);
          backendOrder = await ordersAPI.createOrder(orderData);
          console.log('COD order created successfully:', backendOrder);
        } else if (paymentResult.paymentMethod === 'Razorpay') {
          // For Razorpay, use the order data from payment verification response
          console.log('Using Razorpay order data from payment result:', paymentResult);
          backendOrder = {
            data: {
              order: paymentResult.order || {
                _id: paymentResult.backendOrderId,
                orderNumber: paymentResult.orderNumber || `ORD${Date.now()}`
              }
            }
          };
        } else {
          // Fallback: create order for any other payment method
          console.log('Creating order for payment method:', paymentResult.paymentMethod);
          backendOrder = await ordersAPI.createOrder(orderData);
        }
      } catch (apiError) {
        console.warn('Backend order creation failed, continuing with local order:', apiError);
        // Continue with local order processing even if backend fails
      }

      // Clear cart on successful payment
      clearCart();

      // Prepare items with consistent structure for confirmation page
      const confirmationItems = cart.map(item => ({
        id: item._id || item.id,
        name: item.name,
        quantity: item.quantity,
        image: item.image || item.images?.[0] || item.imageUrl,
        price: item.price,
        product: item._id || item.id
      }));

      // Navigate to order confirmation with order and payment details
      const finalOrderId = backendOrder?.data?.order?.orderNumber || paymentResult.orderNumber || orderId;
      console.log('🎯 [ORDER CONFIRMATION] Navigating with data:', {
        backendOrder: backendOrder?.data?.order,
        finalOrderId: finalOrderId,
        paymentMethod,
        paymentResult,
        hasOrderNumber: !!backendOrder?.data?.order?.orderNumber,
        hasPaymentOrderNumber: !!paymentResult.orderNumber,
        fallbackOrderId: orderId
      });

      navigate('/order-confirmation', {
        state: {
          orderId: finalOrderId,
          orderTotal: finalTotal,
          items: confirmationItems,
          shippingInfo: orderDetails.shippingInfo,
          paymentMethod,
          paymentResult,
          transactionId: paymentResult.transactionId,
          backendOrder: backendOrder?.data?.order
        }
      });
    } catch (error) {
      console.error('Order completion failed:', error);
      throw error;
    }
  };

  // Handle Razorpay payment success
  const handlePaymentSuccess = async (paymentResult) => {
    try {
      console.log('🎯 [RAZORPAY SUCCESS] Payment result received:', paymentResult);

      const orderId = 'ORD' + Date.now();
      const orderDetails = {
        orderId,
        amount: finalTotal,
        items: cart,
        shippingInfo,
        orderNotes,
        taxPrice: 0,
        shippingPrice: shippingCost
      };

      await completeOrder(paymentResult, orderDetails, orderId);
    } catch (error) {
      console.error('Payment order completion failed:', error);
      alert('Order completion failed. Please contact support.');
    }
  };

  // Handle payment failure
  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    // RazorpayCheckout passes { error: 'message' }, standard Error has .message
    alert(error.error || error.message || 'Payment failed. Please try again.');
  };

  // Handle input changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };



  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FEFCF3' }}>
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-20">
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-12">
              {/* Enhanced Empty Cart Icon */}
              <div className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center shadow-xl" style={{ background: 'linear-gradient(to bottom right, #F8F9FA, #FF6B6B)' }}>
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L17 18M9.5 18h7" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold mb-4" style={{ color: '#2C3E50' }}>No Items to Order</h1>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">Your cart is empty. Add some amazing products before placing an order.</p>

              <Link
                to="/products"
                className="inline-flex items-center gap-3 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:brightness-110"
                style={{ background: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFCF3' }}>
      {/* Enhanced Hero Section - Compact */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 via-orange-600/5 to-red-600/5"></div>
        <div className="relative max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="text-center">
            {/* Order Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200/50 shadow-lg mb-3 sm:mb-4">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}></div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700">SECURE CHECKOUT</span>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Place Your Order
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto mb-4 sm:mb-6">
              Complete your purchase securely with our encrypted checkout process
            </p>

            {/* Order Statistics */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold" style={{ color: '#2C3E50' }}>{getTotalItems()}</div>
                <div className="text-xs text-gray-600">Items</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold" style={{ color: '#2C3E50' }}>{formatPrice(finalTotal)}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl font-bold" style={{ color: '#20B2AA' }}>Secure</div>
                <div className="text-xs text-gray-600">Secure</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Enhanced Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-4 sm:space-y-6">
              {/* Enhanced Shipping Information */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3" style={{ color: '#2C3E50' }}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none bg-white text-gray-900 placeholder-gray-400 transition-all duration-300 ${errors.firstName ? 'border-red-500' : ''}`}
                      placeholder="Enter first name"
                      style={{
                        WebkitBoxShadow: '0 0 0 1000px white inset',
                        WebkitTextFillColor: '#111827'
                      }}
                      onFocus={(e) => {
                        if (!errors.firstName) {
                          e.target.style.borderColor = '#FF6B6B';
                          e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
                        }
                      }}
                      onBlur={(e) => {
                        if (!errors.firstName) {
                          e.target.style.borderColor = '#E5E7EB';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white ${shippingInfo.lastName ? 'text-gray-900' : 'text-gray-500'} placeholder-gray-400 autofill:bg-white autofill:text-gray-900 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter last name"
                      style={{
                        WebkitBoxShadow: '0 0 0 1000px white inset',
                        WebkitTextFillColor: shippingInfo.lastName ? '#111827' : '#6b7280'
                      }}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white ${shippingInfo.email ? 'text-gray-900' : 'text-gray-500'} placeholder-gray-400 autofill:bg-white autofill:text-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter email address"
                      style={{
                        WebkitBoxShadow: '0 0 0 1000px white inset',
                        WebkitTextFillColor: shippingInfo.email ? '#111827' : '#6b7280'
                      }}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white ${shippingInfo.phone ? 'text-gray-900' : 'text-gray-500'} placeholder-gray-400 autofill:bg-white autofill:text-gray-900 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter 10-digit phone number"
                      style={{
                        WebkitBoxShadow: '0 0 0 1000px white inset',
                        WebkitTextFillColor: shippingInfo.phone ? '#111827' : '#6b7280'
                      }}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <textarea
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      rows="3"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white ${shippingInfo.address ? 'text-gray-900' : 'text-gray-500'} placeholder-gray-400 resize-none autofill:bg-white autofill:text-gray-900 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter complete address"
                      style={{
                        WebkitBoxShadow: '0 0 0 1000px white inset',
                        WebkitTextFillColor: shippingInfo.address ? '#111827' : '#6b7280'
                      }}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <div className="relative">
                      <select
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white ${shippingInfo.city ? 'text-gray-900' : 'text-gray-500'} autofill:bg-white autofill:text-gray-900 appearance-none ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                        style={{
                          WebkitBoxShadow: '0 0 0 1000px white inset',
                          WebkitTextFillColor: shippingInfo.city ? '#111827' : '#6b7280'
                        }}
                      >
                        <option value="" className="text-gray-500">Select City</option>
                        <option value="Mumbai" className="text-gray-900">Mumbai</option>
                        <option value="Delhi" className="text-gray-900">Delhi</option>
                        <option value="Bangalore" className="text-gray-900">Bangalore</option>
                        <option value="Hyderabad" className="text-gray-900">Hyderabad</option>
                        <option value="Chennai" className="text-gray-900">Chennai</option>
                        <option value="Kolkata" className="text-gray-900">Kolkata</option>
                        <option value="Pune" className="text-gray-900">Pune</option>
                        <option value="Ahmedabad" className="text-gray-900">Ahmedabad</option>
                        <option value="Jaipur" className="text-gray-900">Jaipur</option>
                        <option value="Surat" className="text-gray-900">Surat</option>
                        <option value="Lucknow" className="text-gray-900">Lucknow</option>
                        <option value="Kanpur" className="text-gray-900">Kanpur</option>
                        <option value="Nagpur" className="text-gray-900">Nagpur</option>
                        <option value="Indore" className="text-gray-900">Indore</option>
                        <option value="Thane" className="text-gray-900">Thane</option>
                        <option value="Bhopal" className="text-gray-900">Bhopal</option>
                        <option value="Visakhapatnam" className="text-gray-900">Visakhapatnam</option>
                        <option value="Pimpri-Chinchwad" className="text-gray-900">Pimpri-Chinchwad</option>
                        <option value="Patna" className="text-gray-900">Patna</option>
                        <option value="Vadodara" className="text-gray-900">Vadodara</option>
                        <option value="Ghaziabad" className="text-gray-900">Ghaziabad</option>
                        <option value="Ludhiana" className="text-gray-900">Ludhiana</option>
                        <option value="Agra" className="text-gray-900">Agra</option>
                        <option value="Nashik" className="text-gray-900">Nashik</option>
                        <option value="Faridabad" className="text-gray-900">Faridabad</option>
                        <option value="Meerut" className="text-gray-900">Meerut</option>
                        <option value="Rajkot" className="text-gray-900">Rajkot</option>
                        <option value="Kalyan-Dombivali" className="text-gray-900">Kalyan-Dombivali</option>
                        <option value="Vasai-Virar" className="text-gray-900">Vasai-Virar</option>
                        <option value="Varanasi" className="text-gray-900">Varanasi</option>
                        <option value="Other" className="text-gray-900">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <div className="relative">
                      <select
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white ${shippingInfo.state ? 'text-gray-900' : 'text-gray-500'} autofill:bg-white autofill:text-gray-900 appearance-none ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                        style={{
                          WebkitBoxShadow: '0 0 0 1000px white inset',
                          WebkitTextFillColor: shippingInfo.state ? '#111827' : '#6b7280'
                        }}
                      >
                        <option value="" className="text-gray-500">Select State</option>
                        <option value="Andhra Pradesh" className="text-gray-900">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh" className="text-gray-900">Arunachal Pradesh</option>
                        <option value="Assam" className="text-gray-900">Assam</option>
                        <option value="Bihar" className="text-gray-900">Bihar</option>
                        <option value="Chhattisgarh" className="text-gray-900">Chhattisgarh</option>
                        <option value="Goa" className="text-gray-900">Goa</option>
                        <option value="Gujarat" className="text-gray-900">Gujarat</option>
                        <option value="Haryana" className="text-gray-900">Haryana</option>
                        <option value="Himachal Pradesh" className="text-gray-900">Himachal Pradesh</option>
                        <option value="Jharkhand" className="text-gray-900">Jharkhand</option>
                        <option value="Karnataka" className="text-gray-900">Karnataka</option>
                        <option value="Kerala" className="text-gray-900">Kerala</option>
                        <option value="Madhya Pradesh" className="text-gray-900">Madhya Pradesh</option>
                        <option value="Maharashtra" className="text-gray-900">Maharashtra</option>
                        <option value="Manipur" className="text-gray-900">Manipur</option>
                        <option value="Meghalaya" className="text-gray-900">Meghalaya</option>
                        <option value="Mizoram" className="text-gray-900">Mizoram</option>
                        <option value="Nagaland" className="text-gray-900">Nagaland</option>
                        <option value="Odisha" className="text-gray-900">Odisha</option>
                        <option value="Punjab" className="text-gray-900">Punjab</option>
                        <option value="Rajasthan" className="text-gray-900">Rajasthan</option>
                        <option value="Sikkim" className="text-gray-900">Sikkim</option>
                        <option value="Tamil Nadu" className="text-gray-900">Tamil Nadu</option>
                        <option value="Telangana" className="text-gray-900">Telangana</option>
                        <option value="Tripura" className="text-gray-900">Tripura</option>
                        <option value="Uttar Pradesh" className="text-gray-900">Uttar Pradesh</option>
                        <option value="Uttarakhand" className="text-gray-900">Uttarakhand</option>
                        <option value="West Bengal" className="text-gray-900">West Bengal</option>
                        <option value="Andaman and Nicobar Islands" className="text-gray-900">Andaman and Nicobar Islands</option>
                        <option value="Chandigarh" className="text-gray-900">Chandigarh</option>
                        <option value="Dadra and Nagar Haveli and Daman and Diu" className="text-gray-900">Dadra and Nagar Haveli and Daman and Diu</option>
                        <option value="Delhi" className="text-gray-900">Delhi</option>
                        <option value="Jammu and Kashmir" className="text-gray-900">Jammu and Kashmir</option>
                        <option value="Ladakh" className="text-gray-900">Ladakh</option>
                        <option value="Lakshadweep" className="text-gray-900">Lakshadweep</option>
                        <option value="Puducherry" className="text-gray-900">Puducherry</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                    <input
                      id="pincode"
                      type="text"
                      name="pincode"
                      value={shippingInfo.pincode}
                      onChange={handleShippingChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white ${shippingInfo.pincode ? 'text-gray-900' : 'text-gray-500'} placeholder-gray-400 autofill:bg-white autofill:text-gray-900 ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter 6-digit pincode"
                      style={{
                        WebkitBoxShadow: '0 0 0 1000px white inset',
                        WebkitTextFillColor: shippingInfo.pincode ? '#111827' : '#6b7280'
                      }}
                    />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <div className="relative">
                      <select
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                        className={`w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-coral bg-white ${shippingInfo.country ? 'text-gray-900' : 'text-gray-500'} autofill:bg-white autofill:text-gray-900 appearance-none`}
                        style={{
                          WebkitBoxShadow: '0 0 0 1000px white inset',
                          WebkitTextFillColor: shippingInfo.country ? '#111827' : '#6b7280'
                        }}
                      >
                        <option value="India" className="text-gray-900">India</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3" style={{ color: '#2C3E50' }}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(to right, #20B2AA, #FF6B6B)' }}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  Payment Details
                </h2>

                {/* Streamlined Payment Options - Two Clear Choices */}
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Razorpay Option - Enhanced Visual Design */}
                    <label className={`group cursor-pointer relative overflow-hidden rounded-3xl transition-all duration-500 transform hover:scale-[1.02] ${paymentMethod === 'razorpay' ? 'ring-4 ring-orange-200 shadow-2xl' : 'hover:shadow-xl'}`}>
                      <input
                        id="payment-razorpay"
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-8 border-3 transition-all duration-300 ${paymentMethod === 'razorpay' ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-red-50' : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/30'}`}>
                        {/* Selection Indicator */}
                        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300 ${paymentMethod === 'razorpay' ? 'border-orange-500 bg-orange-500' : 'border-gray-300 bg-white'}`}>
                          {paymentMethod === 'razorpay' && (
                            <svg className="w-4 h-4 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>

                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">Razorpay</h3>
                          <p className="text-gray-600 mb-4">Cards, UPI, Wallets & More</p>
                          <div className="flex flex-wrap justify-center gap-2 mb-4">
                            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Recommended</span>
                            <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium">Instant</span>
                          </div>
                          <p className="text-sm text-gray-500">100+ payment methods available</p>
                        </div>
                      </div>
                    </label>

                    {/* COD Option - Enhanced Visual Design */}
                    <label className={`group cursor-pointer relative overflow-hidden rounded-3xl transition-all duration-500 transform hover:scale-[1.02] ${paymentMethod === 'cod' ? 'ring-4 ring-teal-200 shadow-2xl' : 'hover:shadow-xl'}`}>
                      <input
                        id="payment-cod"
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-8 border-3 transition-all duration-300 ${paymentMethod === 'cod' ? 'border-teal-400 bg-gradient-to-br from-teal-50 to-emerald-50' : 'border-gray-200 bg-white hover:border-teal-200 hover:bg-teal-50/30'}`}>
                        {/* Selection Indicator */}
                        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all duration-300 ${paymentMethod === 'cod' ? 'border-teal-500 bg-teal-500' : 'border-gray-300 bg-white'}`}>
                          {paymentMethod === 'cod' && (
                            <svg className="w-4 h-4 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>

                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">Cash on Delivery</h3>
                          <p className="text-gray-600 mb-4">Pay when delivered</p>
                          <div className="flex flex-wrap justify-center gap-2 mb-4">
                            <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-medium">+ ₹20 Extra</span>
                            <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium">No Online Payment</span>
                          </div>
                          <p className="text-sm text-gray-500">Pay cash to delivery person</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>



                {/* COD Details */}
                {paymentMethod === 'cod' && (
                  <div className="mt-6 p-6 border rounded-2xl" style={{ borderColor: '#20B2AA', background: 'linear-gradient(135deg, #FEFCF3 0%, #F8F9FA 100%)' }}>
                    <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#2C3E50' }}>
                      <svg className="w-5 h-5" style={{ color: '#FF6B6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Cash on Delivery
                    </h3>
                    <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'white', borderColor: '#20B2AA' }}>
                      <p className="text-sm text-gray-700 mb-2">Pay with cash when your order is delivered.</p>
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4" style={{ color: '#FF6B6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="font-medium" style={{ color: '#2C3E50' }}>Additional ₹20 COD charges may apply</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border" style={{ borderColor: '#20B2AA' }}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3" style={{ color: '#2C3E50' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F8F9FA' }}>
                    <svg className="w-5 h-5" style={{ color: '#FF6B6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  Order Notes
                  <span className="text-sm font-normal text-gray-500">(Optional)</span>
                </h2>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 bg-white ${orderNotes ? 'text-gray-900' : 'text-gray-500'} placeholder-gray-400 resize-none autofill:bg-white autofill:text-gray-900`}
                  rows="3"
                  placeholder="Any special instructions for your order..."
                  style={{
                    WebkitBoxShadow: '0 0 0 1000px white inset',
                    WebkitTextFillColor: orderNotes ? '#111827' : '#6b7280',
                    '--tw-ring-color': '#FF6B6B',
                    borderColor: '#d1d5db'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FF6B6B'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 sticky top-24 border" style={{ borderColor: '#20B2AA' }}>
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: '#2C3E50' }}>Order Summary</h2>

              {/* Items */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 sm:gap-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>
                      <img
                        src={getImageUrl(item.image || item.images?.[0] || item.imageUrl)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/DJSpeaker1.png'; // Fallback image
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-2" style={{ color: '#2C3E50' }}>{item.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-700">Qty: {item.quantity}</span>
                        <span className="font-semibold" style={{ color: '#FF6B6B' }}>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 border-t pt-3" style={{ borderColor: '#20B2AA' }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#2C3E50' }}>Subtotal ({getTotalItems()} items)</span>
                  <span className="font-semibold" style={{ color: '#2C3E50' }}>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#2C3E50' }}>Shipping</span>
                  <span className={`font-semibold ${shippingCost === 0 ? '' : ''}`} style={{ color: shippingCost === 0 ? '#20B2AA' : '#2C3E50' }}>
                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#20B2AA' }}>Coupon ({appliedCoupon.code})</span>
                    <span className="font-semibold" style={{ color: '#20B2AA' }}>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#2C3E50' }}>COD Charges</span>
                    <span className="font-semibold" style={{ color: '#2C3E50' }}>₹20</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-3 mt-3" style={{ borderColor: '#20B2AA' }}>
                {/* Payment Method Indicator */}
                <div className="flex justify-between items-center mb-2">
                  <span style={{ color: '#2C3E50' }}>Payment Method</span>
                  <span className="font-semibold flex items-center gap-2" style={{ color: '#FF6B6B' }}>
                    {paymentMethod === 'razorpay' ? (
                      <>
                        Razorpay
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Secure</span>
                      </>
                    ) : paymentMethod === 'cod' ? (
                      <>
                        Cash on Delivery
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">₹20 Extra</span>
                      </>
                    ) : (
                      <>
                        Select Payment Method
                      </>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold" style={{ color: '#2C3E50' }}>Total</span>
                  <span className="text-xl font-bold" style={{ color: '#FF6B6B' }}>
                    {formatPrice(finalTotal + (paymentMethod === 'cod' ? 20 : 0))}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="mt-6">
                {paymentMethod === 'razorpay' ? (
                  <RazorpayCheckout
                    amount={finalTotal}
                    orderItems={cart}
                    shippingInfo={shippingInfo}
                    orderNotes={orderNotes}
                    appliedCoupon={appliedCoupon}
                    couponDiscount={couponDiscount}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                    buttonText="Pay with Razorpay"
                    disabled={!isFormValid()}
                  />
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={!isFormValid() || isProcessing}
                    className={`w-full font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${!isFormValid() || isProcessing
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 hover:shadow-lg hover:scale-105 transform'
                      }`}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        {paymentMethod === 'cod' ? (
                          <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Place COD Order
                          </>
                        ) : paymentMethod === 'upi' ? (
                          <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Pay with UPI
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Place Order
                          </>
                        )}
                      </>
                    )}
                  </button>
                )}

                <Link
                  to="/cart"
                  className="w-full border-2 border-teal-500 text-teal-500 font-semibold py-3 px-6 rounded-2xl transition-all duration-300 text-center block hover:bg-teal-500 hover:text-white hover:shadow-lg hover:scale-105 transform mt-4"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Cart
                  </div>
                </Link>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-4 border-t" style={{ borderColor: '#20B2AA' }}>
                <div className="flex items-center gap-2 text-xs" style={{ color: '#2C3E50' }}>
                  <svg className="w-4 h-4" style={{ color: '#20B2AA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
