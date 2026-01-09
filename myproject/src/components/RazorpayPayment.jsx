import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
const RazorpayPayment = ({ amount, orderData, onSuccess, onError }) => {
  ;
const [loading, setLoading] = useState(false);
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
      ;
const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    }
  );
};
const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Load Razorpay script
const isRazorpayLoaded = await loadRazorpayScript();
if (!isRazorpayLoaded) {
        throw new Error('Failed to load Razorpay');
      }

      // Create order on backend
const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          notes: {
            orderId: orderData?.id || 'cart_order'
          }
        })
      });
const orderResult = await orderResponse.json();
if (orderResult.status !== 'success') {
        throw new Error(orderResult.message);
      }

      // Configure Razorpay options
const options = {
        key: orderResult.data.key,
        amount: orderResult.data.amount,
        currency: orderResult.data.currency,
        name: 'Sounds Accessories',
        description: 'Payment for your order',
        order_id: orderResult.data.orderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
;
const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: orderData
              })
            });
const verifyResult = await verifyResponse.json();
if (verifyResult.status === 'success') {
              toast.success('Payment successful!');
              onSuccess && onSuccess(verifyResult.data);
            } else {
              throw new Error(verifyResult.message);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
            onError && onError(error);
          }
        },
        prefill: {
          name: orderData?.customerName || '',
          email: orderData?.customerEmail || '',
          contact: orderData?.customerPhone || ''
        },
        notes: {
          address: 'Sounds Accessories Store'
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast.error('Payment cancelled');
          }
        }
      };

      // Open Razorpay checkout
const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
      onError && onError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="razorpay-payment">
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          `Pay ₹${amount}`
        )}
      </button>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Secure payment powered by Razorpay
        </p>
        <div className="flex justify-center items-center mt-2 space-x-4">
          <img src="/brands/paytm.svg" alt="Paytm" className="h-6" />
          <img src="/brands/phonepe.svg" alt="PhonePe" className="h-6" />
          <img src="/brands/gpay.svg" alt="Google Pay" className="h-6" />
          <span className="text-xs text-gray-500">UPI • Cards • Net Banking</span>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;
