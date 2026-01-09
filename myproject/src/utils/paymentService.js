import { initializeRazorpayPayment, RAZORPAY_KEY_ID } from './razorpay';
import { paymentAPI } from './api';

// Payment Service for handling different payment methods
class PaymentService {
  // Simulate UPI payment process
  static async processUPIPayment(orderDetails) {
    return new Promise((resolve, reject) => {
      // Simulate UPI payment flow
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        
        if (success) {
          resolve({
            success: true,
            transactionId: 'UPI' + Date.now(),
            paymentMethod: 'UPI',
            amount: orderDetails.amount,
            timestamp: new Date().toISOString(),
            status: 'COMPLETED'
          }
  );
} else {
          reject({
            success: false,
            error: 'UPI payment failed. Please try again.',
            code: 'UPI_PAYMENT_FAILED'
          }
  );
}
      }, 2000); // 2 second delay to simulate processing
    }
  );
}

  // Process Card payment through Razorpay
  static async processCardPayment(orderDetails, cardInfo) {
    return this.processRazorpayPayment(orderDetails);
  }

  // Process payment through Razorpay
  static async processRazorpayPayment(orderDetails) {
    return new Promise(async (resolve, reject) => {
      try {
    console.log('Processing Razorpay payment for:', orderDetails);
        
        // Step 1: Create order on backend
const orderResponse = await paymentAPI.createOrder({
          amount: Math.round(orderDetails.amount), // Ensure integer amount
          currency: 'INR',
          receipt: orderDetails.orderId || `order_${Date.now()}`,
          notes: {
            orderNote: orderDetails.orderNotes || '',
            items: `${orderDetails.items.length} items`,
            customerName: `${orderDetails.shippingInfo.firstName} ${orderDetails.shippingInfo.lastName}`
          }
        });

        console.log('Backend order created:', orderResponse);
const { orderId, amount, key } = orderResponse.data;

        // Step 2: Initialize Razorpay payment
        await initializeRazorpayPayment({
          amount: amount, // Backend returns amount in paise
          orderId: orderId,
          name: `${orderDetails.shippingInfo.firstName} ${orderDetails.shippingInfo.lastName}`,
          email: orderDetails.shippingInfo.email,
          contact: orderDetails.shippingInfo.phone,
          onSuccess: async (response) => {
            console.log('Payment successful:', response);
            
            // Step 3: Verify payment on backend
            try {
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
                  shippingPrice: orderDetails.shippingPrice || 0
                }
              });

              console.log('Payment verified:', verifyResponse);

              resolve({
                success: true,
                transactionId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                paymentMethod: 'Razorpay',
                amount: amount / 100, // Convert from paise to rupees
                timestamp: new Date().toISOString(),
                status: 'COMPLETED',
                backendOrderId: verifyResponse.data?.orderId
              }
  );
} catch (verifyError) {
              console.error('Payment verification failed:', verifyError);
              reject({
                success: false,
                error: 'Payment verification failed. Please contact support.',
                code: 'PAYMENT_VERIFICATION_FAILED',
                details: verifyError.message
              }
  );
}
          },
          onFailure: (error) => {
            console.error('Payment failed:', error);
            reject({
              success: false,
              error: error.description || 'Payment failed. Please try again.',
              code: error.code || 'PAYMENT_FAILED',
              details: error
            }
  );
},
          onDismiss: () => {
            console.log('Payment cancelled by user');
            reject({
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
        reject({
          success: false,
          error: error.message || 'Payment initialization failed. Please try again.',
          code: 'PAYMENT_INIT_FAILED',
          details: error
        }
  );
}
    }
  );
}

  // Cash on Delivery (no payment processing needed)
  static async processCODPayment(orderDetails) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: 'COD' + Date.now(),
          paymentMethod: 'COD',
          amount: orderDetails.amount,
          timestamp: new Date().toISOString(),
          status: 'PENDING',
          note: 'Payment will be collected on delivery'
        }
  );
}, 500);
    }
  );
}

  // Generate UPI deep link for different apps
  static generateUPILink(orderDetails, upiApp = 'generic') {
    const upiId = 'merchant@upi'; // Replace with actual merchant UPI ID
const amount = orderDetails.amount;
const transactionNote = `Payment for Order #${orderDetails.orderId}`;
const baseUrl = 'upi:// pay';
const params = new URLSearchParams({
      pa: upiId,
      am: amount.toString(),
      tn: transactionNote,
      tr: orderDetails.orderId,
      cu: 'INR'
    });

    switch (upiApp) {
      case 'phonepe':
        return `phonepe://pay?${params.toString()}`;
      case 'googlepay':
        return `tez://upi/pay?${params.toString()}`;
      case 'paytm':
        return `paytmmp://pay?${params.toString()}`;
      default:
        return `${baseUrl}?${params.toString()}`;
    }
  }

  // Verify payment status (for demonstration)
  static async verifyPayment(transactionId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transactionId,
          status: 'COMPLETED',
          verified: true
        }
  );
}, 1000);
    }
  );
}
}

export default PaymentService;
