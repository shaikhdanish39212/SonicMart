import React, { useState } from 'react';
import { initializeRazorpayPayment } from '../utils/razorpay';
import { paymentAPI } from '../utils/api';
const RazorpayCheckout = ({ 
  amount,
  orderItems,
  shippingInfo,
  orderNotes,
  appliedCoupon,
  couponDiscount,
  onSuccess, 
  onFailure, 
  buttonText = "Pay with Razorpay",
  disabled = false,
  className = "",
  style = {}
}) => {
  ;
const [isProcessing, setIsProcessing] = useState(false);
const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Validate required fields
      if (!amount || !shippingInfo || !orderItems) {
        throw new Error('Missing required payment information');
      }

      // Create orderDetails object from individual props
const orderDetails = {
        amount: Math.round(amount * 100) / 100, // Ensure 2 decimal places
        items: orderItems,
        shippingInfo,
        orderNotes,
        orderId: `order_${Date.now()}`
      };
console.log('Initializing Razorpay payment:', orderDetails);
      
      // Create order on backend
const orderResponse = await paymentAPI.createOrder({
        amount: orderDetails.amount, // Send amount in rupees, backend will convert to paise
        currency: 'INR',
        receipt: orderDetails.orderId || `order_${Date.now()}`,
        notes: {
          customerName: `${orderDetails.shippingInfo.firstName} ${orderDetails.shippingInfo.lastName}`,
          items: `${orderDetails.items.length} items`,
          orderNote: orderDetails.orderNotes || ''
        }
      });
const { orderId: razorpayOrderId, amount: razorpayAmount, key } = orderResponse.data;
      console.log('Order created successfully:', { orderId: razorpayOrderId, amount: razorpayAmount });

      // Initialize Razorpay
      await initializeRazorpayPayment({
        amount: razorpayAmount,
        orderId: razorpayOrderId,
        name: `${orderDetails.shippingInfo.firstName} ${orderDetails.shippingInfo.lastName}`,
        email: orderDetails.shippingInfo.email,
        contact: orderDetails.shippingInfo.phone,
        onSuccess: async (response) => {
          try {
    console.log('Payment successful, verifying:', response);
            
            // Verify payment
const verifyResponse = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                items: orderDetails.items.map(item => ({
                  product: item._id || item.id,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                  image: item.image
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
                totalPrice: orderDetails.amount,
                taxPrice: orderDetails.taxPrice || 0,
                shippingPrice: orderDetails.shippingPrice || 0,
                couponCode: appliedCoupon?.code || null,
                discountAmount: couponDiscount || 0
              }
            });

            console.log('Payment verified successfully:', verifyResponse);
            
            // Success callback
            onSuccess({
              success: true,
              transactionId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              paymentMethod: 'Razorpay',
              amount: orderDetails.amount, // Use original amount in rupees
              timestamp: new Date().toISOString(),
              status: 'COMPLETED',
              backendOrderId: verifyResponse.data?.orderId,
              orderNumber: verifyResponse.data?.orderNumber,
              order: verifyResponse.data?.order
            }
  );
            } catch (verifyError) {
            console.error('Payment verification failed:', verifyError);
            
            // Extract specific error message from backend response
            let errorMessage = 'Payment verification failed. Please contact support.';
            let errorCode = 'PAYMENT_VERIFICATION_FAILED';
            
            if (verifyError.message) {
              errorMessage = verifyError.message;
              
              // Handle specific error types
              if (verifyError.message.includes('signature')) {
                errorCode = 'SIGNATURE_VERIFICATION_FAILED';
                errorMessage = 'Payment signature verification failed. This may indicate a security issue.';
              } else if (verifyError.message.includes('Missing required')) {
                errorCode = 'MISSING_PAYMENT_DATA';
                errorMessage = 'Payment data is incomplete. Please try again.';
              } else if (verifyError.message.includes('configuration')) {
                errorCode = 'PAYMENT_GATEWAY_ERROR';
                errorMessage = 'Payment gateway configuration error. Please contact support.';
              }
            }
            
            onFailure({
              success: false,
              error: errorMessage,
              code: errorCode,
              details: verifyError.message
            });
          } finally {
            setIsProcessing(false);
          }
        },
        onFailure: (error) => {
          console.error('Payment failed:', error);
          setIsProcessing(false);
          onFailure({
            success: false,
            error: error.description || 'Payment failed. Please try again.',
            code: error.code || 'PAYMENT_FAILED'
          }
  );
},
        onDismiss: () => {
          console.log('Payment dismissed by user');
          setIsProcessing(false);
          onFailure({
            success: false,
            error: 'Payment cancelled by user',
            code: 'PAYMENT_CANCELLED'
          }
  );
}
      }
  );
} catch (error) {
      console.error('Payment initialization failed:', error);
      setIsProcessing(false);
      
      // Provide specific error messages
      let errorMessage = 'Payment initialization failed. Please try again.';
if (error.message.includes('Missing required')) {
        errorMessage = 'Please fill in all required information before proceeding with payment.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('amount')) {
        errorMessage = 'Invalid amount. Please refresh the page and try again.';
      }
      
      onFailure({
        success: false,
        error: errorMessage,
        code: 'PAYMENT_INIT_FAILED',
        details: error.message
      }
  );
}
  };
  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isProcessing}
      className={className || `
        w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 
        text-white font-semibold py-3 px-6 rounded-2xl 
        transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg hover:scale-105 transform
      `}
      style={style}
    >
      {isProcessing ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing Payment...
        </>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{buttonText}</span>
        </div>
      )}
    </button>
  );
};

export default RazorpayCheckout;
